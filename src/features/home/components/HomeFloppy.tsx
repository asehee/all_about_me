import { useState } from 'react'
import type { PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import './home-floppy.css'

export default function HomeFloppy() {
  const [isOpen, setIsOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 20 })
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 20 })

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    tiltX.set(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 14)
    tiltY.set((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14)
  }

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <div className="home-floppy-scene">
      <div className="home-floppy-float">
        <motion.button
          type="button"
          className="home-floppy"
          aria-label="플로피 디스크 셔터 열기"
          aria-pressed={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onBlur={resetTilt}
          style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY, rotateZ: -8 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        >
          <span className="home-floppy-body" aria-hidden="true">
            <span className="home-floppy-seam" />
            <span className="home-floppy-track"><span className="home-floppy-window" /></span>
            <span className={`home-floppy-shutter${isOpen ? ' is-open' : ''}`}><span className="home-floppy-shutter-window" /></span>
            <span className="home-floppy-label">
              <span className="home-floppy-label-title">U+003F.zip</span>
              <span className="home-floppy-label-rule" />
            </span>
            <span className="home-floppy-lock"><span /></span>
            <span className="home-floppy-notch" />
            <span className="home-floppy-ridge home-floppy-ridge-left" />
            <span className="home-floppy-ridge home-floppy-ridge-right" />
          </span>
        </motion.button>
      </div>
      <span className="home-floppy-shadow" aria-hidden="true" />
    </div>
  )
}
