import React from 'react';
import {motion} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from './RegisterForm';
import confetti from 'canvas-confetti';


const Register = () => {

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    const result = await register(userData);

    if (result.success) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff41', '#0080ff', '#bf00ff', '#ff003c', '#ffff00']
      });

      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    }

    return result;
  };

  const handleSwitchToLogin = () => {
    setTimeout(() => {
      navigate('/login');
    }, 5000)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10'
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity:0, scale: 0.9}}
        animate={{ opacity: 1, scale: 1}}
        className='relative z-10 w-full max-w-4xl'
      >
        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
          onSwitchToLogin={handleSwitchToLogin}
        ></RegisterForm>
      </motion.div>
    </div>
  )
}

export default Register