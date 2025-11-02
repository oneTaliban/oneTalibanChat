import React, {useState, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, 
    User, 
    Mail,
    Lock,
    Shield,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Fingerprint,
    EyeOff,
} from 'lucide-react';
import Input from '../../components/Ui/Input';
import Button from '../../components/Ui/Button';
import { useDeviceFingerprint } from '../../hooks/useDeviceFingerprint';
// import { securityAPI } from '../../utils/api'

const PasswordStrengthIndicator = ({password}) => {
  const getStrength = (pass) => {
    let score = 0;

    // lenght check
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;

    //Character variety check
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    //common passwords check (simplified)
    const  commonPasswords = ['password', '123456', 'qwerty', 'letmein', 'hacker'];
    if (!commonPasswords.includes(pass.toLowerCase())) score++;

    return Math.min(score, 6);
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const  strengthColors = [
    'bg-red-500', 
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-emarald-500'
  ];

  const requirements  = [
    {test: password.length >= 8, text: "At least 8 charactes"},
    {test: /[A-Z]/.test(password), text: "One uppercase letter"},
    {test: /[a-z]/.test(password), text: "One lowercase letter"},
    {test: /[0-9]/.test(password), text: "One number"},
    {test: /[^A-Za-z0-9]/.test(password), text: "One special character"},
    {test: password.length <= 128, text: "Less than 128 characters"},
  ];

  return (
    <div className='space-y-3'>
      {/* Strenth meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Password strength:</span>
          <span 
            className={`font-medium ${
                strength >= 4 ? 'text-green-400' :
                strength >= 2 ? 'text-yellow-400' : 'text-red-400'
              }`}
          >
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="flex space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < strength ? strengthColors[strength] : 'bg-gray-600'
                }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Requirements list  */}
      <div className="space-y-2">
        {requirements.map((req, index) => {
          <motion.div
            key={index}
            initial={{opacity: 0 , x: -10}}
            animate={{opacity: 1, x:0}}
            transition={{delay: index * 0.1}}
            className='flex items-center space-x-2 text-sm'
          >
            {req.test ? (
              <CheckCircle className='w-4  h-4 text-green-400 flex-shrink-0'></CheckCircle>
            ) : (
              <XCircle className='w-4 h-4 text-red-400 flex-srink-0'></XCircle>
            )}
            <span className={req.test ? 'text-green-400' : 'text-red-400'}>
              {req.test}
            </span>
          </motion.div>
        })}
      </div>
    </div>
  );
};

const UsernameAvailability = ({username, onAvailabilityChange}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length >= 3 && username.length <= 20) {
        setIsChecking(true);
        try {
          // to Simulate an api call 
          //delay simualation
          await new Promise((resolve) => setTimeout(resolve, 500));

          // availability check
          const available = !['admin', 'root', 'user', 'test'].includes(username.toLowerCase());
          setIsAvailable(available);
          onAvailabilityChange(available);

        } catch (error) {
          console.error("Username check failed: ", error);
          setIsAvailable(null);
          onAvailabilityChange(null);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsAvailable(null);
        onAvailabilityChange(null);
      }
    };

    const timeoutId = setTimeout(checkUsername, 300);
    return () => clearTimeout(timeoutId);
  }, [username, onAvailabilityChange]);

  if (!username || username.length < 3) return null;

  return (
    <motion.div
      initial={{opacity: 0, height: 0}}
      animate={{opacity: 1, height: 'auto'}}
      className='flex items-center space-x-2 text-sm'
    >
      {isChecking ? (
        <>
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-blue-400">Checking availability...</span>
        </>
      ) : isAvailable === true ? (
            <>
              <CheckCircle className='w-4 h-4 text-green-400'></CheckCircle>
              <span className='text-green-400'>Username available</span>
            </>
      ) : isAvailable === false ? (
            <>
              <XCircle className='w-4 h-4 text-red-400'></XCircle>
              <span className="text-red-400">Username taken</span>
            </>
      ) : null}
    </motion.div>
  );
};

