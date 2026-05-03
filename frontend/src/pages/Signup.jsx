import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import loginBg from '../assets/login-bg-dark.png'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Visual Asset */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={loginBg}
          alt="Architectural Backdrop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-16 xl:p-24 bg-[#0b0b0b] relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff5c00]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[440px] mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <span className="text-[#ff5c00] text-3xl font-bold">✳</span>
              <span className="text-white text-2xl font-bold tracking-tight">Planify</span>
            </Link>

            <h1 className="text-[32px] font-bold text-white mb-8 tracking-tight">
              Create an account
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 transition-all text-[15px]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 transition-all text-[15px]"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 transition-all text-[15px]"
                />
                <div className="flex gap-4">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="role"
                      value="Member"
                      checked={role === 'Member'}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden peer"
                    />
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-sm font-medium text-gray-400 peer-checked:border-[#ff5c00] peer-checked:text-[#ff5c00] transition-all cursor-pointer">
                      Member
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={role === 'Admin'}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden peer"
                    />
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-sm font-medium text-gray-400 peer-checked:border-[#ff5c00] peer-checked:text-[#ff5c00] transition-all cursor-pointer">
                      Admin
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ff5c00] text-white font-bold py-4 rounded-full transition-all duration-300 hover:bg-[#e55200] shadow-[0_0_20px_rgba(255,92,0,0.2)] active:scale-[0.98] text-[15px] mt-4 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Get Started'}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400 text-[15px]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff5c00] font-bold hover:underline underline-offset-4">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center lg:text-left text-gray-600 text-xs font-medium tracking-tight"
        >
          <span className="mr-2 opacity-50">PLATFORM</span>
          Built for teams. Designed for efficiency.
        </motion.div>
      </div>
    </div>
  )
}

export default Signup



