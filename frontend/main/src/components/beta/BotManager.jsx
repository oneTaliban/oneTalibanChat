
import React, {useState, useEffect} from 'react'
import {motion, AnimatePresence } from 'framer-motion'
import { 
    Bot,
    Cpu,
    Wifi,
    WifiOff,
    MapPin,
    Calendar,
    MoreVertical,
    Play,
    StopCircle,
    Download,
    Trash2,
    Filter,
    Search,
    RefreshCw
} from 'lucide-react'
import { apiUtils, botApi } from '../../utils/api'

const BotManager = () => {
    const [bots, setBots] = useState([]);
    const [selectedBot, setSelectedBot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');

    const fetchBots = async () => {
        try {
            setIsLoading(true);
            const response = await botApi.getAll();
            setBots(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch bots: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBots();
        const interval = setInterval(fetchBots, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredBots = bots.filter(bot => {
        const matchesSearch = bot.hostname.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                bot.bot_id.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                bot.ip_address.includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || bot.status === statusFilter
        const matchesPlatform = platformFilter === 'all' || bot.platform === platformFilter
        return matchesSearch && matchesStatus && matchesPlatform
    });

    const BotCard = ({ bot }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9}}
            animate={{ opacity: 1, scale: 1}}
            exit={{ opacity: 0, scale: 0.9}}
            whileHover={{ y: -5}}
            className={` p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedBot?.id === bot.id 
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
            onClick={() => setSelectedBot(bot)}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                        bot.online_status === 'Online' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                        <Bot size={20} className={
                            bot.online_status === 'Online' ? 'text-green-500' : 'text-red-500'
                        }></Bot>
                    </div>
                    <div>
                        <h3 className="font-semibold">{bot.hostname}</h3>
                        <p className="text-sm text-gray-400">
                            {bot.bot_id} • {apiUtils.formatPlatform(bot.platform)}
                        </p>
                    </div>
                </div>
                <button className="p-1 hover:bg-gray-700 rounded">
                    <MoreVertical size={16}></MoreVertical>
                </button>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Status: </span>
                    <span className={` font-medium ${
                        bot.online_status === 'Online' ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {bot.online_status}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">IP: </span>
                    <span>{bot.ip_address}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">User: </span>
                    <span>{bot.username}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">CPU: </span>
                    <span>{bot.system_summary?.cpu_cores} cores</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Memory: </span>
                    <span>{bot.system_summary?.memory_gb} GB</span>
                </div>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1 mt-3">
                {bot.can_mine && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded">
                        Mining
                    </span>
                )}
                {bots.can_ddos && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded">
                        DDoS
                    </span>
                )}
                {bot.can_seo && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-500 text-xs rounded">
                        SEO
                    </span>
                )}
                {bot.can_collect_data && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded">
                        Data
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-1 text-gray-400">
                    <Calendar size={14}></Calendar>
                    <span className="text-xs">
                        {bot.last_seen_humanized}
                    </span>
                </div>
                <div className="text-xs text-gray-400">
                    v{bot.version}
                </div>
            </div>
        </motion.div>
    )

    const BotDetails = ({ bot, onClose}) => (
        <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: 20}}
            className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9}}            
                animate={{ scale: 1}}
                className='bg-gray-800 rounded-xl p-6 max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto'
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{bot.hostname}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
                        X
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* System information */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">System Information</h3>
                            <div className="space-y-3">
                                <InfoRow label="Bot ID" value={bot.bot_id}></InfoRow>
                                <InfoRow label='Platform' value={apiUtils.formatPlatform(bot.platform)}></InfoRow>
                                <InfoRow label='Architecture' value={bot.architecture}></InfoRow>
                                <InfoRow label='Username' value={bot.username}></InfoRow>
                                <InfoRow label='Privileges' value={bot.priveleges}></InfoRow>
                                <InfoRow label='Version' value={bot.version}></InfoRow>
                                <InfoRow label='Status' value={
                                    <span className={`${
                                        bot.online_status === 'Online' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {bot.online_status}
                                    </span>
                                }></InfoRow>
                            </div>
                        </div>

                        {/* Hardware Information */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Hardware</h3>
                            <div className="space-y-3">
                                <InfoRow label='CPU Cores' value={bot.cpu_cores}></InfoRow>
                                <InfoRow label='Memory' value={`${bot.system_summary?.memory_gb} GB`}></InfoRow>
                                <InfoRow label='Disk Space' value={`${bot.system_summary?.disk_gb} GB`}></InfoRow>
                                <InfoRow label='Uptime' value={bot.uptime}></InfoRow>
                            </div>
                        </div>
                    </div>

                    {/* Network Capabilities */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Network Information</h3>

                            <div className="space-y-3">
                                <InfoRow label='IP Address' value={bot.ip_address}></InfoRow>
                                <InfoRow label='Internal IP' value={bot.internal_ip || 'N/A'}></InfoRow>
                                <InfoRow label='MAC Address' value={bot.mac_address || 'N/A'}></InfoRow>
                                <InfoRow label='User Agent' value={
                                    <span className='text-xs font-mono'>{bot.user_agent}</span>
                                }></InfoRow>
                                <InfoRow label='First Seen' value={new Date(bot.first_seen).toLocaleTimeString()}></InfoRow>
                                <InfoRow label='Last Seen' value={new Date(bot.last_seen).toLocaleTimeString()}></InfoRow>
                            </div>
                        </div>

                        {/* Capabilities */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Capabilities</h3>
                            
                            <div className="flex flex-wrap gap-2">
                                {bot.capabilities?.map((capability, index) => (
                                    <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-500 rounded-full text-sm">
                                        {capability}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-700">
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{scale:0.95}}
                        className='flex-1 py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                    >
                        <Play size={20}></Play>
                        <span>Execute Command</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{scale:0.95}}
                        className='flex-1 py-3 bg-gray-700 rounded-lg font-semibold flex items-center justify-center space-x-2'
                    >
                        <Download size={20}></Download>
                        <span>Collect Data</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{scale:0.95}}
                        className='flex-1 py-3 bg-red-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                    >
                        <Trash2 size={20}></Trash2>
                        <span>Remove</span>
                    </motion.button>                                        
                </div>
            </motion.div>
        </motion.div>
    )
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                className='flex justify-between items-center'
            >
                <div>
                    <h1 className="text-3xl font-bold">Bot Management</h1>
                    <p className="text-gray-400">
                        {filteredBots.length} bots found • {bots.filter(b => b.online_status === "Online").length} online
                    </p>
                </div>
                <div className="flex space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        onClick={fetchBots}
                        className='px-4 py-2 bg-gray-700 rounded-lg font-semibold fles items-center space-x-2'
                    >
                        <RefreshCw size={20}></RefreshCw>
                        <span>Refresh</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        className='px-4 py-2 bg-green-600 rounded-lg font-semibold'
                    >
                        Deploy Bot
                    </motion.button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, x: -20}}
                animate={{ opacity: 1, x: 0}}
                className='flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700'
            >
                <div className="flex items-center space-x-4 flex-1 w-full">
                    <div className="relative flex-1">
                        <Search size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></Search>
                        <input
                            type='text'
                            placeholder='Search bots by hostname, ID, IP...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-cyan-500'
                        ></input>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Filter size={20} className='text-gray-400'></Filter>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                    >
                        <option value='all'>All Status</option>
                        <option value='online'>Online</option>
                        <option value='offline'>Offline</option>
                        <option value='busy'>Busy</option>
                    </select>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className='px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                    >
                        <option value='all'>All Platforms</option>
                        <option value='windows'>Windows</option>
                        <option value='linux'>Linux</option>
                        <option value='android'>Android</option>
                        <option value='ios'>iOS</option>
                        <option value='web'>Web</option>
                    </select>                
                </div>
            </motion.div>

            {/* Bots grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <RefreshCw size={32} className='animate-spin text-cyan-500'></RefreshCw>
                    <span className="ml-2 text-gray-400">Loading bots...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredBots.map(bot => (
                            <BotCard key={bot.id} bot={bot}></BotCard>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredBots.length === 0 && (
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    className='text-center py-12'
                >
                    <Bot size={64} className='mx-auto mb-4 text-gray-400 opacity-50'></Bot>
                    <h3 className="text-xl font-semibold text-gray-400">No bots Found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </motion.div>
            )}

            {/* Bot details modal */}
            <AnimatePresence>
                {selectedBot && (
                    <BotDetails bot={selectedBot} onClose={() => setSelectedBot(null)}></BotDetails>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

const InfoRow = ({label, value}) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-right">{value}</span>
    </div>
);

export default BotManager