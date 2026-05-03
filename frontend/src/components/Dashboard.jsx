import { useEffect, useRef, useState } from 'react'

function Dashboard() {
    const dashboardRef = useRef(null)
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        function handleScroll() {
            if (!dashboardRef.current) return
            const rect = dashboardRef.current.getBoundingClientRect()
            const windowH = window.innerHeight

            const raw = 1 - rect.top / windowH
            const clamped = Math.min(Math.max(raw, 0), 1)
            setScrollProgress(clamped)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const rotateX = 20 * (1 - scrollProgress)       // 20° → 0°
    const scale = 0.85 + 0.15 * scrollProgress       // 0.85 → 1
    const opacity = 0.4 + 0.6 * scrollProgress       // 0.4 → 1
    const translateY = 60 * (1 - scrollProgress)     // 60px → 0

    return (
        <div
            ref={dashboardRef}
            className="relative z-10 max-w-6xl mx-auto px-6 pb-20"
            style={{ perspective: '1200px' }}
        >
            <div
                className="relative rounded-2xl overflow-hidden border border-white/10 will-change-transform"
                style={{
                    transform: `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
                    opacity: opacity,
                    transformOrigin: 'center bottom',
                    boxShadow: `0 ${20 + 20 * scrollProgress}px ${60 + 40 * scrollProgress}px -20px rgba(255, 92, 0, ${0.08 + 0.12 * scrollProgress})`,
                    transition: 'box-shadow 0.3s ease-out',
                }}
            >
                <img
                    src="/dashboard.png"
                    alt="Planify Dashboard"
                    className="w-full h-auto block"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0b0b] to-transparent pointer-events-none" />
            </div>
        </div>
    )
}

export default Dashboard