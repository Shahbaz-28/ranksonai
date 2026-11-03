import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { Priority, Severity, WorkStatus } from "@/lib/mock/types"
import { effortLabels, ink, line, priorityStyles, series, severityStyles, status, workStatusStyles } from "./tokens"

/* ------------------------------- surfaces ------------------------------- */

export function Card({
  className,
  children,
  as: As = "div",
}: {
  className?: string
  children: React.ReactNode
  as?: "div" | "section" | "article" | "li"
}) {
  return (
    <As
      className={cn(
        "bg-white rounded-xl border border-[rgba(55,50,47,0.10)] shadow-[0px_1px_2px_rgba(55,50,47,0.05)]",
        className,
      )}
    >
      {children}
    </As>
  )
}

export function CardHead({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-3", className)}>
      <div className="min-w-0">
        <h3 className="text-[#37322F] text-sm font-semibold leading-5">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] leading-5 text-[#605A57]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 text-[13px]">{action}</div>}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[720px]">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.55)]">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 text-[#37322F] text-[22px] sm:text-[26px] font-semibold leading-tight tracking-[-0.01em]">
          {title}
        </h1>
        {description && <p className="mt-2 text-[13px] sm:text-sm leading-6 text-[#605A57]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[#37322F] text-[15px] font-semibold leading-6">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] leading-5 text-[#605A57]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-[rgba(55,50,47,0.08)]", className)} />
}

/* --------------------------------- badges -------------------------------- */

function Pill({
  children,
  bg,
  color,
  dot,
  className,
}: {
  children: React.ReactNode
  bg: string
  color: string
  dot?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-medium leading-4 whitespace-nowrap",
        className,
      )}
      style={{ backgroundColor: bg, color }}
    >
      {dot && <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: dot }} aria-hidden />}
      {children}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = severityStyles[severity]
  return (
    <Pill bg={s.bg} color={s.text} dot={s.dot}>
      {s.label}
    </Pill>
  )
}

export function StatusBadge({ status: value }: { status: WorkStatus }) {
  const s = workStatusStyles[value]
  return (
    <Pill bg={s.bg} color={s.text} dot={s.dot}>
      {s.label}
    </Pill>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priorityStyles[priority]
  return (
    <Pill bg={p.bg} color={p.text}>
      {p.label} priority
    </Pill>
  )
}

export function EffortBadge({ effort }: { effort: "low" | "medium" | "high" }) {
  return (
    <Pill bg="rgba(55,50,47,0.05)" color={ink.secondary}>
      {effortLabels[effort]}
    </Pill>
  )
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  return (
    <Pill
      bg={tone === "accent" ? "rgba(42,120,214,0.08)" : "rgba(55,50,47,0.05)"}
      color={tone === "accent" ? "#1d5ba6" : ink.secondary}
    >
      {children}
    </Pill>
  )
}

export function AppearanceBadge({ appeared }: { appeared: boolean }) {
  return appeared ? (
    <Pill bg="rgba(12,163,12,0.10)" color={status.goodText} dot={status.good}>
      Mentioned
    </Pill>
  ) : (
    <Pill bg="rgba(208,59,59,0.08)" color={status.criticalText} dot={status.critical}>
      Not mentioned
    </Pill>
  )
}

export function PlatformChip({ name, color, muted = false }: { name: string; color: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[11px] font-medium leading-4",
        muted ? "opacity-55" : "",
      )}
      style={{ borderColor: line.hairline, color: ink.secondary }}
    >
      <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {name}
    </span>
  )
}

/** Signed change, with the arrow carrying direction so colour is never alone. */
export function Delta({
  value,
  unit,
  invert = false,
  className,
}: {
  value: number
  unit?: string
  /** When true, a rising number is bad (e.g. competitor share). */
  invert?: boolean
  className?: string
}) {
  const flat = value === 0
  const good = invert ? value < 0 : value > 0
  const color = flat ? ink.muted : good ? status.goodText : status.criticalText
  const arrow = flat ? "±" : value > 0 ? "↑" : "↓"
  return (
    <span className={cn("inline-flex items-center gap-1 text-[12px] font-medium tabular-nums", className)} style={{ color }}>
      <span aria-hidden>{arrow}</span>
      {Math.abs(value)}
      {unit ? ` ${unit}` : ""}
    </span>
  )
}

/* ------------------------------- data tiles ------------------------------ */

export function StatTile({
  label,
  value,
  delta,
  deltaUnit,
  caption,
  href,
}: {
  label: string
  value: string
  delta?: number
  deltaUnit?: string
  caption?: string
  href?: string
}) {
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">{label}</div>
        {typeof delta === "number" && <Delta value={delta} unit={deltaUnit} />}
      </div>
      <div className="mt-2 text-[30px] font-semibold leading-none text-[#37322F]">{value}</div>
      {caption && <div className="mt-2 text-[12px] leading-[18px] text-[#605A57]">{caption}</div>}
    </>
  )

  if (!href) return <Card className="p-5">{body}</Card>

  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-[rgba(55,50,47,0.10)] shadow-[0px_1px_2px_rgba(55,50,47,0.05)] p-5 transition-colors hover:border-[rgba(55,50,47,0.22)]"
    >
      {body}
      <div className="mt-3 text-[12px] font-medium text-[#37322F] opacity-0 transition-opacity group-hover:opacity-100">
        View detail →
      </div>
    </Link>
  )
}

