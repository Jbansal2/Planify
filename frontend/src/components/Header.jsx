import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ title }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/dashboard/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
      <h1 className="text-3xl font-bold text-white shrink-0 w-48">{title}</h1>

      <div className="flex-1 max-w-xl w-full">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-[#111113] border border-white/5 rounded-full py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0 relative" ref={dropdownRef}>
        {/* Notification Button */}
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
            showDropdown ? 'border-[#ff5c00]/50 text-[#ff5c00] bg-[#ff5c00]/10' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-[#111113]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ff5c00] border-2 border-[#111113]"></span>
          )}
        </button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-[100px] sm:right-0 w-80 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-white font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#ff5c00]/20 text-[#ff5c00] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">No notifications yet.</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => !notif.read && markAsRead(notif._id)}
                      className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${notif.read ? 'opacity-60' : 'bg-[#ff5c00]/5'}`}
                    >
                      <p className={`text-sm mb-1 ${notif.read ? 'text-gray-400' : 'text-white font-bold'}`}>
                        {notif.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-[#ff5c00]"></span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role === 'Admin' ? 'Super Admin' : 'Member'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ff5c00] flex items-center justify-center font-bold text-white text-lg shadow-[0_0_15px_rgba(255,92,0,0.3)] border border-[#ff5c00]/50">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
