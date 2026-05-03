const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Docs'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy', 'Terms', 'License'],
}

const socialIcons = [
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

function Footer() {
  return (
    <footer className="relative bg-[#0b0b0b] border-t border-white/10 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ff5c00]/5 blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-10 lg:px-20 mx-auto py-24 relative">
        {/* CTA Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-24 pb-20 border-b border-white/5">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to <span className="font-serif italic text-[#ff5c00] font-normal">Supercharge</span> your work?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              Join 10,000+ teams using Planify to build faster and better.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="bg-[#ff5c00] hover:bg-[#e55200] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,92,0,0.25)] hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] active:scale-95 text-center"
            >
              Get Started Now
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 active:scale-95 text-center"
            >
              Book a Demo
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-16 mb-20">
          {/* Brand Info */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <span className="text-[#ff5c00] text-3xl">✳</span>
              <span className="tracking-tight">Planify</span>
            </a>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-8">
              The next generation project management tool designed for high-performance teams. Build, track, and ship with ease.
            </p>
            <div className="flex items-center gap-5">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#ff5c00] hover:border-[#ff5c00] transition-all duration-300 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-white mb-6 tracking-wider uppercase">
                {heading}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] text-gray-400 hover:text-[#ff5c00] transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[1px] bg-[#ff5c00] mr-0 group-hover:mr-2 transition-all duration-200"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Planify. All rights reserved. Made with ❤️ for teams.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
