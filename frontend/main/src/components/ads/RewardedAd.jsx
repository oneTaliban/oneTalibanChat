import React, {useState} from 'react'
import { motion } from 'framer-motion'
import { Play, Zap, Shield ,Star } from 'lucide-react'


const RewardedAd = ({ onRewardEarned, onClose}) => {
    const [adStarted ,setAdStarted] = useState(false);
    const [rewardGranted, setRewardGranted] = useState(false);
    const [countDown, setCountDown] = useState(30);

    const handleStartAd = () => {
        setAdStarted(true);

        // simulating ad playback
        const timer = setInterval(() => {
            setCountDown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    grantReward();
                    return 0;
                }
                return prev - 1
            });
        } ,1000);
    };

    const grantReward = () => {
        setRewardGranted(true);
        
        //Granting reward 24hrs of premim features
        const reward = {
            type: 'premium_features',
            durtion: '24h',
            benefits: ['ad_free', 'premium_analytics', 'export_features']
        };
        onRewardEarned(reward);
    };

    const rewards = [
        {icon: Shield, text: 'Ad-Free Experience', color: 'text-hacker-green'},
        {icon: Zap, text: 'Premium Analytics', color: 'text-hacker-blue'},
        {icon: Star, text: 'Export Features', color: 'text-hacker-red'},
    ];

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9}}
        animate={{ opacity: 1, scale: 1}}
        exit={{ opacity: 0, scale: 0.9}}
        className='bg-terminal-bg border-2 border-hacker-green rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 mt-[45vh]'
    >
        {!adStarted ? (
            //Pre-ad screen
            <div className="text-center">
                <div className="w-16 h-16 bg-hacker-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className='text-hacker-green' size={24}></Play>
                </div>

                <h3 className="text-xl font-mono font-bold text-white mb-2">
                    Watch Ad, Get Premium
                </h3>
                <p className="text-gray-300 font-mono text-sm mb-6">
                    Watch a short video to unlock 24 hours of premium features
                </p>

                {/* Rewards Preview */}
                <div className="space-y-3 mb-6">
                    {rewards.map((reward, index) => {
                        const Icon = reward.icon
                        return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-black/30 rounded border border-hacker-green/20">
                                <Icon size={18} className={reward.color}></Icon>
                                <span className="text-white font-mono text-sm">{reward.text}</span>
                            </div>
                        )
                    })}
                </div>
                
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className='flex-1 border border-gray-600 text-gray-400 font-mono py-3 rounded hover:border-hacker-red hover:text-hacker-red transition-colors'
                    >
                        No Thanks
                    </button>
                    <button
                        onClick={handleStartAd}
                        className='flex-1 bg-hacker-green text-black font-mono font-bold py-3 rounded hover:bg-green-400 transition-colors'
                    >
                        Watch Ad (30s)
                    </button>
                </div>
            </div>
        ) : !rewardGranted ? (
            // Ad playback screen
            <div className="text-center">
                <div className="w-20 h-20 border-4 border-hacker-green rounded-full flex items-center justify-center mx-auto mb-4 realtive ">
                    <div className="absolute inset-8 w-7 h-7 border-4 border-transparent rounded-full border-t-hacker-green animate-spin"></div>
                    <span className="text-hacker-green font-mono font-bold text-xl">{countDown}s</span>
                </div>
                <h3 className="text-xl font-mono font-bold text-white mb-2">
                    Video Playing...
                </h3>

                <p className="text-gray-300 font-mono text-sm mb-4">
                    Please watch the video to earn the reward.
                </p>

                <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-400 font-mono mb-2">
                        Advertisement
                    </div>
                    <div className="h-32 bg-gradient-to-br from-hacker-green/20 to-hacker-blue/20 rounded flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 bg-hacker-green rounded-full flex items-center justify-center mx-auto mb-2">
                                <Play size={16} className='text-black'></Play>
                            </div>
                            <span className="text-white font-mono text-sm">Video Ad</span>
                        </div>
                    </div>
                </div>
            </div>
        ): (
            // Reward granted screen
            <div className="text-center">
                <div className="w-16 h-16 bg-hacker-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className='text-black' size={24}></Star>
                </div>

                <h3 className="text-xl font-mono font-bold text-white mb-2">
                    Reward Granted!
                </h3>

                <p className="text-gray-300 font-mono text-sm mb-6">
                    You now have 24 hours of premium feature unlocked
                </p>

                <div className="bg-hacker-green/10 border border-hacker-green/30 rounded-lg p-4 mb-6">
                    <div className="text-hacker-green font-mono font-bold text-lg">Premium Active</div>
                    <div className="text-gray-300 font-mono text-sm">Expires in 24 hours</div>
                </div>

                <button
                    onClick={onClose}
                    className='w-full bg-hacker-green text-black font-mono font-bold py-3 rounded hover:bg-green-400 transition-colors'
                >
                    Enjoy Premium Features
                </button>
            </div>
        )}
    </motion.div>
  )
}

export default RewardedAd