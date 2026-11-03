import type { PlatformId, Severity } from "./types"

export interface Kpi {
  id: string
  label: string
  value: string
  /** Raw numeric value for charts and rings. */
  numeric: number
  delta: number
  deltaUnit: string
  caption: string
  href: string
}

export const kpis: Kpi[] = [
  {
    id: "visibility",
    label: "AI visibility score",
    value: "61",
    numeric: 61,
    delta: 4,
    deltaUnit: "pts vs Oct",
    caption: "Blended across 5 engines and 240 tracked prompts",
    href: "/dashboard/visibility",
  },
  {
    id: "mentions",
    label: "Brand mention rate",
    value: "38%",
    numeric: 38,
    delta: 1,
    deltaUnit: "pts vs Oct",
    caption: "91 of 240 prompts name Harborflow",
    href: "/dashboard/visibility",
  },
  {
    id: "citations",
    label: "Citation rate",
    value: "25%",
    numeric: 25,
    delta: 2,
    deltaUnit: "pts vs Oct",
    caption: "harborflow.io cited in 86 of 210 sampled answers",
    href: "/dashboard/citations",
  },
  {
    id: "share",
    label: "Share of voice",
    value: "14.2%",
    numeric: 14.2,
    delta: 0.8,
    deltaUnit: "pts vs Oct",
    caption: "Rank 4 of 6 tracked brands",
    href: "/dashboard/competitors",
  },
]

export interface Alert {
  id: string
  severity: Severity
  title: string
  detail: string
  href: string
  cta: string
}

export const alerts: Alert[] = [
  {
    id: "al-01",
    severity: "critical",
    title: "Three purchase-intent prompts exclude us for a missing pricing page",
    detail:
      "ChatGPT states the reason in its answer: quote-only vendors are not ranked. 4,720 monthly searches are affected and the fix is awaiting a pricing decision.",
    href: "/dashboard/recommendations/r-01",
    cta: "Review recommendation",
  },
  {
    id: "al-02",
    severity: "critical",
    title: "Compliance prompt cannot confirm our SOC 2 because nothing is published",
    detail:
      "Perplexity notes our certifications appear only in third-party reviews. Nexora Pay's trust page takes the citation on every run.",
    href: "/dashboard/recommendations/r-02",
    cta: "View progress",
  },
  {
    id: "al-03",
    severity: "serious",
    title: "All alternatives prompts are answered from competitor-authored pages",
    detail:
      "Settlewise's 'Payline Ops alternatives' page is cited on three gap prompts worth 5,900 monthly searches. We publish no equivalent.",
    href: "/dashboard/recommendations/r-11",
    cta: "Review plan",
  },
  {
    id: "al-04",
    severity: "warning",
    title: "Copilot visibility down 2 points this month",
    detail: "A Bing re-index dropped the capability table from our Dynamics integration page snapshot.",
    href: "/dashboard/visibility/copilot",
    cta: "Inspect platform",
  },
]

export interface RecentMention {
  id: string
  platform: PlatformId
  promptId: string
  question: string
  excerpt: string
  appeared: boolean
  position: number | null
  checkedAt: string
}

