import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {ThemeProvider} from './contexts/ThemeContext';
import {ChatProvider} from './contexts/ChatContext';
import {WebSocketProvider} from './contexts/WebSocketContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login' ;
import Register from './pages/Auth/Register' ; 
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import EthicalHacking from './pages/EthicalHacking';
import Donations from './pages/Donations';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Footer from './components/Layout/Footer';
import Scanlines from './components/Ui/Scanlines';
import MatrixBackground from './components/Ui/MatrixBackground';

// beta
import Layout from './components/beta/Layout';
import Dashboard from './components/beta/Dashboard';
import SEOBooster from './components/beta/SEOBooster';
import CommandCenter from './components/beta/CommandCenter';
import DataManager from './components/beta/DataManager';
import DeliverySystem from './components/beta/DeliverySystem';
import SpecialOperations from './components/beta/SpecialOperations';
import BotManager from './components/beta/BotManager';

//ads
import AdRevenueDashboard from './components/ads/AdRevenueDashboard';
import BannerAd from './components/ads/BannerAd'
import InterstitialAd from './components/ads/InterstitialAd'
import { useAds } from './hooks/useAds'
import { AD_CONFIG } from './utils/adConfig';

import { motion, AnimatePresence } from 'framer-motion';

import './styles/App.css';
import Beta from './pages/Beta';



function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const {adState, trackingPageView, trackingNavigaion, resetInterstitial} = useAds();

  //Tracking page view and navigations
  useEffect(() => {
    trackingPageView();
  }, [activeTab, trackingPageView]);

  const handleTabChange = (tab) => {
    trackingNavigaion();
    setActiveTab(tab);
  };

  return (
    <>

      <ThemeProvider>
        <AuthProvider>
          <WebSocketProvider>
            <ChatProvider>
              <Router>
                {/* TODO visual effects */}
                <MatrixBackground></MatrixBackground>
                <Scanlines></Scanlines>

                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:bg-gray-900 relative" >
                  <Navbar activeTab={activeTab} setActiveTab={handleTabChange}></Navbar>
                  <main className="container mx-auto px-4 py-8 relative z-10">
                    <Routes>
                      <Route path='/' element={<Home />}></Route>
                      <Route path='/login' element={<Login />}></Route>
                      <Route path='/register' element={<Register />}></Route>
                      <Route path='/chat' element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      }></Route>
                      <Route path='/profile' element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }></Route>
                      <Route path='/hacking' element={<EthicalHacking />}></Route>
                      <Route path='/donations' element={<Donations />}></Route>
                      <Route path='/subscription' element={<Subscription />}></Route>
                      <Route path='/ad-dashboard' element={<AdRevenueDashboard></AdRevenueDashboard>}></Route>
                      <Route path='/beta' element={<Beta></Beta>}></Route>
                      
                      <Route path='/beta/dashboard' element={
                          <AnimatePresence>
                            <motion.div
                            initial={{ opacity: 0, y: 20}}
                            animate={{ opacity: 1, y: 0}}
                            exit={{ opacity: 0, y: -20}}
                            >
                            <Dashboard></Dashboard>
                            </motion.div>
                          </AnimatePresence>
                      }></Route>
                      <Route path='/beta/bots' element={
                          <AnimatePresence>
                            <motion.div
                            initial={{ opacity: 0, y: 20}}
                            animate={{ opacity: 1, y: 0}}
                            exit={{ opacity: 0, y: -20}}
                            >
                            <BotManager></BotManager>
                            </motion.div>
                          </AnimatePresence>
                      }></Route>
                      <Route path='/beta/commands' element={<CommandCenter></CommandCenter>}></Route>
                      <Route path='/beta/data' element={<DataManager></DataManager>}></Route>
                      <Route path='/beta/special' element={<SpecialOperations></SpecialOperations>}></Route>
                      <Route path='/beta/seo' element={<SEOBooster></SEOBooster>}></Route>
                      <Route path='/beta/delivery' element={<DeliverySystem></DeliverySystem>}></Route>

                    </Routes>
                  </main>
                  <Footer></Footer>

                  {/* Banner Ads */}
                  {adState.shouldShowBanner && (
                    <BannerAd
                      position='bottom'
                      adUnitId={AD_CONFIG.AD_UNITS.BANNER.HOME}
                    ></BannerAd>
                  )}

                  {/* Interstitial Ads */}
                  <InterstitialAd
                    isOpen={adState.shouldShowInterstial}
                    onClose={resetInterstitial}
                    adUnitId={AD_CONFIG.AD_UNITS.INTERSTITIAL.NAVIGATION}
                  ></InterstitialAd>
                </div>
              </Router>
            </ChatProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>

    </>
  )
}

export default App
