export type ActivityKind = "shipped" | "approved" | "started" | "detected" | "crawl" | "gain" | "loss"

export interface ActivityEntry {
  id: string
  date: string
  kind: ActivityKind
  title: string
  detail: string
  /** Deep link into the dashboard, when the entry has a detail page. */
  href?: string
  /** Visibility points attributed to this change, when measured. */
  points?: number
}

export const activity: ActivityEntry[] = [
  {
    id: "ac-18",
    date: "2026-11-02",
    kind: "crawl",
    title: "Weekly crawl completed",
    detail: "412 pages crawled, 118 with open issues. Two new issues detected since 26 Oct.",
    href: "/dashboard/audit",
  },
  {
    id: "ac-17",
    date: "2026-11-01",
    kind: "gain",
    title: "Perplexity visibility passed 67",
    detail: "Driven by the integrations hub refresh. Position 1 held on both ERP prompts for four consecutive weeks.",
    href: "/dashboard/visibility/perplexity",
    points: 5,
  },
  {
    id: "ac-16",
    date: "2026-10-30",
    kind: "started",
    title: "Trust page implementation started",
    detail: "Tom Brennan picked up r-02 after Legal confirmed attestation dates.",
    href: "/dashboard/recommendations/r-02",
  },
  {
    id: "ac-15",
    date: "2026-10-28",
    kind: "detected",
    title: "Full site audit refreshed",
    detail: "16 open issues, 4 critical. Missing pricing and trust pages remain the two largest exclusion causes.",
    href: "/dashboard/audit",
  },
  {
    id: "ac-14",
    date: "2026-10-21",
    kind: "loss",
    title: "Copilot mention rate fell 3 points",
    detail: "Bing re-indexed the Dynamics integration page and dropped the capability table from its snapshot.",
    href: "/dashboard/visibility/copilot",
    points: -2,
  },
  {
    id: "ac-13",
    date: "2026-10-12",
    kind: "started",
    title: "G2 review campaign launched",
    detail: "Wave one sent to 180 accounts. 34 new reviews published so far against a 95 target.",
    href: "/dashboard/recommendations/r-15",
  },
  {
    id: "ac-12",
    date: "2026-09-29",
    kind: "gain",
    title: "Implementation prompt reached position 1 on all engines",
    detail: "The 21-day benchmark is now quoted verbatim by ChatGPT, Gemini and Perplexity.",
    href: "/dashboard/prompts/p-014",
    points: 4,
  },
  {
    id: "ac-11",
    date: "2026-09-16",
    kind: "started",
    title: "Implementation methodology page drafted",
    detail: "Published for verification; waiting on two crawl cycles to confirm citation pickup.",
    href: "/dashboard/content/c-07",
  },
  {
    id: "ac-10",
    date: "2026-08-21",
    kind: "shipped",
    title: "Sage Intacct and Dynamics marketplace listings completed",
    detail: "Both listings now carry full capability fields and sync documentation.",
    href: "/dashboard/recommendations/r-16",
    points: 4,
  },
  {
    id: "ac-09",
    date: "2026-08-04",
    kind: "approved",
    title: "Marketplace listing work approved",
    detail: "Elise Kaufman approved r-16 for implementation.",
    href: "/dashboard/recommendations/r-16",
  },
  {
    id: "ac-08",
    date: "2026-06-18",
    kind: "shipped",
    title: "NetSuite field-level sync reference published",
    detail: "1,300-word reference page replacing the previous marketing page.",
    href: "/dashboard/content/c-08",
    points: 6,
  },
  {
    id: "ac-07",
    date: "2026-05-27",
    kind: "shipped",
    title: "Integrations hub live in primary navigation",
    detail: "Eleven ERP pages moved from crawl depth 4 to depth 2.",
    href: "/dashboard/recommendations/r-09",
    points: 7,
  },
  {
    id: "ac-06",
    date: "2026-05-12",
    kind: "detected",
    title: "Orphaned integration pages detected",
    detail: "Nine of eleven ERP pages had no internal links from product pages.",
    href: "/dashboard/audit/a-09",
  },
  {
    id: "ac-05",
    date: "2026-04-09",
    kind: "shipped",
    title: "AI crawlers unblocked in robots.txt",
    detail: "GPTBot, OAI-SearchBot, PerplexityBot and ClaudeBot allowed. Crawl hits went 0 → 1,840/week.",
    href: "/dashboard/recommendations/r-03",
    points: 14,
  },
  {
    id: "ac-04",
    date: "2026-04-04",
    kind: "detected",
    title: "Critical: all AI crawlers blocked sitewide",
    detail: "Blanket disallow from the 2025 scraping incident was still live.",
    href: "/dashboard/audit/a-03",
  },
  {
    id: "ac-03",
    date: "2026-04-02",
    kind: "crawl",
    title: "Tracking started",
    detail: "Baseline: visibility 31, mention rate 17%, citation rate 8%, share of voice 10.6%.",
  },
]

