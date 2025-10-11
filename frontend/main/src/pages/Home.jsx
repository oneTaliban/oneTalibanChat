import React from 'react';
import TypeWriter from '../components/Ui/TypeWriter';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Zap, Users, User } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <MessageCircle className='w-8 h-8'></MessageCircle>,
      title: "Real-Time Chat",
      description: "Instant messaging with WebSocket technology",
    },
    {
      icon: <Shield className='w-8 h-8'></Shield>,
      title: "Secure and Encrypted",
      description: "End-to-End encryption for your conversations",
    },
    {
      icon: <Zap className='w-8 h-8'></Zap>,
      title: "Lightning Fast",
      description: "Optimized for Speed and Performance",
    },
    {
      icon: <Users className='w-8 h-8'></Users>,
      title: "Group Chats",
      description: "Create rooms and channels for teams",
    }
  ]
  return (
    <div className="min-h-screen text-white">
      <TypeWriter></TypeWriter>
      {/* {hero section} */}
      <section className="pt-20 pb-16 text-center">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className='max-w-4xl mx-auto'
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            One Taliban Chat
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Secure , real-time messaging platform with cutting-edge features and advanced security.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{scale: 0.95}}
              className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transiton-colors'
            >
              Get started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{scale: 0.95}}
              className='border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors'
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* {features section} */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className='text-3xl md:text-4xl font-bold text-center mb-12'
          >
            Powerful Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{opacity:0, y:30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6, delay:index * 0.1}}
                className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all'
              >
                <div className="text-purple-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* {CTA section} */}
      <section className="py-16 text-center">
        <motion.div
          initial={{opacity: 0, y:30}}
          whileInView={{opacity: 1, y:0}}
          transition={{duration: 0.8}}
          className='max-w-2xl mx-auto'
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get Started?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of users who trust One Taliban for secure communication.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{scale: 0.95}}
            className='bg-gradient-to-r from-purple-600.to-pink-600.text-white px-8 py-3 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all'
          >
            Create Account
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}

export default Home