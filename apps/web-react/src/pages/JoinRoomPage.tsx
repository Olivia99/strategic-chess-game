import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_code: roomCode.toUpperCase(),
          player_name: playerName
        })
      });
      
      if (response.ok) {
        // Navigate to game room
        window.location.href = `/game/room/${roomCode.toUpperCase()}`;
      } else {
        alert('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error joining room');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Join Game Room
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter room code"
              maxLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
            />
          </div>
          
          <button
            onClick={handleJoinRoom}
            disabled={!roomCode.trim() || !playerName.trim() || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-semibold transition-colors"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
          
          <Link
            to="/"
            className="block text-center text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}