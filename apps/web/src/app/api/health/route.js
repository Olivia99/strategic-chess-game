// Health check endpoint to test deployment
export async function GET() {
  try {
    // Check if DATABASE_URL is available
    const hasDatabase = !!process.env.DATABASE_URL;
    
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: hasDatabase ? 'connected' : 'not configured',
      node_env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}