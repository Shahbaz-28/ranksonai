"use client"

import { useEffect, useReducer, useRef, useState } from "react"

import { series, status } from "@/components/dashboard/tokens"

/**
 * The hook: an AI answer writing itself, naming three competitors, citing four
 * sources — and never mentioning you. It is the product's whole premise shown
 * rather than claimed.
 *
 * Honours prefers-reduced-motion by rendering the finished state immediately.
 */

type Seg = { t: string; brand?: boolean }

const PROMPT = "best accounts payable automation software for mid-market companies"

const ANSWER: Seg[] = [
  { t: "For mid-market AP automation, the platforms most often recommended are " },
  { t: "Payline Ops", brand: true },
  { t: ", " },
  { t: "Nexora Pay", brand: true },
  { t: " and " },
  { t: "Settlewise", brand: true },
  { t: " — each publishes transparent per-invoice pricing and documented ERP integrations. Vendors that quote only on request could not be ranked here." },
]

const SOURCES = ["g2.com", "capterra.com", "paylineops.com", "cfodive.com"]

const TOTAL = ANSWER.reduce((n, s) => n + s.t.length, 0)

/** ms per character — fast enough to feel generated, slow enough to read. */
const SPEED = 13

export default function HeroAnswerStream() {
  const [reduced, setReduced] = useState(false)
  const [chars, setChars] = useState(0)
  const [cites, setCites] = useState(0)
  const [phase, setPhase] = useState<"thinking" | "writing" | "citing" | "done">("thinking")
  const [, restart] = useReducer((n: number) => n + 1, 0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      setReduced(true)
      setChars(TOTAL)
      setCites(SOURCES.length)
      setPhase("done")
      return
    }

    const after = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms))
    }

    setChars(0)
    setCites(0)
    setPhase("thinking")

    after(900, () => setPhase("writing"))

    let i = 0
    const typing = setInterval(() => {
      i += 2
      if (i >= TOTAL) {
        clearInterval(typing)
        setChars(TOTAL)
        setPhase("citing")
        SOURCES.forEach((_, n) => after(260 * (n + 1), () => setCites(n + 1)))
        after(260 * SOURCES.length + 420, () => setPhase("done"))
        after(260 * SOURCES.length + 4200, () => restart())
        return
      }
      setChars(i)
    }, SPEED)
    timers.current.push(typing as unknown as ReturnType<typeof setTimeout>)

    const started = timers.current
    return () => {
      clearInterval(typing)
      started.forEach(clearTimeout)
      timers.current = []
    }
    // restart() bumps the reducer, which re-runs the whole sequence
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart])

  // Slice the segment list to the revealed character count.
  let left = chars
  const shown = ANSWER.map((s) => {
    if (left <= 0) return { ...s, t: "" }
    const t = s.t.slice(0, left)
    left -= s.t.length
    return { ...s, t }
  })

  const writing = phase === "writing"

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[rgba(55,50,47,0.12)] bg-white shadow-[0px_28px_70px_-30px_rgba(55,50,47,0.40),0px_2px_8px_rgba(55,50,47,0.06)]">
      {/* Engine bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(55,50,47,0.09)] bg-[#FCFBFA] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.s1 }} />
          <span className="text-[12.5px] font-semibold text-[#37322F]">ChatGPT</span>
          <span className="text-[12px] text-[rgba(73,66,61,0.5)]">· live answer</span>
        </div>
        <span className="text-[11.5px] tabular-nums text-[rgba(73,66,61,0.45)]">
          {phase === "thinking" ? "searching the web…" : "2 Nov 2026"}
        </span>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* Prompt */}
        <div className="flex items-start gap-2.5">
          <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(55,50,47,0.07)] text-[10px] font-semibold text-[#605A57]">
            Q
          </span>
          <p className="text-[14px] font-medium leading-6 text-[#37322F] sm:text-[15px]">{PROMPT}</p>
        </div>

        {/* Answer */}
        <div className="mt-4 min-h-[120px] sm:min-h-[104px]">
          {phase === "thinking" ? (
            <div className="flex flex-col gap-2 pt-1">
              {[100, 92, 64].map((w, i) => (
                <span
                  key={w}
                  className="block h-3 animate-pulse rounded bg-[rgba(55,50,47,0.07)]"
                  style={{ width: `${w}%`, animationDelay: `${i * 140}ms` }}
                />
              ))}
            </div>
          ) : (
            <p className="text-[14px] leading-[26px] text-[#49423D] sm:text-[15px]">
              {shown.map((s, i) =>
                s.brand ? (
                  <mark key={i} className="rounded bg-[rgba(235,104,52,0.16)] px-0.5 font-medium text-[#37322F]">
                    {s.t}
                  </mark>
                ) : (
                  <span key={i}>{s.t}</span>
                ),
              )}
              {writing && (
                <span
                  className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] bg-[#37322F]"
                  style={{ animation: "visilm-caret 1s steps(2) infinite" }}
                />
              )}
            </p>
          )}
        </div>

        {/* Citations */}
        <div className="mt-4 flex min-h-[30px] flex-wrap items-center gap-1.5">
          {cites > 0 && (
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.45)]">
              Cited
            </span>
          )}
          {SOURCES.slice(0, cites).map((s) => (
            <span
              key={s}
              className="rounded-full border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-2.5 py-[3px] text-[11.5px] font-medium text-[#49423D]"
              style={{ animation: reduced ? undefined : "visilm-pop 280ms ease-out both" }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Verdict */}
        <div
          className="mt-3 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-opacity duration-500"
          style={{
            borderColor: "rgba(208,59,59,0.22)",
            backgroundColor: "rgba(208,59,59,0.05)",
            opacity: phase === "done" ? 1 : 0,
          }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: status.critical }} />
          <span className="text-[13px] leading-5 text-[#49423D]">
            <strong className="font-semibold text-[#37322F]">Harborflow was not mentioned.</strong> Three competitors
            were, and four sources were cited — none of them yours.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes visilm-caret { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes visilm-pop { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes visilm-caret { 0%,100% { opacity: 1 } }
          @keyframes visilm-pop { from { opacity: 1 } to { opacity: 1 } }
        }
      `}</style>
    </div>
  )
}
