import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Star } from 'lucide-react'


const InterstitialAd = ({ isOpen, onClose, adUnitId}) => {
    const [countDown ,setCountDown] = useState(5);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAdLoaded(false);
            setCountDown(8);
            // simualte as loading 
            const loadTimer = setTimeout(() => {
                setAdLoaded(true);
            }, 2000);

            // countdown timer
            const countDownTimer = setInterval(() => {
                setCountDown(prev => {
                    if (prev <= 1) {
                        clearInterval(countDownTimer);
                        return 0
                    }
                    return prev - 1
                });
            }, 1000);
            return () => {
                clearTimeout(loadTimer);
                clearInterval(countDownTimer);
            };
        }
    }, [isOpen]);

    const handleClose = () => {
        if (countDown === 0) {
            onClose()
        }
    };

    const handleClick = () => {
        // Track ad click
        console.log(adUnitId)
        // to implement opening the advertiser's link
        window.open('https://example.com', '_blank');
    };
  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -50}}
                animate={{ scale: 1, opacity: 1, y: 0}}
                exit={{ scale: 0.8 ,opacity: 0, y: -50}}
                className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-terminal-bg border-2 border-hacker-green rounded-xl shadow-2xl max-w-md w-full mx-4 z-[70]'
            >
                {/* Ad Header */}
                <div className="flex items-center justify-between p-4 border-b border-hacker-green/30">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-hacker-green rounded-full animate-pulse"></div>
                        <span className="text-hacker-green font-mono font-semibold">
                            Premium Offer
                        </span>
                    </div>

                    <button
                        onClick={handleClose}
                        disabled={countDown > 0}
                        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-mono ${
                            countDown > 0
                                ? "text-gray-500 cursor-not-allowed" 
                                : 'text-gray-400 hover:text-hacker-red hover:bg-hacker-red/10'
                        }`}
                    >
                        <X size={14}></X>
                        <span>Close {countDown > 0 && `(${countDown})`}</span>
                    </button>
                </div>

                {/* Ad content */}
                <div className="p-6">
                    {!adLoaded ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hacker-green mb-4"></div>
                            <span className="text-gray-400 font-mono">Loading premium offer...</span>
                        </div>
                    ) : (
                        <div className="text-center">
                            {/* Ad badge */}
                            <div className="inline-flex items-center space-x-1 bg-hacker-green/20 text-hacker-green px-3 py-1 rounded-full text-sm font-mono">
                                <Star size={14}></Star>
                                <span>RECOMMENDED</span>
                            </div>

                            {/* Ad title */}
                            <h3 className="text-xl font-mono font-bold text-white mb-2">
                                Advanced Financial Analytics
                            </h3>
                            {/* Ad description */}
                            <p className="text-gray-300 font-mono text-sm mb-6">
                                Unlock AI-Powered insights, custom reports, and premium visualization.
                                Used by Financial Porfessionals Worldwide
                            </p>

                            {/* Features List */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {['AI Production', 'Export Reports', 'No Ads', 'priority Support'].map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-xs">
                                        <div className="w-1 h-1 bg-hacker-green rounded-full"></div>
                                        <span className="text-gray-400 font-mono">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Cta buttons */}
                            <button
                                onClick={handleClick}
                                className='w-full bg-gradient-to-r from-hacker-green to-hacker-blue text-black font-mono font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-hacker-green/30 transition-all duration-300 flex items-center justify-center space-x-2'
                            >
                                <span>Learn More</span>
                                <ExternalLink size={16}></ExternalLink>
                            </button>

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-500 font-mono mt-4">
                                Advertisement  Your Privacy protected
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default InterstitialAd