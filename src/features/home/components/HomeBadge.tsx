import { useEffect, useRef } from 'react'
import { Asterisk } from 'lucide-react'

export default function HomeBadge() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const cordRef = useRef<SVGPathElement>(null)
  const velocityRef = useRef(-0.04)
  const pointerXRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const scene = sceneRef.current
    const badge = badgeRef.current
    const cord = cordRef.current
    if (!scene || !badge || !cord) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 270
    let length = 170
    let angle = 0.09
    let cardAngle = 0.06
    let cardVelocity = 0
    let elapsed = 0
    let previousTime = 0
    let frame = 0
    let inView = true

    const draw = () => {
      const x = Math.sin(angle) * length
      const y = Math.cos(angle) * length
      const anchor = width / 2
      // The card rotates around its slot; the curve ends at that same pivot.
      cord.setAttribute('d', `M ${anchor} -12 C ${anchor + x * 0.12} ${y * 0.34}, ${anchor + x * 0.72 - Math.sin(cardAngle - angle) * 22} ${y * 0.74}, ${anchor + x} ${y}`)
      badge.style.transform = `translate3d(${x}px, ${y - 13}px, 0) rotate(${cardAngle}rad) scale(var(--badge-scale))`
    }

    const measure = () => {
      width = scene.clientWidth
      const scale = Number.parseFloat(getComputedStyle(scene).getPropertyValue('--badge-scale')) || 1
      length = Math.max(100, scene.clientHeight - (337 - 13) * scale)
      draw()
    }

    const tick = (time: number) => {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.032) : 0
      previousTime = time
      elapsed += dt
      // Damped pendulum with a quiet, irregular breeze rather than a looping tween.
      const breeze = 0.35 * Math.sin(elapsed * 1.05) + 0.1 * Math.sin(elapsed * 1.73)
      velocityRef.current += (-7 * angle - 0.85 * velocityRef.current + breeze) * dt
      angle += velocityRef.current * dt
      const target = angle * 1.25 + velocityRef.current * 0.18
      cardVelocity += (12 * (target - cardAngle) - 2.4 * cardVelocity) * dt
      cardAngle += cardVelocity * dt
      draw()
      frame = requestAnimationFrame(tick)
    }

    const syncAnimation = () => {
      cancelAnimationFrame(frame)
      previousTime = 0
      reducedMotionRef.current = motionPreference.matches
      if (motionPreference.matches) {
        angle = 0
        cardAngle = 0.04
        velocityRef.current = 0
        cardVelocity = 0
        draw()
      } else if (inView && !document.hidden) {
        frame = requestAnimationFrame(tick)
      }
    }

    const resizeObserver = new ResizeObserver(measure)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncAnimation()
    })
    measure()
    resizeObserver.observe(scene)
    intersectionObserver.observe(scene)
    motionPreference.addEventListener('change', syncAnimation)
    document.addEventListener('visibilitychange', syncAnimation)
    syncAnimation()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motionPreference.removeEventListener('change', syncAnimation)
      document.removeEventListener('visibilitychange', syncAnimation)
    }
  }, [])

  return (
    <div ref={sceneRef} className="home-badge-scene" aria-label="hee, software engineer">
      <svg className="home-lanyard" aria-hidden="true" width="100%" height="100%">
        <path ref={cordRef} fill="none" stroke="#91899b" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div
        ref={badgeRef}
        className="home-badge"
        onPointerEnter={(event) => {
          pointerXRef.current = event.clientX
        }}
        onPointerMove={(event) => {
          if (reducedMotionRef.current) return
          if (pointerXRef.current !== null) {
            const nudge = Math.max(-0.025, Math.min(0.025, (event.clientX - pointerXRef.current) * 0.002))
            velocityRef.current = Math.max(-0.55, Math.min(0.55, velocityRef.current + nudge))
          }
          pointerXRef.current = event.clientX
        }}
        onPointerLeave={() => { pointerXRef.current = null }}
        onPointerDown={() => {
          if (!reducedMotionRef.current) velocityRef.current += 0.18
        }}
      >
        <div className="home-badge-slot" aria-hidden="true" />
        <div className="home-badge-clip" aria-hidden="true" />
        <div className="home-badge-paper">
          <div className="home-badge-top"><Asterisk size={20} aria-hidden="true" /></div>
          <div className="home-badge-art" aria-hidden="true">
            <span className="home-badge-emoji">👨‍💻</span>
          </div>
          <p className="home-badge-name">hee.</p>
          <p className="home-badge-job">Software engineer</p>
          <div className="home-badge-bottom"><span className="home-barcode" aria-hidden="true" /></div>
        </div>
      </div>
    </div>
  )
}
