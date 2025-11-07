import React, {useState, useEffect} from 'react';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatRoom from '../components/Chat/ChatRoom';
import { MessageCircle, Users, Search , Plus } from 'lucide-react';
import Button from '../components/Ui/Button';
import Input from '../components/Ui/Input';
import Modal from '../components/Ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { motion } from 'framer-motion';
import { chatApi } from '../utils/api';

const Chat = () => {
  const { rooms, activeRoom, loadRooms, selectRoom, loading, error } = useChat();
  const {user} = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRoom , setShowCreateRoom] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [newRoomData, setNewRoomData]= useState({
    name: '',
    description: '',
    room_type: 'group',
    is_private: false,
  });
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || 
    room.participants.some(p =>
      p.username.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
  );

  const handleCreateRoom = async () => {
    // implemantation for creating a new rooms,
    console.log('creating new room', newRoomData);
    const response = chatApi.createRoom(newRoomData);
    console.log("created room : ", response);
    if (response.status === 'ok'){
      setRoomCreated(true);
    }
    setShowCreateRoom(false);
    setNewRoomData({
      name: '',
      description: '',
      room_type: 'group',
      is_private: false,
    });
    setRoomCreated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{opacity: 0, scale: 0.8}}  
          animate={{opacity: 1, scale: 1}}
          className='text-center'
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your conversations ...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-17 left-4 z-50">
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='bg-gray-800/80 backdrop-blur-sm'
        >
          <Users className='w-5 h-5'></Users>
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{  x: sidebarOpen ? 0 : -400}}
        animate={{  x: sidebarOpen ? 0 : -400}}
        transition={{type: 'spring', damping: 30, stiffness: 300}}
        className='fixed pt-20 lg:pt-4 lg:static inset-y-0 left-0 z-40 w-80 bg-terminal-header border-r border-gray-700 flex flex-col lg:translate-x-0 transform transition-transform duration-300 ease-in-out'
      >
        {/* sidebar header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <MessageCircle  className='w-6 h-6 text-purple-400'></MessageCircle>
              <span>One Taliban Chat</span>
            </h1>      
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowCreateRoom(true)}
              className=''
            >
              <Plus className="w-4 h-4"></Plus>
            </Button>
          </div>

          {/* Search */}
          {/* <div className="relative">
            <Input
              placeholder={'Search conversations...'}
              className='!bg-gray-800 !border-gray-600 !pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className='w-4 h-4'></Search>}
            >
            </Input>
            <Search className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2'></Search>
          </div> */}
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto">
          <ChatSidebar roomCreated={roomCreated}></ChatSidebar>
        </div>
        

        {/* User info // Already have implemented in chatsidebar*/}
        {/* <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt={user.username} 
                className='w-10 h-10 rounded-full border-2  border-green-500'
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-terminal-header"></div>
            </div>
            <div className='flex-1 min-w-0'>
              <p className="text-white font-medium truncate">{user.username}</p>
              <p className="text-green-400 text-sm">Online See Profile</p>
            </div>
          </div>
        </div> */}
      </motion.div>

      {/* Main chat area */}
      <div className="flex-1 flex  flex-col min-h-0 lg:ml-0">
        <ChatRoom></ChatRoom>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
        </div>
      )}

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        title='Create New Chat Room'
        size='md'
      >
        <div className="space-y-4">
          <Input
            label="Room Name"
            value={newRoomData.name}
            onChange={(e) => setNewRoomData(prev => ({...prev, name: e.target.value}))}
            placeholder="Enter room name"
          ></Input>

          <Input
            label="Room Description"
            value={newRoomData.description}
            onChange={(e) => setNewRoomData(prev => ({...prev, description: e.target.value}))}
            placeholder="Enter room description"
            multiline='true'
            rows={3}
          ></Input>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Room Type
              </label>
              <select 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={newRoomData.room_type}  
                onChange={(e) => setNewRoomData(prev => ({...prev, room_type: e.target.value}))}
              >
                <option value="direct">Direct Message</option>
                <option value="group">Group Chat</option>
                <option value="channel">Channel</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input 
                  type="checkbox" 
                  checked={newRoomData.is_private}
                  onChange={(e) => setNewRoomData(prev => ({...prev, is_private: e.target.value}))}
                  className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
                />
                <span className="text-gray-300 text-sm">Private Room</span>
              </label>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              variant='secondary'
              onClick={() => setShowCreateRoom(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleCreateRoom}
              disabled={!newRoomData.name.trim()}
              className='flex-1 text-gradient'
            >
              Create Room
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;