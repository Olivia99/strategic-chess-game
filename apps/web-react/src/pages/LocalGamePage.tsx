import { Link } from 'react-router-dom';

export default function LocalGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Local Game Setup
        </h1>
        
        <p className="text-gray-600 mb-8">
          Local game feature is coming soon! For now, try creating an online multiplayer room.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/rooms/create"
            className="block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Create Online Room Instead
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