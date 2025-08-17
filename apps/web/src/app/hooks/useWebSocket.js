import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(roomCode, onMessage) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!roomCode) return;

    try {
      // Use Server-Sent Events as a fallback for real-time updates
      // This is more compatible than WebSocket for this use case
      const eventSource = new EventSource(`/api/rooms/${roomCode}/events`);
      
      eventSource.onopen = () => {
        console.log('SSE connection opened for room:', roomCode);
        setConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      eventSource.onerror = () => {
        console.error('SSE connection error for room:', roomCode);
        setConnected(false);
        eventSource.close();
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else {
          setError('Failed to maintain connection. Please refresh the page.');
        }
      };

      wsRef.current = eventSource;
    } catch (err) {
      console.error('Failed to create SSE connection:', err);
      setError('Failed to connect to game server');
    }
  }, [roomCode, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  const sendMessage = useCallback((message) => {
    // Since we're using SSE for receiving, we'll use regular HTTP for sending
    // This is handled by the existing updateRoomState function
    console.log('Message sending handled by HTTP API:', message);
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connected,
    error,
    sendMessage,
    reconnect: connect
  };
}