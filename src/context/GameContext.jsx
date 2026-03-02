import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../services/socket';

const GameContext = createContext();

export const GameProvider = ({ children, correctAnswer }) => {
    const [messages, setMessages] = useState([]);

  const sendMessage = (text, user = "User") => {
    // Logic: Check if the answer is correct here (Metadata Approach)
    const isCorrect = text.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

    const newMessage = {
      text,
      user,
      isCorrect,
      id: Date.now()
    };

    setMessages((prev) => [...prev, newMessage]);
  };
  const [gameState, setGameState] = useState({
    players: [],
    currentDrawer: null,
    wordHint: "",
    isDrawing: false,
    messages: [],
    roomID: null,
  });

  useEffect(() => {
    socket.on("update_game", (data) => {
      setGameState((prev) => ({ ...prev, ...data }));
    });

    return () => socket.off("update_game");
  }, []);

  return (
    <GameContext.Provider value={{ gameState, setGameState, messages, sendMessage }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);