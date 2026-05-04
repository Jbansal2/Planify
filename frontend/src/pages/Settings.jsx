import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await axios.put('/api/users/profile', profileData);
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
    }

    setIsSavingPassword(true);
    try {
      await axios.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '✨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Settings" />

        <div className="p-4 sm:p-6 lg:p-8 pt-0">
          <div className="max-w-5xl mx-auto">
            {/* Horizontal Tabs */}
            <div className="flex items-center gap-8 mb-8 border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all whitespace-nowrap relative ${
                    activeTab === tab.id 
                      ? 'text-[#ff5c00]' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff5c00]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Settings Content Area */}
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'profile' && (
                    <div className="max-w-3xl">
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 dark:text-white">Account</h2>

                      {/* Avatar Section */}
                      <div className="flex items-center gap-6 mb-12 pb-12 border-b border-gray-50 dark:border-white/5">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">{user?.name?.[0]}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">Profile picture size: 400px x 400px</p>
                        </div>
                        <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm dark:bg-white/5 dark:border-white/10 dark:text-white">
                          Upload new
                        </button>
                      </div>

                      {/* Basic Info Section */}
                      <div className="mb-12">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">Basic information</h3>
                        <p className="text-sm text-gray-400 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit tempor incididunt</p>

                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                          {profileMsg.text && (
                            <div className={`p-4 rounded-2xl text-xs font-bold ${profileMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {profileMsg.text}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">Full name</label>
                              <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                className="w-full bg-white border border-gray-100 rounded-full px-6 py-3.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm"
                                placeholder="John Carter"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">Email address</label>
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                className="w-full bg-white border border-gray-100 rounded-full px-6 py-3.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm"
                                placeholder="example@gmail.com"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">About biography</label>
                            <textarea
                              rows="4"
                              className="w-full bg-white border border-gray-100 rounded-3xl px-6 py-4 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm resize-none"
                              placeholder="Write a brief bio..."
                            />
                          </div>

                          <div className="flex justify-end pt-4">
                            <button 
                              type="submit"
                              disabled={isSavingProfile || (profileData.name === user?.name && profileData.email === user?.email)}
                              className="bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold py-3.5 px-10 rounded-full transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#ff5c00]/20"
                            >
                              {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Danger Zone */}
                      <div className="mt-20 pt-10 border-t border-gray-50 dark:border-white/5">
                        <div className="flex items-center justify-between p-8 bg-red-50 rounded-[2rem] dark:bg-red-500/5">
                          <div>
                            <h3 className="text-red-600 font-bold">Delete Account</h3>
                            <p className="text-xs text-red-400 mt-1">Once deleted, all your data will be permanently removed.</p>
                          </div>
                          <button className="px-6 py-2.5 bg-white border border-red-100 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 transition-all dark:bg-white/5 dark:border-red-500/20">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="max-w-2xl">
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 dark:text-white">Security</h2>
                      <form onSubmit={handlePasswordUpdate} className="space-y-8">
                         {passwordMsg.text && (
                           <div className={`p-4 rounded-2xl text-xs font-bold ${passwordMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                             {passwordMsg.text}
                           </div>
                         )}
                         <div className="space-y-3">
                           <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">Current Password</label>
                           <input
                             type="password"
                             value={passwordData.currentPassword}
                             onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                             className="w-full bg-white border border-gray-100 rounded-full px-6 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm"
                           />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">New Password</label>
                             <input
                               type="password"
                               value={passwordData.newPassword}
                               onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                               className="w-full bg-white border border-gray-100 rounded-full px-6 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm"
                             />
                           </div>
                           <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900 dark:text-white px-1">Confirm Password</label>
                             <input
                               type="password"
                               value={passwordData.confirmPassword}
                               onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                               className="w-full bg-white border border-gray-100 rounded-full px-6 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white shadow-sm"
                             />
                           </div>
                         </div>
                         <div className="flex justify-end">
                           <button 
                             type="submit"
                             className="bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold py-3.5 px-10 rounded-full transition-all active:scale-95"
                           >
                             Update Password
                           </button>
                         </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="max-w-3xl">
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 dark:text-white">Appearance</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                          onClick={() => setTheme('dark')}
                          className={`group relative flex flex-col gap-4 p-4 rounded-3xl border-2 transition-all ${
                            theme === 'dark' ? 'border-[#ff5c00] bg-[#ff5c00]/5' : 'border-gray-50 bg-gray-50 dark:border-white/5 dark:bg-[#1a1a1c]'
                          }`}
                        >
                          <div className="aspect-video w-full bg-[#0b0b0b] rounded-2xl border border-white/5 overflow-hidden p-4">
                             <div className="w-1/2 h-2 bg-white/20 rounded-full mb-2"></div>
                             <div className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl"></div>
                          </div>
                          <span className={`font-bold text-sm ${theme === 'dark' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Premium Dark</span>
                        </button>
                        <button
                          onClick={() => setTheme('light')}
                          className={`group relative flex flex-col gap-4 p-4 rounded-3xl border-2 transition-all ${
                            theme === 'light' ? 'border-[#ff5c00] bg-[#ff5c00]/5' : 'border-gray-50 bg-gray-50 dark:border-white/5 dark:bg-[#1a1a1c]'
                          }`}
                        >
                          <div className="aspect-video w-full bg-white rounded-2xl border border-black/5 overflow-hidden p-4">
                             <div className="w-1/2 h-2 bg-black/10 rounded-full mb-2"></div>
                             <div className="w-full h-12 bg-black/[0.02] border border-black/5 rounded-xl"></div>
                          </div>
                          <span className={`font-bold text-sm ${theme === 'light' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Modern Light</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
