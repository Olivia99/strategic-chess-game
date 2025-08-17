import sql from '@/app/api/utils/sql';

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return Response.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Generate unique room code
    let roomCode;
    let attempts = 0;
    do {
      roomCode = generateRoomCode();
      attempts++;
      if (attempts > 10) {
        return Response.json({ error: 'Failed to generate unique room code' }, { status: 500 });
      }
      
      const existing = await sql`
        SELECT id FROM game_rooms WHERE room_code = ${roomCode}
      `;
      
      if (existing.length === 0) break;
    } while (true);

    // Create new room
    const [room] = await sql`
      INSERT INTO game_rooms (room_code, white_player_id, status)
      VALUES (${roomCode}, ${playerId}, 'waiting')
      RETURNING *
    `;

    return Response.json({ room });
  } catch (error) {
    console.error('Error creating room:', error);
    return Response.json({ error: 'Failed to create room' }, { status: 500 });
  }
}