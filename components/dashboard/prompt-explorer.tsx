"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import type { FunnelStage, Priority } from "@/lib/mock/types"
import { cn } from "@/lib/utils"
import { EmptyState, PriorityBadge, TableWrap, Td, Th, formatNumber } from "./kit"

export interface PromptRow {
  id: string
  question: string
  stage: FunnelStage
  stageLabel: string
  intent: string
  priority: Priority
  monthlyVolume: number
  appeared: boolean
  appearanceRate: number
  bestPosition: number | null
  competitors: string[]
  citations: number
  topBrand: string
  platforms: { id: string; name: string; color: string; appeared: boolean }[]
}

const stageOrder: { id: FunnelStage | "all"; label: string }[] = [
  { id: "all", label: "All stages" },
  { id: "discovery", label: "Discovery" },
  { id: "exploration", label: "Exploration" },
  { id: "comparison", label: "Comparison" },
  { id: "evaluation", label: "Evaluation" },
  { id: "purchase", label: "Purchase intent" },
]

export default function PromptExplorer({ rows }: { rows: PromptRow[] }) {
  const [stage, setStage] = useState<FunnelStage | "all">("all")
  const [onlyGaps, setOnlyGaps] = useState(false)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (stage !== "all" && row.stage !== stage) return false
      if (onlyGaps && row.appeared) return false
      if (q && !row.question.toLowerCase().includes(q) && !row.competitors.join(" ").toLowerCase().includes(q))
        return false
      return true
    })
  }, [rows, stage, onlyGaps, query])

  const gapCount = rows.filter((r) => !r.appeared).length
  const volume = filtered.reduce((sum, r) => sum + r.monthlyVolume, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Filters — one row above the table */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {stageOrder.map((option) => {
            const active = stage === option.id
            const count = option.id === "all" ? rows.length : rows.filter((r) => r.stage === option.id).length
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setStage(option.id)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
                  active
                    ? "border-transparent bg-[#37322F] text-white"
                    : "border-[rgba(55,50,47,0.14)] bg-white text-[#605A57] hover:text-[#37322F]",
                )}
              >
                {option.label}
                <span className={cn("tabular-nums", active ? "text-white/70" : "text-[rgba(73,66,61,0.45)]")}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyGaps((v) => !v)}
            aria-pressed={onlyGaps}
            className={cn(
              "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors",
              onlyGaps
                ? "border-transparent bg-[rgba(208,59,59,0.10)] text-[#9c2626]"
                : "border-[rgba(55,50,47,0.14)] bg-white text-[#605A57] hover:text-[#37322F]",
            )}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: onlyGaps ? "#d03b3b" : "rgba(55,50,47,0.25)" }}
              aria-hidden
            />
            Gaps only ({gapCount})
          </button>
          <label className="relative">
            <span className="sr-only">Search prompts</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[rgba(73,66,61,0.45)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions or brands"
              className="h-8 w-[230px] rounded-full border border-[rgba(55,50,47,0.14)] bg-white pl-8 pr-3 text-[12px] text-[#37322F] outline-none placeholder:text-[rgba(73,66,61,0.45)] focus:border-[#37322F]"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(55,50,47,0.10)] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.05)]">
        {filtered.length === 0 ? (
          <EmptyState
            title="No prompts match these filters"
            detail="Try clearing the search box or switching back to all stages. The tracked set holds 20 sampled prompts out of 240 monitored."
            action={
              <button
                type="button"
                onClick={() => {
                  setStage("all")
                  setOnlyGaps(false)
                  setQuery("")
                }}
                className="inline-flex h-9 items-center rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-4 text-[13px] font-medium text-[#37322F] hover:bg-[rgba(55,50,47,0.03)]"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Buyer question</Th>
                  <Th>Stage &amp; intent</Th>
                  <Th>Engines</Th>
                  <Th>Competitors named</Th>
                  <Th align="right">Volume</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                    <Td>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/prompts/${row.id}`}
                          className="max-w-[420px] font-medium text-[#37322F] hover:underline"
                        >
                          {row.question}
                        </Link>
                        {!row.appeared && (
                          <span className="rounded-full bg-[rgba(208,59,59,0.08)] px-1.5 py-[1px] text-[10px] font-semibold text-[#9c2626]">
                            Gap
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={row.priority} />
                        <span className="text-[12px] text-[rgba(73,66,61,0.62)]">
                          {row.appearanceRate}% of engines mention you
                          {row.bestPosition ? ` · best position #${row.bestPosition}` : ""}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <div className="font-medium text-[#37322F]">{row.stageLabel}</div>
                      <div className="mt-0.5 text-[12px] capitalize text-[rgba(73,66,61,0.62)]">{row.intent}</div>
                    </Td>
                    <Td>
                      <ul className="flex flex-wrap gap-1.5">
                        {row.platforms.map((platform) => (
                          <li
                            key={platform.id}
                            title={`${platform.name}: ${platform.appeared ? "mentioned" : "not mentioned"}`}
                            className="inline-flex items-center gap-1 rounded-full border border-[rgba(55,50,47,0.12)] px-1.5 py-[2px] text-[11px]"
                            style={{ color: platform.appeared ? "#37322F" : "rgba(73,66,61,0.5)" }}
                          >
                            <span
                              className="h-[7px] w-[7px] rounded-full"
                              style={{
                                backgroundColor: platform.appeared ? platform.color : "transparent",
                                border: platform.appeared ? undefined : `1.5px solid ${platform.color}`,
                                opacity: platform.appeared ? 1 : 0.6,
                              }}
                              aria-hidden
                            />
                            {platform.name}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-1 text-[11px] text-[rgba(73,66,61,0.45)]">
                        Filled dot = mentioned · {row.citations} citations
                      </div>
                    </Td>
                    <Td>
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {row.competitors.length ? (
                          row.competitors.map((name) => (
                            <span
                              key={name}
                              className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] text-[11px] text-[#605A57]"
                            >
                              {name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[12px] text-[rgba(73,66,61,0.45)]">None</span>
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-[rgba(73,66,61,0.45)]">Usually won by {row.topBrand}</div>
                    </Td>
                    <Td align="right">{formatNumber(row.monthlyVolume)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-[12px] text-[rgba(73,66,61,0.62)]">
              <span>
                {filtered.length} prompt{filtered.length === 1 ? "" : "s"} shown
              </span>
              <span>{formatNumber(volume)} monthly searches represented</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
