import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
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
    setPasswordMsg({ type: '', text: '' });
    
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '✨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Settings" />

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Settings Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
              <nav className="flex lg:flex-col gap-2 p-1 bg-white border border-gray-200 rounded-2xl dark:bg-[#111113] dark:border-white/5 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'bg-[#ff5c00] text-white shadow-[0_10px_20px_rgba(255,92,0,0.2)]' 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Settings Content Area */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 dark:bg-[#111113] dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-8 mb-10">
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#ff5c00] to-[#ff8c00] flex items-center justify-center font-bold text-white text-4xl shadow-2xl">
                              {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform dark:bg-[#1a1a1c] dark:border-white/10">
                              📸
                            </button>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                            <p className="text-gray-500 font-medium dark:text-gray-400">{user?.role} • Workspace Member</p>
                          </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                          {profileMsg.text && (
                            <div className={`p-5 rounded-2xl text-sm font-bold ${profileMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {profileMsg.text}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Full Name</label>
                              <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Email Address</label>
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:text-white"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="pt-4 flex justify-end">
                            <button 
                              type="submit"
                              disabled={isSavingProfile || (profileData.name === user?.name && profileData.email === user?.email)}
                              className="bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#ff5c00]/20"
                            >
                              {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 flex items-center justify-between">
                        <div>
                          <h3 className="text-red-500 font-bold text-lg">Danger Zone</h3>
                          <p className="text-gray-500 text-sm mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 dark:bg-[#111113] dark:border-white/5 shadow-sm">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Security</h2>
                        <p className="text-gray-500 mt-1 dark:text-gray-400">Update your password to keep your account secure.</p>
                      </div>
                      
                      <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        {passwordMsg.text && (
                          <div className={`p-5 rounded-2xl text-sm font-bold ${passwordMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {passwordMsg.text}
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">New Password</label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:text-white"
                              required
                              minLength="6"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:text-white"
                              required
                              minLength="6"
                            />
                          </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                          <button 
                            type="submit"
                            disabled={isSavingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                          >
                            {isSavingPassword ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </form>

                      <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl dark:bg-white/[0.02]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm dark:bg-[#1a1a1c]">📱</div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">Authenticator App</p>
                              <p className="text-xs text-gray-500">Secure your account with 2FA.</p>
                            </div>
                          </div>
                          <button className="text-xs font-bold text-[#ff5c00] uppercase tracking-widest hover:underline">Setup Now</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 dark:bg-[#111113] dark:border-white/5 shadow-sm">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Selection</h2>
                        <p className="text-gray-500 mt-1 dark:text-gray-400">Choose your preferred style for the interface.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                          onClick={() => setTheme('dark')}
                          className={`group relative flex flex-col gap-4 p-4 rounded-3xl border-2 transition-all ${
                            theme === 'dark' 
                              ? 'border-[#ff5c00] bg-[#ff5c00]/5' 
                              : 'border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-white/5 dark:bg-[#1a1a1c] dark:hover:border-white/10'
                          }`}
                        >
                          <div className="aspect-video w-full bg-[#0b0b0b] rounded-2xl border border-white/5 overflow-hidden p-4 flex flex-col gap-2">
                             <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                             <div className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl"></div>
                          </div>
                          <div className="flex items-center justify-between px-2 pb-2">
                            <span className={`font-bold ${theme === 'dark' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Premium Dark</span>
                            {theme === 'dark' && <span className="text-[#ff5c00]">✓</span>}
                          </div>
                        </button>

                        <button
                          onClick={() => setTheme('light')}
                          className={`group relative flex flex-col gap-4 p-4 rounded-3xl border-2 transition-all ${
                            theme === 'light' 
                              ? 'border-[#ff5c00] bg-[#ff5c00]/5' 
                              : 'border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-white/5 dark:bg-[#1a1a1c] dark:hover:border-white/10'
                          }`}
                        >
                          <div className="aspect-video w-full bg-white rounded-2xl border border-black/5 overflow-hidden p-4 flex flex-col gap-2">
                             <div className="w-1/2 h-2 bg-black/10 rounded-full"></div>
                             <div className="w-full h-12 bg-black/[0.02] border border-black/5 rounded-xl"></div>
                          </div>
                          <div className="flex items-center justify-between px-2 pb-2">
                            <span className={`font-bold ${theme === 'light' ? 'text-[#ff5c00]' : 'text-gray-500'}`}>Modern Light</span>
                            {theme === 'light' && <span className="text-[#ff5c00]">✓</span>}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 dark:bg-[#111113] dark:border-white/5 shadow-sm">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                        <p className="text-gray-500 mt-1 dark:text-gray-400">Control how and when you receive updates.</p>
                      </div>
                      
                      <div className="space-y-6">
                        {[
                          { title: 'Email Notifications', desc: 'Receive weekly summaries and important alerts.', enabled: true },
                          { title: 'Browser Push', desc: 'Get real-time updates when tasks are updated.', enabled: false },
                          { title: 'Project Updates', desc: 'Notify me when someone joins or leaves a project.', enabled: true },
                          { title: 'Chat Mentions', desc: 'Receive alerts when you are tagged in messages.', enabled: true },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl dark:bg-white/[0.02]">
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                            <button className={`w-12 h-6 rounded-full transition-all relative ${item.enabled ? 'bg-[#ff5c00]' : 'bg-gray-300 dark:bg-white/10'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'left-7' : 'left-1'}`}></div>
                            </button>
                          </div>
                        ))}
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
