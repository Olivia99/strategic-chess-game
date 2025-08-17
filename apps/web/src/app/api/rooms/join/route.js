import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { roomCode, playerId } = await request.json();

    if (!roomCode || !playerId) {
      return Response.json(
        { error: "Room code and player ID are required" },
        { status: 400 },
      );
    }

    // Find the room
    const [room] = await sql`
      SELECT * FROM game_rooms 
      WHERE room_code = ${roomCode.toUpperCase()}
    `;

    if (!room) {
      return Response.json(
        { error: "Room not found. Please check the room code." },
        { status: 404 },
      );
    }

    // More specific error messages based on room status
    if (room.status === "playing") {
      return Response.json(
        { error: "This game is already in progress. You cannot join now." },
        { status: 400 },
      );
    }

    if (room.status === "hero_selection") {
      return Response.json(
        {
          error:
            "This room is in hero selection phase. The game may have already started.",
        },
        { status: 400 },
      );
    }

    if (room.status === "finished") {
      return Response.json(
        { error: "This game has already finished." },
        { status: 400 },
      );
    }

    if (room.status !== "waiting") {
      return Response.json(
        {
          error: `Room is not available for joining. Current status: ${room.status}`,
        },
        { status: 400 },
      );
    }

    if (room.white_player_id === playerId) {
      return Response.json(
        { error: "You are already in this room as the white player." },
        { status: 400 },
      );
    }

    if (room.black_player_id === playerId) {
      return Response.json(
        { error: "You are already in this room as the black player." },
        { status: 400 },
      );
    }

    if (room.black_player_id) {
      return Response.json(
        { error: "This room is full. Both players have already joined." },
        { status: 400 },
      );
    }

    // Join as black player
    const [updatedRoom] = await sql`
      UPDATE game_rooms 
      SET black_player_id = ${playerId}, status = 'hero_selection', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${room.id}
      RETURNING *
    `;

    return Response.json({ room: updatedRoom });
  } catch (error) {
    console.error("Error joining room:", error);
    return Response.json(
      { error: "Failed to join room. Please try again." },
      { status: 500 },
    );
  }
}
