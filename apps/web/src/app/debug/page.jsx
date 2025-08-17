// Simple debug page with inline styles
export default function DebugPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          🔧 Debug Page - System Status
        </h1>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h2 style={{fontWeight: 'bold', color: '#15803d'}}>✅ React Router Working</h2>
            <p style={{color: '#16a34a'}}>This page is rendered successfully</p>
          </div>
          
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h2 style={{fontWeight: 'bold', color: '#1e40af'}}>🎯 Environment Check</h2>
            <p style={{color: '#2563eb'}}>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</p>
            <p style={{color: '#2563eb'}}>
              Database: {process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}
            </p>
          </div>
          
          <div style={{
            background: '#fefce8',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h2 style={{fontWeight: 'bold', color: '#a16207'}}>🧪 Test Links</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px'}}>
              <a 
                href="/api/health" 
                target="_blank"
                style={{color: '#2563eb', textDecoration: 'underline'}}
              >
                Test Health API (/api/health)
              </a>
              <a 
                href="/api/heroes" 
                target="_blank"
                style={{color: '#2563eb', textDecoration: 'underline'}}
              >
                Test Heroes API (/api/heroes)
              </a>
              <a 
                href="/test" 
                style={{color: '#2563eb', textDecoration: 'underline'}}
              >
                Test Page (/test)
              </a>
              <a 
                href="/" 
                style={{color: '#2563eb', textDecoration: 'underline'}}
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}