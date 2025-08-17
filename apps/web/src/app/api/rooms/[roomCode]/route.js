import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { roomCode } = params;
    const code = roomCode.toUpperCase();

    const [room] = await sql`
      SELECT * FROM game_rooms 
      WHERE room_code = ${code}
    `;

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    // Ensure room_states table exists and then merge state (if any)
    await sql`
      CREATE TABLE IF NOT EXISTS room_states (
        room_code TEXT PRIMARY KEY,
        board_state JSONB,
        current_turn TEXT,
        white_trophies INTEGER,
        black_trophies INTEGER,
        winner TEXT,
        last_move JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const stateRows = await sql`
      SELECT board_state, current_turn, white_trophies, black_trophies, winner, last_move
      FROM room_states
      WHERE room_code = ${code}
      LIMIT 1
    `;

    const state = stateRows[0] || {};
    return Response.json({ room: { ...room, ...state } });
  } catch (error) {
    console.error("Error fetching room:", error);
    return Response.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { roomCode } = params;
    const code = roomCode.toUpperCase();
    const updates = await request.json();

    // Normalize undefined to null for conditional updates
    const u = {
      white_hero: updates.white_hero ?? null,
      black_hero: updates.black_hero ?? null,
      status: updates.status ?? null,
      // state fields (stored in room_states and mirrored to game_rooms)
      current_turn: updates.current_turn ?? null,
      board_state: updates.board_state ?? null,
      white_trophies: updates.white_trophies ?? null,
      black_trophies: updates.black_trophies ?? null,
      winner: updates.winner ?? null,
      last_move: updates.last_move ?? null,
    };

    // 0) Make sure the room exists
    const existing = await sql`
      SELECT id FROM game_rooms WHERE room_code = ${code}
    `;
    if (existing.length === 0) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    // 1) Update hero/status in game_rooms when present
    if (u.white_hero !== null || u.black_hero !== null || u.status !== null) {
      await sql`
        UPDATE game_rooms 
        SET 
          white_hero = COALESCE(${u.white_hero}, white_hero),
          black_hero = COALESCE(${u.black_hero}, black_hero),
          status = COALESCE(${u.status}, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE room_code = ${code}
      `;
    }

    // 2) Ensure room_states exists
    await sql`
      CREATE TABLE IF NOT EXISTS room_states (
        room_code TEXT PRIMARY KEY,
        board_state JSONB,
        current_turn TEXT,
        white_trophies INTEGER,
        black_trophies INTEGER,
        winner TEXT,
        last_move JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Prepare JSON for jsonb fields
    const board_state_json =
      u.board_state !== null ? JSON.stringify(u.board_state) : null;
    const last_move_json =
      u.last_move !== null ? JSON.stringify(u.last_move) : null;

    // 3) Upsert state fields (primary store)
    const stateUpsertRows = await sql`
      INSERT INTO room_states (
        room_code, board_state, current_turn, white_trophies, black_trophies, winner, last_move, updated_at
      ) VALUES (
        ${code}, ${board_state_json}::jsonb, ${u.current_turn}, ${u.white_trophies}, ${u.black_trophies}, ${u.winner}, ${last_move_json}::jsonb, CURRENT_TIMESTAMP
      )
      ON CONFLICT (room_code) DO UPDATE SET
        board_state = COALESCE(EXCLUDED.board_state, room_states.board_state),
        current_turn = COALESCE(EXCLUDED.current_turn, room_states.current_turn),
        white_trophies = COALESCE(EXCLUDED.white_trophies, room_states.white_trophies),
        black_trophies = COALESCE(EXCLUDED.black_trophies, room_states.black_trophies),
        winner = COALESCE(EXCLUDED.winner, room_states.winner),
        last_move = COALESCE(EXCLUDED.last_move, room_states.last_move),
        updated_at = CURRENT_TIMESTAMP
      RETURNING board_state, current_turn, white_trophies, black_trophies, winner, last_move
    `;

    // 4) Mirror to game_rooms for backward compatibility
    await sql`
      ALTER TABLE game_rooms 
      ADD COLUMN IF NOT EXISTS board_state JSONB,
      ADD COLUMN IF NOT EXISTS current_turn TEXT,
      ADD COLUMN IF NOT EXISTS white_trophies INTEGER,
      ADD COLUMN IF NOT EXISTS black_trophies INTEGER,
      ADD COLUMN IF NOT EXISTS winner TEXT,
      ADD COLUMN IF NOT EXISTS last_move JSONB
    `;

    await sql`
      UPDATE game_rooms
      SET 
        board_state = COALESCE(${board_state_json}::jsonb, board_state),
        current_turn = COALESCE(${u.current_turn}, current_turn),
        white_trophies = COALESCE(${u.white_trophies}, white_trophies),
        black_trophies = COALESCE(${u.black_trophies}, black_trophies),
        winner = COALESCE(${u.winner}, winner),
        last_move = COALESCE(${last_move_json}::jsonb, last_move),
        updated_at = CURRENT_TIMESTAMP
      WHERE room_code = ${code}
    `;

    // 5) Return merged view
    const [room] = await sql`
      SELECT * FROM game_rooms WHERE room_code = ${code}
    `;

    const state = stateUpsertRows[0] || {};
    const result = { room: { ...room, ...state } };

    // Note: In a production environment, you would trigger a WebSocket broadcast here
    // For now, the SSE endpoint will pick up the database changes via polling
    
    return Response.json(result);
  } catch (error) {
    console.error("Error updating room:", error);
    return Response.json({ error: "Failed to update room" }, { status: 500 });
  }
}
