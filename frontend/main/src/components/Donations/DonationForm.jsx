import React, {useState} from 'react';
import  { motion, AnimatePresence} from 'framer-motion';
import {
  Heart,
  CreditCard, 
  Bitcoin,
  Smartphone,
  Shield,
  Zap,
  Gift,
  Crown,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Button from '../Ui/Button';
import Modal from '../Ui/Modal';
import Input from '../Ui/Input';

const PaymentMethod = ({method, isSelected, onSelect, icon, title, description}) => (
  <motion.div
    whileHover={{ scale: 1.02}}
    whileTap={{ scale: 0.98}}
    onClick={() => onSelect(method)}
    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`p-2 rounded-lg ${
          isSelected ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {isSelected && (
        <CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0'></CheckCircle>
      )}
    </div>
  </motion.div>
);

const DonationTier = ({
  tier,
  isSelected,
  onSelect,
  popular = false,
  recommended = false,
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5}}
    whileTap={{ scale: 0.95}}
    onClick={() => onSelect(tier)}
    className={`relative p-6  border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
      isSelected
        ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/30'  
        : popular 
        ? 'border-yellow-500 bg-yellow-500/5 hover:border-yellow-400'
        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
    }`}
  >
    {/* Popular Badge */}
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -traslate-x-1/2">
        <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Sparkles className='w-3 h-3'></Sparkles>
          <span>MOST POPULAR</span>
        </div>
      </div>
    )}

    {/* Recommended Badge */}
    {recommended && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-green-500 text-green-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Crown className='w-3 h-3'></Crown>
          <span>RECOMMENDED</span>
        </div>
      </div>
    )}

    <div className="text-center space-y-4">
      {/* Tier Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
        popular ? 'bg-yellow-500/20 text-yellow-400' :
        recommended ? 'bg-green-500/20 text-green-400' :
        'bg-purple-500/20 text-purple-400'
      }`}>
        <Gift className='w-6 h-6'></Gift>
      </div>
      
      {/* Tier Name */}
      <h3 className="text-xl font-bold text-white">{tier.name}</h3>

      {/* Amount */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-white">
          ${tier.amount}
        </div>
        {tier.originalAmount && (
          <div className="text-sm text-gray-400 line-through">
            ${tier.originalAmount}
          </div>
        )}
      </div>
      
      {/* Description */}
      <p className="text-gray-400 text-sm min-h-[40px]">
        {tier.description}
      </p>

      {/* Features */}
      <div className="space-y-2">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
            <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0'></CheckCircle>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Select button */}
      <div
        className={`px-4 py-2 rounded-lg font-semibold text-center ${
          isSelected
            ? 'bg-purple-500 text-white'
            : popular 
            ? 'bg-yellow-500 text-yellow-900'   
            : recommended
            ? 'bg-green-500 text-green-900'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </div>
    </div>
  </motion.div>
)

const DonationForm = () => {
  const  [selectedTier , setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: '',
    anonymous: false
  });

  const donationTiers = [
    {
      id: 'basic',
      name: 'Supporter',
      amount: '5',
      description: 'Help keep lights on',
      features: [
        "Supporter badge in chat",
        "Our eternal gratitude",
        "Priority support",
      ],
    },
    {
      id: 'popular',
      name: 'Booster',
      amount: '15',
      originalAmount: '20',
      description: 'Boost our development',
      features: [
        "All supporter features",
        "Custom username color",
        "Early access to features",
        "Special emoji and reactions",
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Champion',
      amount: '30',
      description: 'Become a true champion',
      features: [
        "All Booster features",
        "Animated profile Frame",
        "Exclusive Champion badge",
        "VIP support channel access",
        "Feature request priority",
      ],
      recommended: true,
    },
    {
      id: 'hero',
      name: 'Hero',
      amount: '60',
      description: "Our development hero",
      features: [
        "All Champion features",
        "Dedicated thank you message",
        "Hero status in community",
        "Direct developer access",
        "Custom feature consideration",
      ]
    }
  ];

  const paymentMethods = [
    {
      id: 'stripe',
      title: 'Credit/Debit Card',
      description: 'Secure Payment via Stripe',
      icon: <CreditCard className='w-5 h-5'></CreditCard>
    },
    {
      id: 'mpesa',
      title: 'Mpesa',
      description: 'Mobile money payment',
      icon: <Smartphone className='w-5 h-5'></Smartphone>
    },
    {
      id: 'bitcoin',
      title: 'Bitcoin',
      description: 'Cryptocurrency payment',
      icon: <Bitcoin className='w-5 h-5'></Bitcoin>
    }
  ];

  const handleDonations = async () => {
    if (!selectedTier && !customAmount) {
      alert('Please select a donation tier or enter a custom amount');
      return;
    }
    setIsProcessing(true);

    try {
      // simualting payment processing
      await new Promise(resolve => setTimeout(resolve , 3000));

      //to integrate with payment api
      console.log('Processing donation: ', {
        amount: selectedTier ? selectedTier.amount : customAmount,
        paymentMethod,
        donorInfo
      });

      setShowSuccess(true)
    } catch (error) {
      console.error('Donation Failed: ', error);
      alert("Donation Failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCustomAmountChange = (value) => {
    //validating custom amount 
    const amount = parseFloat(value);
    if (amount >= 1 && amount <= 10000) {
      setCustomAmount(value);
      setSelectedTier(null);
    } else if (value === '') {
      setCustomAmount('');
    }
  };

  const getTotalAmount = () => {
    if (selectedTier) return selectedTier.amount;
    if (customAmount) return customAmount;
    return '0';
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y:20}}
        animate={{ opacity: 1, y:0}}
        className='text-center space-y-4'
      >
        <div className="inline-flex items-center space-x-2 bg-purple-500/30 rounded-full px-4 py-2">
          <Heart className='w-5 h-5 text-red-400 animate-pulse'></Heart>
          <span className="text-purple-400 font-semibold">Support Our Mission</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Support One Taliban Chat
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Help us continue providing secure, real-time messaging with cutting-edge features.
          Your support keeps the platform free and open for everyone.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Tiers */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{ opacity: 1, x: 0}}
            transition={{ delay: 0.2}}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Gift className='w-6 h-6 text-purple-400'></Gift>
              <span>Choose Your Support Level</span>
            </h2>

            {/* Donation Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {donationTiers.map((tier) => (
                <DonationTier
                  key={tier.id}
                  tier={tier}
                  isSelected={selectedTier?.id === tier.id}
                  onSelect={setSelectedTier}
                  popular={tier.popular}
                  recommended={tier.recommended}
                ></DonationTier>
              ))}
            </div>

            {/* Custom Amount */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className='mt-6 p-6 border-2 border-gray-600 rounded-2xl bg-gray-800/50'
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Or Enter Custom Amount
              </h3>
              <div className="flex space-x-4">
                <Input
                type='number'
                placeholder="Enter amount (1-10000)"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min='1'
                max='10000'
                className='flex-1'
                >
                </Input>
                <div className="text-2xl font-bold text-white flex items-center">
                  ${getTotalAmount()}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Donor Information */}
          <motion.div
            initial={{ opacity: 0 ,x: -20}}
            animate={{ opacity: 1, x: 0}}
            transition={{delay: 0.4}}
            className='space-y-6'
          >
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Heart className='w-6 h-6 text-red-400'></Heart>
              <span>Your Information (optional)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your name"
                placeholder="How should we thank you?"
                value={donorInfo.name}
                onChange={(e) => setDonorInfo(prev => ({...prev, name: e.target.value}))}
                disabled={donorInfo.anonymous}
              ></Input>

              <Input
                label="Email Address"
                type='email'
                placeholder="For receipts and updates"
                value={donorInfo.email}
                onChange={(e) => setDonorInfo(prev => ({...prev, email: e.target.value}))}
                disabled={donorInfo.anonymous}
              ></Input>
            </div>

            <Input
              label="Message of support"
              placeholder="Leave an encouraging message for our team..."
              value={donorInfo.message}
              onChange={(e) => setDonorInfo(prev => ({...prev, message: e.target.value}))}
              multiline= 'true'
              rows={3}
            ></Input>

            <label className='flex items-center space-x-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={donorInfo.anonymous}
                onChange={(e) => setDonorInfo(prev => ({...prev, anonymous: e.target.checked}))}
                className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
              ></input>
              <div>
                <span className="text-white font-medium">Donate Anonymously</span>
                <p className="text-gray-400 text-sm">
                  Your donation will be hidden from public view
                </p>
              </div>
            </label>
          </motion.div>
        </div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20}}
          animate={{ opacity: 1, x: 0}}
          transition={{ delay: 0.6}}
          className='space-y-6'
        >
          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <CreditCard className='w-6 h-6 text-blue-400'></CreditCard>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <PaymentMethod
                  key={method.id}
                  method={method.id}
                  isSelected={paymentMethod === method.id}
                  onSelect={setPaymentMethod}
                  icon={method.icon}
                  title={method.title}
                  description={method.description}
                ></PaymentMethod>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Donation Summary</h3>

              <div className="space-3">
                <div className="flex justify-between text-gray-300">
                  <span>Donation Amount</span>
                  <span className="font-semibold">${getTotalAmount()}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Payment Processing</span>
                  <span className="text-green-400">Free</span>
                </div>

                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-white font-bold.text-lg">
                    <span>Total</span>
                    <span className='text-green-400'>${getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center space-x-2  text-sm text-green-400 pt-4 border-t border-gray-600">
                <Shield className='w-4 h-4'></Shield>
                <span>Secure SSL Encryption Payment</span>
              </div>

              {/* Donate Button */}
              <Button
                variant='primary'
                loading={isProcessing}
                disabled={!selectedTier && !customAmount}
                onClick={handleDonations}
                size='lg'
                className='w-full mt-4'
              >
                {isProcessing ? (
                  <>Processing Donations...</>
                ) : (
                  <>
                    <Heart className='w-5 h-5 mr-2'></Heart>
                    Donate ${getTotalAmount()} Now
                  </>
                )}
              </Button>

              {/* Guarantee */}
              <p className="text-center text-gray-500 text-xs">
                <span className="text-gray-300">100% Secure </span>
                - 30-Day Refund Guarantee - No Spam
              </p>
          </div>

          {/* Features Highlights */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Zap className='w-5 h-5 text-purple-400'></Zap>
              <span>What Your Support Enables</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0'></CheckCircle>
                <span>Server Maintenance and Uptime</span>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0'></CheckCircle>
                <span>New Feature development</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0'></CheckCircle>
                <span>Security enhancements</span>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0'></CheckCircle>
                <span>Communtity support</span>
              </div>                            
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Thank You for Your Support!"
        size='md'
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Heart className='w-10 h-10 text-green-400'></Heart>
          </div>

          <h3 className="text-2xl font-bold text-white">
            Donation Successfull!
          </h3>

          <p className="text-gray-400">
            Your generous donation of <span className="text-white font-semibod">${getTotalAmount()}</span> has been received.
            Thank You for Supporting One Talibab Chat!
          </p>

          {!donorInfo.anonymous && donorInfo.name && (
            <p className="text-purple-400 font-semibols">
              Thank You {donorInfo.name}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-400">
            <p>A receipt has been sent to your email</p>
            <p>Your supporter benefits are now active</p>
          </div>

          <Button
            variant='primary'
            onClick={() => setShowSuccess(false)}
            className='w-full'
          >
            Continue to Chat
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default DonationForm