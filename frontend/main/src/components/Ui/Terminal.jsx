import React from 'react'
import {motion} from 'framer-motion';

const Terminal = ({title, icon: Icon, children, className = ''}) => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.5}}
        className={` bg-hacker-terminal border border-hacker-green/30 rounded-lg overflow-hidden shadow-2xl ${className}`}
    >
        {/* Terminal Header */}
        <div className="bg-black/50 border-b border-hacker-green/20 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {Icon && <Icon className='text-hacker-green' size={18}></Icon>}
                    <h3 className="text-hacker-green font-mono font-semibold">{title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-hacker-red cursor-pointer hover:bg-red-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-hacker-green cursor-pointer hover:bg-green-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-hacker-blue cursor-pointer hover:bg-blue-500 transition-colors"></div>
                </div>
            </div>
        </div>

        {/* Terminal content */}
        <div className="p-4">
            {children}
        </div>
    </motion.div>
  )
}

export default Terminal