// Ultra-minimal homepage with inline styles only
export default function MinimalHomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#e0f2fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>
          🎮 Strategic Chess Game
        </h1>
        <p style={{color: '#666', marginBottom: '24px'}}>
          Welcome to the game!
        </p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <a 
            href="/test" 
            style={{
              display: 'block',
              background: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            Test Page
          </a>
          <a 
            href="/api/health" 
            target="_blank"
            style={{
              display: 'block',
              background: '#16a34a',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            Test API
          </a>
          <a 
            href="/debug" 
            style={{
              display: 'block',
              background: '#9333ea',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            Debug Page
          </a>
        </div>
      </div>
    </div>
  );
}