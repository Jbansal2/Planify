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
    taskStatusDistribution: [
      { name: 'Todo', value: 5 },
      { name: 'In Progress', value: 3 },
      { name: 'Done', value: 8 }
    ],
    priorityDistribution: [
      { name: 'High', value: 4 },
      { name: 'Medium', value: 7 },
      { name: 'Low', value: 5 }
    ],
    teamProgress: []
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
      const newData = statsRes.data;
      
      // Only update distributions if they have actual data to show
      const hasStatusData = newData.taskStatusDistribution?.some(t => t.value > 0);
      const hasPriorityData = newData.priorityDistribution?.some(p => p.value > 0);

      setStats(prev => ({
        ...newData,
        taskStatusDistribution: hasStatusData ? newData.taskStatusDistribution : prev.taskStatusDistribution,
        priorityDistribution: hasPriorityData ? newData.priorityDistribution : prev.priorityDistribution,
        teamProgress: newData.teamProgress || []
      }));

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
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row font-sans dark:bg-[#0b0b0b] transition-colors duration-300 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Dashboard" />

        <div className="p-4 sm:p-6 lg:p-8 pt-0">
          {/* Stats Grid - Real Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Projects', value: stats.totalProjects, color: 'bg-orange-50 text-[#ff5c00]', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { title: 'Active Tasks', value: stats.activeTasks, color: 'bg-blue-50 text-blue-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
            { title: 'Completed', value: stats.completedTasks, color: 'bg-green-50 text-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Overdue', value: stats.overdueTasks, color: 'bg-red-50 text-red-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} dark:bg-white/5`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                  </svg>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{card.title}</p>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - Real Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5 min-h-[380px]"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 dark:text-white">Task Distribution</h3>
            <div className="h-[280px] w-full">
              {stats.taskStatusDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.taskStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
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
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                  <div className="text-4xl">📊</div>
                  <p className="text-sm font-bold">{isLoading ? 'Loading charts...' : 'No data to visualize'}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Priority Analysis Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5 min-h-[380px]"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 dark:text-white">Priority Breakdown</h3>
            <div className="h-[280px] w-full">
              {stats.priorityDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDark ? "#666" : "#999"} 
                      fontSize={11} 
                      fontWeight="bold"
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke={isDark ? "#666" : "#999"} 
                      fontSize={11} 
                      fontWeight="bold"
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#111113' : '#fff', 
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {stats.priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                  <div className="text-4xl">📈</div>
                  <p className="text-sm font-bold">{isLoading ? 'Loading charts...' : 'No priority data'}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Team progress</h3>
              <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-full px-4 py-2 focus:ring-0 dark:bg-white/5">
                <option>This month</option>
              </select>
            </div>
            <div className="space-y-8">
              {stats.teamProgress.length > 0 ? (
                stats.teamProgress.map((member, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shrink-0 text-xs dark:bg-white/5 dark:text-white">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{member.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400">{member.completed} of {member.total} completed</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full dark:bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(member.completed / member.total) * 100}%` }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 w-8">{Math.round((member.completed / member.total) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <span className="text-3xl">👥</span>
                  <p className="text-xs font-bold">No team members assigned to tasks yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tasks Reports Summary */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:bg-[#111113] dark:border-white/5"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Quick Analysis</h3>
              <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-full px-4 py-2 focus:ring-0 dark:bg-white/5">
                <option>Active Stats</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Completed', value: stats.completedTasks, change: '12%', up: true, icon: 'bg-green-50 text-green-500', svg: 'M5 13l4 4L19 7' },
                { label: 'Active', value: stats.activeTasks, change: '3%', up: false, icon: 'bg-red-50 text-red-500', svg: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
                { label: 'Overdue', value: stats.overdueTasks, change: '1%', up: false, icon: 'bg-yellow-50 text-yellow-500', svg: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
              ].map((report, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${report.icon} dark:bg-white/5`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={report.svg} />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mb-2">{report.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{report.value}</span>
                    <div className={`flex items-center text-[10px] font-bold ${report.up ? 'text-green-500' : 'text-red-500'}`}>
                      {report.up ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
