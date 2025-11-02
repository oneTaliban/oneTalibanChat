import React, {createContext, useContext, useRef, useEffect} from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext();

export const WebSocketProvider = ({children}) => {
  const {isAuthenticated, user} = useAuth();
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = () => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      // websocket connection will be established per chat room
      //This context provides the utility functions
    } catch (error) {
      console.error("WebSocket connection error: ",error);
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    }
  }, [isAuthenticated, user]);

  const value = {
    connectToRoom: (roomId) => {
      //this is to be implemented in the chat components
    },
    sendMessage: (roomId, messagte) => {
      //this will be implemented in the chat components
    },
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be within a WebSocketProvider");
  }
  return context;
};