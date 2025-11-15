// /hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/auth";
import { messagesAPI } from "../api/message";

export const useSocket = () => {
  const { user } = useAuth();

  const teamId = user?.teamId ?? null;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!teamId) return;

      try {
        const messagesResponse = await messagesAPI.getByTeam(teamId);
        setMessages(messagesResponse.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [teamId]);

  useEffect(() => {
    if (!teamId) return;

    // Create socket
    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
      transports: ["polling"], // optional
    });

    socketRef.current = socket;

    // connected
    socket.on("connect", () => {
      setIsConnected(true);

      // join teamId room
      socket.emit("join_team", { teamId });
    });

    // listen messages
    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("new_message");
        socketRef.current.disconnect();
      }
    };
  }, [teamId]);

  return {
    isConnected,
    messages,
  };
};
