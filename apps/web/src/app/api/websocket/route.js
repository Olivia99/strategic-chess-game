// WebSocket server for real-time game state synchronization
import { WebSocketServer } from 'ws';

const connections = new Map(); // roomCode -> Set of WebSocket connections
const gameStates = new Map(); // roomCode -> latest game state

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomCode = searchParams.get('roomCode');
  
  if (!roomCode) {
    return new Response('Room code required', { status: 400 });
  }

  // Create WebSocket upgrade response
  const upgradeHeader = request.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket upgrade', { status: 426 });
  }

  // In a real deployment, you would handle WebSocket upgrade here
  // For now, return instructions for client-side implementation
  return new Response(JSON.stringify({
    message: 'WebSocket endpoint ready',
    roomCode,
    instructions: 'Connect using WebSocket client'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Utility functions for WebSocket management
export const wsUtils = {
  broadcast: (roomCode, message) => {
    const roomConnections = connections.get(roomCode);
    if (roomConnections) {
      roomConnections.forEach(ws => {
        if (ws.readyState === 1) { // WebSocket.OPEN
          ws.send(JSON.stringify(message));
        }
      });
    }
  },

  addConnection: (roomCode, ws) => {
    if (!connections.has(roomCode)) {
      connections.set(roomCode, new Set());
    }
    connections.get(roomCode).add(ws);
  },

  removeConnection: (roomCode, ws) => {
    const roomConnections = connections.get(roomCode);
    if (roomConnections) {
      roomConnections.delete(ws);
      if (roomConnections.size === 0) {
        connections.delete(roomCode);
      }
    }
  },

  updateGameState: (roomCode, gameState) => {
    gameStates.set(roomCode, gameState);
    wsUtils.broadcast(roomCode, {
      type: 'gameStateUpdate',
      data: gameState
    });
  }
};