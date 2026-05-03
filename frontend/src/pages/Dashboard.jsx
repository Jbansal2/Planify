import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

import Header from '../components/Header';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats(statsRes.data);

      const notifRes = await axios.get('http://localhost:5000/api/dashboard/notifications');
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/dashboard/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read');
    }
  };

  const cards = [
    { title: 'Total Projects', value: stats.totalProjects, color: '#ff5c00' },
    { title: 'Active Tasks', value: stats.activeTasks, color: '#3b82f6' },
    { title: 'Completed', value: stats.completedTasks, color: '#22c55e' },
    { title: 'Overdue', value: stats.overdueTasks, color: '#ef4444' }
  ];

  return (
    <div className="h-screen bg-[#0b0b0b] flex overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Dashboard" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111113] border border-white/5 p-6 rounded-3xl"
            >
              <p className="text-gray-400 text-sm font-medium mb-4">{card.title}</p>
              <p className="text-4xl font-bold text-white" style={{ color: card.color }}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Area */}
          <div className="bg-[#111113] border border-white/5 rounded-3xl p-8 text-center flex flex-col justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-[#ff5c00] text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Go to Projects</h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              View all your projects, assign tasks, and track progress.
            </p>
            <div>
              <Link 
                to="/projects"
                className="inline-flex items-center gap-2 bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(255,92,0,0.2)]"
              >
                Open Workspace
              </Link>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="bg-[#111113] border border-white/5 rounded-3xl p-8 flex flex-col max-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6">Recent Notifications</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-10">No new notifications</p>
              ) : (
                notifications.map((notif) => (
                  <motion.div 
                    key={notif._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-2xl border ${notif.read ? 'bg-white/5 border-transparent' : 'bg-[#ff5c00]/10 border-[#ff5c00]/20'}`}
                  >
                    <p className="text-sm text-gray-300 mb-2">{notif.message}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                      {!notif.read && (
                        <button 
                          onClick={() => markNotificationRead(notif._id)}
                          className="text-xs font-bold text-[#ff5c00] hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
