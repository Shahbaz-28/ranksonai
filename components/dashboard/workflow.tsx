"use client"

import type { WorkStatus } from "@/lib/mock/types"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./kit"
import { nextStates, useDashboard, type WorkKind } from "./dashboard-state"
import { workStatusStyles } from "./tokens"

/** Status badge that reflects any change made in this browser. */
export function LiveStatus({ kind, id }: { kind: WorkKind; id: string }) {
  const { statusOf } = useDashboard()
  return <StatusBadge status={statusOf(kind, id)} />
}

/**
 * The implementation workflow control. Buttons move the item between states
 * and the change is reflected everywhere the item appears.
 */
export function StatusActions({
  kind,
  id,
  className,
  compact = false,
}: {
  kind: WorkKind
  id: string
  className?: string
  compact?: boolean
}) {
  const { statusOf, setStatus } = useDashboard()
  const current = statusOf(kind, id)
  const options = nextStates[current]

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.to}
          type="button"
          onClick={() => setStatus(kind, id, option.to)}
          className={cn(
            "inline-flex items-center justify-center rounded-full border text-[13px] font-medium transition-colors",
            compact ? "h-8 px-3" : "h-9 px-4",
            option.primary
              ? "border-transparent bg-[#37322F] text-white hover:bg-[#2A2520]"
              : "border-[rgba(55,50,47,0.16)] bg-white text-[#37322F] hover:bg-[rgba(55,50,47,0.03)]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const flow: WorkStatus[] = ["pending", "needs-approval", "in-progress", "verification", "completed"]

/** Visual state of the implementation workflow for one item. */
export function WorkflowStepper({ kind, id }: { kind: WorkKind; id: string }) {
  const { statusOf } = useDashboard()
  const current = statusOf(kind, id)
  const currentIndex = flow.indexOf(current)

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-stretch">
      {flow.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        const style = workStatusStyles[step]
        return (
          <li key={step} className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-2">
            <div className="flex items-center gap-2 sm:w-full">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  active ? "border-transparent text-white" : done ? "border-transparent" : "border-[rgba(55,50,47,0.18)]",
                )}
                style={
                  active
                    ? { backgroundColor: style.dot }
                    : done
                      ? { backgroundColor: "rgba(12,163,12,0.14)", color: "#1f6b1f" }
                      : { color: "rgba(73,66,61,0.45)" }
                }
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="hidden h-px flex-1 bg-[rgba(55,50,47,0.10)] sm:block" />
            </div>
            <div className="pb-5 sm:pb-0">
              <div
                className={cn(
                  "text-[12px] font-semibold",
                  active ? "text-[#37322F]" : done ? "text-[#49423D]" : "text-[rgba(73,66,61,0.55)]",
                )}
              >
                {style.label}
              </div>
              {active && <div className="mt-0.5 text-[11px] text-[rgba(73,66,61,0.62)]">Current state</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Count of items in a given state, kept live as statuses change. */
export function StatusCount({ kind, ids, status }: { kind: WorkKind; ids: string[]; status: WorkStatus }) {
  const { statusOf } = useDashboard()
  return <>{ids.filter((id) => statusOf(kind, id) === status).length}</>
}

export function ResetDemoButton() {
  const { resetDemo, changed } = useDashboard()
  if (changed.length === 0) return null
  return (
    <button
      type="button"
      onClick={resetDemo}
      className="inline-flex h-8 items-center rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[12px] font-medium text-[#37322F] transition-colors hover:bg-[rgba(55,50,47,0.03)]"
    >
      Reset {changed.length} local change{changed.length === 1 ? "" : "s"}
    </button>
  )
}
