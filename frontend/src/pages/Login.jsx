import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import loginBg from '../assets/login-bg-dark.png'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
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

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-16 xl:p-24 bg-[#0b0b0b] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff5c00]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[440px] mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <span className="text-[#ff5c00] text-3xl font-bold">✳</span>
              <span className="text-white text-2xl font-bold tracking-tight">Planify</span>
            </Link>

            <h1 className="text-[32px] font-bold text-white mb-8 tracking-tight">
              Welcome Back
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 focus:ring-4 focus:ring-[#ff5c00]/10 transition-all text-[15px]"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff5c00]/50 focus:ring-4 focus:ring-[#ff5c00]/10 transition-all text-[15px]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ff5c00] text-white font-bold py-4 rounded-full transition-all duration-300 hover:bg-[#e55200] shadow-[0_0_20px_rgba(255,92,0,0.2)] active:scale-[0.98] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Continue'}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400 text-[15px]">
              New to Planify?{' '}
              <Link to="/signup" className="text-[#ff5c00] font-bold hover:underline underline-offset-4">
                Join for free
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

export default Login


