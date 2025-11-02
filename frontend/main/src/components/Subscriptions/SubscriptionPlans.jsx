import React, {useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  Zap,
  Shield,
  Star,
  CheckCircle,
  X,
  Sparkles,
  Rocket,
  Gem,
  Users,
  Clock,
  Gift,
  Flower,
  XCircle,
  Lock,
 } from 'lucide-react';
 import Button from '../Ui/Button';
 import Modal from '../Ui/Modal';

const FeatureBadge = ({ feature, included = true}) => (
  <div className="flex items-center space-x-3">
    {included ? (
      <CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0'></CheckCircle>
    ) : (
      <X className='w-5 h-5 text-red-400 flex-shrink-0'></X>
    )}
    <span className={included ? 'text-gray-300' : 'text-gray-500'}>{feature}</span>
  </div>
);

const SubscriptionCard = ({
  plan,
  isSelected,
  onSelect,
  popular = false,
  recommended = false,
}) => {
  const isYearly = plan.billingCycle === 'yearly';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5}}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plan)}
      className={`relative p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${
        isSelected 
        ? 'border-purple-500/10 shadow-2xl shadow-purple-500/30'
        : popular
        ? 'border-yellow-500 bg-yellow-500/5 hover:border-yellow-400'
        : recommended
        ? 'border-green-500 bg-green-500/5 hover:border-green-400'
        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
            <Sparkles className='w-4 h-4'></Sparkles>
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-green-900 px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
            <Crown className='w-4 h-4'></Crown>
            <span>RECOMMENDED</span>
          </div>
        </div>        
      )}

      <div className="space-y-6">
        {/* Plan Header */}
        <div className="text-center space-y-4">
          {/* Plan icon */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${
              popular ? 'bg-yellow-500/20 tex-yellow-400' :
              recommended ? 'bg-green-500/20 text-green-400' :
              'bg-purple-500/20 text-purple-400'
            }`}
          >
            {plan.icon}
          </div>

          {/* Plan Name */}
          <h3 className="text-2xl font-seme-bold text-gradient">
            {plan.name}
          </h3>

          {/* Description */}
          <p className="text-gray-400">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-4xl font-bold text-white">
              ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            </span>
            <span className='text-gray-400'>
              /{isYearly ? 'year' : 'month'}
            </span>
          </div>

          {isYearly && plan.monthlyPrice && (
            <div className="text-green-400 font-semibold">
              Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} per year!
            </div>
          )}
          
          {plan.originalPrice && (
            <div className="text-gray-400 line-through text-sm">
              ${plan.originalPrice}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          {plan.features.map((feature, index) =>  (
            <FeatureBadge
              key={index}
              feature={feature.text}
              included={feature.included}
            ></FeatureBadge>
          ))}
        </div>


        {/* Select Button */}
        <Button
          variant={isSelected ? 'primary' : popular ? 'success' : recommended ? 'success' : 'secondary'}
          size='lg'
          className='w-full'
          disabled={isSelected}
        >
          {isSelected ? "Current Plan" : `Get ${plan.name}`}
        </Button>
         
        {/* Saving Note */}
        {isYearly && (
          <div className="text-center text-green-400 text-sm font-semibold">
            <Flower className='w-4 h-4 mr-3'></Flower>
            {Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)}% savings!
          </div>
        )}
      </div>
    </motion.div>
  );
};

