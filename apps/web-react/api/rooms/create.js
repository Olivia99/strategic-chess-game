import sql from '../_utils/sql.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { player_name, hero_id } = req.body;

    if (!player_name || !hero_id) {
      return res.status(400).json({ error: 'Player name and hero ID are required' });
    }

    // Generate a unique room code
    const roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create room in database
    const room = await sql`
      INSERT INTO game_rooms (room_code, status, player1_name, player1_hero_id, created_at)
      VALUES (${roomCode}, 'waiting', ${player_name}, ${hero_id}, NOW())
      RETURNING *
    `;

    res.status(200).json({
      room_code: roomCode,
      room_id: room[0].id,
      status: room[0].status,
      player_name: player_name
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
}