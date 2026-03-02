import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../context/ChatContext';

const MessageList = () => {
  const { messages } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-slate-900 flex flex-col gap-2">
      {messages.map((msg) => {
        if (msg.isSystem) {
          return (
            <div key={msg.id} className={`text-sm text-center font-bold px-2 py-1 rounded-md ${msg.success ? 'bg-green-600/20 text-green-400' : 'bg-slate-700/50 text-slate-300'}`}>
              {msg.text}
            </div>
          );
        }

        return (
          <div key={msg.id} className="text-sm">
            <span className="font-bold text-slate-300">{msg.user}: </span>
            <span className="text-white break-words">
              {msg.text}
            </span>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;