import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CreateRoomPage() {
  const [playerName, setPlayerName] = useState('');
  const [selectedHero, setSelectedHero] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!playerName.trim() || !selectedHero) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName,
          hero_id: parseInt(selectedHero)
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Navigate to game room with room code
        window.location.href = `/game/room/${data.room_code}`;
      } else {
        alert('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Game Room
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Hero
            </label>
            <select
              value={selectedHero}
              onChange={(e) => setSelectedHero(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a hero...</option>
              <option value="1">Alexander the Great</option>
              <option value="2">Genghis Khan</option>
              <option value="3">Napoleon Bonaparte</option>
              <option value="4">George Washington</option>
              <option value="5">Anne Bonny</option>
              <option value="6">Che Guevara</option>
            </select>
          </div>
          
          <button
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || !selectedHero || loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-semibold transition-colors"
          >
            {loading ? 'Creating...' : 'Create Room'}
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