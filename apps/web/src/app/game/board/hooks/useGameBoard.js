import { useState, useEffect, useCallback } from "react";
import { createInitialBoard } from "../gameLogic/boardSetup";
import { calculateValidMoves } from "../gameLogic/moves";
import { useWebSocket } from "@/app/hooks/useWebSocket";

export function useGameBoard() {
  const [gameParams, setGameParams] = useState({});
  const [board, setBoard] = useState(createInitialBoard());
  const [currentTurn, setCurrentTurn] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [whiteTrophies, setWhiteTrophies] = useState(0);
  const [blackTrophies, setBlackTrophies] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [moveHistory, setMoveHistory] = useState([]);
  const [showConversionModal, setShowConversionModal] = useState(null);
  const [room, setRoom] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'gameStateUpdate' && message.data) {
      const data = message.data;
      
      // Update board state if provided
      if (data.board_state) {
        let remoteBoard = data.board_state;
        if (typeof remoteBoard === "string") {
          try {
            remoteBoard = JSON.parse(remoteBoard);
          } catch (e) {
            console.error("Failed to parse board_state string", e);
            return;
          }
        }
        if (Array.isArray(remoteBoard)) {
          setBoard(remoteBoard);
        }
      }

      // Update other game state
      if (data.current_turn) setCurrentTurn(data.current_turn);
      if (typeof data.white_trophies === "number") setWhiteTrophies(data.white_trophies);
      if (typeof data.black_trophies === "number") setBlackTrophies(data.black_trophies);
      if (data.winner) {
        setGameStatus(data.winner === "white" ? "white_wins" : "black_wins");
      }
    } else if (message.type === 'connected') {
      setWsConnected(true);
      console.log('Connected to game room:', message.roomCode);
    } else if (message.type === 'error') {
      console.error('WebSocket error:', message.message);
    }
  }, []);

  // Initialize WebSocket connection for multiplayer games
  const { connected: wsConnectedState, error: wsError, reconnect } = useWebSocket(
    gameParams.mode === "multiplayer" ? gameParams.roomCode : null,
    handleWebSocketMessage
  );

  const fetchRoomState = async (roomCode) => {
    try {
      const response = await fetch(`/api/rooms/${roomCode}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setRoom(data.room);

        const storedPlayerId = localStorage.getItem("chess_player_id");
        if (data.room.white_player_id === storedPlayerId) {
          setPlayerColor("white");
        } else if (data.room.black_player_id === storedPlayerId) {
          setPlayerColor("black");
        }

        let remoteBoard = data.room.board_state;
        if (typeof remoteBoard === "string") {
          try {
            remoteBoard = JSON.parse(remoteBoard);
          } catch (e) {
            console.error("Failed to parse board_state string", e);
            remoteBoard = null;
          }
        }
        if (Array.isArray(remoteBoard)) {
          setBoard(remoteBoard);
        }

        if (data.room.current_turn) setCurrentTurn(data.room.current_turn);
        if (typeof data.room.white_trophies === "number") setWhiteTrophies(data.room.white_trophies);
        if (typeof data.room.black_trophies === "number") setBlackTrophies(data.room.black_trophies);
        if (data.room.winner) {
          setGameStatus(
            data.room.winner === "white" ? "white_wins" : "black_wins",
          );
        }
      } else {
        console.error("Failed to fetch room state", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching room state:", error);
    }
  };

  const updateRoomState = async (updates) => {
    if (gameParams.mode === "multiplayer" && gameParams.roomCode) {
      try {
        const res = await fetch(`/api/rooms/${gameParams.roomCode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.error("Update room failed", res.status, res.statusText, txt);
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error updating room:", error);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      mode: urlParams.get("mode"),
      roomCode: urlParams.get("roomCode"),
      whiteHero: urlParams.get("whiteHero"),
      blackHero: urlParams.get("blackHero"),
    };
    setGameParams(params);

    if (params.mode === "multiplayer") {
      const storedPlayerId = localStorage.getItem("chess_player_id");
      setPlayerId(storedPlayerId);
    }

    if (params.whiteHero === "Alexander the Great") setWhiteTrophies(3);
    if (params.blackHero === "Alexander the Great") setBlackTrophies(3);

    if (params.mode === "multiplayer" && params.roomCode) {
      // Initial fetch for room state
      fetchRoomState(params.roomCode);
      // No need for polling interval - WebSocket will handle real-time updates
    }
  }, []);

  const memoizedCalculateValidMoves = useCallback((piece, row, col) => {
    return calculateValidMoves(board, piece, row, col);
  }, [board]);

  const makeMove = async (fromRow, fromCol, toRow, toCol) => {
    if (gameParams.mode === "multiplayer") {
      if (!playerColor || playerColor !== currentTurn) return;
      const moving = board[fromRow][fromCol];
      if (!moving || moving.color !== playerColor) return;
    }

    const prevBoard = board;
    const prevTurn = currentTurn;
    const prevWhiteTrophies = whiteTrophies;
    const prevBlackTrophies = blackTrophies;

    const newBoard = board.map((r) => [...r]);
    const movingPiece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];

    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;

    let newWhiteTrophies = whiteTrophies;
    let newBlackTrophies = blackTrophies;
    let newGameStatus = gameStatus;

    if (capturedPiece) {
      if (capturedPiece.type === "commander") {
        newGameStatus = movingPiece.color === "white" ? "white_wins" : "black_wins";
        setGameStatus(newGameStatus);
      } else {
        if (movingPiece.color === "white") {
          newWhiteTrophies += 1;
          if (movingPiece.type === "elephant") newWhiteTrophies += 1;
        } else {
          newBlackTrophies += 1;
          if (movingPiece.type === "elephant") newBlackTrophies += 1;
        }
      }
    }

    const convertiblePairs = [
      ["horse", "elephant"],
      ["guard", "raider"],
      ["tower", "artillery"],
    ];
    const canConvert = convertiblePairs.some((pair) => pair.includes(movingPiece.type));
    if (canConvert) {
      setShowConversionModal({ row: toRow, col: toCol, piece: movingPiece, pairs: convertiblePairs });
    }

    setBoard(newBoard);
    setWhiteTrophies(newWhiteTrophies);
    setBlackTrophies(newBlackTrophies);

    if (newWhiteTrophies >= 21) {
      newGameStatus = "white_wins";
      setGameStatus(newGameStatus);
    } else if (newBlackTrophies >= 21) {
      newGameStatus = "black_wins";
      setGameStatus(newGameStatus);
    }

    const moveData = { from: [fromRow, fromCol], to: [toRow, toCol], piece: movingPiece, captured: capturedPiece, turn: currentTurn };
    setMoveHistory((prev) => [...prev, moveData]);

    const nextTurn = currentTurn === "white" ? "black" : "white";
    setCurrentTurn(nextTurn);
    setSelectedPiece(null);
    setValidMoves([]);

    if (gameParams.mode === "multiplayer" && gameParams.roomCode) {
      const updates = {
        board_state: newBoard,
        current_turn: nextTurn,
        white_trophies: newWhiteTrophies,
        black_trophies: newBlackTrophies,
        last_move: moveData,
        updated_at: new Date().toISOString(),
      };
      if (newGameStatus !== "playing") {
        updates.winner = newGameStatus === "white_wins" ? "white" : "black";
        updates.status = "finished";
      }
      const ok = await updateRoomState(updates);
      if (!ok) {
        console.error("Server update failed, rolling back local state");
        setBoard(prevBoard);
        setWhiteTrophies(prevWhiteTrophies);
        setBlackTrophies(prevBlackTrophies);
        setCurrentTurn(prevTurn);
        fetchRoomState(gameParams.roomCode);
        return;
      }
      // No need for manual polling - WebSocket will handle the update
    }
  };

  const handlePieceClick = (row, col) => {
    const piece = board[row][col];
    if (gameParams.mode === "multiplayer") {
      if (!playerColor || currentTurn !== playerColor) return;
      if (!selectedPiece && (!piece || piece.color !== playerColor)) return;
      if (selectedPiece && piece && piece.color !== playerColor) return;
    }

    if (selectedPiece) {
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      if (isValidMove) {
        makeMove(selectedPiece.row, selectedPiece.col, row, col);
      } else if (piece && piece.color === currentTurn) {
        setSelectedPiece({ row, col, piece });
        setValidMoves(memoizedCalculateValidMoves(piece, row, col));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === currentTurn) {
      setSelectedPiece({ row, col, piece });
      setValidMoves(memoizedCalculateValidMoves(piece, row, col));
    }
  };

  const handleConversion = (newType) => {
    if (showConversionModal) {
      const newBoard = [...board];
      newBoard[showConversionModal.row][showConversionModal.col] = {
        ...showConversionModal.piece,
        type: newType,
      };
      setBoard(newBoard);
    }
    setShowConversionModal(null);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentTurn("white");
    setSelectedPiece(null);
    setValidMoves([]);
    setWhiteTrophies(gameParams.whiteHero === "Alexander the Great" ? 3 : 0);
    setBlackTrophies(gameParams.blackHero === "Alexander the Great" ? 3 : 0);
    setGameStatus("playing");
    setMoveHistory([]);
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return {
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
    wsConnected: wsConnectedState,
    wsError,
    handlePieceClick,
    handleConversion,
    setShowConversionModal,
    resetGame,
    goHome,
    reconnectWebSocket: reconnect,
  };
}
