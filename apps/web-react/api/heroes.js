import sql from './_utils/sql.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const heroes = await sql`
      SELECT * FROM heroes 
      ORDER BY name
    `;
    
    res.status(200).json(heroes);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    res.status(500).json({ error: 'Failed to fetch heroes' });
  }
}