import React from 'react';
import {motion} from 'framer-motion';
import  {MessageCircle, Heart, Code, Shield} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      initial={{opacity:0}}
      whileInView={{opacity:1}}
      transition={{duration: 0.8}}
      className='bg-gray-500/50 border-t border-gray-800 mt-16'
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              whileHover={{scale:1.03}}
              className='flex items-center space-x-3 mb-4'
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <MessageCircle className='w-6 h-6 text-white'></MessageCircle>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                One Taliban
              </span>
            </motion.div>
            <p className="text-gray-400 mb-4 max-w-md">
              Secure real-time mesaging platform with cutting-edge features 
              and advanced security for the modern digital era where privacy matters. 
            </p>
            <div className="flex items-center space-x-2 text-gray-500">
              <Code className='w-4 h-4'></Code>
              <span className="text sm">Built with passion and cutting-edge technology</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick links</h3>
            <ul className="space-y-2">
              {['Chat', 'Profile', 'Ethical Hacking', 'Donations', 'Subscription'].map((item) => (
                <li 
                  key={item}  
                >
                  <a 
                    href={`/${item.toLocaleLowerCase()}`}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400"></Shield>
                <span>Security</span>
              </h3>
              <ul className="text-y-2 text-gray-400 text-sm">
                <li>End-to-End Encryption</li>
                <li>Device Fingerprinting</li>
                <li>Secure Authentication</li>
                <li>Privacy First</li>
              </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} One Taliban Chat. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm flex items-center space-x-1">
              <span>Made with</span>
              <motion.div
                animate={{scale: [1, 1.2, 1]}}
                transition={{duration: 1, repeat: Infinity}}
              >
                <Heart className="w-4 h-4 text-red-400"></Heart>
              </motion.div>
              <span>for the community.</span>
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;