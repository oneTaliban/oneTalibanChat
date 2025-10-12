import React from 'react';
import { motion } from 'framer-motion';

const Input = ({
  label, 
  type = 'text',
  value, 
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  ...props
}) => {

  return (
    <motion.div
      initial = {{opacity: 0 , y: 10}}
      animate = {{opacity: 1, y:0}}
      className='space-y-2'
    >
      {label && (
        <label 
          htmlFor=""
          className='block text-sm font-medium text-gray-300'
        >
          {label}
        </label>
      )}
      <motion.input
        whileFocus={{scale: 1.01}}
        type={type}
        value={value}
        onChange={onchange}
        placeholder={placeholder}
        className={`
            w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg
            text-white placeholder-gray-400 focus:outline-none focus:ring-2
            focus:ring-purple-500 focus:border-transparent transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed 
            ${error ? 'border-red-500 focus-ring-500' : ''}   
            ${className}
          `}
          {...props}
      ></motion.input>
      {error && (
        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className='text-red-400 text-sm'
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Input