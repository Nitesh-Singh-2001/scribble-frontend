import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage } = useContext(ChatContext);
  const { roomId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && roomId) {
      sendMessage(input, roomId);
      setInput(''); // Clear the box
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t border-slate-700 bg-slate-900 p-2 gap-2">
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type your guess..."
        className="flex-1 bg-slate-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-700 placeholder-slate-500"
      />
      <button 
        type="submit" 
        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded-md transition-colors shadow-md"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;