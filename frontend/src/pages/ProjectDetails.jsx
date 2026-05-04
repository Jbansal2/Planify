import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks/project/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/tasks', { ...newTask, project: id });
      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'Todo', priority: 'Medium', assignee: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task');
    }
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-500';
      case 'Medium': return 'bg-amber-500/10 text-amber-500';
      case 'Low': return 'bg-emerald-500/10 text-emerald-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <Header title="Task Board" />
      
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
        <Link to="/projects" className="text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2 font-bold text-sm dark:text-gray-400 dark:hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          BACK TO PROJECTS
        </Link>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm dark:bg-[#111113] dark:hover:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            ADD TASK
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(column => (
          <div key={column} className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs dark:text-gray-400">{column}</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md dark:bg-white/5 dark:text-gray-500">
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>
            
            <div className="space-y-4">
              {tasks.filter(t => t.status === column).map(task => (
                <motion.div
                  key={task._id}
                  layout
                  className="bg-white border border-gray-100 p-5 rounded-2xl group relative shadow-sm dark:bg-[#111113] dark:border-white/5 dark:shadow-none"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-gray-900 font-bold dark:text-white">{task.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>
                  
                  {task.assignee && task.assignee.name && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#ff5c00]/20 text-[#ff5c00] flex items-center justify-center text-xs font-bold uppercase">
                        {task.assignee.name.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-500">Assigned to <span className="text-gray-700 font-medium dark:text-gray-300">{task.assignee.name}</span></span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={`text-xs font-bold ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500' : 'text-gray-400'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {columns.filter(c => c !== column).map(c => (
                      <button 
                        key={c}
                        onClick={() => updateTaskStatus(task._id, c)}
                        className="text-[10px] uppercase font-bold text-[#ff5c00] hover:underline"
                      >
                        Move to {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

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
              className="relative bg-white border border-gray-200 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl dark:bg-[#111113] dark:border-white/10"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/50 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600"
                />
                <textarea
                  placeholder="Task Description"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/50 transition-all resize-none dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all appearance-none dark:bg-white/5 dark:border-white/10 dark:text-white"
                  >
                    <option value="Low" className="bg-white text-gray-900 dark:bg-[#111113] dark:text-white">Low Priority</option>
                    <option value="Medium" className="bg-white text-gray-900 dark:bg-[#111113] dark:text-white">Medium Priority</option>
                    <option value="High" className="bg-white text-gray-900 dark:bg-[#111113] dark:text-white">High Priority</option>
                  </select>

                  <select
                    value={newTask.assignee || ''}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all appearance-none dark:bg-white/5 dark:border-white/10 dark:text-white"
                  >
                    <option value="" className="bg-white text-gray-500 dark:bg-[#111113] dark:text-gray-400">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id} className="bg-white text-gray-900 dark:bg-[#111113] dark:text-white">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-[#ff5c00]/50 transition-all appearance-none [color-scheme:light] dark:[color-scheme:dark] dark:bg-white/5 dark:border-white/10 dark:text-white"
                />

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ff5c00] text-white font-bold py-4 rounded-full transition-all hover:bg-[#e55200] disabled:opacity-50 shadow-lg shadow-[#ff5c00]/20"
                >
                  {isLoading ? 'Adding...' : 'Add Task'}
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

export default ProjectDetails;