export interface MonthlyReport {
  /** URL slug, e.g. "2026-10". */
  period: string
  label: string
  publishedAt: string
  summary: string
  metrics: {
    label: string
    value: string
    delta: number
    /** Formatting suffix for the delta. */
    unit: string
  }[]
  shipped: { title: string; href: string; points?: number }[]
  /** What moved against us. */
  risks: string[]
  competitorMovement: { brand: string; slug: string; change: number; note: string }[]
  nextPeriod: string[]
}

export const monthlyReports: MonthlyReport[] = [
  {
    period: "2026-10",
    label: "October 2026",
    publishedAt: "2026-11-01",
    summary:
      "Visibility rose 3 points to 57 with no new content shipped — the gain came from the integrations hub maturing in the index. The pricing and trust gaps remain the two largest exclusion causes and both are now awaiting a decision rather than work.",
    metrics: [
      { label: "AI visibility score", value: "57", delta: 3, unit: "pts" },
      { label: "Brand mention rate", value: "37%", delta: 2, unit: "pts" },
      { label: "Citation rate", value: "23%", delta: 2, unit: "pts" },
      { label: "Share of voice", value: "13.4%", delta: 1.1, unit: "pts" },
      { label: "Prompts won", value: "7 of 20", delta: 1, unit: "prompts" },
      { label: "Citations earned", value: "248", delta: 29, unit: "citations" },
    ],
    shipped: [{ title: "G2 review campaign launched (wave one)", href: "/dashboard/recommendations/r-15" }],
    risks: [
      "Copilot mention rate fell 3 points after a Bing re-index dropped our Dynamics capability table.",
      "Settlewise published a second alternatives page that now appears on two of our gap prompts.",
    ],
    competitorMovement: [
      { brand: "Payline Ops", slug: "payline-ops", change: -1.2, note: "Share eroding slowly as the category widens." },
      { brand: "Settlewise", slug: "settlewise", change: 0.8, note: "New alternatives page picked up on two prompts." },
      { brand: "Nexora Pay", slug: "nexora-pay", change: 2.4, note: "Gartner Peer Insights volume lifted Gemini answers." },
    ],
    nextPeriod: [
      "Decision needed on the published pricing figure (r-01)",
      "Ship the trust page (r-02, in progress)",
      "Wave two of the G2 review campaign",
    ],
  },
  {
    period: "2026-09",
    label: "September 2026",
    publishedAt: "2026-10-01",
    summary:
      "The strongest month since tracking began. The implementation methodology page took position 1 on all three primary engines, and our 21-day benchmark started being quoted verbatim rather than paraphrased.",
    metrics: [
      { label: "AI visibility score", value: "54", delta: 6, unit: "pts" },
      { label: "Brand mention rate", value: "35%", delta: 3, unit: "pts" },
      { label: "Citation rate", value: "21%", delta: 2, unit: "pts" },
      { label: "Share of voice", value: "12.3%", delta: 1.4, unit: "pts" },
      { label: "Prompts won", value: "6 of 20", delta: 1, unit: "prompts" },
      { label: "Citations earned", value: "219", delta: 24, unit: "citations" },
    ],
    shipped: [
      { title: "Implementation methodology drafted", href: "/dashboard/content/c-07", points: 4 },
    ],
    risks: ["Pricing prompts still exclude us entirely; three purchase-intent prompts unchanged since April."],
    competitorMovement: [
      { brand: "Payline Ops", slug: "payline-ops", change: -0.6, note: "No new roundup placements." },
      { brand: "Corvus AP", slug: "corvus-ap", change: -0.9, note: "Lost ground on general mid-market prompts." },
    ],
    nextPeriod: ["Launch the G2 review campaign", "Audit refresh ahead of Q4 planning"],
  },
  {
    period: "2026-08",
    label: "August 2026",
    publishedAt: "2026-09-01",
    summary:
      "Marketplace listings for Sage Intacct and Dynamics were completed, replicating the NetSuite pattern. Visibility rose 4 points, concentrated on ERP-specific prompts.",
    metrics: [
      { label: "AI visibility score", value: "48", delta: 4, unit: "pts" },
      { label: "Brand mention rate", value: "32%", delta: 4, unit: "pts" },
      { label: "Citation rate", value: "19%", delta: 3, unit: "pts" },
      { label: "Share of voice", value: "10.9%", delta: 0.7, unit: "pts" },
      { label: "Prompts won", value: "5 of 20", delta: 1, unit: "prompts" },
      { label: "Citations earned", value: "195", delta: 31, unit: "citations" },
    ],
    shipped: [
      { title: "Sage Intacct and Dynamics listings completed", href: "/dashboard/recommendations/r-16", points: 4 },
    ],
    risks: ["Schema coverage still at zero across all product pages."],
    competitorMovement: [
      { brand: "Nexora Pay", slug: "nexora-pay", change: 1.8, note: "Security portal refresh lifted compliance prompts." },
    ],
    nextPeriod: ["Draft the implementation methodology page", "Scope the schema rollout"],
  },
]

