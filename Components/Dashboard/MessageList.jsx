// Components/Dashboard/MessageList.js
'use client';
import { useEffect, useMemo } from 'react';
import TypingIndicator from './TypingIndicator';
import AdminChatMessage from '@/Components/Home/AdminChatMessage';
import ClientChatMessage from '@/Components/Home/ClientChatMessage';

const MessageList = ({ messages, messagesEndRef, user, selectedUserName, isTyping }) => {
  const UserID = user?._id;
  
  // Sort messages once
  const sortedMessages = useMemo(() => [...messages].sort((a, b) => 
    new Date(a.createdAt || a.data?.createdAt) - new Date(b.createdAt || b.data?.createdAt)
  ), [messages]);

  // Generate message components with useMemo to prevent unnecessary recalculations
  const messageComponents = useMemo(() => sortedMessages.map((message) => {
    const isCurrentUserMessage = (message?.senderId || message.data?.senderId?._id) === UserID;
    const Component = isCurrentUserMessage ? ClientChatMessage : AdminChatMessage;
    
    return (
      <Component
        key={message?._id || message.data?._id}
        messageId={message?._id}
        message={message?.text || message.data?.text}
        time={new Date(message?.createdAt || message.data?.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
        imageUrl={message?.image || message.data?.image || ""}
        senderName={isCurrentUserMessage ? "You" : selectedUserName}
        MesseageBoxSize='max-w-[520px] min-w-[320px]'
        recieverId={user?._id}
      />
    );
  }), [sortedMessages, UserID, selectedUserName]);

  useEffect(() => {
    // Only scroll if there are new messages
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, messagesEndRef]);

  return (
    <div className="h-full p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#996f53] scrollbar-track-transparent bg-gradient-to-br from-[#6b6b6b] to-black overflow-x-hidden">
      {messageComponents}
      {isTyping && (
        <TypingIndicator senderName={selectedUserName} />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageList.displayName = 'MessageList';

export default MessageList;