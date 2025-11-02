import React, {useState, useEffect } from 'react';
import { motion, useReducedMotion  } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Shield,
  Bell,
  Globe,
  Edit3,
  CheckCircle,
  XCircle,
 } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
 import Button from '../components/Ui/Button';
 import Input from '../components/Ui/Input';
 import Modal from '../components/Ui/Modal';

const ProfileSection = ({ title, icon, children, isActive = true}) => (
  <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    className={`bg-gray-800/50 border rounded-2xl p-6 ${
        isActive ? 'border-gray-700' : 'border-gray-800 opacity-50'
      }`}
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-purple-500/20 rounded-lg">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const SecurityBadge = ({level, description}) => {
  const getColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-400 bg-green-400/20 border-green-400';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400';
      case 'low': return 'text-red-400 bg-red-400/20 border-red-400';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400'; 
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getColor(level)}`}>
      <div className={`w-2 h-2 rounded-full ${ level === 'high' ? 'bg-green-400' : level === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
      <span className="text-sm font-medium">{description}</span>
    </div>
  );
};

const Profile = () => {

  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    github: '',
    twitter: '',
    linkedin: '',
  });

  const [preferences, setPreferences] = useState({
    email_notification: true,
    push_notification: true,
    two_factor_enabled: false,
    show_online_status: true,
    language: 'en',
    theme: 'dark',
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        website: user.profile?.website || '',
        location: user.profile?.location || '',
        github: user.profile?.github || '',
        twitter: user.profile?.twitter || '',
        linkedin: user.profile?.linkedin || '',
      });

      setPreferences({
        email_notification: user.profile?.email_notification ?? true,
        push_notification: user.profile?.push_notification ?? true,
        two_factor_enabled: user.profile?.two_factor_enabled ?? false,
        show_online_status: user.profile?.show_online_status ?? true,
        language: 'en',
        theme: 'dark',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile: ', error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    // Implement avatar upload logic
    console.log("Uploading avatar: ",file);
    setShowAvatarModal(false);
  }

  const getSecurtyLevel = () => {
    let score = 0;
    if (preferences.two_factor_enabled) score += 2;
    if (user?.email_verified) score += 1;
    if (formData.phone) score += 1;

    if (score >= 3) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  };

  const securityLevel = getSecurtyLevel();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gradient">Loading Profile...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0}}
          className='text-center mb-8'
        >
          <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Avatar & Security */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <ProfileSection title="Profile Picture" icon={<User className='w-5 h-5 text-purple-400'></User>}>
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.username} 
                    className='w-32 h-32 rounded-full border-4 border-purple-500 mx-auto'
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className='absolute bottom-2 right-2 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors'
                  >
                    <Camera className='w-4 h-4 text-white'></Camera>
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Click the camera icon to update your profile picture
                </p>
              </div>
            </ProfileSection>

            {/* Security Status */}
            <ProfileSection title="Security Status" icon={<Shield className='w-5 h-5 text-green-400'></Shield>}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Overall Security</span>
                  <SecurityBadge 
                    level={securityLevel}
                    description = {
                      securityLevel === 'high' ? 'Highly Secure' :
                      securityLevel === 'medium' ? 'Moderately Secure' : "Needs Improvement"
                    }
                  ></SecurityBadge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Email Verification</span>
                    {(user.email_verified ? (
                      <CheckCircle className='text-green-400 w-5 h-5'></CheckCircle>
                    ) : (
                      <XCircle className='text-red-400 w-5 h-5'></XCircle>
                    ) )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">2FA Enabled</span>
                    {(preferences.two_factor_enabled ? (
                      <CheckCircle className='text-green-400 w-5 h-5'></CheckCircle>
                    ) : (
                      <XCircle className='text-red-400 w-5 h-5'></XCircle>
                    ) )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Phone Number</span>
                    {(formData.phone ? (
                      <CheckCircle className='text-green-400 w-5 h-5'></CheckCircle>
                    ) : (
                      <XCircle className='text-red-400 w-5 h-5'></XCircle>
                    ) )}
                  </div>

                </div>
                <Button
                  variant='secondary'
                  size='sm'
                  className='w-full'
                  onClick={() => { /* Navigate to security settings */}}
                >
                  <Shield className='w-4 h-4 mr-2'></Shield>
                  Security Settings
                </Button>
              </div>
            </ProfileSection>
          </div>

          {/* Right column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic information */}
            <ProfileSection title="Basic Information" icon={<User className='w-5 h-5 text-blue-400'></User>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                  disabled={!isEditing}
                  icon={<User className='w-4 h-4'></User>}
                ></Input>
              
                <Input
                  label="Email"
                  value={formData.email}
                  type='email'
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  disabled={!isEditing}
                  icon={<Mail className='w-4 h-4'></Mail>}
                ></Input>

                <Input
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({...prev, first_name: e.target.value}))}
                  disabled={!isEditing}
                ></Input>

                <Input
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({...prev, last_name: e.target.value}))}
                  disabled={!isEditing}
                ></Input>

                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  disabled={!isEditing}
                  icon={<Phone className='w-4 h-4'></Phone>}
                ></Input>                                                              

              </div>

              <Input
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                multiline='true'
                rows={3}
              ></Input>
            </ProfileSection>

            {/* Social links */}
            <ProfileSection title="Social Links" icon={<Globe className='w-5 h-5 text-green-400'></Globe>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({...prev, website: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="https://..."
                ></Input> 

                <Input
                  label="Github"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({...prev, github: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="https://github.com/username"
                ></Input> 

                <Input
                  label="Twitter"
                  value={formData.twitter}
                  onChange={(e) => setFormData(prev => ({...prev, twitter: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="https://x.com/username"
                ></Input> 

                <Input
                  label="Linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({...prev, linkedin: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/username"
                ></Input> 

              </div>
            </ProfileSection>

            {/* Preferences */}
            <ProfileSection title="Preferences" icon={<Bell className='w-5 h-5 text-yellow-400'></Bell>}>
              <div className="space-y-4">
                <label htmlFor="" className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-white font-medium">Push Notifications</span>
                    <p className="text-gray-400 text-sm">Receive browser notifications</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.push_notification}  
                    onChange={(e) => setPreferences(prev => ({...prev, push_notification: e.target.checked}))}
                    disabled={!isEditing}
                    className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
                  />
                </label>

                <label htmlFor="" className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-white font-medium">Email Notifications</span>
                    <p className="text-gray-400 text-sm">Receive email updates and security alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.email_notification}  
                    onChange={(e) => setPreferences(prev => ({...prev, email_notification: e.target.checked}))}
                    disabled={!isEditing}
                    className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
                  />
                </label>

                <label htmlFor="" className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-white font-medium">Two-Factor Authentication</span>
                    <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.two_factor_enabled}  
                    onChange={(e) => setPreferences(prev => ({...prev, two_factor_enabled: e.target.checked}))}
                    disabled={!isEditing}
                    className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
                  />
                </label>

                <label htmlFor="" className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-white font-medium">Show Online Status</span>
                    <p className="text-gray-400 text-sm">Let others see when you are online</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.show_online_status}  
                    onChange={(e) => setPreferences(prev => ({...prev, show_online_status: e.target.checked}))}
                    disabled={!isEditing}
                    className='rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500'
                  />
                </label>

              </div>
            </ProfileSection>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isEditing ? (
                <Button
                  variant='secondary'
                  onClick={() => setIsEditing(true)}
                  className='flex-1'
                >
                  <Edit3 className='w-4 h-4 mr-2'></Edit3>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setIsEditing(false);
                      // reset form data
                      if (user) {
                        setFormData({
                          username: user.username || '',
                          email: user.email || '',
                          first_name: user.first_name || '',
                          last_name: user.last_name || '',
                          phone: user.phone || '',
                          bio: user.bio || '',
                          website: user.profile?.website || '',
                          location: user.profile?.location || '',
                          github: user.profile?.github || '',
                          twitter: user.profile?.twitter || '',
                          linkedin: user.profile?.linkedin || '',                          
                        });
                      }
                    }}
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='primary'
                    onClick={handleSaveProfile}
                    loading={isLoading}
                    className='flex-1'
                  >
                    <Save className='w-4 h-4 mr-2'></Save>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar upload modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
        size='md'
      >
        <div className="text-center space-y-4">
          <div className="w-32 h-32 rounded-full border-4 border-purple-500 mx-auto overflow-hidden">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.username} 
              className='w-full h-full object-cover'
            />
          </div>

          <div className="space-y-3">
            <input 
              type="file" 
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleAvatarUpload(file);
              }}
              className='block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600'
            />

            <p className="text-gray-400 text-sm">
              Recommended: Square image, at least 256x256 pixels
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant='secondary'
              onClick={() => setShowAvatarModal(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => {/* implement avatar removal*/}}
              className='flex-1'
            >
              Remove Current
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile