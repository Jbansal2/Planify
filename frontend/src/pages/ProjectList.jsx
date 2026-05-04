import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', dueDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '', dueDate: '' });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return 'No Due Date';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return `Due to ${date.toLocaleDateString('en-GB', options)}`;
  };

  // Helper to get dummy avatar colors for variety
  const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row font-sans dark:bg-[#0b0b0b] transition-colors duration-300 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Projects" />

        <div className="p-4 sm:p-6 lg:p-8 pt-0">

        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active</span>
            <span className="text-sm font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded-full dark:text-white dark:bg-white/10">{projects.length} PROJECTS</span>
          </div>

          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm dark:bg-[#111113] dark:hover:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              NEW PROJECT
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">No active projects found.</div>
          ) : (
            projects.map((project, i) => {
              const allMembers = [project.owner, ...(project.members || [])].filter(Boolean);
              const displayMembers = allMembers.slice(0, 4);
              const extraMembersCount = allMembers.length > 4 ? allMembers.length - 4 : 0;
              
              // Calculate progress
              const totalTasks = project.totalTasks || 0;
              const completedTasks = project.completedTasks || 0;
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              // Determine Icon based on title (mock logic for visual appeal)
              let iconColor = "bg-blue-50 text-blue-600";
              let Icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              );

              if (project.title.toLowerCase().includes('dev')) {
                iconColor = "bg-purple-50 text-purple-600";
                Icon = (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                );
              } else if (project.title.toLowerCase().includes('mark')) {
                iconColor = "bg-yellow-50 text-yellow-600";
                Icon = (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167H3.353a1.765 1.765 0 01-1.447-2.783l2.49-3.599ZM14.5 21V3M14.5 13h5.25a2.25 2.25 0 000-4.5H14.5" />
                  </svg>
                );
              }

              return (
                <motion.div 
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 dark:bg-[#111113] dark:border-white/5 group relative"
                >
                  <Link to={`/projects/${project._id}`} className="absolute inset-0 z-0" />
                  
                  {/* Top Row: Icon & Menu */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconColor} dark:bg-white/5`}>
                      {Icon}
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all dark:hover:text-white dark:hover:bg-white/5 relative z-10">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-[#ff5c00] transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {project.description || "No description provided for this project. Start adding tasks to see progress."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-white/5">
                    {/* Tasks Info */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Tasks</p>
                      <p className="text-xs font-bold text-gray-400">{completedTasks} of {totalTasks} completed</p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Progress</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                        <p className="text-xs font-bold text-gray-400 shrink-0">{progress}%</p>
                      </div>
                    </div>

                    {/* Members Avatars */}
                    <div className="flex items-center -space-x-2 pt-2">
                      {displayMembers.map((mem, idx) => (
                        <div 
                          key={mem._id || idx} 
                          className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600 dark:border-[#111113] dark:bg-white/5 dark:text-white overflow-hidden shadow-sm"
                          title={mem.name}
                        >
                          {mem.avatar ? (
                            <img src={mem.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{mem.name?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                      ))}
                      {extraMembersCount > 0 && (
                        <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:border-[#111113] dark:bg-white/5 shadow-sm">
                          +{extraMembersCount}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white border border-gray-200 w-full max-w-md p-8 rounded-3xl shadow-2xl dark:bg-[#111113] dark:border-white/10"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Create New Project</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600"
                  />
                  <textarea
                    placeholder="Project Description"
                    rows="3"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/50 transition-all resize-none dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600"
                  />
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#ff5c00] text-white font-bold py-4 rounded-full transition-all hover:bg-[#e55200] disabled:opacity-50 mt-4 shadow-lg shadow-[#ff5c00]/20"
                  >
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default ProjectList;
