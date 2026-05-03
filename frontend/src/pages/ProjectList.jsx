import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/projects', newProject);
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
    <div className="h-screen bg-[#0b0b0b] flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Header title="Projects" />

        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active</span>
            <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">{projects.length} PROJECTS</span>
          </div>

          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#111113] hover:bg-white/5 border border-white/10 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              NEW PROJECT
            </button>
          )}
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No active projects found.</div>
          ) : (
            projects.map((project, i) => {
              const allMembers = [project.owner, ...(project.members || [])];
              const displayMembers = allMembers.slice(0, 4);
              const extraMembersCount = allMembers.length > 4 ? allMembers.length - 4 : 0;
              const isOverdue = project.dueDate && new Date(project.dueDate) < new Date();

              return (
                <motion.div 
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={`/projects/${project._id}`}
                    className="flex flex-col xl:flex-row items-center justify-between p-6 bg-[#111113] border border-white/5 hover:border-white/10 rounded-2xl group transition-all"
                  >
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 w-full xl:w-1/3 mb-4 xl:mb-0">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2c] text-white flex items-center justify-center text-xl font-bold group-hover:bg-[#ff5c00] group-hover:text-white transition-all">
                        {project.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{project.title}</h3>
                        <p className="text-gray-500 text-sm">Workspace</p>
                      </div>
                    </div>

                    {/* Tasks Counter */}
                    <div className="w-full xl:w-1/6 mb-4 xl:mb-0">
                      <p className="text-white font-bold"><span className="text-[#ff5c00]">{project.completedTasks || 0}</span> / {project.totalTasks || 0}</p>
                      <p className="text-gray-500 text-sm">Tasks</p>
                    </div>

                    {/* Members/Owner Area (Replaces Budget in mockup) */}
                    <div className="w-full xl:w-1/6 mb-4 xl:mb-0">
                      <p className="text-white font-bold">{allMembers.length} Members</p>
                      <p className="text-gray-500 text-sm">Involved</p>
                    </div>

                    {/* Due Date */}
                    <div className="w-full xl:w-1/6 mb-4 xl:mb-0 flex justify-start xl:justify-center">
                      <span className={`text-xs font-bold px-4 py-2 rounded-lg ${isOverdue ? 'bg-red-500/10 text-red-500' : 'bg-[#1a1a1c] text-gray-300'}`}>
                        {formatDueDate(project.dueDate)}
                      </span>
                    </div>

                    {/* Avatars */}
                    <div className="w-full xl:w-1/6 flex justify-start xl:justify-end items-center">
                      <div className="flex -space-x-3">
                        {displayMembers.map((mem, idx) => (
                          <div key={mem._id || idx} className={`w-8 h-8 rounded-full border-2 border-[#111113] flex items-center justify-center text-[10px] text-white font-bold ${idx === 0 ? 'bg-[#ff5c00]' : avatarColors[idx % avatarColors.length]} z-${30 - idx * 10}`}>
                            {mem.name ? mem.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        ))}
                        {extraMembersCount > 0 && (
                          <div className="w-8 h-8 rounded-full border-2 border-[#111113] bg-[#2a2a2c] flex items-center justify-center text-[10px] text-white font-bold z-0">
                            +{extraMembersCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
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
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-[#111113] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 transition-all"
                  />
                  <textarea
                    placeholder="Project Description"
                    rows="3"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 transition-all resize-none"
                  />
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ff5c00]/50 transition-all [color-scheme:dark]"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#ff5c00] text-white font-bold py-4 rounded-full transition-all hover:bg-[#e55200] disabled:opacity-50 mt-4"
                  >
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default ProjectList;
