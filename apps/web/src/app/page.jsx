// Ultra-simple homepage for debugging
export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">🎮 Strategic Chess Game</h1>
        <p className="text-gray-600 mb-6">Welcome to the game!</p>
        
        <div className="space-y-3">
          <a 
            href="/debug" 
            className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Debug Page
          </a>
          <a 
            href="/api/health" 
            target="_blank"
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test API
          </a>
          <a 
            href="/rooms/create" 
            className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Create Room
          </a>
        </div>
      </div>
    </div>
  );
}