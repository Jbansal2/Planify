function DelawareLogo() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#0a0a0a" fontWeight="bold">D</text>
      </svg>
      <span className="text-xl font-semibold tracking-tight">delaware</span>
    </div>
  )
}

function ManilaLogo() {
  return (
    <span className="text-2xl font-bold text-white/50 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      Manila.
    </span>
  )
}

function GreenishLogo() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 4C7 7 7 13 10 16C13 13 13 7 10 4Z" fill="#0a0a0a" />
      </svg>
      <span className="text-xl font-semibold tracking-tight">Greenish</span>
    </div>
  )
}

function VisionLogo() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="9" />
        <circle cx="10" cy="10" r="4" fill="#0a0a0a" />
      </svg>
      <span className="text-xl font-semibold tracking-tight">vision</span>
    </div>
  )
}

function ColoradoLogo() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L2 20h20L12 3zm0 4l6 11H6l6-11z" />
      </svg>
      <span className="text-xl font-semibold tracking-tight">Colorado</span>
    </div>
  )
}

function HamiltonLogo() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 0L12.5 7.5H20L14 12L16 20L10 15L4 20L6 12L0 7.5H7.5L10 0Z" />
      </svg>
      <span className="text-xl font-semibold tracking-tight">Hamilton</span>
    </div>
  )
}

const logos = [
  DelawareLogo,
  ManilaLogo,
  GreenishLogo,
  VisionLogo,
  ColoradoLogo,
  HamiltonLogo,
]

const ITEM_GAP = 80

function LogoSet() {
  return (
    <>
      {logos.map((Logo, i) => (
        <div key={i} className="shrink-0">
          <Logo />
        </div>
      ))}
    </>
  )
}

function TrustedBy() {
  return (
    <section className="relative bg-transparent py-20 overflow-hidden">
      <p className="text-center text-sm text-gray-500 font-medium tracking-wide mb-12">
        Trusted by Leading Digital Agencies
      </p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0b0b0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0b0b0b] to-transparent z-10 pointer-events-none" />

        { }
        <div
          className="flex items-center w-max"
          style={{
            gap: `${ITEM_GAP}px`,
            animation: 'marquee 25s linear infinite',
            willChange: 'transform',
          }}
        >
          <LogoSet />
          <LogoSet />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default TrustedBy