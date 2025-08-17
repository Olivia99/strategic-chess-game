import { useState, useEffect } from "react";
import { Crown, Users } from "lucide-react";

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use persistent player ID from localStorage
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

  useEffect(() => {
    // Check if room code is in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("code");
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase());
    }
  }, []);

  const joinRoom = async (e) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: roomCode.trim().toUpperCase(),
          playerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join room");
      }

      const data = await response.json();
      // Redirect to the game room
      window.location.href = `/game/room/${data.room.room_code}`;
    } catch (err) {
      console.error("Error joining room:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    setRoomCode(value);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-amber-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Join Game Room</h1>
          </div>
          <a href="/" className="text-amber-600 hover:text-amber-700 underline">
            ← Back to home
          </a>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enter Room Code
            </h2>
            <p className="text-gray-600">
              Enter the 6-character code shared by your opponent
            </p>
          </div>

          <form onSubmit={joinRoom} className="space-y-6">
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={handleCodeChange}
                placeholder="ABC123"
                className="w-full px-4 py-3 text-center text-2xl font-mono font-bold tracking-wider border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                maxLength={6}
                autoComplete="off"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                6 characters (letters and numbers)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-center text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || roomCode.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Joining...
                </div>
              ) : (
                "Join Room"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Don't have a room code?{" "}
              <a
                href="/rooms/create"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Create a new room
              </a>
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                1
              </span>
              <span>Join the game room with the code</span>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                2
              </span>
              <span>Both players select their heroes</span>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                3
              </span>
              <span>Start playing Strategic Chess!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
