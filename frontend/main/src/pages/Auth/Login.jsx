import React, {useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { gsap } from 'gsap';
import {useAuth} from '../../contexts/AuthContext';
// import { fingerprintDevice } from '../utils/security';

import confetti from 'canvas-confetti';

const Login = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const {register, handleSubmit, formState: { errors }} = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //gsap animation for login form
    const tl = gsap.timeline();
    tl.fromTo('.login-form', 
      {opacity: 0, y:50 },
      {opacity: 1, y:0 , duration: 1, ease: "power3.out"}
    )
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: {y:0.6},
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // get device fingerprint before login
      // const fingerprint = await fingerprintDevice();

      const result  = await login(data) ; //TODO add fingerprint
      if (result.success) {
        setShowConfetti(true);
        triggerConfetti();

        //success animation
        gsap.to('.success-message', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          onComplete: () => {
            setTimeout(() => navigate('/chat'), 2000);
          }
        });
      }
    } catch (error) {
      console.error('Login Failed');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
        {/* animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-black"></div>

        {/* floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div 
              className="absolute w-1 h-1 bg-purple-500 rounded-full animate-pulse"
              key={i}  
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
            </div>
          ))}
        </div>

        <div className="login-form relative z-10 w-full max-w-md">
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/30 p-8">
            {/* hacker-style terminal header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full border border-green-500/50">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">SECURE_LOGIN://ONE_TALIBAN</span>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                  <label htmlFor="" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                    {...register('username', {required: 'Username is required'})}
                    placeholder='Enter your username'
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                    {...register('password', {required: 'Password is required'})}
                    placeholder='Enter your password'
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus-ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursur-not-allowed"
                  type='submit'  
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Authenticating ...
                    </div>
                  ): (
                    'Access System'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    to='/register'
                    className='text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300'
                  >
                    Create One
                  </Link>
                </p>
              </div>

              {/* security notice */}
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm text-center">
                    This system uses advanced fingerprinting and security monitoring
                  </p>
              </div>

              {/* success message */}
              <div className="success-message opacity-0 transform translate-y-4 mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-center font-medium">
                    Authentication successful! and Redirecting ...
                  </p>
              </div>

              {/* confetti canvas  */}
              <canvas 
                className="fixed inset-0 pointer-events-none z-20"
                id="confetti-canvas"
                style={{ display: showConfetti ? 'block' : 'none'}}
              >

              </canvas>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login