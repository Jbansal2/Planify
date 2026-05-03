import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    quote:
      'Planify has completely transformed how our agency manages projects. The intuitive canvas board and real-time updates have boosted our productivity significantly.',
    name: 'Sarah Johnson',
    position: 'CEO, CreativeFlow Agency',
  },
  {
    quote:
      'The customizable workflows and automated notifications have made it incredibly easy to stay on top of our deadlines. Our team collaboration has never been better.',
    name: 'Michael Chen',
    position: 'Project Manager, PixelCraft',
  },
  {
    quote:
      'Since adopting Planify, we have seen a remarkable improvement in project delivery times. The analytics dashboard provides invaluable insights for decision-making.',
    name: 'Emily Rodriguez',
    position: 'COO, DigitalPulse Studio',
  },
]

function Stars() {
  return (
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-[#ff5c00]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Testimonials() {
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(1)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function handleScroll() {
      const scrollLeft = el.scrollLeft
      const cardWidth = el.firstElementChild?.offsetWidth || 400
      const gap = 32
      const idx = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIdx(Math.min(idx, testimonials.length - 1))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    // scroll to center card initially
    setTimeout(() => {
      const cardWidth = el.firstElementChild?.offsetWidth || 400
      el.scrollTo({ left: cardWidth + 32, behavior: 'instant' })
    }, 100)

    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative bg-[#0b0b0b] py-24 overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 px-6">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
          <span className="text-sm text-gray-300">See what&apos;s new in Grauberg</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
          What <span className="font-serif italic text-[#ff5c00] font-normal">Our Clients</span> Are Saying
        </h2>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Our clients have experienced remarkable improvements in their project management and overall productivity.
        </p>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-[calc(50%-220px)] pb-4 no-scrollbar"
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[440px] snap-center rounded-2xl border p-8 transition-all duration-500 ${activeIdx === i
                ? 'border-[#ff5c00]/30 bg-gradient-to-b from-[#ff5c00]/8 to-[#111113] scale-100 opacity-100'
                : 'border-white/5 bg-[#111113] scale-95 opacity-50'
              }`}
          >
            <Stars />
            <p className="text-white text-base leading-relaxed mb-8">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="text-white font-bold text-sm">{t.name}</p>
            <p className="text-gray-500 text-sm">{t.position}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = scrollRef.current
              if (!el) return
              const cardWidth = el.firstElementChild?.offsetWidth || 400
              el.scrollTo({ left: i * (cardWidth + 32), behavior: 'smooth' })
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIdx === i ? 'bg-[#ff5c00] w-6' : 'bg-white/20'
              }`}
          />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default Testimonials
