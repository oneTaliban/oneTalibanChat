import React, {useState} from 'react';
import { href, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  User,
  Shield,
  DollarSign,
  Crown,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Ui/Button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {user, logout} = useAuth();
  const {isDark, toggleTheme} = useTheme();
  const location = useLocation();

  const navigation = [
    {name: 'Home', href: '/', icon:Home},
    {name: 'Chat', href: '/chat', icon: MessageCircle},
    {name: 'Profile', href: '/profile', icon: User},
    {name: 'Ethical Hacking', href: '/hacking', icon: Shield},
    {name: 'Donations', href: '/donations', icon: DollarSign},
    {name: 'Subscription', href: 'subscription', icon: Crown},
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{y: -100}}
      animate={{y:0}}
      className='bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40'
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* logo */}
          <motion.div
            whileHover={{ scale: 1.05}}
            className='flex items-center space-x-3'
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <MessageCircle className='w-5 h-5 text-white'></MessageCircle>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              One Taliban
            </span>
          </motion.div>

          {/* desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration ${
                        isActive(item.href) 
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      }`}
                  >
                    <Icon className='w-4 h-4'></Icon>
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              ); 
            })}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* theme toggle */}
            <motion.div
              whileHover={{opacity: 1.05}}
              whileTap={{opacity: 0.95}}
              onClick={toggleTheme}
              className='p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
            >
              {isDark ? <Sun className='w-5 h-5'></Sun> : <Moon className='w-5 h-5'></Moon>}
            </motion.div>

            {/* User menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <img 
                    src={user.avatar || '/default-avatar.png' || 'T'} 
                    alt={user.username} 
                    className='w-8 h-8 rounded-full border-2 border-purple-500'  
                  />
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to='/login'>
                  <Button variant='ghost' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary' size='sm'>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
            >
              {isMobileMenuOpen ? (
                <X className='w-5 h-5'></X>
              ) : (
                <Menu className='w-5 h-5'></Menu>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={{opacity:0, height: 0}}
              className='md:hidden border-t border-gray-700'
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => {
                  const Icon =  item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{scale: 1.02}}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transiton-all duration-300 ${
                            isActive(item.href) 
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                          }`}
                      >
                        <Icon className='w-5 h-5'></Icon>
                        <span className="font-medium">{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}
                {!user && (
                  <>
                    <Link
                      to='/login'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                        <LogOut className='w-5 h-5'></LogOut>
                        <span className="font-medium">Login</span>
                      </div>
                    </Link>
                    <Link
                      to='/register'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3 px-4 py-3 bg-purple-600 text-white rounded-lg">
                        <User className='w-5 h-5'></User>
                        <span className="font-medium">Sign Up</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;