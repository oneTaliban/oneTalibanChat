import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {motion} from 'framer-motion';

const ProtectedRoute = ({children}) => {
  const {isAuthenticated, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <motion.div
          initial={{opacity: 0, scale: 0.8}}
          animate={{ opacity:1, scale: 1}}
          className='text-center'
        >
          <motion.div
            animate={{ rotate: 360}}
            transition={{duration: 1 , repeat: Infinity, ease: 'linear'}}
            className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4'
          >
          </motion.div>
          <p className="text-white text-lg">Securing your connection...</p>
        </motion.div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return  <Navigate to='/login' state={{ from: location}} replace ></Navigate>;
  }
  return children;
}

export default ProtectedRoute;