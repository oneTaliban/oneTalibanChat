import React, { useState, useEffect, useRef} from 'react';
import { motion , AnimatePresence} from 'framer-motion';
import { Send, Users, Phone, Video, MoreVertical, Search, MessageCircleMore} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';


const ChatRoom = () => {
  const {activeRoom , messages, loadRooms , typingUsers, sendMessage, setTyping} = useChat();
  const {user} = useAuth();
  const [isLoading,setIsLoading] = useState(false);
  const ws = useRef(null);
  
  useEffect(() => {
    if (!activeRoom) return;

    // connect to websocket for real time communication
    // const connectWebSocket = () => {
    //   const token = localStorage.getItem('access_token');
    //   ws.current = new WebSocket(
    //     `ws://localhost:8000/ws/chat/${activeRoom.id}/?token=${token}`
    //   );

    //   ws.current.onopen = () => {
    //     console.log("WebSocket connected");
    //   };

    //   ws.current.onmessage = (event) => {
    //     const data = JSON.parse(event.data);

    //     switch (data.type) {
    //       case 'chat_message':
    //         // handle new message
            
    //       case 'typing':
    //         //handle typing
    //       case 'message_read':
    //         // handle message read
    //       default:
    //         break;
    //       }
    //     };
    //     ws.current.onclose = () => {
    //       console.log("WebSocket closed");
    //     };
    //   };

    //   connectWebSocket();

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
  }, [activeRoom]);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-chat-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8}}
          animate={{ opacity: 1 , scale: 1}}
          className='text-center text-gray-500'
        >
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl"> 
              <MessageCircleMore className='w-18 h-18'></MessageCircleMore>
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gradient">Welcome to One Taliban Chat</h3>
          <p>Select a conversation to start messaging</p>
        </motion.div>        
      </div>
    );
  }
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className='flex-1 flex flex-col h-full max-w-screen'
    >
      {/* Chat header */}
      <div className="bg-terminal-header border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={activeRoom.avatar || '/default-group.png'} 
                alt={activeRoom.name} 
                className='w-12 h-12 rounded-full border-2 border-purple-500'
              />
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-terminal-header'></div>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{activeRoom.name}</h2>
              <p className="text-gray-400 text-sm">
                {typingUsers.length > 0
                  ? `${typingUsers[0].username} is typing...`
                  : `${activeRoom.participants.length} participants`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Video className='w-5 h-5'></Video>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className='w-5 h-5'></Phone>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Search className='w-5 h-5'></Search>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className='w-5 h-5'></MoreVertical>
            </button>
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-hacker-blue/5 backdrop-blur-md bg-whatsapp-chat-bg max-h-screen">
        <MessageList></MessageList>
      </div>

      {/* Typing indicators */}
      {/* <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0}}
            animate={{ opacity: 1, height: 'auto'}}
            exit={{ opacity: 0, height: 0}}
            className='px-6 py-2'
          >
            {typingUsers.map((typingUser) => (
              <TypingIndicator key={typingUser.id} user={typingUser}></TypingIndicator>
            ))}
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Chat Input */}
      <ChatInput></ChatInput>
      
  </motion.div>
  );

};

export default ChatRoom