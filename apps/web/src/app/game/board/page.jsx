"use client";
import GameHeader from "./components/GameHeader";
import GameInfoPanel from "./components/GameInfoPanel";
import GameBoard from "./components/GameBoard";
import ConversionModal from "./components/ConversionModal";
import { useGameBoard } from "./hooks/useGameBoard";

export default function GameBoardPage() {
  const {
    gameParams,
    board,
    currentTurn,
    selectedPiece,
    validMoves,
    whiteTrophies,
    blackTrophies,
    gameStatus,
    showConversionModal,
    playerColor,
    wsConnected,
    wsError,
    handlePieceClick,
    handleConversion,
    setShowConversionModal,
    resetGame,
    goHome,
    reconnectWebSocket,
  } = useGameBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <GameHeader goHome={goHome} />
        
        {/* Connection Status Indicator */}
        {gameParams.mode === "multiplayer" && (
          <div className="mb-4 text-center">
            {wsConnected ? (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected to game room
              </div>
            ) : wsError ? (
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Connection failed
                <button 
                  onClick={reconnectWebSocket}
                  className="ml-2 text-red-600 hover:text-red-800 underline text-xs"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                Connecting...
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <GameInfoPanel
            gameParams={gameParams}
            playerColor={playerColor}
            currentTurn={currentTurn}
            whiteTrophies={whiteTrophies}
            blackTrophies={blackTrophies}
            resetGame={resetGame}
          />

          <GameBoard
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            handlePieceClick={handlePieceClick}
            gameStatus={gameStatus}
          />
        </div>

        <ConversionModal
          showConversionModal={showConversionModal}
          handleConversion={handleConversion}
          setShowConversionModal={setShowConversionModal}
        />
      </div>
    </div>
  );
}
