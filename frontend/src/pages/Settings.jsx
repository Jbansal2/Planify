import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Settings() {
  const { user, updateUser } = useAuth();
  
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
    <div className="h-screen bg-[#0b0b0b] flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Settings" />

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111113] border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-[#ff5c00] flex items-center justify-center font-bold text-white text-4xl shadow-[0_0_20px_rgba(255,92,0,0.3)]">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-center">
                  <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
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
                  <label className="block text-gray-400 text-sm font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all"
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
            className="bg-[#111113] border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Account Security</h2>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-2xl">
              {passwordMsg.text && (
                <div className={`p-4 rounded-xl text-sm font-bold ${passwordMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSavingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 border border-white/10 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default Settings;
