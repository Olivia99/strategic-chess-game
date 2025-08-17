import { Link } from 'react-router-dom';

export default function GameBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Game Board
        </h1>
        
        <p className="text-gray-600 mb-8">
          Game board component is being migrated. Please use the room-based multiplayer for now.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/rooms/create"
            className="block bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Create New Game Room
          </Link>
          
          <Link
            to="/"
            className="block text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}