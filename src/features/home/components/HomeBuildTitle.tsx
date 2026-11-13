import { useEffect, useRef, useState, type CSSProperties } from 'react'
import characterAsset from '@/assets/builder/character.svg'
import keyboardAsset from '@/assets/builder/keyboard.svg'
import raisedKeyboardAsset from '@/assets/builder/keyboard-raised.svg'
import impactKeyboardAsset from '@/assets/builder/keyboard-impact.svg'
import recoverKeyboardAsset from '@/assets/builder/keyboard-recover.svg'
import cursorAsset from '@/assets/builder/click-cursor.svg'
import popAsset from '@/assets/builder/click-pop.svg'
import './home-build-title.css'

const chips = [
  [-38, -42, -100], [-12, -62, 140], [22, -46, -160],
  [-45, -8, 110], [4, -26, -80], [44, -10, 150],
  [-28, 20, -140], [10, 30, 100], [40, 24, -120],
]

function PixelBuilder() {
  return (
    <svg viewBox="0 0 48 48" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      <g className="builder-body">
        <image href={characterAsset} width="48" height="48" />
        {/* Shared padding keeps the overhead keyboard pose fully visible. */}
        <g className="builder-tool">
          <image className="tool-pose tool-idle" href={keyboardAsset} x="-16" y="-16" width="80" height="80" />
          <image className="tool-pose tool-raised" href={raisedKeyboardAsset} x="-16" y="-16" width="80" height="80" />
          <image className="tool-pose tool-impact" href={impactKeyboardAsset} x="-16" y="-16" width="80" height="80" />
          <image className="tool-pose tool-recover" href={recoverKeyboardAsset} x="-16" y="-16" width="80" height="80" />
        </g>
      </g>
    </svg>
  )
}

export default function HomeBuildTitle() {
  const [hasInteracted, setHasInteracted] = useState(false)
  const [brokenCount, setBrokenCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState(3)
  const [swinging, setSwinging] = useState(false)
  const [moving, setMoving] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)
  const busy = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const strike = () => {
    if (busy.current) return
    busy.current = true
    setHasInteracted(true)
    timers.current.forEach(clearTimeout)
    timers.current = []
    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(setTimeout(callback, delay))
    }
    const lastDot = activeIndex === 0
    setSwinging(true)

    // Shatter the current dot at the keyboard's contact frame, then walk left.
    schedule(() => setBrokenCount((value) => value + 1), 380)
    schedule(() => {
      setSwinging(false)
      if (!lastDot) {
        setMoving(true)
        setActiveIndex((value) => value - 1)
      }
    }, 700)

    if (lastDot) {
      schedule(() => setRebuilding(true), 1450)
      schedule(() => {
        setBrokenCount(0)
        setRebuilding(false)
        setMoving(true)
        setActiveIndex(3)
      }, 2250)
      schedule(() => {
        setMoving(false)
        busy.current = false
      }, 2670)
    } else {
      schedule(() => {
        setMoving(false)
        busy.current = false
      }, 1120)
    }
  }

  const busyState = swinging || moving || rebuilding || brokenCount === 4
  const status = rebuilding
    ? 'Rebuilding all four dots.'
    : brokenCount === 4
      ? 'All four dots cleared. Rebuilding shortly.'
      : brokenCount === 0 ? '' : `${brokenCount} of 4 dots cleared, from right to left.`

  return (
    <div className={`home-build-title${moving ? ' is-moving' : ''}`}>
      <h1 className="home-wordmark" aria-label="build . . . .">
        build<span className={`build-dots${rebuilding ? ' is-rebuilding' : ''}${swinging ? ' is-swinging' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const broken = index >= 4 - brokenCount
            return (
              <span key={index} className={`build-target${broken ? ' is-broken' : ''}`} aria-hidden="true">
                <span className="build-dot">.</span>
                {broken && (
                  <span className="build-chips is-shattered">
                    {chips.map(([x, y, rotation], chipIndex) => (
                      <i key={chipIndex} style={{ '--chip-x': `${x}px`, '--chip-y': `${y}px`, '--chip-rotation': `${rotation}deg`, '--chip-delay': `${chipIndex * 28}ms` } as CSSProperties} />
                    ))}
                  </span>
                )}
              </span>
            )
          })}
          <button
            type="button"
            className="build-worker"
            style={{ '--worker-column': activeIndex } as CSSProperties}
            onClick={strike}
            disabled={busyState}
            aria-label={`Smash dot ${activeIndex + 1} with the keyboard. Clear the dots from right to left.`}
          >
            <PixelBuilder />
            {!hasInteracted && (
              <span className="builder-click-hint" aria-hidden="true">
                <img className="builder-click-pop" src={popAsset} width="48" height="28" alt="" draggable={false} />
                <img className="builder-click-cursor" src={cursorAsset} width="20" height="24" alt="" draggable={false} />
              </span>
            )}
          </button>
        </span>
      </h1>
      <p className="home-sr-only" role="status">{status}</p>
    </div>
  )
}