const BillingToggle = ({ billingCycle, onCycleChange }) => (
  <div className="flex items-center justify-center space-x-4 mb-8">
    <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
      Monthly
    </span>
    <button
      onClick={() => onCycleChange(billingCycle === 'monthly' ? 'yearly' : 'monthly')}  
      className='relative w-14 h-8 bg-gray-600 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
    >
      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
          billingCycle === 'yearly' ? 'transform translate-x-7'  : 'transform translate-x-1'
        }`}
      ></div>
    </button>

    <div className="flex items-center space-x-2">
      <span className={` font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
        Yearly
      </span>
      <div className="bg-green-500 text-green-900 px-2 py-1 rounded-full text-xs font-bold">
        SAVE 20%
      </div>
    </div>
  </div>
);

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: '0',
      yearlyPrice: '0',
      icon: <Users className='w-8 h-8'></Users>,
      features: [
        {text: 'Basic messaging', included: true},
        {text: 'Group chats (up to 10 people)', included: true},
        {text: 'File Sharing (10MB limit)', included: true},
        {text: '7-day message history', included: true},
        {text: 'Custom themes', included: false},
        {text: 'Priority support', included: false},
        {text: 'Basic security features', included: false},
        {text: 'Unlimited message history', included: false},
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users and small teams',
      monthlyPrice: '9.99',
      yearlyPrice: '95.99', // 20% discount
      originalPrice: '119.88',
      icon: <Zap className='w-8 h-8'></Zap>,
      features: [
        {text: 'Everything in Free', included: true},
        {text: 'Group chats (up to 50 people)', included: true},
        {text: 'File sharing (100MB limit)', included: true},
        {text: '30-day message history', included: true},
        {text: 'Custom themes and appearances', included: true},
        {text: 'Priority email support', included: true},
        {text: 'Basic security features', included: true},
        {text: 'Unlimited message history', included: false},
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For organisation and security-conscious users',
      monthlyPrice: '19.90',
      yearlyPrice: '191.99',
      originalPrice: '239.88',
      icon: <Shield className='w-8 h-8'></Shield>,
      features: [
        {text: 'Everything in pro', included: true},
        {text: 'Unlimited group members', included: true},
        {text: 'File sharing (16GB limit)', included: true},
        {text: 'Unlimited message history', included: true},
        {text: 'Advanced customozations', included: true},
        {text: '24/7 priority support', included: true},
        {text: 'Advanced security features', included: true},
        {text: 'Dedicated account manager', included: true},        
      ],
      recommended: true,
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      description: 'The complete experience with exclusive features',
      monthlyPrice: '29.99',
      yearlyPrice: '287.99',
      originalPrice: '359.88',
      icon: <Crown className='w-8 h-8'></Crown>,
      features: [
        {text: 'Everything in enterprise', included: true},
        {text: 'Api access', included: true},
        {text: 'unlimited file sharing', included: true},
        {text: 'Custom domain support', included: true},
        {text: 'White label solitions', included: true},
        {text: 'Dedicated servre instance', included: true},
        {text: 'Custom feature development', included: true},
        {text: 'Personal onboarding session', included: true},
      ]
    },
  ];

  const handleSubscribe = async (plan) => {
    if (plan.id === 'free') {
      // handle free plan selection
      setSelectedPlan(plan);
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      // to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // to integrate with Stripe / other payment 
      console.log('Processing subscription', {
        plan: selectedPlan.id,
        billingCycle,
        amount: billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
      });
    } catch (error) {
      console.error('Subscription failed: ', error);
      alert("Subscription failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPlan = () => {
    // to come from user context
    return 'free';
  };

  const isCurrentPlan = (planId) => planId === getCurrentPlan();
  
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Header */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className='text-center space-y-6'
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full px-6 py-3">
          <Crown className='w-5 h-5 text-purple-400'></Crown>
          <span className="text-purple-400 font-semibold">Upgrade Your Experience</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Unlock powerful features and enhance your chatting experience.
          All plans include our core security features and regular updates.
        </p>

        {/* Billing toggle */}
        <BillingToggle
          billingCycle={billingCycle}
          onCycleChange={setBillingCycle}
        ></BillingToggle>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{delay: 0.3}}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
      >
        {subscriptionPlans.map((plan) => (
          <SubscriptionCard
            key={plan.id}
            plan={{
              ...plan,
              billingCycle,
              price: billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
            }}
            isSelected={isCurrentPlan(plan.id)}
            onSelect={() => handleSubscribe(plan)}
            popular={plan.popular}
            recommended={plan.recommended}
          ></SubscriptionCard>
        ))}
      </motion.div>

      {/* Features comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity:1 , y:0 }}
        transition={{ delay: 0.6 }}
        className='bg-gray-800/50 border border-gray-700 rounded-3xl p-8'
      > 
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Compare All Features
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-4 text-gray-400 font-semibold">Feature</th>
                {subscriptionPlans.map((plan) => (
                  <th key={plan.id} className="text-center py-4">
                    <div className="space-y-2">
                      <div className="text-white font-bold">{plan.name}</div>
                      <div className="text-2xl font-bold text-white">
                        ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      </div>
                      <div className="text-gray-400 text-sm">
                        per {billingCycle === 'yearly' ? 'year' : "month"}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscriptionPlans[0].features.map((_, featureIndex) => (
                <tr key={featureIndex} className='border-b border-gray-700/50'>
                  <td className="py-4 text-gray-300 font-medium">
                    {subscriptionPlans[0].features[featureIndex].text}
                  </td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="text-center py-4">
                      {plan.features[featureIndex].included ? (
                        <CheckCircle  className='w-6 h-6 text-green-400 mx-auto'></CheckCircle> 
                      ) : (
                        <X className='w-6 h-6 text-red-400 mx-auto'></X>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ delay: 0.8}}
        className='space-y-6'
      >
        <h2 className="text-3xl font-bold text-white text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "Can I Change Plans Later?",
              answer: "Yes! You can upgrade or downgrade your at any time. Changes take effect immediately",
            },
            {
              question: "Is there a free trial?",
              answer: "All paid plans come with a 14-day free trial. No credit card required to start",
            },
            {
              question: "What payment methods do you accept",
              answer: "We accept all major credit/debit cards, Paypal, Cryptocurrencies, and mobile payments.",
            },
            {
              question: "Can I get a refund?",
              answer: "We offer a 30-day money-back guarantee for all annual plans. Monthly plans can be cancelled anytime."
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 == 0 ? -20 : 20}}
              animate={{ opacity: 1, x: 0}}
              transition={{ delay: 0.9 * index * 0.1}}
              className='bg-gray-800/50 border border-gray-700 rounded-2xl p-6'
            >
              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Subscribe to ${selectedPlan?.name}`}
        size='lg'
      >
        <div className="space-y-6">
          {/* Plan  Summary */}
          <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold tex-white">Order Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedPlan?.name} Plan</span>
                <span className="text-white font-semibold">
                  ${billingCycle === 'yearly' ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Billing Cycle</span>
                <span className="text-white font-semibold">
                  {billingCycle === 'yearly' ? "Yearly" : "Monthly"}
                </span>
              </div>

              {billingCycle === 'yearly' && (
                <div className="flex justify-between text-green-400">
                  <span>Yearly Discount</span>
                  <span className="font-semibold">
                    Save $ {((selectedPlan?.monthlyPrice * 12) - selectedPlan?.yearlyPrice).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>
                    ${billingCycle === 'yearly' ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  {billingCycle === "yearly" ? 'per year' : 'per month'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment method selectiond */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gradient">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Credit / Debit Card', 'Paypal', 'Bitcoin', 'M-Pesa'].map(method => (
                <div key={method} className="p-4 border-2 border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors text-center">
                  <div className="text-gray-300 font-medium">{method}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant='secondary'
              onClick={() => setShowPaymentModal(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={processPayment}
              loading={isProcessing}
              className='flex-1'
            >
              {isProcessing ? 'Processing...' : 'Complete Subscription'}
            </Button>
          </div>

          {/* Security Note */}
          <div>
            <span>
              <Lock className=' inline-flex w-5 h-5 mr-3 text-green-400'></Lock> 
              Secure payment encrypted with SSL technology
            </span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SubscriptionPlans