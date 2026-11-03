/** Shared types for the Visilm demo dataset. All data is mock. */

export type PlatformId = "chatgpt" | "gemini" | "perplexity" | "claude" | "copilot"

export type FunnelStage = "discovery" | "exploration" | "comparison" | "evaluation" | "purchase"

export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional"

export type Priority = "critical" | "high" | "medium" | "low"

export type Severity = "critical" | "serious" | "warning" | "info"

/** Workflow states used by recommendations, audit issues and content briefs. */
export type WorkStatus = "pending" | "needs-approval" | "in-progress" | "verification" | "completed"

export type SourceType = "owned" | "review" | "publication" | "community" | "directory" | "social"

export interface TrendPoint {
  /** Short month label, e.g. "Apr". */
  month: string
  /** Full period label, e.g. "April 2026". */
  period: string
  chatgpt: number
  gemini: number
  perplexity: number
  /** Blended visibility score across all tracked platforms. */
  overall: number
}

export interface MetricDelta {
  value: number
  /** Change versus the previous 30-day period. */
  delta: number
  /** Whether a rising number is good for this metric. */
  higherIsBetter?: boolean
}
