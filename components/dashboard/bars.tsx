import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Delta } from "./kit"

export interface BarRow {
  key: string
  label: string
  value: number
  color: string
  valueLabel?: string
  delta?: number
  deltaUnit?: string
  caption?: string
  href?: string
  /** Emphasise the row that represents us. */
  highlight?: boolean
}

/**
 * Ranked horizontal bars. Every bar carries its own printed value, so the
 * chart stays readable without relying on colour contrast.
 */
export function RankedBars({
  rows,
  max,
  className,
  showRank = false,
}: {
  rows: BarRow[]
  /** Defaults to the largest value in the set. */
  max?: number
  className?: string
  showRank?: boolean
}) {
  const ceiling = max ?? Math.max(...rows.map((r) => r.value), 1)

  return (
    <ul className={cn("flex flex-col gap-3.5", className)}>
      {rows.map((row, index) => {
        const pct = Math.max(1.5, (row.value / ceiling) * 100)
        const inner = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-2">
                {showRank && (
                  <span className="text-[11px] font-semibold tabular-nums text-[rgba(73,66,61,0.45)]">{index + 1}</span>
                )}
                <span
                  className={cn(
                    "truncate text-[13px]",
                    row.highlight ? "font-semibold text-[#37322F]" : "font-medium text-[#49423D]",
                  )}
                >
                  {row.label}
                </span>
                {row.highlight && (
                  <span className="rounded-full bg-[rgba(42,120,214,0.10)] px-1.5 py-[1px] text-[10px] font-semibold text-[#1d5ba6]">
                    You
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-baseline gap-2">
                <span className="text-[13px] font-semibold tabular-nums text-[#37322F]">
                  {row.valueLabel ?? row.value}
                </span>
                {typeof row.delta === "number" && <Delta value={row.delta} unit={row.deltaUnit} invert={!row.highlight} />}
              </div>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.06)]">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: row.color }} />
            </div>
            {row.caption && <div className="mt-1 text-[12px] leading-[18px] text-[rgba(73,66,61,0.62)]">{row.caption}</div>}
          </>
        )

        return (
          <li key={row.key}>
            {row.href ? (
              <Link href={row.href} className="block rounded-lg transition-opacity hover:opacity-80">
                {inner}
              </Link>
            ) : (
              inner
            )}
          </li>
        )
      })}
    </ul>
  )
}

export interface StackSegment {
  key: string
  label: string
  value: number
  color: string
}

/** Single stacked bar with a value legend. 2px gaps separate adjacent fills. */
export function StackBar({ segments, suffix = "%" }: { segments: StackSegment[]; suffix?: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1

  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
        {segments.map((segment) => (
          <div
            key={segment.key}
            style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
            title={`${segment.label}: ${segment.value}${suffix}`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ backgroundColor: segment.color }} aria-hidden />
            <span className="truncate text-[12px] text-[#605A57]">{segment.label}</span>
            <span className="ml-auto text-[12px] font-semibold tabular-nums text-[#37322F]">
              {segment.value}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Small multiples of score dials for platform rows. */
export function MiniScore({ value, color, label }: { value: number; color: string; label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-9 w-9">
        <svg viewBox="0 0 36 36" className="h-9 w-9" role="img" aria-label={`${value} out of 100`}>
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(55,50,47,0.08)" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 94.2} ${94.2 - (value / 100) * 94.2}`}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-[#37322F]">
          {value}
        </span>
      </div>
      <div className="min-w-0 text-[13px] text-[#49423D]">{label}</div>
    </div>
  )
}
