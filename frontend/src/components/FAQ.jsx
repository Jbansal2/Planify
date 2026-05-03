import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqData = [
  {
    question: 'What is included in the free Starter plan?',
    answer: 'The Starter plan includes unlimited projects, basic task management, real-time collaboration, and access to our community support. It’s perfect for individuals and small teams getting started with project management.',
  },
  {
    question: 'Can I upgrade my plan at any time?',
    answer: 'Yes, you can upgrade your plan at any time to access more advanced features and support. Simply go to your account settings and choose the plan that best fits your needs.',
  },
  {
    question: 'How does the free trial for the Teams plan work?',
    answer: 'When you sign up for the Teams plan, you get a 14-day free trial with access to all the features included in the plan. You can decide to continue with the Teams plan, upgrade to the Business plan, or revert to the Starter plan after the trial period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. Payments are processed securely through our payment gateway.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. Our platform uses advanced security measures, including encryption and regular security audits, to ensure your data is protected at all times.',
  },
  {
    question: 'Do you offer support if I need help?',
    answer: 'Absolutely! The Starter plan includes community support, while the Teams and Business plans offer priority support. Business plan users also have access to a dedicated account manager for personalized assistance.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your account will remain active until the end of the current billing period.',
  },
  {
    question: 'What integrations do you offer?',
    answer: 'Our platform integrates seamlessly with a variety of tools and platforms, including Slack, Google Drive, Dropbox, and many more. The Business plan includes full access to all integrations.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <section className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff5c00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full px-4 sm:px-10 lg:px-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Header Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
            }}
            className="lg:col-span-5"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
              Frequently
              <br />
              <span className="text-[#ff5c00]">Asked Question</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Find answers to the most common questions about Planify. Can&apos;t find what you&apos;re looking for? Reach out to our support team.
            </p>
          </motion.div>

          {/* Accordion Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="divide-y divide-white/10 border-t border-white/10"
            >
              {faqData.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp} className="py-6">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${openIndex === index ? 'text-[#ff5c00]' : 'text-white hover:text-[#ff5c00]'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[#ff5c00] border-[#ff5c00] rotate-45' : 'bg-white/5 group-hover:border-white/30'}`}>
                      <svg
                        className={`w-4 h-4 transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-gray-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 text-base leading-relaxed pr-10 mt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
