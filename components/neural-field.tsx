"use client"

import { useEffect, useRef } from "react"

/**
 * A slow drifting node field — the "engines reading each other" texture behind
 * the hero. Canvas rather than DOM so it stays cheap: one paint per frame, no
 * layout, and it idles entirely when scrolled out of view.
 *
 * Decorative only. Renders a single static frame when reduced motion is asked
 * for, and is hidden from assistive tech.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string | null }

/** Accent slots reused from the dashboard palette, kept sparse. */
const ACCENTS = ["#2a78d6", "#1baf7a", "#eb6834", "#eda100", "#e87ba4"]

const LINK_DIST = 132

const TONES = {
  light: { rgb: "55,50,47", link: 0.17, dot: 0.26 },
  dark: { rgb: "247,245,243", link: 0.2, dot: 0.34 },
} as const

export default function NeuralField({
  className,
  tone = "light",
  mask = "radial-gradient(68% 62% at 50% 38%, #000 0%, #000 44%, transparent 82%)",
}: {
  className?: string
  tone?: keyof typeof TONES
  mask?: string
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const palette = TONES[tone]

    let w = 0
    let h = 0
    let dpr = 1
    let nodes: Node[] = []
    let raf = 0
    let visible = true

    function seed() {
      // Density scales with area, capped so phones stay light.
      const count = Math.min(58, Math.max(16, Math.round((w * h) / 17000)))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 1,
        c: i % 9 === 0 ? ACCENTS[(i / 9) % ACCENTS.length | 0] : null,
      }))
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)

      // Links first, so nodes sit on top of them.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue

          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * palette.link
          ctx!.strokeStyle = `rgba(${palette.rgb},${alpha.toFixed(3)})`
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }
      }

      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fillStyle = n.c ? `${n.c}aa` : `rgba(${palette.rgb},${palette.dot})`
        ctx!.fill()
      }
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    resize()

    if (reduced) {
      draw()
    } else {
      raf = requestAnimationFrame(step)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)

    // Idle while off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        if (next === visible) return
        visible = next
        if (reduced) return
        if (visible) {
          raf = requestAnimationFrame(step)
        } else {
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [tone])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      // Fade the field out toward the edges so it never fights the copy.
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  )
}
