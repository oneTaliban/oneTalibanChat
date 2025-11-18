import React,{useState} from 'react'
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Layout from '../components/beta/Layout'
import SEOBooster from '../components/beta/SEOBooster'
import Dashboard from '../components/beta/Dashboard'
import DataManager from '../components/beta/DataManager'
import CommandCenter from '../components/beta/CommandCenter'
import DeliverySystem from '../components/beta/DeliverySystem'
import SpecialOperations from '../components/beta/SpecialOperations'
import BotManager from '../components/beta/BotManager'

import { motion, AnimatePresence } from 'framer-motion'

const Beta = () => {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <Layout>
          <AnimatePresence>
            <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -20}}
            >
              <Dashboard></Dashboard>
            </motion.div>
            {/* <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -20}}
            >
            <BotManager></BotManager>
            </motion.div> */}
          </AnimatePresence>
        </Layout>    
    // </div>
  )
}

export default Beta                