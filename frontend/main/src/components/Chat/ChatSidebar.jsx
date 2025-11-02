import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Plus, MessageCircle } from 'lucide-react';
import {useChat} from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../Ui/Input';

const ChatSidebar = ({ roomCreated}) => {
  const {rooms, activeRoom, loadRooms, selectRoom, loading} = useChat();
  const { user } = useAuth();
  const [ searchTerm, setSearchTerm ] = useState('');

  let filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.participants.some(p => 
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    if (roomCreated) {
      loadRooms();
      filteredRooms = rooms.filter(room => 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        room.participants.some(p => 
          p.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );      
    }
  }, [roomCreated]);


  if (loading) {
    return (
      <div className="chat-sidebar bg-terminal-header border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="animate-pulse bg-gray-700 h-10 rounded-lg"></div>
        </div>
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="bg-gray-700 rounded-full w-12 h-12"></div>
              <div className="flex-space-y-2">
                <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                <div className="bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{x: -50, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      className='chat-sidebar bg-terminal-header border-r border-gray-700 flex flex-col h-full'
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center  mb-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <MessageCircle className='w-5 h-5 text-purple-400'></MessageCircle>
            <span>Chats</span>
          </h2>
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className='p-2 hidden bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4 text-white'></Plus>
          </motion.button>
        </div>
        <Input
          placeholder='Search Conversations...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='!bg-gray-800 !border-gray-600'
          icon={<Search className='w-4 h-4'></Search>}
        ></Input>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredRooms.length === 0 ? (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className='flex flex-col items-center justify-center h-32 text-gray-500'
            >
              <Users className='w-8 h-8 mb-2'></Users>
              <p>No conversation found.</p>
            </motion.div>
            )
            : (
              filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{ delay: index * 0.1}}
                  whileHover={{scale: 1.02}}
                  className={`p-4 border-b border-gray-700 cursor-pointer h-auto transition-all duration-300 ${
                      activeRoom?.id === room.id
                      ? 'bg-purple-600/20 border-l-4 border-l-purple-500'
                      : 'hover: bg-gray-800/50'
                    }`}
                  onClick={() => selectRoom(room)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={room.avatar || '/default-group.png'} 
                        alt={room.name} 
                        className='w-12 h-12 rounded-full border-2 border-gray-600'
                      />
                      { room.participants.some(p => p.is_online) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-terminal-header"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold truncate">
                          {room.name}
                        </h3>
                        {room.last_message && (
                          <span className="text-xs text-gray-400">
                            {new Date(room.last_message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        {room.last_message
                          ? room.last_message.content
                          : `Created by ${room.created_by.username}`
                        }
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className='w-3 h-3'></Users>
                          <span>{ room.participants.length}</span>
                        </div>
                        {room.unread_count > 0 && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            {room.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) )
            )
          }
        </AnimatePresence>
      </div>

      {/* User status */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.name} 
              className='w-10 h-10 rounded-full border-2 border-green-500'
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-terminal-header"></div>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">
              {user.username}
            </p>
            <p className="text-green-400 text-sm">Online</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

};

export default ChatSidebar;