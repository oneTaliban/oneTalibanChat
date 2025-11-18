import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence} from 'framer-motion'
import {
    Database,
    Download,
    Trash2,
    Search,
    Filter,
    FileText,
    Image,
    Video,
    Archive,
    Key,
    CreditCard,
    Lock,
    RefreshCw,
    Eye,
    MailSearch
} from 'lucide-react'
import { apiUtils ,dataApi } from '../../utils/api'

const DataManager = () => {
    const [collectedData, setCollectedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedData, setSelectedData] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await dataApi.getAll({ ordering: '-created_at'});
            setCollectedData(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredData = collectedData.filter(item => {
        const matchesSearch = item.filenam?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                item.data_type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.bot_info?.hostname.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterType === 'all' || item.data_type === filterType
        return matchesSearch && matchesFilter
    });

    const getDataIcon = (data_type) => {
        const iconMap = {
            'file': FileText,
            'credentials': Key,
            'network': Database,
            'system': Database,
            'browser': Eye,
            'keylogger': FileText,
            'cookies': Lock,
            'credit_cards': CreditCard,
            'passwords': Lock
        };
        return iconMap[data_type] || FileText
    };

    const getDataTypeColor = (dataType) => {
        const colorMap = {
            'file': '#00c49f',
            'credentials': '#ff6b6b',
            'network': '0088fe',
            'system': '#ffbb29',
            'browser': '#8884d8',
            'keylogger': '#ff8042',
            'cookies': '#00c49f',
            'credit_cards': '#ff6b6b',
            'passwords': '#ff8042'
        };
        return colorMap[dataType] || "#666"
    };

    const DataItem = ({ data }) => {
        const DataIcon = getDataIcon(data.data_type)
        const color = getDataTypeColor(data.data_type)

        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9}}
                animate={{ opacity: 1, scale: 1}}
                exit={{ opacity: 0, scale: 0.9}}
                className='p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors cursor-pointer'
                onClick={() => setSelectedData(data)}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div style={{ color}} className="p-2 bg-gray-700 rounded-lg">
                            <DataIcon size={20}></DataIcon>
                        </div>
                        <div>
                            <h3 className="font-semibold capitalize">
                                {data.data_type_display || apiUtils.formatDataType(data.data_type)}
                            </h3>
                            <p className="text-sm text-gray-400">
                                From: {data.bot_info?.hostname || 'Unknown'}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.1}}
                            whileTap={{ scale: 0.9}}
                            className='p-2 bg-cyan-600 rounded-lg'
                            onClick={(e) => {
                                e.stopPropagation()
                                // Handle download
                            }}
                        >
                            <Download size={16}></Download>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1}}
                            whileTap={{ scale: 0.9}}
                            className='p-2 bg-red-600 rounded-lg'
                            onClick={(e) => {
                                e.stopPropagation()
                                // Handle delete
                            }}
                        >
                            <Trash2 size={16}></Trash2>
                        </motion.button>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <div className="text-gray-400">Filename: </div>
                        <span className="font-medium">{data.filename || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Size: </div>
                        <span className="">{data.data_size_humanized || '0 bytes'}</span>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Collected: </div>
                        <span className="">{data.created_at_humanized || new Date(data.creeated_at).toLocaleString()}</span>
                    </div>
                    {data.description && (
                        <div className="flex justify-between">
                            <div className="text-gray-400">Description: </div>
                            <span className="text-right">{data.description}</span>
                        </div>
                    )}
                </div>
                {data.checksum && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400 font-mono">
                            Checksum: {data.checksum}
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    const DataDetails = ({ data, onClose}) => (
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
                className='bg-gray-800 rounded-xl p-6 w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto'
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center items-center mb-6">
                    <h2 className="text-2xl font-bold capitalize">
                        {data.data_type_display || apiUtils.formatDataType(data.data_type)}
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-700 rounded-lg'
                    >X</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Metadata */}
                    <div className="space-y-4">
                        <div className="font-medium text-lg">Metadata</div>
                        <div className="space-y-3">
                            <InfoRow label='Bot' value={data.bot_info?.hostname}></InfoRow>
                            <InfoRow label='Platform' value={data.bot_info?.platform}></InfoRow>
                            <InfoRow label='Data Type' value={apiUtils.formatDataType(data_type)}></InfoRow>
                            <InfoRow label='Filename' value={data.filename || 'N/A'}></InfoRow>
                            <InfoRow label='Size' value={data.data_size_humanized}></InfoRow>
                            <InfoRow label='Collected' value={new Date(data.created_at).toLocaleString()}></InfoRow>
                            {data.checksum && <InfoRow label="Checksum" value={data.checksum}></InfoRow>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Actions</h3>
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.05}}
                                whileTap={{ scale: 0.95}}
                                className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                            >
                                <Download size={20}></Download>
                                <span>Download Data</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05}}
                                whileTap={{ scale: 0.95}}
                                className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                            >
                                <Eye size={20}></Eye>
                                <span>View Raw Data</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05}}
                                whileTap={{ scale: 0.95}}
                                className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                            >
                                <Trash2 size={20}></Trash2>
                                <span>Delete Parmanently</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {data.description && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-300">{data.description}</p>
                    </div>
                )}

                {/* Preview */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4">Data Preview</h3>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
                        {data.raw_data ? (
                            <pre>{JSON.stringify(data.raw_data, null, 2)}</pre>
                        ) : (
                            <p className="text-gray-400">No preview available. Data may be encrypted.</p>
                        )}
                    </div>
                </div>
            </motion.div>
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
                    <h1 className="text-3xl font-bold">Data Management</h1>
                    <p className="text-gray-400">
                        {filteredData.length} items   { collectedData.reduce((acc, item) => acc + (item.data_size || 0), 0).toLocaleString()} bytes total
                    </p>
                </div>
                <div className="flex space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05}}                
                        whileTap={{ scale: 0.95}}
                        onClick={fetchData}
                        className='px-4 py-2 bg-gray-700 rounded-lg font-semibold flex items-center space-x-2'
                    >
                        <RefreshCw size={20}></RefreshCw>
                        <span>Refresh</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        className='px-4 py-2 bg-cyan-600 rounded-lg font-semibold'
                    >
                        Collect Data
                    </motion.button>
                </div>
            </motion.div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Database}
                    label="Total Data"
                    value={collectedData.length}
                    color='#00c49f'
                ></StatCard>
                <StatCard
                    icon={FileText}
                    label="Files"
                    value={collectedData.filter(d => d.data_type === 'file').length}
                    color='#0088fe'
                ></StatCard>
                <StatCard
                    icon={Key}
                    label="Credentials"
                    value={collectedData.filter(d => d.data_type === 'credentials').length}
                    color='#ffbb28'
                ></StatCard>
                <StatCard
                    icon={Lock}
                    label="Sensitive Data"
                    value={collectedData.filter(d => 
                    ['passwords', 'credit_cards', 'cookies'].includes(d.data_type).length
                    )}
                    color='#ff8042'
                ></StatCard>                                    
            </div>

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
                            placeholder='Search data by filename, type , bot ...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                        ></input>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <Filter size={20} className='text-gray-400'></Filter>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className='px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                    >
                        <option value="all">All Types</option>
                        <option value="file">Files</option>
                        <option value="credentials">Credentials</option>
                        <option value="network">Network Data</option>
                        <option value="system">System Info</option>
                        <option value="browser">Browser Data</option>
                        <option value="keylogger">Keylogger Data</option>
                        <option value="cookies">Cookies</option>
                        <option value="credit_cards">Credit Cards</option>
                        <option value="passwords">Passwords</option>
                    </select>
                </div>
            </motion.div>

            {/* Data Grid */}
            {isLoading ? (
            <div className="flex justify-center items-center py-12">
                <RefreshCw size={32} className='animate-spin text-cyan-500'></RefreshCw>
                <span className='ml-2 text-gray-400'>Loading data...</span>
            </div>
            ): (
            <motion.div
                layout
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            >
                <AnimatePresence>
                    {filteredData.map(data => (
                        <DataItem key={data.id} data={data}></DataItem>
                    ))}
                </AnimatePresence>
            </motion.div>
            )}

            {!isLoading && filteredData.length === 0 && (
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                className='text-center py-12'
            >
                <Database size={64} className='mx-auto mb-4 text-gray-400 opacity-50'></Database>
                <h3 className="text-xl font-semibold text-gray-400">No data founnd</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
            )}

            {/* Data details Modal */}
            <AnimatePresence>
                {selectedData && (
                    <DataDetails data={selectedData} onClose={() => setSelectedData(null) }></DataDetails>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color}) => (
    <motion.div
        whileHover={{ scale: 1.05}}
        className='p-4 bg-gray-800 rounded-xl border border-gray-700'
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color}}>
                    {value}
                </p>
            </div>
            <div className="p-3 rounded-full bg-gray-700">
                <Icon size={24}></Icon>
            </div>
        </div>
    </motion.div>
);

const InfoRow = ({label, value}) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400">{label}: </span>
        <span className="font-medium text-right">{value}</span>
    </div>
);

export default DataManager;