import { useState } from 'react'

const plans = [
  {
    name: 'STARTER',
    price: 'Free',
    period: '',
    desc: 'Perfect for individuals and small teams getting started.',
    features: ['Unlimited Projects', 'Basic Task Management', 'Real-Time Collaboration', 'Community Support'],
    featured: false,
  },
  {
    name: 'TEAMS',
    price: '$45',
    cents: '.00',
    period: 'Per user / Yearly',
    desc: 'Ideal for growing teams that need more advanced features and support.',
    features: ['Everything in Starter Plan, Plus', 'Advanced Analytics', 'Customizable Workflows', 'Automated Notifications', 'Priority Support'],
    featured: true,
  },
  {
    name: 'BUSINESS',
    price: '$90',
    cents: '.00',
    period: 'Per user / Yearly',
    desc: 'Designed for large agencies that require comprehensive tools and premium support.',
    features: ['Everything in Teams Plan, plus', 'Dedicated Account Manager', 'Third Party Integrations', 'Enhanced Security', 'Unlimited Users'],
    featured: false,
  },
]

function CheckIcon({ featured }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${featured ? 'text-[#ff5c00]' : 'text-[#ff5c00]/60'}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

function Pricing() {
  return (
    <section className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
          Choose the perfect
          <br />
          plan for <span className="font-serif italic text-[#ff5c00] font-normal">Your Agency</span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Flexible pricing options to meet the needs of every team, from startups to large agencies.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
              plan.featured
                ? 'border-[#ff5c00]/40 bg-gradient-to-b from-[#ff5c00]/5 to-[#111113] shadow-[0_0_40px_-10px_rgba(255,92,0,0.15)]'
                : 'border-white/10 bg-[#111113]'
            }`}
          >
            <p className={`text-xs font-bold tracking-widest mb-6 ${plan.featured ? 'text-[#ff5c00]' : 'text-gray-400'}`}>
              {plan.name}
            </p>

            {plan.price === 'Free' ? (
              <p className="text-5xl font-bold text-white mb-2">Free</p>
            ) : (
              <p className="text-white mb-2 flex items-start">
                <span className="text-lg mt-2 mr-0.5">$</span>
                <span className="text-5xl font-bold">{plan.price.replace('$', '')}</span>
                <span className="text-lg mt-2">{plan.cents}</span>
              </p>
            )}

            {plan.period && <p className="text-gray-500 text-sm mb-4">{plan.period}</p>}

            <p className="text-gray-400 text-sm leading-relaxed mb-8">{plan.desc}</p>

            <div className="space-y-4 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-center gap-3">
                  <CheckIcon featured={plan.featured} />
                  <span className="text-white text-sm">{f}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                plan.featured
                  ? 'bg-[#ff5c00] text-white hover:bg-[#e55200] shadow-[0_0_20px_rgba(255,92,0,0.25)]'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Start Your Free Trial
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pricing
