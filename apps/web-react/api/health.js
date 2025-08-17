import sql from './_utils/sql.js';

export default async function handler(req, res) {
  try {
    // Check if DATABASE_URL is available
    const hasDatabase = !!process.env.DATABASE_URL;
    const dbUrl = process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.substring(0, 30) + '...' : 'not set';
    
    // Test database connection if available
    let dbTest = 'not tested';
    if (hasDatabase) {
      try {
        await sql`SELECT 1 as test`;
        dbTest = 'connection successful';
      } catch (dbError) {
        dbTest = `connection failed: ${dbError.message}`;
      }
    }
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      database: {
        configured: hasDatabase,
        url_preview: dbUrl,
        test_result: dbTest
      },
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'unknown'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
}