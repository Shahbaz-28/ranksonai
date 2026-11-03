/**
 * Dashboard design tokens.
 *
 * Ink and surfaces continue the marketing site's warm neutrals. Series colours
 * are the validated categorical palette (slots assigned per entity and never
 * reassigned by rank); status colours are reserved and always ship with a
 * label, never colour alone.
 */

export const ink = {
  primary: "#37322F",
  secondary: "#605A57",
  muted: "rgba(73,66,61,0.62)",
  faint: "rgba(73,66,61,0.45)",
} as const

export const surface = {
  page: "#F7F5F3",
  card: "#FFFFFF",
  sunken: "#FBFAF9",
  rail: "#FCFBFA",
} as const

export const line = {
  hairline: "rgba(55,50,47,0.10)",
  soft: "rgba(55,50,47,0.06)",
  grid: "#ECE9E5",
} as const

/** Categorical slots, fixed order. */
export const series = {
  s1: "#2a78d6",
  s2: "#eb6834",
  s3: "#1baf7a",
  s4: "#eda100",
  s5: "#e87ba4",
  s6: "#6250d6",
  s7: "#e34948",
} as const

/** Reserved status colours — never reused as a series colour. */
export const status = {
  good: "#0ca30c",
  goodText: "#1f6b1f",
  warning: "#fab219",
  warningText: "#8a6000",
  serious: "#ec835a",
  seriousText: "#a4461f",
  critical: "#d03b3b",
  criticalText: "#9c2626",
  neutral: "#898781",
} as const

export const severityStyles = {
  critical: { dot: status.critical, text: status.criticalText, bg: "rgba(208,59,59,0.08)", label: "Critical" },
  serious: { dot: status.serious, text: status.seriousText, bg: "rgba(236,131,90,0.10)", label: "Serious" },
  warning: { dot: status.warning, text: status.warningText, bg: "rgba(250,178,25,0.12)", label: "Warning" },
  info: { dot: status.neutral, text: ink.secondary, bg: "rgba(55,50,47,0.06)", label: "Info" },
} as const

export const workStatusStyles = {
  pending: { dot: status.neutral, text: ink.secondary, bg: "rgba(55,50,47,0.06)", label: "Pending" },
  "needs-approval": { dot: status.warning, text: status.warningText, bg: "rgba(250,178,25,0.12)", label: "Needs approval" },
  "in-progress": { dot: series.s1, text: "#1d5ba6", bg: "rgba(42,120,214,0.10)", label: "In progress" },
  verification: { dot: series.s6, text: "#4b3cb0", bg: "rgba(98,80,214,0.10)", label: "Verification required" },
  completed: { dot: status.good, text: status.goodText, bg: "rgba(12,163,12,0.10)", label: "Completed" },
} as const

export const priorityStyles = {
  critical: { text: status.criticalText, bg: "rgba(208,59,59,0.08)", label: "Critical" },
  high: { text: status.seriousText, bg: "rgba(236,131,90,0.10)", label: "High" },
  medium: { text: status.warningText, bg: "rgba(250,178,25,0.12)", label: "Medium" },
  low: { text: ink.secondary, bg: "rgba(55,50,47,0.06)", label: "Low" },
} as const

export const effortLabels = { low: "Low effort", medium: "Medium effort", high: "High effort" } as const
