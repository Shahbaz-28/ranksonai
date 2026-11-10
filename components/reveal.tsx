"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Fades and lifts children into view once. Starts visible and only hides
 * itself after mount, so the content is present for crawlers, for JS-off
 * readers, and for anyone who asked for reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const el = ref.current
    if (!el) return

    setArmed(true)
    setShown(false)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={
        armed
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translateY(14px)",
              transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
              willChange: shown ? undefined : "opacity, transform",
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
