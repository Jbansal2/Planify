import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  
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
      const res = await axios.put('https://backend-production-b33cd.up.railway.app/api/users/profile', profileData);
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
    setProfileMsg({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
    }

    setIsSavingPassword(true);
    try {
      await axios.put('https://backend-production-b33cd.up.railway.app/api/users/password', {
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Settings" />

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Profile Information</h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-[#ff5c00] flex items-center justify-center font-bold text-white text-4xl shadow-[0_0_20px_rgba(255,92,0,0.3)]">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-center">
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider dark:bg-white/10 dark:text-white">
                    {user?.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4">
                {profileMsg.text && (
                  <div className={`p-4 rounded-xl text-sm font-bold ${profileMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {profileMsg.text}
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-500 text-sm font-bold mb-2 dark:text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm font-bold mb-2 dark:text-gray-400">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white"
                    required
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSavingProfile || (profileData.name === user?.name && profileData.email === user?.email)}
                    className="bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Account Security Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Account Security</h2>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-2xl">
              {passwordMsg.text && (
                <div className={`p-4 rounded-xl text-sm font-bold ${passwordMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="block text-gray-500 text-sm font-bold mb-2 dark:text-gray-400">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm font-bold mb-2 dark:text-gray-400">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm font-bold mb-2 dark:text-gray-400">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSavingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all active:scale-95 border border-gray-200 disabled:opacity-50 disabled:active:scale-100 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/10"
                >
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Appearance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Appearance</h2>
            <div className="space-y-6">
              <p className="text-gray-500 text-sm dark:text-gray-400">Choose how Planify looks to you. Select a theme that fits your preference.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#ff5c00]/10 border-[#ff5c00]' : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-[#1a1a1c] dark:border-white/5 dark:hover:border-white/10'}`}
                >
                  <div className="h-24 w-full bg-[#0b0b0b] rounded-xl border border-white/10 flex items-center justify-center">
                    <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Dark Mode</span>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${theme === 'light' ? 'bg-[#ff5c00]/10 border-[#ff5c00]' : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-[#1a1a1c] dark:border-white/5 dark:hover:border-white/10'}`}
                >
                  <div className="h-24 w-full bg-white rounded-xl border border-black/10 flex items-center justify-center">
                    <div className="w-12 h-2 bg-black/20 rounded-full"></div>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'light' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Light Mode</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default Settings;
