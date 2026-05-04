import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Messages() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages(activeChat._id);
      interval = setInterval(() => {
        fetchMessages(activeChat._id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('https://backend-production-b33cd.up.railway.app/api/users');
      const otherUsers = res.data.filter(u => u._id !== user.id);
      setContacts(otherUsers);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`https://backend-production-b33cd.up.railway.app/api/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const payload = { receiverId: activeChat._id, content: newMessage };
      const res = await axios.post('https://backend-production-b33cd.up.railway.app/api/messages', payload);
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-[#0b0b0b] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-hidden flex flex-col">
        <Header title="Messages" />

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Panel: Contacts List */}
          <div className="w-1/3 bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm dark:bg-[#111113] dark:border-white/5 dark:shadow-2xl transition-colors duration-300">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight dark:text-white">Chats</h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Direct Messages</p>
                </div>
                <div className="w-10 h-10 bg-[#ff5c00]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ff5c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 border border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/30 transition-all dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white dark:placeholder:text-gray-600"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-2 border-[#ff5c00] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-medium">Loading conversations...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-gray-600 font-medium">No contacts found</p>
                </div>
              ) : filteredContacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => setActiveChat(contact)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 group ${
                    activeChat?._id === contact._id 
                      ? 'bg-[#ff5c00] shadow-[0_10px_30px_rgba(255,92,0,0.2)]' 
                      : 'bg-transparent hover:bg-gray-100 border border-transparent hover:border-gray-200 dark:hover:bg-white/5 dark:hover:border-white/5'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                      activeChat?._id === contact._id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-[#1a1a1c] dark:text-gray-400 dark:group-hover:bg-[#2a2a2c]'
                    }`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${
                      activeChat?._id === contact._id ? 'bg-white' : 'bg-green-500'
                    } ${activeChat?._id === contact._id ? '' : 'dark:border-[#111113]'}`}></span>
                  </div>
                  <div className="text-left flex-1 overflow-hidden">
                    <h3 className={`font-bold text-base truncate transition-colors duration-300 ${activeChat?._id === contact._id ? 'text-white' : 'text-gray-900 group-hover:text-black dark:text-white/90 dark:group-hover:text-white'}`}>
                      {contact.name}
                    </h3>
                    <p className={`text-xs truncate font-medium transition-colors duration-300 ${activeChat?._id === contact._id ? 'text-white/70' : 'text-gray-500'}`}>
                      {contact.role} • Workspace
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Active Chat */}
          <div className="w-2/3 bg-white border border-gray-200 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm dark:bg-[#111113] dark:border-white/5 dark:shadow-2xl relative transition-colors duration-300">
            <AnimatePresence mode="wait">
              {activeChat ? (
                <motion.div 
                  key={activeChat._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  {/* Chat Header */}
                  <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#ff5c00] text-white flex items-center justify-center font-bold text-xl shadow-[0_10px_20px_rgba(255,92,0,0.2)]">
                        {activeChat.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-tight dark:text-white">{activeChat.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <p className="text-xs text-gray-500 font-medium">Online now</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all dark:bg-white/5 dark:border-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 5z" />
                        </svg>
                      </button>
                      <button className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all dark:bg-white/5 dark:border-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,rgba(255,92,0,0.02),transparent)]">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-200 dark:bg-white/5 dark:border-white/5">
                          <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg dark:text-white">Start a conversation</h3>
                        <p className="text-sm mt-2 max-w-[240px] text-center font-medium">Send a friendly greeting to {activeChat.name.split(' ')[0]} to get things started.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full dark:text-gray-600 dark:bg-white/5">Conversation Started</span>
                        </div>
                        {messages.map((msg, i) => {
                          const isMe = msg.sender === user.id;
                          return (
                            <motion.div 
                              key={msg._id}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[75%] group relative ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-6 py-4 rounded-[1.8rem] shadow-lg transition-all duration-300 ${
                                  isMe 
                                    ? 'bg-[#ff5c00] text-white rounded-br-none hover:shadow-[0_10px_25px_rgba(255,92,0,0.3)]' 
                                    : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none hover:bg-gray-200 dark:bg-[#1a1a1c] dark:text-white/90 dark:border-white/5 dark:hover:bg-[#202022]'
                                }`}>
                                  <p className="text-[0.9375rem] font-medium leading-relaxed">{msg.content}</p>
                                </div>
                                <div className={`flex items-center gap-2 mt-2 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-600">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                  {isMe && (
                                    <svg className="w-3 h-3 text-[#ff5c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-8 border-t border-gray-100 bg-gray-50/30 dark:border-white/5 dark:bg-white/[0.01]">
                    <form onSubmit={sendMessage} className="flex gap-4 items-center">
                      <button type="button" className="shrink-0 w-14 h-14 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Write a message..."
                          className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-8 py-5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#ff5c00]/30 transition-all text-sm font-medium shadow-inner dark:bg-[#1a1a1c] dark:border-white/5 dark:text-white dark:placeholder:text-gray-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="shrink-0 w-16 h-14 bg-[#ff5c00] hover:bg-[#e55200] rounded-2xl flex items-center justify-center text-white transition-all duration-300 disabled:opacity-30 disabled:grayscale shadow-[0_10px_20px_rgba(255,92,0,0.2)] active:scale-95"
                      >
                        <svg className="w-6 h-6 rotate-45 mb-1 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="relative mb-10">
                    <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center border border-gray-200 shadow-xl dark:bg-white/5 dark:border-white/5 dark:shadow-2xl">
                      <svg className="w-12 h-12 text-[#ff5c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#ff5c00] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-[#111113]">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight dark:text-white">Select a Chat</h2>
                  <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                    Collaborate with your team in real-time. Select a workspace member from the list to start messaging.
                  </p>
                  <div className="mt-12 flex gap-4">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 dark:bg-[#1a1a1c] dark:border-[#111113]">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest self-center dark:text-gray-600">+ {contacts.length} Members</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Messages;
