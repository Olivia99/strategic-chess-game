import sql from '../_utils/sql.js';

export default async function handler(req, res) {
  const { roomCode } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const room = await sql`
      SELECT * FROM game_rooms 
      WHERE room_code = ${roomCode}
    `;

    if (room.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room[0]);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
}