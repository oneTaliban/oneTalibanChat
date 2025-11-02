import React, {useState} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Check, CheckCheck, MoreVertical } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const Message = ({message, index}) => {
  const {likeMessage, markMessageRead} = useChat();
  const {user} = useAuth();
  const [showActions, setShowActions] = useState(false);

  const isSent = message.sender.id === user.id;
  const isTemp = message.tempId;

  const handleLike = async () => {
    if (!isTemp) {
      await likeMessage(message.id)
    }
  };

  const handleMouseEnter = () => {
    if (!isTemp) {
      setShowActions(true);
      //mark message as read while hovering over the messages
      if (!message.is_read && !isSent) {
        markMessageRead(message.id);
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = () => {
    if (!isSent) return null;
    if (message.read_by && message.read_by.length > 1) {
      return <CheckCheck className='w-3 h-3 text-blue-500'></CheckCheck>;
    }else if (message.read_by && message.read_by.length === 1) {
      return <Check className='w-3 h-3 text-gray-500'></Check>;
    }
    return <Check className='w-3 h-3 text-gray-400'></Check>;
  };

  return (
    <motion.div
      initial={{opacity: 0 , y: 20, scale: 0.8}}
      animate={{opacity: 1, y: 0, scale:1}}
      transition={{duration: 0.3, delay: index * 0.05}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowActions(false)}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`message ${isSent ? 'message-sent' : 'message-received'} relative`}>
        {/* sender info for received messages */}
        {isSent && (
          <div className="flex items-center space-x-2 mb-1">
            <img 
              src={message.sender.avatar || '/default-avatar.png'} 
              // alt={message.sender.username}
              className='w-6 h-6 rounded-full' 
            />
            <span className="text-xs text-gray-600 font-medium">
              {message.sender.username}
            </span>
          </div>
        )}

        {/* message content */}
        <div className="message-content">
          {message.content}
        </div>

        {/* message footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            <span className="message-timestamp">
              {formatTime(message.created_at)}
            </span>
            {getStatusIcon()}
          </div>

          {/* {like button} */}
          {!isTemp && (
            <motion.button
              whileHover={{ scale: 1.1}}
              whileTap={{ scale: 0.9}}
              onClick={handleLike}
              className={`p-1 rounded-full transition-colors ${
                  message.is_liked
                  ? 'text-red-500 bg-red-500/10'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                }`}
            >
              <Heart
                className={`w-3 h-3 ${message.is_liked ? 'fill-current' : ''}`}
              ></Heart>
            </motion.button>
          )}
        </div>

        {/* Like count */}
        {message.like_count > 0 && (
          <div className="flex items-center space-x-1 mt-1">
            <Heart className="w-3 h-3 text-red-500 fill-current"></Heart>
            <span className="text-xs text-gray-500">{message.likes_count}</span>
          </div>
        )}

        {/* Loading indicator for temp messages */}
        {isTemp && (
          <div className="absolute -top-2 -right-2">
            <motion.div
              animate={{ rotate: 360}}
              transition={{duration: 1,  repeat: Infinity, ease: 'linear'}}
              className='w-4 h-4 border-2  border-purple-500 border-t-transparent rounded-full'
            >
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showActions && !isTemp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            className='flex items-center space-x-1 ml-2'
          >
            <motion.button
              whileHover={{ scale: 1.1}}
              whileTap={{ scale: 0.9}}
              className='p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors'
            >
             <MoreVertical className='w-4 h-4'></MoreVertical> 
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Message