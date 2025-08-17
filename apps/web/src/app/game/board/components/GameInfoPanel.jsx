import { Crown, Star, RotateCcw, Flag } from "lucide-react";
import { PIECE_TYPES } from "../gameLogic/constants";

export default function GameInfoPanel({
  gameParams,
  playerColor,
  currentTurn,
  whiteTrophies,
  blackTrophies,
  resetGame,
}) {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Heroes */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <Crown className="w-5 h-5 mr-2 text-amber-600" />
          Heroes
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800">White</p>
            <p className="text-blue-700 text-sm">
              {gameParams.whiteHero || "Unknown"}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800">Black</p>
            <p className="text-red-700 text-sm">
              {gameParams.blackHero || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <Flag className="w-5 h-5 mr-2 text-amber-600" />
          Game Status
        </h3>

        {/* Multiplayer turn indicator */}
        {gameParams.mode === "multiplayer" && playerColor && (
          <div className="mb-3">
            <div
              className={`p-3 rounded-lg border-2 ${
                currentTurn === playerColor
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-gray-50 border-gray-300 text-gray-600"
              }`}
            >
              <div className="flex items-center justify-center">
                {currentTurn === playerColor ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-semibold">Your Turn!</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <span>Opponent's Turn</span>
                  </>
                )}
              </div>
              <p className="text-center text-sm mt-1">
                You are playing as{" "}
                <strong
                  className={
                    playerColor === "white"
                      ? "text-blue-600"
                      : "text-red-600"
                  }
                >
                  {playerColor}
                </strong>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div
            className={`p-2 rounded-lg ${
              currentTurn === "white"
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium">
              White's Turn
              {gameParams.mode === "multiplayer" &&
                playerColor === "white" &&
                currentTurn === "white" && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
            </p>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{whiteTrophies}/21 trophies</span>
            </div>
          </div>
          <div
            className={`p-2 rounded-lg ${
              currentTurn === "black"
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium">
              Black's Turn
              {gameParams.mode === "multiplayer" &&
                playerColor === "black" &&
                currentTurn === "black" && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
            </p>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{blackTrophies}/21 trophies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-3">Controls</h3>
        <div className="space-y-2">
          <button
            onClick={resetGame}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </button>
          {gameParams.mode === "multiplayer" && (
            <div className="text-xs text-gray-600 text-center">
              Room: {gameParams.roomCode}
            </div>
          )}
        </div>
      </div>

      {/* Piece Legend */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-3">Pieces</h3>
        <div className="space-y-1 text-xs">
          {Object.entries(PIECE_TYPES).map(([type, info]) => (
            <div key={type} className="flex items-center">
              <span className="text-lg mr-2">{info.symbol}</span>
              <span className="text-gray-700">{info.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
