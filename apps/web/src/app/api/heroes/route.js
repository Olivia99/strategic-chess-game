import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const heroes = await sql`
      SELECT * FROM heroes 
      ORDER BY name
    `;
    
    return Response.json({ heroes });
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return Response.json({ error: 'Failed to fetch heroes' }, { status: 500 });
  }
}