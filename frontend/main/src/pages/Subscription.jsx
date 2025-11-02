import React from 'react';
import { motion } from 'framer-motion';
import SubscriptionPlans from '../components/Subscriptions/SubscriptionPlans';

const Subscription = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <SubscriptionPlans></SubscriptionPlans>
    </div>
  )
}

export default Subscription