export const reportByPeriod = (period: string) => monthlyReports.find((r) => r.period === period)

/** Citation growth by month, for the progress chart. */
export const citationGrowth = [
  { month: "Apr", period: "April 2026", citations: 94, ourCitations: 18 },
  { month: "May", period: "May 2026", citations: 121, ourCitations: 27 },
  { month: "Jun", period: "June 2026", citations: 148, ourCitations: 39 },
  { month: "Jul", period: "July 2026", citations: 164, ourCitations: 48 },
  { month: "Aug", period: "August 2026", citations: 195, ourCitations: 58 },
  { month: "Sep", period: "September 2026", citations: 219, ourCitations: 68 },
  { month: "Oct", period: "October 2026", citations: 248, ourCitations: 79 },
  { month: "Nov", period: "November 2026", citations: 263, ourCitations: 86 },
]

/** Share of voice over time for us and the three closest rivals. */
export const shareOfVoiceTrend = [
  { month: "Apr", period: "April 2026", harborflow: 10.6, paylineOps: 35.1, nexoraPay: 19.4, settlewise: 15.2 },
  { month: "May", period: "May 2026", harborflow: 10.9, paylineOps: 34.6, nexoraPay: 20.1, settlewise: 15.4 },
  { month: "Jun", period: "June 2026", harborflow: 11.4, paylineOps: 34.0, nexoraPay: 20.8, settlewise: 15.8 },
  { month: "Jul", period: "July 2026", harborflow: 11.8, paylineOps: 33.4, nexoraPay: 21.3, settlewise: 16.0 },
  { month: "Aug", period: "August 2026", harborflow: 10.9, paylineOps: 33.1, nexoraPay: 22.1, settlewise: 16.3 },
  { month: "Sep", period: "September 2026", harborflow: 12.3, paylineOps: 32.5, nexoraPay: 22.4, settlewise: 16.5 },
  { month: "Oct", period: "October 2026", harborflow: 13.4, paylineOps: 31.9, nexoraPay: 23.1, settlewise: 16.8 },
  { month: "Nov", period: "November 2026", harborflow: 14.2, paylineOps: 31.5, nexoraPay: 23.8, settlewise: 17.1 },
]
