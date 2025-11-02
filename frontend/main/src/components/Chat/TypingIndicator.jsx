import React from 'react';
import { motion } from 'framer-motion';


const TypingIndicator = ({user}) => {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{ opacity: 0, y: 10}}
      className='flex justify-start'
    >
      <div className="message message-received">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <img 
            src={user.avatar || 'default-avatar.png'} 
            // alt={user.username} 
            className='w-6 h-6 rounded-full'
          />
          <span className="text-xs text-gray-600 font-medium">
            {user.username}
          </span>
        </div>
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;