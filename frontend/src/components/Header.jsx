import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
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
      const res = await axios.get('/api/dashboard/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/dashboard/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex flex-col lg:flex-row justify-between items-center gap-4 py-4 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md dark:bg-[#0b0b0b]/90 border-b border-gray-100 dark:border-white/5 transition-all duration-300 w-full">
      {/* Title */}
      <h1 className="text-2xl font-extrabold text-gray-900 shrink-0 dark:text-white transition-colors duration-300">
        {title}
      </h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md w-full mx-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#ff5c00] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search for..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#ff5c00]/30 focus:ring-4 focus:ring-[#ff5c00]/5 transition-all dark:bg-[#111113] dark:border-white/5 dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-6 shrink-0 relative" ref={dropdownRef}>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              showDropdown 
              ? 'text-[#ff5c00] bg-[#ff5c00]/5' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0b0b0b]"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden dark:bg-[#111113] dark:border-white/10"
              >
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center dark:border-white/5 dark:bg-white/5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-[10px] font-bold text-gray-400">{unreadCount} New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5 cursor-pointer">
                        <p className="text-xs text-gray-800 dark:text-gray-200">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/5 ml-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200 dark:bg-white/5 dark:border-white/10 dark:text-white shrink-0 overflow-hidden shadow-sm">
             {user?.avatar ? (
               <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
             ) : (
               <span>{user?.name?.[0]}</span>
             )}
          </div>
          <div className="hidden sm:block">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#ff5c00] transition-colors">{user?.name}</h4>
            <p className="text-[11px] text-gray-500 font-medium">Account settings</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>
    </header>
  );
}

export default Header;
