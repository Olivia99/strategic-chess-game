import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Room {
  room_code: string;
  status: string;
  player1_name?: string;
  player2_name?: string;
}

export default function GameRoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomCode) return;
    
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomCode}`);
        if (response.ok) {
          const data = await response.json();
          setRoom(data);
        } else {
          setError('Room not found');
        }
      } catch (err) {
        setError('Failed to load room');
      }
      setLoading(false);
    };

    fetchRoom();
  }, [roomCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Room Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The room you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Game Room: {roomCode}
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-blue-800 mb-2">Room Status</h2>
          <p className="text-blue-700">Status: {room.status}</p>
          {room.player1_name && (
            <p className="text-blue-700">Player 1: {room.player1_name}</p>
          )}
          {room.player2_name && (
            <p className="text-blue-700">Player 2: {room.player2_name}</p>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-yellow-800 mb-2">🚧 Under Development</h2>
          <p className="text-yellow-700">
            Game functionality is being migrated to the new React architecture. 
            The room exists and players can join, but gameplay features are coming soon!
          </p>
        </div>
        
        <div className="text-center space-y-4">
          <Link
            to="/rooms/create"
            className="block bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Create New Room
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