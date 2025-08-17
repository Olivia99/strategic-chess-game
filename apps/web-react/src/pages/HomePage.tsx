import { useState } from 'react';
import { Users, User, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [gameMode, setGameMode] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-amber-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-800">Strategic Chess</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A 6×6 grid chess board game where legendary commanders lead their armies to victory. 
            Choose your hero and dominate the battlefield!
          </p>
        </div>

        {/* Game Mode Selection */}
        {!gameMode && (
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <button
              onClick={() => setGameMode('single')}
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-300"
            >
              <div className="flex flex-col items-center">
                <User className="w-16 h-16 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Single Player</h3>
                <p className="text-gray-600 text-center">
                  Play locally against a friend on the same device
                </p>
              </div>
            </button>

            <button
              onClick={() => setGameMode('multiplayer')}
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-300"
            >
              <div className="flex flex-col items-center">
                <Users className="w-16 h-16 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Multiplayer</h3>
                <p className="text-gray-600 text-center">
                  Create or join a room to play online with others
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Single Player Flow */}
        {gameMode === 'single' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Local Game</h2>
              <p className="text-gray-600 mb-6 text-center">
                Both players will select their heroes on this device, then take turns playing.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/game/local"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Local Game
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Multiplayer Flow */}
        {gameMode === 'multiplayer' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Online Multiplayer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  to="/rooms/create"
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors block"
                >
                  <h3 className="text-xl font-semibold mb-2">Create Room</h3>
                  <p className="text-green-100">Start a new game and invite others</p>
                </Link>
                <Link
                  to="/rooms/join"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center transition-colors block"
                >
                  <h3 className="text-xl font-semibold mb-2">Join Room</h3>
                  <p className="text-purple-100">Enter a room code to join a game</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        {gameMode && (
          <div className="text-center mt-8">
            <button
              onClick={() => setGameMode(null)}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to mode selection
            </button>
          </div>
        )}

        {/* Game Rules Summary */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Game Overview</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">6×6</div>
              <p className="text-gray-600">Grid board with intersection-based movement</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <p className="text-gray-600">Legendary heroes to choose from</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">21</div>
              <p className="text-gray-600">Trophy points needed for victory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}