export const recentMentions: RecentMention[] = [
  {
    id: "rm-01",
    platform: "perplexity",
    promptId: "p-006",
    question: "Which AP automation tools integrate natively with NetSuite?",
    excerpt:
      "Harborflow is the most commonly cited NetSuite-native option, with documented two-way sync for bills, vendors and payment status.",
    appeared: true,
    position: 1,
    checkedAt: "2026-11-01T11:24:00Z",
  },
  {
    id: "rm-02",
    platform: "chatgpt",
    promptId: "p-019",
    question: "AP automation pricing for a 500-employee company",
    excerpt:
      "Payline Ops starts around $1,500/month and Nexora Pay around $1,900/month based on published tiers. Quote-only vendors could not be ranked here.",
    appeared: false,
    position: null,
    checkedAt: "2026-11-01T16:40:00Z",
  },
  {
    id: "rm-03",
    platform: "chatgpt",
    promptId: "p-014",
    question: "How long does an AP automation implementation take?",
    excerpt:
      "Harborflow publishes a 21-day benchmark for single-entity NetSuite or Intacct implementations, the shortest documented timeline in the category.",
    appeared: true,
    position: 1,
    checkedAt: "2026-11-01T15:02:00Z",
  },
  {
    id: "rm-04",
    platform: "gemini",
    promptId: "p-005",
    question: "Best accounts payable automation software for mid-market companies",
    excerpt: "Top options include Payline Ops, Nexora Pay and Settlewise, which lead on analyst coverage.",
    appeared: false,
    position: null,
    checkedAt: "2026-11-01T11:05:00Z",
  },
  {
    id: "rm-05",
    platform: "perplexity",
    promptId: "p-016",
    question: "Is AP automation software SOC 2 compliant?",
    excerpt:
      "Harborflow's certifications are referenced in third-party reviews but not on its own site, so they could not be confirmed.",
    appeared: false,
    position: null,
    checkedAt: "2026-11-01T15:44:00Z",
  },
  {
    id: "rm-06",
    platform: "gemini",
    promptId: "p-010",
    question: "Harborflow vs Payline Ops",
    excerpt:
      "Harborflow emphasises ERP depth and speed to value. Pricing comparison is difficult because Harborflow does not publish list pricing.",
    appeared: true,
    position: 1,
    checkedAt: "2026-11-01T13:22:00Z",
  },
]

/** Where visibility is being lost, for the overview breakdown. */
export const exclusionCauses = [
  { cause: "No published pricing", prompts: 3, volume: 4720, severity: "critical" as Severity, href: "/dashboard/recommendations/r-01" },
  { cause: "No alternatives or comparison pages", prompts: 3, volume: 5900, severity: "critical" as Severity, href: "/dashboard/recommendations/r-11" },
  { cause: "Capability undocumented on site", prompts: 2, volume: 2750, severity: "serious" as Severity, href: "/dashboard/audit/a-06" },
  { cause: "No original benchmark data", prompts: 2, volume: 4650, severity: "serious" as Severity, href: "/dashboard/recommendations/r-12" },
  { cause: "Missing third-party listings", prompts: 2, volume: 10700, severity: "serious" as Severity, href: "/dashboard/citations" },
  { cause: "Vertical content not served", prompts: 1, volume: 980, severity: "warning" as Severity, href: "/dashboard/prompts/p-008" },
]

export const onboardingStages = [
  {
    id: "crawl",
    label: "Crawling your website",
    detail: "Fetching pages, following internal links and checking what AI crawlers can read.",
    findings: ["412 pages found", "118 pages with issues", "GPTBot access confirmed"],
    durationMs: 2600,
  },
  {
    id: "extract",
    label: "Extracting business information",
    detail: "Reading your identity, category, location and claims from the pages we can see.",
    findings: ["Category: accounts payable automation", "HQ: Austin, Texas", "4 conflicting category phrases found"],
    durationMs: 2200,
  },
  {
    id: "services",
    label: "Identifying services",
    detail: "Mapping each product and service to the pages that describe it.",
    findings: ["6 services identified", "3 without citable detail", "27 pages mapped to services"],
    durationMs: 2000,
  },
  {
    id: "competitors",
    label: "Identifying competitors",
    detail: "Finding the brands that appear alongside you in AI answers for your category.",
    findings: ["5 competitors detected", "Payline Ops leads share of voice", "Settlewise closest direct peer"],
    durationMs: 2400,
  },
  {
    id: "readiness",
    label: "GEO readiness analysis",
    detail: "Scoring crawlability, structure, schema and content against what engines cite.",
    findings: ["Readiness score: 57 / 100", "Schema coverage: 38%", "2 critical blockers found"],
    durationMs: 2800,
  },
] as const
