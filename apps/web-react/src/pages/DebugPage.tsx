import { Link } from 'react-router-dom';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔧 Debug Page - System Status
        </h1>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-bold text-green-800">✅ React App Working</h2>
            <p className="text-green-700">This page is rendered successfully with Vite + React</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-bold text-blue-800">🎯 Environment Check</h2>
            <p className="text-blue-700">
              Mode: {import.meta.env.MODE}
            </p>
            <p className="text-blue-700">
              Base URL: {import.meta.env.BASE_URL}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="font-bold text-yellow-800">🧪 Test Links</h2>
            <div className="space-y-2">
              <a 
                href="/api/health" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Test Health API (/api/health)
              </a>
              <a 
                href="/api/heroes" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Test Heroes API (/api/heroes)
              </a>
              <Link 
                to="/" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}