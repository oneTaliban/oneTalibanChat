import React, { useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { MessageCircleMore } from 'lucide-react';


const MessageList = () => {
  const {messages, activeRoom, typingUsers} = useChat();
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behaviour: 'smooth'});
  };

  useEffect(() => {
    // scrollToBottom();
  }, [ /*messages, typingUsers */]);
  
  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-chat-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8}}
          animate={{ opacity: 1 , scale: 1}}
          className='text-center tex-gray-500'
        >
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl"> 
              <MessageCircleMore></MessageCircleMore>
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to One Taliban Chat</h3>
          <p>Select a conversation to start messaging</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-whatsapp-chat-bg overflow-hidden"> 
      {/* Message container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <Message
              key={message.id || message.tempId}
              message={message}
              index={index}
            ></Message>
          ))}

          {/* typing indicators */}
          {/* disabled it since i am using for chat input */}
          {/* {typingUsers.map((user) => (
            <TypingIndicator key={user.id} user={user}></TypingIndicator>
          ))} */}
        </AnimatePresence>
        
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default MessageList;