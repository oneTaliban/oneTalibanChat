import React from 'react';
import {motion } from 'framer-motion';
import DonationForm from '../components/Donations/DonationForm';

const Donations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <DonationForm></DonationForm>
    </div>
  )
}

export default Donations