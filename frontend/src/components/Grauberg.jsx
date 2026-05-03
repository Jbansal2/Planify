import { motion } from 'framer-motion'

function Grauberg() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }

  return (
    <section className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden">
      <motion.div 
        {...fadeInUp}
        className="w-full px-4 sm:px-10 lg:px-20 mx-auto text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="text-sm text-gray-300">
            See what&apos;s new in Grauberg
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
          Revolutionize your
          <br />
          <span className="font-serif italic text-[#ff5c00] font-normal">
            Project Management
          </span>
        </h2>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Unlock seamless collaboration and unparalleled efficiency with our
          intuitive canvas board.
        </p>
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        className="w-full px-4 sm:px-10 lg:px-20 mx-auto"
      >
        <div className="relative rounded-2xl border border-white/10 bg-[#111113] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[55%] p-4 sm:p-6">
              <div className="rounded-xl overflow-hidden border border-white/5">
                <img
                  src="/kanban.png"
                  alt="Kanban board interface"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            <div className="lg:w-[45%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center self-start mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 font-medium">
                See what&apos;s new in Grauberg
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
                Seamless &amp; Collaborative
                <br />
                Canvas Board
              </h3>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                Experience the ultimate in project visualization and team
                collaboration. Our intuitive canvas board makes it easy to map
                out tasks, track progress, and ensure everyone is on the same
                page. With real-time updates and drag-and-drop functionality,
                your team can work together effortlessly, no matter where they
                are.
              </p>

              <div className="flex items-center gap-1 mb-6 animate-cursor-float">
                <svg width="16" height="20" viewBox="0 0 18 22" fill="none">
                  <path
                    d="M1.5 1L6.5 19L9.5 12L17 10L1.5 1Z"
                    fill="#ff5c00"
                    stroke="#ff5c00"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs font-semibold text-white bg-[#ff5c00] px-3 py-1 rounded-full">
                  Timothy D.
                </span>
              </div>

              <a
                href="#"
                className="group inline-flex items-center self-start gap-2 bg-[#ff5c00] hover:bg-[#e55200] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,92,0,0.25)] hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] active:scale-95"
              >
                Get Started Now
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes cursor-float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(6px, -10px); }
          50% { transform: translate(-4px, -14px); }
          75% { transform: translate(8px, -6px); }
        }
        .animate-cursor-float {
          animation: cursor-float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Grauberg
