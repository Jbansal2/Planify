import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Blog', href: '#blog' },
  { label: 'Pages', href: '#', hasDropdown: true },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between transition-all duration-300">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="text-[#ff5c00] text-2xl">✳</span>
          <span className="tracking-tight">Planify</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 rounded-lg transition-colors duration-200 hover:text-white"
              >
                {link.label}
                {link.hasDropdown && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="hidden md:inline-block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="hidden md:inline-flex items-center gap-2 bg-[#ff5c00] hover:bg-[#e55200] text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(255,92,0,0.3)]"
          >
            Get Started
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
            </svg>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-gray-300 cursor-pointer bg-white/5 rounded-lg border border-white/10"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-8 pt-4 flex flex-col gap-2 border-t border-white/5 bg-[#0b0b0b]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-4 text-[15px] font-medium text-gray-400 rounded-xl transition-all duration-200 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center bg-white/5 text-white font-bold text-sm px-6 py-4 rounded-xl border border-white/10"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-[0_10px_20px_rgba(255,92,0,0.2)]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
