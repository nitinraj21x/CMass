import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300 }
  const trailSpringConfig = { damping: 35, stiffness: 150 }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)
  const trailSpringX = useSpring(trailX, trailSpringConfig)
  const trailSpringY = useSpring(trailY, trailSpringConfig)

  const isHoveringRef = useRef(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'hover'
      ) {
        isHoveringRef.current = true
        dotRef.current?.classList.add('scale-0')
        ringRef.current?.classList.add('scale-150', 'border-accent')
      }
    }

    const handleMouseOut = () => {
      isHoveringRef.current = false
      dotRef.current?.classList.remove('scale-0')
      ringRef.current?.classList.remove('scale-150', 'border-accent')
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY, trailX, trailY])

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] transition-transform duration-150"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Ring */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-accent/50 rounded-full pointer-events-none z-[9998] transition-all duration-300"
        style={{
          x: trailSpringX,
          y: trailSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}
