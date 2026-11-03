"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

import { business, onboardingStages } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { Card, Meter, NoteCallout } from "@/components/dashboard/kit"
import { useDashboard } from "@/components/dashboard/dashboard-state"

export default function AnalysisPage() {
  const { profile } = useDashboard()
  const [stageIndex, setStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const total = useMemo(() => onboardingStages.reduce((sum, stage) => sum + stage.durationMs, 0), [])
  const companyName = profile?.company || business.name
  const companyDomain = profile?.domain || business.domain

  useEffect(() => {
    let elapsed = 0
    onboardingStages.forEach((stage, index) => {
      elapsed += stage.durationMs
      const at = elapsed
      timers.current.push(
        setTimeout(() => {
          if (index === onboardingStages.length - 1) {
            setStageIndex(onboardingStages.length)
            setDone(true)
          } else {
            setStageIndex(index + 1)
          }
        }, at),
      )
    })

    const tick = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 100 / (total / 100)))
    }, 100)
    timers.current.push(tick as unknown as ReturnType<typeof setTimeout>)

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      clearInterval(tick)
    }
  }, [total])

  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-[640px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.55)]">
          Step 2 of 3 · Website analysis
        </div>
        <h1 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#37322F] sm:text-[32px]">
          {done ? `Analysis of ${companyDomain} complete` : `Analysing ${companyDomain}`}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[#605A57]">
          {done
            ? "We crawled the site, extracted your business information, mapped services, found your competitors and scored GEO readiness."
            : "This runs five passes over your site. In the real product it takes a few minutes; here it is simulated so you can watch the stages."}
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[13px] font-medium text-[#37322F]">
            {done ? "All stages complete" : `Stage ${Math.min(stageIndex + 1, onboardingStages.length)} of ${onboardingStages.length}`}
          </div>
          <div className="text-[12px] tabular-nums text-[rgba(73,66,61,0.62)]">{Math.round(progress)}%</div>
        </div>
        <div className="mt-2">
          <Meter value={done ? 100 : progress} />
        </div>

        <ol className="mt-6 flex flex-col gap-4">
          {onboardingStages.map((stage, index) => {
            const complete = done || index < stageIndex
            const active = !done && index === stageIndex
            return (
              <li
                key={stage.id}
                className={cn(
                  "flex gap-4 rounded-lg border p-4 transition-colors",
                  active
                    ? "border-[rgba(42,120,214,0.30)] bg-[rgba(42,120,214,0.04)]"
                    : complete
                      ? "border-[rgba(55,50,47,0.10)] bg-white"
                      : "border-[rgba(55,50,47,0.08)] bg-[#FBFAF9]",
                )}
              >
                <span
                  className={cn(
                    "mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    complete
                      ? "border-transparent bg-[rgba(12,163,12,0.14)] text-[#1f6b1f]"
                      : active
                        ? "border-transparent bg-[#2a78d6] text-white"
                        : "border-[rgba(55,50,47,0.18)] text-[rgba(73,66,61,0.45)]",
                  )}
                >
                  {complete ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#37322F]">{stage.label}</span>
                    {active && <span className="text-[11px] font-medium text-[#1d5ba6]">Running…</span>}
                    {complete && <span className="text-[11px] font-medium text-[#1f6b1f]">Done</span>}
                    {!active && !complete && <span className="text-[11px] text-[rgba(73,66,61,0.45)]">Queued</span>}
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-[#605A57]">{stage.detail}</p>
                  {complete && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {stage.findings.map((finding) => (
                        <li
                          key={finding}
                          className="rounded-full bg-[rgba(55,50,47,0.05)] px-2 py-[3px] text-[11px] font-medium text-[#49423D]"
                        >
                          {finding}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 border-t border-[rgba(55,50,47,0.08)] pt-5">
          {done ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-[13px] text-[#605A57]">
                {companyName} scored <span className="font-semibold text-[#37322F]">57 / 100</span> on GEO readiness.
              </div>
              <Link
                href="/onboarding/report"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#37322F] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520]"
              >
                See your initial GEO report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <NoteCallout tone="info" title="What happens next">
              When the passes finish you get an initial report: your business profile as the engines see it, your
              starting visibility across five engines, and the first set of blockers.
            </NoteCallout>
          )}
        </div>
      </Card>

      {!done && (
        <p className="text-[12px] text-[rgba(73,66,61,0.55)]">
          You can leave this page — in the real product the analysis continues and emails you when it is finished.
        </p>
      )}
    </div>
  )
}
