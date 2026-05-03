import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function CursorLabel({ name, color, x, y, flip, animationDelay = '0s', duration = '4s' }) {
  const cursorRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    posRef.current = {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
    }

    let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    function onMouseMove(e) {
      const dx = (e.clientX - lastMouse.x) * 0.06 * (flip ? -1 : 1)
      const dy = (e.clientY - lastMouse.y) * 0.04
      targetRef.current.x += dx
      targetRef.current.y += dy
      targetRef.current.x = Math.max(-18, Math.min(18, targetRef.current.x))
      targetRef.current.y = Math.max(-12, Math.min(12, targetRef.current.y))
      lastMouse = { x: e.clientX, y: e.clientY }
    }

    function animate() {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.05
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.05

      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--dx', `${posRef.current.x}px`)
        cursorRef.current.style.setProperty('--dy', `${posRef.current.y}px`)
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [flip])

  return (
    <div
      ref={cursorRef}
      className="absolute hidden lg:flex items-center gap-0 pointer-events-none select-none z-20"
      style={{
        left: x,
        top: y,
        '--dx': '0px',
        '--dy': '0px',
        animation: `cursorFloat ${duration} ease-in-out infinite`,
        animationDelay,
        transform: 'translate(var(--dx), var(--dy))',
      }}
    >
      <svg
        width="18"
        height="22"
        viewBox="0 0 18 22"
        fill="none"
        className={flip ? 'scale-x-[-1]' : ''}
      >
        <path
          d="M1.5 1L6.5 19L9.5 12L17 10L1.5 1Z"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-xs font-semibold text-white px-3 py-1 rounded-full whitespace-nowrap -ml-1"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  )
}

const avatarColors = ['#f87171', '#fb923c', '#a78bfa', '#34d399', '#60a5fa']

function AvatarStack() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {avatarColors.map((bg, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border-2 border-[#0f0f0f] flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: bg, zIndex: avatarColors.length - i }}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <span className="text-sm text-gray-400 font-medium">
        2000+ Active Users
      </span>
    </div>
  )
}

function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] font-sans pt-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse,_rgba(255,92,0,0.18)_0%,_transparent_70%)] blur-2xl" />
      </div>

      <CursorLabel
        name="Juan D."
        color="#ff5c00"
        x="12%"
        y="62%"
        duration="3.8s"
        animationDelay="0s"
      />
      <CursorLabel
        name="Alex W."
        color="#22c55e"
        x="78%"
        y="28%"
        flip
        duration="5.1s"
        animationDelay="1.3s"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2 mb-10 px-1.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30"
          >
            <span className="bg-[#ff5c00] text-white text-xs font-bold px-3 py-0.5 rounded-full">
              Update
            </span>
            <span className="text-sm text-gray-300 pr-2 flex items-center gap-1">
              See what&apos;s new in Grauberg
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </motion.div>

        <motion.h1
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-white mb-8"
        >
          Effortless Project{' '}
          <br className="hidden sm:block" />
          Management for{' '}
          <br />
          <span className="font-serif italic text-[#ff5c00] font-normal">
            Growing Teams
          </span>
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-xl leading-relaxed max-w-2xl mb-12"
        >
          Manage projects faster, improve team efficiency, and scale your business with one powerful platform.
        </motion.p>

        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-8"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,92,0,0.3)] hover:shadow-[0_0_40px_rgba(255,92,0,0.45)] active:scale-95"
          >
            Get Started Now
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
            </svg>
          </a>
          <AvatarStack />
        </motion.div>
      </div>

      <style>{`
        @keyframes cursorFloat {
          0%   { transform: translate(var(--dx), calc(var(--dy) + 0px)); }
          30%  { transform: translate(var(--dx), calc(var(--dy) - 10px)); }
          60%  { transform: translate(var(--dx), calc(var(--dy) - 4px)); }
          80%  { transform: translate(var(--dx), calc(var(--dy) - 14px)); }
          100% { transform: translate(var(--dx), calc(var(--dy) + 0px)); }
        }
      `}</style>
    </section>
  )
}

export default Hero