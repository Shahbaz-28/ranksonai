"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import type { Priority, WorkStatus } from "@/lib/mock/types"
import { cn } from "@/lib/utils"
import { Card, EffortBadge, EmptyState, PriorityBadge, formatNumber } from "./kit"
import { useDashboard } from "./dashboard-state"
import { StatusActions } from "./workflow"
import { workStatusStyles } from "./tokens"

export interface RecRow {
  id: string
  title: string
  category: string
  categoryLabel: string
  priority: Priority
  impact: number
  effort: "low" | "medium" | "high"
  owner: string
  problem: string
  expectedBenefit: string
  promptVolume: number
  promptCount: number
}

const statusFlow: WorkStatus[] = ["needs-approval", "in-progress", "verification", "pending", "completed"]

export default function RecommendationBoard({
  rows,
  categories,
}: {
  rows: RecRow[]
  categories: { id: string; label: string }[]
}) {
  const { statusOf } = useDashboard()
  const [category, setCategory] = useState("all")

  const visible = useMemo(() => (category === "all" ? rows : rows.filter((r) => r.category === category)), [rows, category])

  const grouped = useMemo(() => {
    const map = new Map<WorkStatus, RecRow[]>()
    for (const status of statusFlow) map.set(status, [])
    for (const row of visible) {
      const status = statusOf("recommendation", row.id)
      map.get(status)?.push(row)
    }
    for (const [, list] of map) list.sort((a, b) => b.impact - a.impact)
    return map
  }, [visible, statusOf])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-1.5">
        {[{ id: "all", label: "All categories" }, ...categories].map((option) => {
          const active = category === option.id
          const count = option.id === "all" ? rows.length : rows.filter((r) => r.category === option.id).length
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setCategory(option.id)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
                active
                  ? "border-transparent bg-[#37322F] text-white"
                  : "border-[rgba(55,50,47,0.14)] bg-white text-[#605A57] hover:text-[#37322F]",
              )}
            >
              {option.label}
              <span className={cn("tabular-nums", active ? "text-white/70" : "text-[rgba(73,66,61,0.45)]")}>{count}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            title="Nothing in this category"
            detail="No recommendation currently targets this area. New ones are proposed after each weekly analysis run."
          />
        </Card>
      ) : (
        statusFlow.map((status) => {
          const items = grouped.get(status) ?? []
          if (items.length === 0) return null
          const style = workStatusStyles[status]
          return (
            <section key={status} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.dot }} aria-hidden />
                <h3 className="text-[13px] font-semibold text-[#37322F]">{style.label}</h3>
                <span className="text-[12px] tabular-nums text-[rgba(73,66,61,0.55)]">{items.length}</span>
                {status === "needs-approval" && (
                  <span className="text-[12px] text-[rgba(73,66,61,0.62)]">— waiting on a decision from your team</span>
                )}
              </div>

              <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {items.map((row) => (
                  <Card as="li" key={row.id} className="flex flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={row.priority} />
                      <EffortBadge effort={row.effort} />
                      <span className="ml-auto text-[12px] font-semibold tabular-nums text-[#37322F]">
                        +{row.impact} pts
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/recommendations/${row.id}`}
                      className="mt-2.5 text-[14px] font-semibold leading-5 text-[#37322F] hover:underline"
                    >
                      {row.title}
                    </Link>

                    <p className="mt-2 text-[13px] leading-[21px] text-[#605A57]">{row.problem}</p>

                    <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-[rgba(55,50,47,0.06)] pt-3 text-[12px]">
                      <div>
                        <dt className="text-[rgba(73,66,61,0.55)]">Area</dt>
                        <dd className="font-medium text-[#37322F]">{row.categoryLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-[rgba(73,66,61,0.55)]">Owner</dt>
                        <dd className="font-medium text-[#37322F]">{row.owner}</dd>
                      </div>
                      <div>
                        <dt className="text-[rgba(73,66,61,0.55)]">Demand</dt>
                        <dd className="font-medium text-[#37322F]">
                          {row.promptVolume ? `${formatNumber(row.promptVolume)}/mo` : "—"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <StatusActions kind="recommendation" id={row.id} compact />
                      <Link
                        href={`/dashboard/recommendations/${row.id}`}
                        className="text-[12px] font-medium text-[#37322F] underline-offset-2 hover:underline"
                      >
                        Full detail →
                      </Link>
                    </div>
                  </Card>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}
