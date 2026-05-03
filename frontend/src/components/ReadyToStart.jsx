import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ReadyToStart() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }

  return (
    <section className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden">
      <div className="w-full px-4 sm:px-10 lg:px-20 mx-auto">
        <motion.div 
          {...fadeInUp}
          className="relative rounded-3xl border border-white/10 bg-[#111113] overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff5c00]/10 blur-[120px] -mr-64 -mt-64 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left — Image/Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:w-1/2 p-4 sm:p-8 lg:p-12 order-2 lg:order-1"
            >
              <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="/kanban.png"
                  alt="Kanban Board Mockup"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Right — Content */}
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 order-1 lg:order-2">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6"
              >
                Ready to transform your
                <br />
                <span className="font-serif italic text-[#ff5c00] font-normal">Project Management?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              >
                Join the growing community of digital agencies revolutionizing their workflows with our powerful, AI-driven tool. Experience the benefits firsthand with our free Starter plan. Upgrade anytime to access advanced features and premium support tailored to your team&apos;s needs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,92,0,0.25)] hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] active:scale-95"
                >
                  Get Started Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                  </svg>
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 active:scale-95"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ReadyToStart
