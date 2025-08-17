import { useState, useEffect, useCallback } from "react";
import { Crown, Users, Copy, Check, Play, AlertCircle } from "lucide-react";
import HeroSelection from "@/components/HeroSelection";
import { useWebSocket } from "@/app/hooks/useWebSocket";

export default function GameRoomPage({ params }) {
  const { roomCode } = params;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const [playerColor, setPlayerColor] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);

  const fetchRoom = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomCode}`);
      if (!response.ok) {
        throw new Error("Room not found");
      }
      const data = await response.json();
      setRoom(data.room);

      // Determine player color and spectator status
      if (data.room.white_player_id === playerId) {
        setPlayerColor("white");
        setIsSpectator(false);
      } else if (data.room.black_player_id === playerId) {
        setPlayerColor("black");
        setIsSpectator(false);
      } else {
        // This user is not a player in this room - they need to join properly
        setIsSpectator(true);
        setPlayerColor(null);
      }
    } catch (err) {
      console.error("Error fetching room:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roomCode, playerId]);

  // WebSocket message handler for real-time room updates
  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'gameStateUpdate' || message.type === 'roomUpdate') {
      // Trigger a fresh room fetch when we get updates
      fetchRoom();
    } else if (message.type === 'connected') {
      console.log('Connected to room updates:', message.roomCode);
    } else if (message.type === 'error') {
      console.error('Room WebSocket error:', message.message);
    }
  }, [fetchRoom]);

  // Initialize WebSocket connection for real-time updates
  const { connected: wsConnected, error: wsError } = useWebSocket(
    roomCode,
    handleWebSocketMessage
  );

  useEffect(() => {
    fetchRoom();
    // Initial fetch only - WebSocket will handle real-time updates
  }, []);


  const selectHero = async (heroName) => {
    try {
      const heroField = playerColor === "white" ? "white_hero" : "black_hero";
      const updates = { [heroField]: heroName };

      // Check if both heroes are selected to start the game
      const otherHeroField =
        playerColor === "white" ? "black_hero" : "white_hero";
      if (room[otherHeroField]) {
        updates.status = "playing";
      }

      const response = await fetch(`/api/rooms/${roomCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchRoom();
      }
    } catch (err) {
      console.error("Error selecting hero:", err);
    }
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startGame = () => {
    const params = new URLSearchParams({
      mode: "multiplayer",
      roomCode,
      whiteHero: room.white_hero,
      blackHero: room.black_hero,
    });
    window.location.href = `/game/board?${params.toString()}`;
  };

  // Show invitation to join for spectators in waiting rooms
  if (
    !loading &&
    isSpectator &&
    room?.status === "waiting" &&
    !room?.black_player_id
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg text-center">
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Join This Game?
          </h2>
          <p className="text-gray-600 mb-4">
            There's an open spot in this room. Would you like to join as the
            second player?
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Room <strong>{roomCode}</strong> is waiting for a second player
            </p>
          </div>
          <div className="space-y-3">
            <a
              href={`/rooms/join?code=${roomCode}`}
              className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join as Black Player
            </a>
            <a
              href="/rooms/create"
              className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Own Room
            </a>
            <a
              href="/"
              className="block text-amber-600 hover:text-amber-700 underline"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show error for spectators trying to access active games
  if (!loading && isSpectator && room?.status !== "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Room Unavailable
          </h2>
          <p className="text-gray-600 mb-4">
            This room is currently in use by other players.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Room <strong>{roomCode}</strong> is in{" "}
              <strong>{room?.status?.replace("_", " ")}</strong> phase
            </p>
          </div>
          <div className="space-y-3">
            <a
              href="/rooms/create"
              className="block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create New Room
            </a>
            <a
              href="/rooms/join"
              className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Different Room
            </a>
            <a
              href="/"
              className="block text-amber-600 hover:text-amber-700 underline"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Room Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-amber-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Game Room</h1>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-2xl font-mono font-bold text-gray-700">
              {roomCode}
            </span>
            <button
              onClick={copyRoomCode}
              className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              title="Copy room code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <a href="/" className="text-amber-600 hover:text-amber-700 underline">
            ← Back to home
          </a>
        </div>

        {/* Room Status */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-600 mr-3" />
              <div>
                <h3 className="font-bold text-gray-800">Room Status</h3>
                <p className="text-gray-600 capitalize">
                  {room?.status?.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                className={`p-3 rounded-lg ${room?.white_player_id ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}
              >
                <p className="text-sm font-medium text-gray-700">
                  White Player
                </p>
                <p
                  className={`text-sm ${room?.white_player_id ? "text-blue-600" : "text-gray-400"}`}
                >
                  {room?.white_player_id
                    ? playerColor === "white"
                      ? "You"
                      : "Opponent"
                    : "Waiting..."}
                </p>
                {room?.white_hero && (
                  <p className="text-xs text-blue-700 mt-1">
                    {room.white_hero}
                  </p>
                )}
              </div>

              <div
                className={`p-3 rounded-lg ${room?.black_player_id ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}
              >
                <p className="text-sm font-medium text-gray-700">
                  Black Player
                </p>
                <p
                  className={`text-sm ${room?.black_player_id ? "text-red-600" : "text-gray-400"}`}
                >
                  {room?.black_player_id
                    ? playerColor === "black"
                      ? "You"
                      : "Opponent"
                    : "Waiting..."}
                </p>
                {room?.black_hero && (
                  <p className="text-xs text-red-700 mt-1">{room.black_hero}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Waiting for Players */}
        {room?.status === "waiting" && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Waiting for Opponent
            </h2>
            <p className="text-gray-600 mb-6">
              Share the room code with your opponent to start the game
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <div className="animate-pulse w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <p className="text-yellow-800">
                  Waiting for second player to join...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Selection Phase */}
        {room?.status === "hero_selection" && playerColor && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <HeroSelection
              onHeroSelect={selectHero}
              selectedHero={
                playerColor === "white" ? room.white_hero : room.black_hero
              }
              playerColor={playerColor}
              opponentHero={
                playerColor === "white" ? room.black_hero : room.white_hero
              }
            />

            {/* Waiting for opponent to select hero */}
            {((playerColor === "white" &&
              room.white_hero &&
              !room.black_hero) ||
              (playerColor === "black" &&
                room.black_hero &&
                !room.white_hero)) && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-pulse w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <p className="text-yellow-800">
                    Waiting for opponent to select their hero...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ready to Play */}
        {room?.status === "playing" && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="mb-6">
              <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Ready to Battle!
              </h2>
              <p className="text-gray-600 mb-6">
                Both heroes have been selected. Time to begin the strategic
                chess battle!
              </p>
            </div>

            {/* Hero Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">White Player</h3>
                <p className="text-blue-700">{room.white_hero}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">Black Player</h3>
                <p className="text-red-700">{room.black_hero}</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg font-bold text-xl transition-colors"
            >
              Enter Game Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
