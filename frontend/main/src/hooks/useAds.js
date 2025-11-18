import { useState, useEffect, useCallback } from "react";
import { AD_CONFIG, AD_TARGETING } from "../utils/adConfig";


export const useAds = () => {
    const [adCounter, setAdCounter] = useState({
        pageViews: 0,
        navigation: 0,
        sessions: 0
    });

    const [adState, setAdState] = useState({
        shouldShowBanner: false,
        shouldShowInterstial: false,
        lastAdShown: null,
    });

    // Tracking user activity for ad frequency
    const trackingPageView = useCallback(() => {
        setAdCounter(prev => {
            const newCount = prev.pageViews + 1;
            const shouldShow = newCount % AD_CONFIG.SETTINGS.BANNER_FREQUENCY === 0;

            setAdState( prevState => ({
                ...prevState,
                shouldShowBanner: shouldShow
            }))
            return {...prev, pageViews: newCount};
        })
    }, []);

    const trackingNavigaion = useCallback(() => {
        setAdCounter(prev => {
            const newCount = prev.navigation + 1;
            const shouldShow = newCount % AD_CONFIG.SETTINGS.INTERSTITIAL_FREQUENCY === 0;

            if (shouldShow) {
                setAdState(prevState => ({
                    ...prevState,
                    shouldShowInterstial: true,
                    lastAdShown: Date.now()
                }));
            }            
            return {...prev, navigation: newCount};
        })
    }, []);


    const resetInterstitial = useCallback(() => {
        setAdState(prev => ({
            ...prev,
            shouldShowInterstial: false,
        }));
    },[]);

    const canShowAd = useCallback(() => {
        if (!adState.lastAdShown) return true;
        const timeSinceLastAdd = Date.now() - adState.lastAdShown;

        return timeSinceLastAdd > 20000 // 20 sec cool down
    }, []);

    return {
        adState,
        adCounter, 
        trackingPageView,
        trackingNavigaion,
        resetInterstitial,
        canShowAd
    };
};