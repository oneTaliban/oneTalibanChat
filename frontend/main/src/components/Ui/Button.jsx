import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props

}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 shadow-lg hover: shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 border border-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    hacker: 'bg-terminal-bg hover:bg-green-900 text-matrix-green border border-matrix-green focus:ring-matrix-green shadow-hacker hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20 focus:ring-white/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;


  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02}}
      whileTap={{scale: disabled ? 1 : 0.98}}
      className={classes}
      disabled={disabled || loading}
      onClick={onclick}
      {...props}
    >
      {loading && (
        <svg className='animate-spin -ml-1 mr-2 -4 text-white ' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-35' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
          <path className="opacity-75" fill='currentColor' d='M4 12'></path>
        </svg>
      )} 
      {children}
    </motion.button>
  );
};

export default Button