import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Team() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Restrict access to Admin only
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://backend-production-b33cd.up.railway.app/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBlockStatus = async (userId) => {
    try {
      const res = await axios.patch(`https://backend-production-b33cd.up.railway.app/api/users/${userId}/block`);
      setUsers(users.map(u => u._id === userId ? { ...u, status: res.data.user.status } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="h-screen bg-[#0b0b0b] flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Team Members" />

        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Workspace</span>
            <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">{users.length} MEMBERS</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-gray-400 text-center py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-[#ff5c00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No members found.</div>
            ) : (
              users.map((member, i) => {
                const isBlocked = member.status === 'blocked';
                
                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col xl:flex-row items-center justify-between p-6 bg-[#111113] border transition-all rounded-2xl group ${
                      isBlocked ? 'border-red-500/20 opacity-75' : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4 w-full xl:w-2/5 mb-4 xl:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl uppercase shrink-0 transition-colors ${
                        isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-[#2a2a2c] text-white group-hover:bg-[#ff5c00] group-hover:text-white'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                          {member.name}
                          {member._id === user.id && (
                            <span className="text-[10px] bg-[#ff5c00]/20 text-[#ff5c00] px-2 py-0.5 rounded font-bold uppercase">You</span>
                          )}
                        </h3>
                        <p className="text-gray-500 text-sm">{member.email}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="w-full xl:w-1/5 mb-4 xl:mb-0">
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        member.role === 'Admin' ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-white/5 text-gray-400'
                      }`}>
                        {member.role === 'Admin' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        )}
                        {member.role}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="w-full xl:w-1/5 mb-4 xl:mb-0 flex justify-start">
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="w-full xl:w-1/5 flex justify-start xl:justify-end items-center">
                      {member._id !== user.id ? (
                        <button
                          onClick={() => toggleBlockStatus(member._id)}
                          className={`text-sm font-bold px-5 py-2 rounded-xl transition-all border ${
                            isBlocked 
                              ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' 
                              : 'bg-transparent text-gray-400 border-white/5 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/10'
                          }`}
                        >
                          {isBlocked ? 'Unblock Member' : 'Block Access'}
                        </button>
                      ) : (
                        <span className="text-gray-600 text-sm italic">Cannot block yourself</span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Team;
