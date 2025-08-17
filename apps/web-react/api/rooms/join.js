import sql from '../_utils/sql.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { room_code, player_name } = req.body;

    if (!room_code || !player_name) {
      return res.status(400).json({ error: 'Room code and player name are required' });
    }

    // Check if room exists and has space
    const room = await sql`
      SELECT * FROM game_rooms 
      WHERE room_code = ${room_code} AND status = 'waiting'
    `;

    if (room.length === 0) {
      return res.status(404).json({ error: 'Room not found or already full' });
    }

    // Add second player to room
    const updatedRoom = await sql`
      UPDATE game_rooms 
      SET player2_name = ${player_name}, status = 'ready'
      WHERE room_code = ${room_code}
      RETURNING *
    `;

    res.status(200).json({
      room_code: room_code,
      status: 'joined',
      room: updatedRoom[0]
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
}