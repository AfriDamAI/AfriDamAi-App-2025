/**
 * 🛡️ AFRIDAM NEURAL SOCKET HOOK
 * Location: components/hooks/use-socket.tsx
 * Version: 2026.1.21 (Type-Safe Handshake)
 * Rule 5: Pure logic engine. Resolves ts(7006) 'any' errors.
 */

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// 🧬 Define the Clinical Data structure
// This ensures 'data' never implicitly has an 'any' type.
export interface SocketData {
  content: string;
  senderId?: string;
  userId?: string;
  payload?: {
    note?: string;
    isTyping?: boolean;
    isNote?: boolean;
  };
  timestamp?: string;
}

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    // 🚀 Initializing the WebSocket Handshake
    const socketInstance = io(url, {
      transports: ["websocket"],
      secure: true,
      auth: {
        // Rule 5: Safety check for client-side execution
        token: typeof window !== 'undefined' ? localStorage.getItem("token") : null
      }
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Clinical Node: ONLINE");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Clinical Node: OFFLINE");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  /** 🛡️ listen: Type-Safe Listener **/
  const listen = useCallback((event: string, callback: (data: SocketData) => void) => {
    if (socket) {
      socket.on(event, (data: SocketData) => {
        callback(data);
      });
    }
  }, [socket]);

  /** 🛡️ emit: Type-Safe Emitter **/
  const emit = useCallback((event: string, data: SocketData) => {
    if (socket) {
      socket.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  }, [socket]);

  return { isConnected, listen, emit };
};