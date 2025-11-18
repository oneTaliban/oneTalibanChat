import React, {useState, useEffect} from "react";
import { motion, AnimatePresence} from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import { AD_CONFIG } from '../../utils/adConfig'

const BannerAd = ( { position='bottom', adUnitId, className=''}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [adLoaded, setAdLoaded] = useState(true);
    const [adError, setAdError] = useState(false); 

    useEffect(() => {
        //Simulating ad loading , to add Admob sdk lOading
        const timer = setTimeout(() => {
            setAdLoaded(true);
            // to add admob logic
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const positions = {
        top: 'top-4',
        bottom: 'bottom-4',
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
    };

    if (!isVisible) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: position === 'bottom' ? 50 : -50}}
                    animate={{ opacity: 1, y: 0}}
                    exit={{ opacity: 0, y: position === 'bottom' ? 50 : -50}}
                    className={` fixed ${ positions[position]} left-1/2 transform -translate-x-1/2  z-[70] ${className}`}
                >
                    <div className="bg-terminal-bg border border-hacker-green/50 rounded-lg shadow-2xl backdrop-blur-sm">
                        {/* Ad header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-hacker-green/30">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-hacker-green rounded-full animate-pulse"></div>
                                <span className="text-xs text-hacker-green font-mono">Sponsored</span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-hacker-red transition-colors"
                            >
                                <X size={14}></X>
                            </button>
                        </div>

                        {/* Ad content */}
                        <div className="p-3">
                            {adError ? (
                                <div className="flex items-center justify-center space-x-2 text-gray-400">
                                    <AlertTriangle size={16}></AlertTriangle>
                                    <span className="text-xs ml-2 font-mono">Ad failed to load</span>
                                </div>
                            ): (
                                <div className="flex items-center space-x-3 min-w-[300px]">
                                    {/* Ad image/Icon */}
                                    <div className="w-10 h-10 bg-grardient-to-br from-hacker-green to-hacker-blue rounded flex items-center justify-center">
                                        <span className="text-black text-xs font-bold">AD</span>
                                    </div>

                                    {/* Ad text */}
                                    <div className="flex-1">
                                        <div className="text-sm text-white font-mono font-semibold">
                                            Premium Financial Tools
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono mt-1">
                                            Upgrade for advance analytics and AI insights
                                        </div>
                                        <div className="text-xs text-hacker-blue font-mono mt-1">
                                            Learn More
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ad footer */}
                        <div className="px-3 py-1 border-t border-hacker-green/20 bg-black/50">
                            <div className="text-xs text-gray-500 font-mono text-center">
                                Advertisement
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BannerAd;