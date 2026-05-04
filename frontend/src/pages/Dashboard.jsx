import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    taskStatusDistribution: [],
    priorityDistribution: []
  });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const statsRes = await axios.get('/api/dashboard/stats');
      setStats(statsRes.data);

      const notifRes = await axios.get('/api/dashboard/notifications');
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.patch(`/api/dashboard/notifications/${id}/read`);
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

  const STATUS_COLORS = ['#3b82f6', '#ff5c00', '#22c55e'];
  const PRIORITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#22c55e'
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <Header title="Dashboard" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 p-6 rounded-3xl dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
            >
              <p className="text-gray-400 text-sm font-medium mb-4">{card.title}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white" style={{ color: card.color }}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Task Status Distribution (Pie Chart) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 p-8 rounded-3xl min-h-[400px] dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Task Status Distribution</h3>
            <div className="h-[300px] w-full">
              {!isLoading && stats.taskStatusDistribution?.some(t => t.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.taskStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.taskStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#111113' : '#fff', 
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                        borderRadius: '12px',
                        color: isDark ? '#fff' : '#000'
                      }}
                      itemStyle={{ color: isDark ? '#fff' : '#000' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
                  <div className="text-4xl">📊</div>
                  <p>{isLoading ? 'Loading charts...' : 'No task data available yet'}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Priority Breakdown (Bar Chart) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 p-8 rounded-3xl min-h-[400px] dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Priority Breakdown</h3>
            <div className="h-[300px] w-full">
              {!isLoading && stats.priorityDistribution?.some(p => p.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDark ? "#666" : "#999"} 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke={isDark ? "#666" : "#999"} 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#111113' : '#fff', 
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                        borderRadius: '12px' 
                      }}
                      itemStyle={{ color: isDark ? '#fff' : '#000' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {stats.priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
                  <div className="text-4xl">📈</div>
                  <p>{isLoading ? 'Loading charts...' : 'No priority data available yet'}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Area */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center flex flex-col justify-center dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none">
            <div className="w-16 h-16 bg-[#ff5c00]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-[#ff5c00] text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">Go to Projects</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto dark:text-gray-400">
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
          <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col max-h-[400px] dark:bg-[#111113] dark:border-white/5 shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Recent Notifications</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-10">No new notifications</p>
              ) : (
                notifications.map((notif) => (
                  <motion.div 
                    key={notif._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-2xl border ${notif.read ? 'bg-gray-50 border-transparent dark:bg-white/5' : 'bg-[#ff5c00]/5 border-[#ff5c00]/10 dark:bg-[#ff5c00]/10 dark:border-[#ff5c00]/20'}`}
                  >
                    <p className={`text-sm mb-2 ${notif.read ? 'text-gray-500' : 'text-gray-900 font-bold dark:text-gray-300 dark:font-normal'}`}>{notif.message}</p>
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
