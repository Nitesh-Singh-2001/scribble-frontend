import React, { createContext, useState, useEffect } from 'react';
import { socket } from '../services/socket';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, {
        id: Date.now() + Math.random(),
        user: data.name,
        text: data.message,
        isSystem: data.isSystem,
        success: data.success
      }]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = (text, roomId) => {
    // Backend handles correctness, we just send the raw text and explicit roomId
    socket.emit("send_message", { message: text, roomId });
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};