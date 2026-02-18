"use client";

import React, { useEffect, useRef } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useNotificationStore } from "@/stores/notification-store";
import { apiClient } from "@/lib/api-client"; // To get baseURL

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const initializeSocketListenersRef = useRef(useNotificationStore.getState().initializeSocketListeners);

  // Derive socket URL from API base URL if not explicitly set
  const getSocketUrl = () => {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      return process.env.NEXT_PUBLIC_SOCKET_URL;
    }

    // Fallback: Use the baseURL from apiClient and strip /api if present
    const baseURL = apiClient.defaults.baseURL;
    if (baseURL && typeof baseURL === 'string') {
      // Remove trailing /api if it exists
      if (baseURL.endsWith("/api")) {
        return baseURL.slice(0, -4); // Remove "/api"
      }
      return baseURL;
    }

    // Default fallback if all else fails
    return "https://afridam-backend-prod-107032494605.us-central1.run.app";
  };

  const socketUrl = getSocketUrl();
  const { isConnected, listen } = useSocket(socketUrl);

  useEffect(() => {
    if (listen) {
      initializeSocketListenersRef.current(listen);
    }
  }, [listen]);

  // Optionally, you can add a context provider here if other components need isConnected or socket instance directly
  // For now, it primarily initializes the notification store listeners.

  return <>{children}</>;
};

export default SocketProvider;
