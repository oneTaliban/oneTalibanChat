import React, { useState, useRef} from 'react';
import { motion } from 'framer-motion';
import {Send, Smile, Paperclip} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const ChatInput = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { sendMessage, activeRoom, setTyping} = useChat();
    const {user} = useAuth();
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // Handle typing indicators
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            setTyping(user, true);
        }

        // clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTyping(user, false);
        }, 1000);

        // Auto resize text area
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() || !activeRoom) return;

        // clear typing indicator
        setIsTyping(false);
        setTyping(user, false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        await sendMessage(message);
        setMessage('');

        // reset textarea height
        if (textareaRef.current){
            textareaRef.current.style.height = 'auto';
        }
    };

    if (!activeRoom) {
        return null;
    }

  return (
    <motion.div
        initial={{ y:50, opacity: 0}}
        animate={{ y:0, opacity: 1}}
        className='chat-input-container bg-terminal-header border-t border-gray-700'
    >
        <div className="flex items-end space-x-3 w-full">
            {/* Attachment button */}
            <motion.button
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 0.95}}
                className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0'
            >
                <Paperclip className="w-5 h-5"></Paperclip>
            </motion.button>

            {/* Emoji button */}
            <motion.button
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 0.95}}
                className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0'
            >
                <Smile className="w-5 h-5"></Smile>
            </motion.button>

            {/* Message input */}
            <div className="flex-1 relative">
                <textarea 
                    ref={textareaRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyUp={handleKeyPress}
                    placeholder='Type a message...'
                    className='chat-input resize-none min-h-[44px] max-h-[120px] py-3 pr-5'
                    rows={1}
                ></textarea>
            </div>

            {/* Send button */}
            <motion.button
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 0.95}}
                onClick={handleSubmit}
                disabled={ !message.trim()}
                className='send-button bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0'
            >
                <Send className='w-5 h-5'></Send>
            </motion.button>
        </div>
    </motion.div>
  );

};

export default ChatInput;