/** A labelled horizontal meter. Values are always printed, never colour-only. */
export function Meter({
  value,
  max = 100,
  color = series.s1,
  label,
  valueLabel,
  sublabel,
}: {
  value: number
  max?: number
  color?: string
  label?: React.ReactNode
  valueLabel?: string
  sublabel?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div>
      {(label || valueLabel) && (
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[13px] font-medium text-[#37322F] truncate">{label}</div>
          <div className="text-[13px] font-semibold tabular-nums text-[#37322F]">{valueLabel ?? value}</div>
        </div>
      )}
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.07)]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {sublabel && <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">{sublabel}</div>}
    </div>
  )
}

/** Score dial, 0–100. The number is the headline; the arc is decoration. */
export function ScoreRing({
  value,
  size = 128,
  caption,
  color = series.s1,
}: {
  value: number
  size?: number
  caption?: string
  color?: string
}) {
  const stroke = size >= 110 ? 10 : 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, value)) / 100) * c

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${value} out of 100`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(55,50,47,0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[28px] font-semibold leading-none text-[#37322F]">{value}</div>
          <div className="text-[11px] text-[rgba(73,66,61,0.55)]">out of 100</div>
        </div>
      </div>
      {caption && <div className="mt-2 max-w-[200px] text-center text-[12px] leading-[18px] text-[#605A57]">{caption}</div>}
    </div>
  )
}

/* --------------------------------- tables -------------------------------- */

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">{children}</table>
    </div>
  )
}

export function Th({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}) {
  return (
    <th
      className={cn(
        "border-b border-[rgba(55,50,47,0.10)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}) {
  return (
    <td
      className={cn(
        "border-b border-[rgba(55,50,47,0.06)] px-5 py-3.5 text-[13px] leading-5 text-[#49423D] align-top",
        align === "right" && "text-right tabular-nums",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  )
}

/* ------------------------------ misc blocks ------------------------------ */

export function EmptyState({
  title,
  detail,
  action,
  icon = "✳",
}: {
  title: string
  detail: string
  action?: React.ReactNode
  icon?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-[15px]"
        style={{ backgroundColor: "rgba(55,50,47,0.05)", color: ink.muted }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="text-sm font-semibold text-[#37322F]">{title}</div>
      <p className="max-w-[420px] text-[13px] leading-5 text-[#605A57]">{detail}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function DefList({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="divide-y divide-[rgba(55,50,47,0.06)]">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
          <dt className="text-[12px] font-medium uppercase tracking-[0.06em] text-[rgba(73,66,61,0.55)]">
            {item.label}
          </dt>
          <dd className="text-[13px] font-medium text-[#37322F] text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] text-[rgba(73,66,61,0.62)]">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-[#37322F] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#37322F] font-medium">{item.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </nav>
  )
}

/** Primary / secondary link buttons. Every one navigates somewhere real. */
export function LinkButton({
  href,
  children,
  variant = "secondary",
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  className?: string
}) {
  const styles = {
    primary: "bg-[#37322F] text-white hover:bg-[#2A2520] border-transparent",
    secondary: "bg-white text-[#37322F] border-[rgba(55,50,47,0.16)] hover:bg-[rgba(55,50,47,0.03)]",
    ghost: "bg-transparent text-[#37322F] border-transparent hover:bg-[rgba(55,50,47,0.05)]",
  }[variant]

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full border px-4 text-[13px] font-medium transition-colors",
        styles,
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function Quote({ children, source }: { children: React.ReactNode; source?: React.ReactNode }) {
  return (
    <figure className="rounded-lg border border-[rgba(55,50,47,0.10)] bg-[#FBFAF9] p-4">
      <blockquote className="text-[13px] leading-6 text-[#49423D]">{children}</blockquote>
      {source && <figcaption className="mt-2 text-[12px] text-[rgba(73,66,61,0.62)]">{source}</figcaption>}
    </figure>
  )
}

export function NoteCallout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "critical" | "good"
  title: string
  children: React.ReactNode
}) {
  const tones = {
    info: { bg: "rgba(42,120,214,0.06)", border: "rgba(42,120,214,0.22)", text: "#1d5ba6" },
    critical: { bg: "rgba(208,59,59,0.06)", border: "rgba(208,59,59,0.22)", text: status.criticalText },
    good: { bg: "rgba(12,163,12,0.06)", border: "rgba(12,163,12,0.22)", text: status.goodText },
  }[tone]

  return (
    <div className="rounded-lg border p-4" style={{ backgroundColor: tones.bg, borderColor: tones.border }}>
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: tones.text }}>
        {title}
      </div>
      <div className="mt-1.5 text-[13px] leading-6 text-[#49423D]">{children}</div>
    </div>
  )
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-US")
}
