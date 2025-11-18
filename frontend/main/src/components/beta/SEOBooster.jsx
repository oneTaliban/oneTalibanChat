import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence, resolveElements} from 'framer-motion'
import { 
    TrendingUp,
    Link,
    Users,
    Search,
    Play,
    BarChart3,
    Target,
    RefreshCw,
    Eye,
    StopCircle,
    Twitter,
    Facebook,
    Instagram,
    Globe
 } from 'lucide-react'
 import {seoApi, apiUtils} from '../../utils/api'
 import { LineChart, Line, BarChart, Bar, ResponsiveContainer, AreaChart, Area } from 'recharts'

const SEOBooster = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [activeCampaigns, setActiveCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        keyword: '',
        bots_count: 10,
        duration_hours: 5
    });
    const [twitterBoost, setTwitterBoost] = useState({
        keyword: '',
        tweets_count: 5,
    });

    const fetchCampaigns = async () => {
        try {
            setIsLoading(true);
            const response = await seoApi.getCampaigns();
            setCampaigns(response.data.results || response.data);
            setActiveCampaigns((response.data.results || response.data).filter(c => c.is_active))
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
        const interval = setInterval(fetchCampaigns, 30000)
        return () => clearInterval(interval);
    }, []);

    const startCampaign = async (e) => {
        e.preventDefault();
        try {
            await seoApi.startCampaign(newCampaign)
            setNewCampaign({name: '', keyword: '', bots_count: 10, duration_hours: 24});
            fetchCampaigns(); // refresh list
        } catch (error) {
            console.error('Failed to start campaign: ', error);
        }
    };

    const startTwitterBoost = async (e) => {
        e.preventDefault();
        try {
            await seoApi.boostTwitter(twitterBoost);
            setTwitterBoost({keyword: '', tweets_count: 5});
        } catch (error) {
            console.error('Failed to start Twitter boost: ', error)
        }
    };

    // sample data for charts
    const rankingData = [
        {day: 'Mon', position: 12},
        {day: 'Tue', position: 10},
        {day: 'Wed', position: 8},
        {day: 'Thu', position: 7},
        {day: 'Fri', position: 6},
        {day: 'Sat', position: 5},
    ];

    const trafficData = [
        {source: 'Organic', visitors: 800},
        {source: 'Social', visitors: 250},
        {source: 'Direct', visitors: 150},
        {source: 'Referral', visitors: 100},
    ];

    const CampaignCard = ({ campaign }) => {
        const isActive = campaign.status.status  === 'Active';

        return (
            <motion.div
                whileHover={{ y: -5}}
                className='p-6 bg-gray-800 rounded-xl border border-gray-700'
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <p className="text-gray-400 text-sm">Keyword: "{campaign.keyword}"</p>
                    </div>
                    <span
                        className={`px-3 py-3 rounded-full text-sm ${
                            isActive
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                    >
                        {campaign.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-500">{campaign.bots_assigned}</div>
                        <div className="text-xs text-gray-400">Bots Assigned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{campaign.searches_performed}</div>
                        <div className="text-xs text-gray-400">Searches</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{campaign.success_rate}</div>
                        <div className="text-xs text-yellow-400">Success Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{campaign.searches_per_bot}</div>
                        <div className="text-xs text-purple-400">Searches/Bot</div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex-justify-between text-sm text-gray-400 mb-1">
                        <span>Duration</span>
                        <span>{campaign.duration}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: '75%'}}></div> //Simulated progress
                    </div>
                </div>

                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        className={`flex-1 py-2 rounded-lg font-semibold ${
                            isActive ? 'bg-red-600' : 'bg-green-600'
                        }`}
                    >
                        {isActive ? 'Pause' : 'Resume'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        className='flex-1 py-2 bg-cyan-600 rounded-lg font-semibold'
                    >
                        Boost
                    </motion.button>
                </div>
            </motion.div>
        );
    };

    const QuicKAction = ({ icon: Icon, title, description, onClick, color, platform}) => (
        <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            onClick={onClick}
            className='p-4 bg-gray-800 rounded-xl border border-gray-700 text-left hover:border-cyan-500 transition-colors'
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20'}}>
                        <Icon size={20} style={{ color }}></Icon>
                    </div>
                    <h3 className="font-semibold" style={{ color }}>{title}</h3>
                </div>
                {platform && (
                    <span className="text-xs text-gradient capitalize">{platform}</span>
                )}
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </motion.button>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, x: 0}}
                className='flex justify-between items-center'
            >
                <div>
                    <h1 className="text-3xl font-bold">SEO Booster</h1>
                    <p className="text-gray-400">
                        {activeCampaigns.length} active campaigns • {campaigns.reduce((acc , c) => acc + c.searches_performed, 0).toLocaleString()} total searches
                    </p>
                </div>
                <div className="flex space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        onClick={fetchCampaigns}
                        className='px-4  py-2 bg-gray-700 rounded-lg font-semibold flex items-center space-x-2'
                    >
                        <RefreshCw size={20}></RefreshCw>
                        <span>Refresh</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Quick action */}
            <motion.div
                initial={{ opacity: 0, x: -20}}
                animate={{ opacity: 1, x: 0}}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
            >
                <QuicKAction
                    icon={TrendingUp}
                    title='Boost Ranking'
                    description='Improve search engine positions'
                    color='#1da1f2'
                    onClick={() => document.getElementById('new-campaign').scrollIntoView()}
                ></QuicKAction>
                <QuicKAction
                    icon={Twitter}
                    title='Twitter Trends'
                    description='Boost keywords on Twitter'
                    color='#1da1f2'
                    platform='twitter'
                    onClick={() => document.getElementById('twitter-boost').scrollIntoView()}
                ></QuicKAction>
                <QuicKAction
                    icon={Link}
                    title='Generate Backlinks'
                    description='Create quality backlinks'
                    color='#1da1f2'
                    // onClick={() => document.getElementById('twitter-boost').scrollIntoView()}
                    // to implement backlink generation
                ></QuicKAction>
                <QuicKAction
                    icon={Users}
                    title='Increase Traffic'
                    description='Drive more visitors to site'
                    color='#1da1f2'
                    // onClick={() => document.getElementById('twitter-boost').scrollIntoView()}
                    // to implement traffic generation
                ></QuicKAction>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign List */}
                <motion.div
                    initial={{ opacity: 0, x: -20}}
                    animate={{ opacity: 1, x: 0}}
                    className='space-y-4'
                >
                    <h2 className="text-xl font-semibold">Active Campaign</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <RefreshCw size={32} className='animate-spin text-cyan-500'></RefreshCw>
                            <span className="ml-2 text-gray-400">Loading Campaigns...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeCampaigns.map(campaign => (
                                <CampaignCard key={campaign.id} campaign={campaign}></CampaignCard>
                            ))}
                            {activeCampaigns.length === 0 && (
                                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                                    <TrendingUp size={48} className='mx-auto mb-4 text-gray-400 opacity-50'></TrendingUp>
                                    <h3 className="text-xl font-semibold text-gray-400">No active campaigns</h3>
                                    <p className="text-gray-500">Start a new campaign to begin campaign to begin SEO boosting</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Analytics & forms */}
                <motion.div
                    initial={{ opacity: 0, x: 20}}
                    animate={{ opacity: 1, x: 0}}
                    className='space-y-6'
                >
                    {/* Ranking Progress */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Ranking Progress</h3>
                        <ResponsiveContainer width='100%' height={200}>
                            <AreaChart data={rankingData}>
                                <defs>
                                    <linearGradient id='rankingGradient' x0='0'y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor='#00c49f' stopOpacity={0.8}></stop>
                                        <stop offset='95%' stopColor='#00c49f' stopOpacity={0.1}></stop>
                                    </linearGradient>
                                </defs>
                                <Area
                                    type='monotone'
                                    dataKey='position'
                                    stroke='#00c49f'
                                    fillOpacity={1}
                                    fill="url(#rankingGradient)"
                                    strokeWidth={2}
                                ></Area>
                                <Line
                                    type='monotone'
                                    dataKey='position'
                                    stroke='#00c49f'
                                    strokeWidth={2}
                                    dot={{ fill: '#00c49f', strokeWidth: 2, r: 4}}
                                ></Line>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Traffic sources */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
                        <ResponsiveContainer width='100%' height={200}>
                            <BarChart data={trafficData}>
                                <Bar
                                    dataKey='visitors'
                                    fill='#0088fe'
                                    radius={[4, 4 ,0, 0]}
                                ></Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* New Campaign Form */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                id='new-campaign'
            >
                <h3 className="text-lg font-semibold mb-4">Start New SE0 Campaign</h3>
                <form onSubmit={startCampaign} className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Campaign Name
                        </label>
                        <input
                            type='text'
                            value={newCampaign.name}
                            onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                            placeholder='My SEO Campaign'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            required
                        ></input>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Target Keyword
                        </label>
                        <input
                            type='text'
                            value={newCampaign.keyword}
                            onChange={(e) => setNewCampaign({...newCampaign, keyword: e.target.value})}
                            placeholder='technology, programming, AI'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            required
                        ></input>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Bots Count
                        </label>
                        <input
                            type='number'
                            value={newCampaign.bots_count}
                            onChange={(e) => setNewCampaign({...newCampaign, bots_count: e.target.value})}
                            min='1'
                            max='1000'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                        ></input>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Duration (hours)
                        </label>
                        <input
                            type='text'
                            value={newCampaign.duration_hours}
                            onChange={(e) => setNewCampaign({...newCampaign, duration_hours: e.target.value})}
                            min='1'
                            max='720'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            required
                        ></input>
                    </div>                
                    <div className="md:col-span-2">
                        <motion.button
                            type='submit'
                            whileHover={{ scale: 1.05}}
                            whileTap={{ scale: 0.95}}
                            className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                        >
                            <Play size={20}></Play>
                            <span>Start Campaign</span>
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            {/* Twitter Boost Form */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                className='bg-gray-800 rounded-xl p-6 border border-gray-700'
                id='twitter-boost'
            >
                <h3 className="text-lg font-semibold mb-4 flex-items-center space-x-2">
                    <Twitter size={20} className='text-blue-400'></Twitter>
                    <span>Twitter Trend Booster</span>
                </h3>
                <form onSubmit={startTwitterBoost} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Keyword/Hashtag
                        </label>
                        <input
                            type='text'
                            value={twitterBoost.keyword}
                            onChange={(e) => setTwitterBoost({ ...twitterBoost, keyword: e.target.value})}
                            placeholder='#trending or keyword'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            required
                        ></input>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                            Tweets per Bot
                        </label>
                        <input
                            type='number'
                            value={twitterBoost.tweets_count}
                            onChange={(e) => setTwitterBoost({...twitterBoost, tweets_count: parseInt(e.target.value)})}
                            min='1'
                            max='720'
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                            required
                        ></input>
                    </div>
                    <div className="md:col-span-2">
                        <motion.button
                            type='submit'
                            whileHover={{ scale: 1.05}}
                            whileTap={{ scale: 0.95}}
                            className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
                        >
                            <Twitter size={20}></Twitter>
                            <span>Boost on Twitter</span>
                        </motion.button>
                    </div>    
                </form>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                className='bg-gray-800 rounded-xl p-6 border border-gray-700'
            >
                <h3 className="text-lg font-semibold mb-4">SEO Performance Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                            {campaigns.reduce((acc, c) => acc + c.searches_performed, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Total Searches</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">
                            {activeCampaigns.length}
                        </div>
                        <div className="text-sm text-gray-400">Active Campaigns</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">
                            {campaigns.reduce((acc, c) => acc + c.bots_assigned, 0)}
                        </div>
                        <div className="text-sm text-gray-400">Bots Engaged</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">
                            {campaigns.length}
                        </div>
                        <div className="text-sm text-gray-400">Total Campaigns</div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default SEOBooster