import React, {useState} from 'react'
import { Link, useLocation} from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Bot,
    Command,
    Database,
    Shield,
    TrendingUp, 
    Package,
    Menu,
    X
} from 'lucide-react'

const Layout = ({ children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        // {path: '/beta/dashboard' ,icon: Bot, label: 'Dashboard'},
        {path: '/beta/bots' ,icon: Bot, label: 'Bot Manager'},
        {path: '/beta/commands' ,icon: Command, label: 'Command Center'},
        {path: '/beta/data' ,icon: Database, label: 'Data Manager'},
        {path: '/beta/special' ,icon: Shield, label: 'Special Ops'},
        {path: '/beta/seo' ,icon: TrendingUp, label: 'SEO Booster'},
        {path: '/beta/delivery' ,icon: Package, label: 'Delivery System'},
    ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-400">
        {/* sidebar */}
        <motion.div
            initial={{ x: -500}}
            animate={{ x: sidebarOpen ? 0 : -500}}
            className='fixed lg:relative z-50 w-64 bg-gray-800 h-full'
        >
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold text-cyan-400">ReadTeam C2</h1>
                <p className="text-sm text-gray-4">Command & Control</p>
            </div>
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 rounded-lg transition-all ${
                                isActive
                                    ? 'bg-cyan-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <Icon size={20}></Icon>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-hidden">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between relative">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='lg:hidden p-2 rounded-lg bg-gray-700 text-gradient z-55 cursor-pointer'
                    >
                        {sidebarOpen ? <X className='absolute transition left-40' size={20}></X> : <Menu size={20}></Menu>}
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                            Last Update: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
                {children}
            </main>
        </div>
    </div>
  );
};

export default Layout;