const RegisterForm = ({ onSubmit, loading, error, onSwitchToLogin }) => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    agreeToTerms: false,
    newsletter: true,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const {fingerprint, isFingerprinting} = useDeviceFingerprint();

  const steps = [
    {number: 1, title: 'Account Info'},
    {number: 2, title: 'Personal Details'},
    {number: 3, title: 'Security'}
  ];
  const validatedField = (name, value) => {
    const errors =  {...formErrors};

    switch (name) {
      case 'username':
        if (value.length < 3) {
          errors.username = 'Username must be atleast 3 characters';
        } else if (value.length > 20) {
          errors.username = 'Username must be less than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers and underscores';
        } else {
          delete errors.username;
        }
        break;

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please Enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else {
          delete errors.password;
        }

        //Update confirm password validation if both are filled
        if (formData.password_confirm && value !== formData.password_confirm) {
          errors.passwordConfirm = 'Passwords do not match';
        } else if (errors.passwordConfirm) {
          delete errors.passwordConfirm;
        }
        break;
      
      case 'password_confirm':
        if (value !== formData.password) {
          errors.passwordConfirm = 'Passwords do not match';
        } else {
          delete errors.passwordConfirm;
        }
        break;
      
      case 'first_name':
        if (value && value.length > 50) {
          errors.firstName = 'First name too long';
        } else {
          delete errors.firstName;
        }
        break;

      case 'last_name':
        if (value && value.length > 50) {
          errors.lastName = 'Last name too long';
        } else {
          delete errors.lastName;
        }
        break;

      case 'agreeToTerms':
        if (!value) {
          errors.agreeToTerms = 'You must agree to terms and conditions';
        } else {
          delete errors.agreeToTerms;
        }
        break;

      default :
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev, 
      [name]: fieldValue
    }));

    validatedField(name, fieldValue);
  };

  const canProceedToStep = (step) => {
    switch (step) {
      case 2:
        return formData.username && 
                formData.email &&
                formData.password &&
                formData.password_confirm && 
                !formErrors.username &&
                !formErrors.email &&
                !formErrors.password &&
                !formErrors.passwordConfirm &&
                usernameAvailable === true;
      
      case 3:
        return true; //Personal details are optional
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // final validation
    const finalErrors = {};
    if (!formData.agreeToTerms) {
      finalErrors.agreeToTerms = 'You must agree to the terms and condtions';
    }

    if (Object.keys(finalErrors).length > 0) {
      setFormErrors(finalErrors);
      return;
    }

    // Include device fingerprint in registration
    const registrationData = {
      ...formData,
      deviceFingerprint: fingerprint,
    };

    await onSubmit(registrationData);
  };

  const nextStep = () => {
    if (canProceedToStep(currentStep + 1)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1}}
      className='max-w-2xl w-full mx-auto p-6'
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep >= step.number
                     ? 'bg-purple-600 text-white border-purple-700'
                     : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className='w-5 h-5'></CheckCircle>
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-sm mt-2 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Security Header */}
      <motion.div
        initial={{ opacity:0, y: -10}}
        animate={{ opacity: 1, y: 0}}
        className='text-center mb-8'
      >
        <div className="encryption-badge inline-flex items-center space-x-2 mb-4">
          <Shield className='w-5 h-5 security-shield'></Shield>
          <Fingerprint className='w-4 h-4'></Fingerprint>
          <span>Secure Registration with Device Fingerprinting for maximum security</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Create Your Secure Account
        </h2>
        <p className="text-gray-400">
          Join thousands of security-conscious users on One Taliban Chat
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className='space-y-6'>
          <AnimatePresence mode='wait'>
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <motion.div
                key='step1'
                initial={{opacity: 0, x: 50}}
                animate={{ opacity: 1, x: 0}}
                exit={{ opacity: 0, x: -50}}
                className='space-y-6'
              >
                <Input
                  label='Username'
                  name="username"
                  type='text'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Choose a unique username'
                  error={formErrors.username}
                  required
                  icon={<User className='w-4 h-4'></User>}
                  disabled={loading}
                ></Input>

                <UsernameAvailability
                  username={formData.username}
                  onAvailabilityChange={setUsernameAvailable}
                ></UsernameAvailability>

                <Input
                  label='Email Address'
                  name="email"
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='your@email.com'
                  error={formErrors.email}
                  required
                  icon={<Mail className='w-4 h-4'></Mail>}
                  disabled={loading}
                ></Input>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label='Password'
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder='Create a unique strong password'
                      error={formErrors.password}
                      required
                      icon={<Lock className='w-4 h-4'></Lock>}
                      disabled={loading}
                    ></Input>
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-9 text-gray-400 hover:text-white transition-colors'
                    >
                      {showPassword ? <EyeOff className='w-4 h-4'></EyeOff> : <Eye className='w-4 h-4'></Eye>}  
                    </button>                
                  </div>

                  <div className="relative">
                    <Input
                      label='Confirm Password'
                      name="password_confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password_confirm}
                      onChange={handleChange}
                      placeholder='Confirm your password'
                      error={formErrors.passwordConfirm}
                      required
                      icon={<Lock className='w-4 h-4'></Lock>}
                      disabled={loading}
                    ></Input>
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-3 top-9 text-gray-400 hover:text-white transition-colors'
                    >
                      {showConfirmPassword ? <EyeOff className='w-4 h-4'></EyeOff> : <Eye className='w-4 h-4'></Eye>}  
                    </button>
                  </div>
                </div>

                {formData.password && (
                  <PasswordStrengthIndicator password={formData.password}></PasswordStrengthIndicator>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type='button'
                    onClick={nextStep}
                    disabled={!canProceedToStep(2)}
                    variant='primary'
                  >
                    Continue to personal details
                  </Button>
                </div>

              </motion.div>
            )}

            {/* Step 2: Personal details */}
            {currentStep === 2 && (
              <motion.div
                key='step2'
                initial={{ opacity: 0, x: 50}}
                animate={{ opacity: 1 , x: 0}}
                exit={{ opacity: 0, x: -50}}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label='First Name'
                    name='first_name'
                    type='text'
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder='john'
                    error={formErrors.firstName}
                    disabled={loading}
                  ></Input>

                  <Input
                    label='Last Name'
                    name='last_name'
                    type='text'
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder='doe'
                    error={formErrors.lastName}
                    disabled={loading}
                  ></Input>       
                </div>

                <div className="space-y-4">
                  <label className='flex items-start space-x-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='newsletter'
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className='mt-1 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offest-gray-900'
                    ></input>
                    <div className="flex-1">
                      <span className="text-white font-semibold">Receive security updates and newsletters</span>
                      <p className="text-gray-400 text-sm mt-1">
                        Get the latest security tips, feature updates, cool deals and imprtant announcement
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type='button'
                    onClick={prevStep}
                    variant='secondary'
                  >
                    Back
                  </Button>
                  <Button
                    type='button'
                    onClick={nextStep}
                    variant='primary'
                  >
                    Continue to Security 
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Security & terms */}
            {currentStep ===3 && (
              <motion.div
                initial={{ opacity: 0, x: 50}}
                animate={{ opacity: 1, x: 0}}
                exit={{ opacity: 0, x: -50}}
                className='space-y-6'
              >
                {/* Device fingerprinting info */}
                <motion.div
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1}}
                  transition={{ delay: 0.2}}
                  className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-4'
                >
                  <div className="flex items-start space-x-3">
                    <Fingerprint className='text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0'></Fingerprint>
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-1">
                        Device Security Registrations
                      </h4>
                      <p className="text-blue-300 text-sm">
                        {isFingerprinting 
                          ? "Securely fingerprinting your device for enhanced security..."
                          : "Your device has been securely fingerprinted for advanced security monitoring and fraud prevention."
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Terms and Condition */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-3">Terms & Conditions</h4>
                    <div className="text-gray-400 text-sm space-y-2">
                      <p>
                        By creating an account, you agree to our Terms of Services and Privacy Policy.
                        You acknowledge that:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>All communication are end-to-end encrypted</li>
                        <li>We collect minimal data necessary for service operations</li>
                        <li>Your device fingerprint is stored for security purposes</li>
                        <li>You are responsible for maintaining your account security</li>
                        <li>We may suspend accounts violating our terms of services</li>
                      </ul>
                      <p>
                        For full terms, please read our complete Terms of Services and Privacy Policy.
                      </p>
                    </div>
                  </div>

                  <label className='flex items-start space-x-3 cursor-pointer '>
                    <input
                      type='checkbox'
                      name='agreeToTerms'
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className='mt-1 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900'
                    ></input>
                    <div className="flex-2">
                      <span className="text-white font-medium">
                        I agree to the Terms & Conditions and Privacy Policy
                      </span>
                      {formErrors.agreeToTerms && (
                        <p className="text-red-400 text-sm mt-1">
                          {formErrors.agreeToTerms}
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95}}
                    animate={{ opacity: 1, scale: 1}}
                    className='bg-red-500/10 border border-red-500/50 rounded-lg p-4'
                  >
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertTriangle className='w-5 h-5 flex-shrink-0'></AlertTriangle>
                      <span className="font-medium">Registration Error</span>
                    </div>
                    <p className="text-red-400 text-sm mt-1">
                      {error}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type='button'
                    onClick={prevStep}
                    variant='secondary'
                  >
                    Back
                  </Button>
                  <Button
                    type='submit'
                    variant='primary'
                    loading={loading}
                    disabled={loading  || !formData.agreeToTerms}
                    className='min-w-[120px]'
                  >
                    {loading ? (
                      <>Creating Account...</>
                    ) : (
                      <>Complete Registration</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </form>

      {/* Switch to login */}
      <motion.div
        initial={{ opacity: 0}} 
        animate={{ opacity: 1}}
        transition={{ delay: 0.5}}
        className='text-center mt-8 pt-6 border-t border-gray-700'
      >
        <p className="text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className='text-purple-400 hover:text-purple-300 font-medium transition-colors'
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </motion.div>  
  )
}

export default RegisterForm