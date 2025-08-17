import { useState, useEffect } from "react";
import { Copy, Check, Users, Crown } from "lucide-react";

export default function CreateRoomPage() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Generate or retrieve persistent player ID
  const [playerId] = useState(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("chess_player_id");
      if (!storedId) {
        storedId = "player_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("chess_player_id", storedId);
      }
      return storedId;
    }
    return "player_" + Math.random().toString(36).substr(2, 9);
  });

  const createRoom = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create room");
      }

      const data = await response.json();
      setRoom(data.room);
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = async () => {
    if (room?.room_code) {
      await navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareRoom = () => {
    const url = `${window.location.origin}/rooms/join?code=${room.room_code}`;
    if (navigator.share) {
      navigator.share({
        title: "Join my Strategic Chess game!",
        text: `Join my Strategic Chess game with room code: ${room.room_code}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    createRoom();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-amber-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">
              Create Game Room
            </h1>
          </div>
          <a href="/" className="text-amber-600 hover:text-amber-700 underline">
            ← Back to home
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Creating your game room...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-700 text-center">{error}</p>
            <div className="text-center mt-4">
              <button
                onClick={createRoom}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {room && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Room Created!
              </h2>
              <p className="text-gray-600">
                Share this room code with your opponent
              </p>
            </div>

            {/* Room Code Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Room Code</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl font-mono font-bold text-gray-800 tracking-wider">
                    {room.room_code}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors"
                    title="Copy room code"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-sm mt-2">
                    Copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Share Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={shareRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                Share Room Link
              </button>
              <button
                onClick={copyRoomCode}
                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors"
              >
                <Copy className="w-6 h-6 mx-auto mb-2" />
                Copy Code Only
              </button>
            </div>

            {/* Room Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="animate-pulse w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <p className="text-yellow-800">
                  Waiting for opponent to join...
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Once your opponent joins, you'll both select heroes and start
                playing!
              </p>
              <a
                href={`/game/room/${room.room_code}`}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Go to Game Room
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
