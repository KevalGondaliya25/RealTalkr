import { selectCurrentToken } from "@/redux/slice/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SocketContextType {
  socket: WebSocket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (token && !socket) {
      const socketConn = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?token=${token}`
      );

      setSocket(socketConn);

      socketConn.addEventListener("open", () => {
        console.info("Connected to WebSocket server");
        socketConn.send(JSON.stringify({ action: "$connect" }));
      });

      socketConn.addEventListener("close", () => {
        console.info("Close connection to WebSocket server");
      });

      socketConn.addEventListener("error", (e) => {
        // console.error("WebSocket Connection is in error", e);
      });

      return () => {
        socketConn.close();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
