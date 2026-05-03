import { motion } from 'framer-motion'

function Features() {
  const features = [
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="14" r="5" fill="#ff5c00" />
          <circle cx="12" cy="26" r="4" fill="#ff5c00" />
          <circle cx="28" cy="26" r="4" fill="#ff5c00" />
          <path d="M20 19v3M16 24l-2 0M24 24l2 0" stroke="#ff5c00" strokeWidth="2" />
        </svg>
      ),
      title: 'Seamless Collaboration',
      desc: 'Our platform enables real-time collaboration, ensuring that your team stays connected and coordinated, no matter where they are.',
    },
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="10" fill="#ff5c00" />
          <circle cx="20" cy="20" r="4" fill="#0b0b0b" />
          <rect x="18" y="8" width="4" height="4" rx="2" fill="#0b0b0b" />
        </svg>
      ),
      title: 'Customizable Workflows',
      desc: 'Tailor the canvas board to fit your unique project needs. Customize task categories, set priorities, and create templates that streamline your processes.',
    },
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <path d="M20 8a12 12 0 0 1 0 24" stroke="#ff5c00" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 8a12 12 0 0 0 0 24" stroke="#ff5c00" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        </svg>
      ),
      title: 'Advanced Analytics',
      desc: 'Gain insights with our robust analytics dashboard. Track key metrics, monitor progress, and make data-driven decisions to enhance project outcomes.',
    },
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="12" fill="#ff5c00" />
          <path d="M16 20l4-8 4 8" stroke="#0b0b0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="24" x2="24" y2="24" stroke="#0b0b0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Time Tracking',
      desc: 'Keep track of time spent on tasks to improve efficiency and optimize resource allocation, ensuring every project stays on schedule and within budget.',
    },
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="#ff5c00" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 14a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" fill="#ff5c00" />
          <path d="M18 16l4 4-4 4" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Automated Notifications',
      desc: 'Stay on top of deadlines with automated reminders and notifications, reducing the risk of missed tasks and ensuring timely project completion.',
    },
    {
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="10" width="8" height="20" rx="2" fill="#ff5c00" />
          <rect x="20" y="16" width="8" height="14" rx="2" fill="#ff5c00" />
          <rect x="32" y="8" width="4" height="6" rx="1" fill="#ff5c00" opacity="0.5" />
        </svg>
      ),
      title: 'Visual Task Management',
      desc: "Easily visualize your project's progress with our intuitive interface. Drag-and-drop functionality and clear task assignments enhance clarity and efficiency.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  }

  return (
    <section className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="w-full px-4 sm:px-10 lg:px-20 mx-auto text-center mb-20"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
          <span className="text-sm text-gray-300">See what&apos;s new in Grauberg</span>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
          Unleash the full potential
          <br />
          of <span className="font-serif italic text-[#ff5c00] font-normal">Your Projects</span>
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Discover the powerful features that make our project management tool indispensable for digital agencies.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="w-full px-4 sm:px-10 lg:px-20 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={itemVariants} className="group">
            <div className="mb-5 transition-transform duration-300 group-hover:scale-110">{f.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Features
