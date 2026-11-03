"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import type { Severity } from "@/lib/mock/types"
import { cn } from "@/lib/utils"
import { EmptyState, SeverityBadge, TableWrap, Td, Th } from "./kit"
import { useDashboard } from "./dashboard-state"
import { LiveStatus } from "./workflow"

export interface IssueRow {
  id: string
  title: string
  category: string
  categoryLabel: string
  severity: Severity
  page: string
  pagesAffected: number
  effort: "low" | "medium" | "high"
  promptsAffected: number
  recommendationId?: string
}

const severities: { id: Severity | "all"; label: string }[] = [
  { id: "all", label: "All severities" },
  { id: "critical", label: "Critical" },
  { id: "serious", label: "Serious" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
]

export default function AuditExplorer({
  rows,
  categories,
}: {
  rows: IssueRow[]
  categories: { id: string; label: string }[]
}) {
  const { statusOf } = useDashboard()
  const [severity, setSeverity] = useState<Severity | "all">("all")
  const [category, setCategory] = useState<string>("all")
  const [openOnly, setOpenOnly] = useState(true)

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (severity !== "all" && row.severity !== severity) return false
        if (category !== "all" && row.category !== category) return false
        if (openOnly && statusOf("issue", row.id) === "completed") return false
        return true
      }),
    [rows, severity, category, openOnly, statusOf],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {severities.map((option) => {
            const active = severity === option.id
            const count = option.id === "all" ? rows.length : rows.filter((r) => r.severity === option.id).length
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSeverity(option.id)}
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
          <label className="flex items-center gap-2 text-[12px] text-[#605A57]">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-8 rounded-full border border-[rgba(55,50,47,0.14)] bg-white px-3 text-[12px] text-[#37322F] outline-none focus:border-[#37322F]"
            >
              <option value="all">All categories</option>
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setOpenOnly((v) => !v)}
            aria-pressed={openOnly}
            className={cn(
              "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors",
              openOnly
                ? "border-transparent bg-[#37322F] text-white"
                : "border-[rgba(55,50,47,0.14)] bg-white text-[#605A57] hover:text-[#37322F]",
            )}
          >
            Open issues only
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(55,50,47,0.10)] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.05)]">
        {filtered.length === 0 ? (
          <EmptyState
            icon="✓"
            title={openOnly ? "No open issues match these filters" : "No issues match these filters"}
            detail={
              openOnly
                ? "Everything in this slice has been implemented and verified. Switch off 'Open issues only' to see completed work."
                : "Try a different severity or category."
            }
            action={
              <button
                type="button"
                onClick={() => {
                  setSeverity("all")
                  setCategory("all")
                  setOpenOnly(false)
                }}
                className="inline-flex h-9 items-center rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-4 text-[13px] font-medium text-[#37322F] hover:bg-[rgba(55,50,47,0.03)]"
              >
                Show everything
              </button>
            }
          />
        ) : (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Issue</Th>
                  <Th>Category</Th>
                  <Th>Severity</Th>
                  <Th>Status</Th>
                  <Th align="right">Pages</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                    <Td>
                      <Link href={`/dashboard/audit/${row.id}`} className="font-medium text-[#37322F] hover:underline">
                        {row.title}
                      </Link>
                      <div className="mt-1 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{row.page}</div>
                      {row.promptsAffected > 0 && (
                        <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                          Holds back {row.promptsAffected} tracked prompt{row.promptsAffected === 1 ? "" : "s"}
                        </div>
                      )}
                    </Td>
                    <Td>{row.categoryLabel}</Td>
                    <Td>
                      <SeverityBadge severity={row.severity} />
                    </Td>
                    <Td>
                      <LiveStatus kind="issue" id={row.id} />
                    </Td>
                    <Td align="right">{row.pagesAffected}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
            <div className="px-5 py-3 text-[12px] text-[rgba(73,66,61,0.62)]">
              {filtered.length} issue{filtered.length === 1 ? "" : "s"} shown of {rows.length} found in the 2 November
              crawl.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
