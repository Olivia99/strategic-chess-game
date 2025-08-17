import sql from "@/app/api/utils/sql";

// Server-Sent Events endpoint for real-time game state updates
export async function GET(request, { params }) {
  const { roomCode } = params;
  const code = roomCode.toUpperCase();

  // Validate room exists
  try {
    const [room] = await sql`
      SELECT id FROM game_rooms 
      WHERE room_code = ${code}
    `;

    if (!room) {
      return new Response('Room not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error validating room:', error);
    return new Response('Internal server error', { status: 500 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ 
        type: 'connected', 
        roomCode: code,
        timestamp: new Date().toISOString()
      })}\n\n`);

      let lastUpdateTime = new Date();
      
      // Poll for updates and send them via SSE
      const pollInterval = setInterval(async () => {
        try {
          // Check for updates since last poll
          const stateRows = await sql`
            SELECT board_state, current_turn, white_trophies, black_trophies, winner, last_move, updated_at
            FROM room_states
            WHERE room_code = ${code} AND updated_at > ${lastUpdateTime}
            LIMIT 1
          `;

          if (stateRows.length > 0) {
            const state = stateRows[0];
            lastUpdateTime = new Date(state.updated_at);
            
            // Send the update
            controller.enqueue(`data: ${JSON.stringify({
              type: 'gameStateUpdate',
              data: {
                board_state: state.board_state,
                current_turn: state.current_turn,
                white_trophies: state.white_trophies,
                black_trophies: state.black_trophies,
                winner: state.winner,
                last_move: state.last_move,
                updated_at: state.updated_at
              },
              timestamp: new Date().toISOString()
            })}\n\n`);
          }
        } catch (error) {
          console.error('Error polling for updates:', error);
          controller.enqueue(`data: ${JSON.stringify({
            type: 'error',
            message: 'Failed to fetch updates',
            timestamp: new Date().toISOString()
          })}\n\n`);
        }
      }, 500); // Poll every 500ms for near real-time updates

      // Keep connection alive with heartbeat
      const heartbeatInterval = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        })}\n\n`);
      }, 30000); // Every 30 seconds

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval);
        clearInterval(heartbeatInterval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}