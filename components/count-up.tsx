"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Counts to `value` once, the first time it scrolls into view. Renders the
 * final value immediately for reduced motion, for zero, and before mount, so
 * the number is never wrong — only, sometimes, animated.
 */
export default function CountUp({
  value,
  suffix = "",
  duration = 1100,
  className,
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (value === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const el = ref.current
    if (!el) return

    setShown(0)
    let raf = 0

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          // easeOutCubic — fast out of the gate, settles on the number
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(Math.round(value * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
      {suffix}
    </span>
  )
}
