import React from 'react';
import { ChatProvider } from '../../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatBox = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-full bg-slate-800 text-white">
        <MessageList />
        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default ChatBox;