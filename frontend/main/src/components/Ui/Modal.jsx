import React from 'react';
import {motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={onClose}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          >
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity:0, scale: 0.9, y: 20}}
            animate={{opacity: 1, scale: 1, y:0}}
            exit={{ opacity: 0, scale: 0.9, y: 20}}
            transition={{type: 'spring', damping: 30, stiffness: 30}}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full ${sizes[size]} bg-gray-900 rounded-2xl shadow-2xl border border-gray-700`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button 
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className='w-5 h-5'></X>
              </button>
            </div>
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>  
  );
}

export default Modal