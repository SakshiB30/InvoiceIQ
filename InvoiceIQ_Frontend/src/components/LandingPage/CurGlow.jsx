import { useEffect, useRef } from 'react'

// Soft light that trails the cursor. Skipped on touch screens and for reduced motion.
function CurGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const skip =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) return undefined

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 3 }
    const target = { ...pos }
    let frame

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.1
      pos.y += (target.y - pos.y) * 0.1
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="iq-cursor" />
}

export default CurGlow