import type { Priority, WorkStatus } from "./types"

export type ContentType = "comparison" | "article" | "service-page" | "faq" | "case-study" | "data-study"

export const contentTypes: { id: ContentType; label: string; blurb: string }[] = [
  { id: "comparison", label: "Comparison & alternatives", blurb: "Head-to-head pages for prompts naming rival brands." },
  { id: "article", label: "Recommended articles", blurb: "Discovery-stage explainers engines quote for definitions." },
  { id: "service-page", label: "Service page improvements", blurb: "Existing pages that need citable detail added." },
  { id: "faq", label: "FAQ opportunities", blurb: "Direct question-and-answer blocks matching real prompts." },
  { id: "case-study", label: "Case studies", blurb: "Named proof with numbers engines can quote." },
  { id: "data-study", label: "Data & benchmarks", blurb: "Original figures that make us the category authority." },
]

export interface ContentBrief {
  id: string
  title: string
  type: ContentType
  status: WorkStatus
  priority: Priority
  /** Target URL path for the page. */
  targetPath: string
  /** Who the page is written for. */
  audience: string
  /** Combined monthly volume of the prompts this page targets. */
  promptVolume: number
  /** Tracked prompt ids this page is meant to win. */
  targetPrompts: string[]
  /** Competitor pages currently cited for these prompts. */
  competingPages: { brand: string; url: string }[]
  wordCount: string
  owner: string
  /** The gap in one sentence. */
  gap: string
  angle: string
  /** Suggested page structure, in order. */
  outline: { heading: string; detail: string }[]
  /** Facts the page must state to be quotable. */
  mustInclude: string[]
  recommendationId?: string
  startedAt?: string
  completedAt?: string
  result?: string
}

export const contentBriefs: ContentBrief[] = [
  {
    id: "c-01",
    title: "Payline Ops alternatives for mid-market finance teams",
    type: "comparison",
    status: "needs-approval",
    priority: "critical",
    targetPath: "/compare/payline-ops-alternatives",
    audience: "Controllers evaluating Payline Ops who need multi-ERP depth without an enterprise rollout",
    promptVolume: 2600,
    targetPrompts: ["p-013"],
    competingPages: [
      { brand: "Settlewise", url: "settlewise.com/compare/payline-ops-alternatives" },
      { brand: "Nexora Pay", url: "nexorapay.com/alternatives/payline-ops" },
    ],
    wordCount: "1,400–1,800",
    owner: "Priya Raghunathan",
    gap: "Every source cited on this prompt is written by a competitor. We have no page in the conversation.",
    angle:
      "Neutral and criteria-led. Five alternatives compared on the same seven criteria, including where Payline Ops is still the right answer and where we are not.",
    outline: [
      { heading: "Who should look at alternatives", detail: "Three concrete situations, not a pitch." },
      { heading: "How we compared", detail: "Seven stated criteria: ERP depth, implementation time, approval flexibility, payment rails, multi-entity, pricing model, support model." },
      { heading: "Comparison table", detail: "Five vendors × seven criteria, server-rendered as a real HTML table." },
      { heading: "Vendor-by-vendor summary", detail: "Two paragraphs each: strongest fit, weakest fit." },
      { heading: "When Payline Ops is still the better choice", detail: "Enterprise multi-currency and 50+ entity environments." },
      { heading: "When Harborflow is the wrong choice", detail: "Sub-200-invoice volumes and construction-specific workflows." },
      { heading: "FAQ", detail: "Six questions lifted verbatim from tracked prompts, with FAQPage schema." },
    ],
    mustInclude: [
      "Published starting price (depends on the pricing page)",
      "21-day implementation benchmark with method link",
      "Named ERP versions supported",
      "An explicit statement of comparison criteria",
    ],
    recommendationId: "r-11",
  },
  {
    id: "c-02",
    title: "Nexora Pay alternatives for NetSuite shops",
    type: "comparison",
    status: "pending",
    priority: "high",
    targetPath: "/compare/nexora-pay-alternatives",
    audience: "NetSuite administrators and controllers who have Nexora Pay on a shortlist",
    promptVolume: 1100,
    targetPrompts: ["p-012"],
    competingPages: [
      { brand: "Payline Ops", url: "paylineops.com/vs/nexora-pay" },
      { brand: "Settlewise", url: "settlewise.com/compare/nexora-pay" },
    ],
    wordCount: "1,200–1,500",
    owner: "Priya Raghunathan",
    gap: "We hold the deepest NetSuite integration in the category and appear on only one engine for this prompt.",
    angle: "Lead with the NetSuite sync detail — the one dimension where we measurably win — then compare honestly on the rest.",
    outline: [
      { heading: "Why NetSuite teams reconsider", detail: "Sync depth, dimension mapping, posting behaviour." },
      { heading: "NetSuite sync compared", detail: "Field-level table: what syncs, which direction, how often." },
      { heading: "Four alternatives", detail: "Same criteria table as the Payline Ops page." },
      { heading: "Migration considerations", detail: "What moving mid-year actually involves." },
      { heading: "FAQ", detail: "Five tracked questions with schema." },
    ],
    mustInclude: [
      "SuiteApp listing link",
      "Field-level sync table",
      "Implementation timeline for a NetSuite-only rollout",
    ],
    recommendationId: "r-11",
  },
  {
    id: "c-03",
    title: "AP automation pricing: what mid-market teams actually pay",
    type: "article",
    status: "needs-approval",
    priority: "critical",
    targetPath: "/pricing",
    audience: "Finance buyers building a budget case before they will talk to sales",
    promptVolume: 4720,
    targetPrompts: ["p-011", "p-018", "p-019"],
    competingPages: [
      { brand: "Settlewise", url: "settlewise.com/pricing" },
      { brand: "Payline Ops", url: "paylineops.com/pricing" },
    ],
    wordCount: "900–1,200",
    owner: "Elise Kaufman",
    gap: "We publish no pricing at all, and engines say so in their answers.",
    angle:
      "Publish the starting price and the three variables that move it. Explain the model honestly rather than hiding behind 'contact us'.",
    outline: [
      { heading: "Starting price", detail: "One number, above the fold, in text." },
      { heading: "What drives cost", detail: "Invoice volume, entity count, payment rails — with ranges." },
      { heading: "Worked example", detail: "A 500-employee company at 2,000 invoices/month, itemised." },
      { heading: "What is included in every plan", detail: "Implementation, ERP connector, support tier." },
      { heading: "FAQ", detail: "Eight pricing questions with FAQPage schema." },
    ],
    mustInclude: ["A published starting price", "Offer schema", "A worked example with totals", "No gated calculator"],
    recommendationId: "r-01",
  },
  {
    id: "c-04",
    title: "The real cost of manual AP: 2026 benchmark from 210 finance teams",
    type: "data-study",
    status: "pending",
    priority: "high",
    targetPath: "/research/ap-cost-benchmark-2026",
    audience: "CFOs and controllers building an internal business case",
    promptVolume: 4650,
    targetPrompts: ["p-002", "p-017"],
    competingPages: [
      { brand: "Payline Ops", url: "paylineops.com/research/benchmark-2026" },
      { brand: "Ardent Partners", url: "ardentpartners.com/ap-metrics" },
    ],
    wordCount: "2,000–2,600",
    owner: "Priya Raghunathan",
    gap: "Every cost figure engines quote in this category belongs to a competitor's study.",
    angle: "Original data from our own customer base, with methodology and sample size stated plainly so it is quotable.",
    outline: [
      { heading: "Headline findings", detail: "Five numbers, each in a single sentence." },
      { heading: "Methodology", detail: "Sample size, period, anonymisation, what was excluded." },
      { heading: "Cost per invoice by company size", detail: "Table with quartiles." },
      { heading: "Cycle time and exception rates", detail: "Distribution, not just averages." },
      { heading: "Payback model", detail: "Assumptions visible and adjustable." },
      { heading: "Limitations", detail: "Where the data does not generalise." },
    ],
    mustInclude: ["Stated sample size (210 accounts)", "Published methodology", "A table engines can parse", "Citation-friendly summary block"],
    recommendationId: "r-12",
  },
  {
    id: "c-05",
    title: "Multi-entity approval workflows, with a worked three-entity example",
    type: "service-page",
    status: "pending",
    priority: "high",
    targetPath: "/product/approvals",
    audience: "Controllers at multi-entity groups consolidating AP onto one platform",
    promptVolume: 1300,
    targetPrompts: ["p-015"],
    competingPages: [{ brand: "Nexora Pay", url: "nexorapay.com/product/multi-entity" }],
    wordCount: "600–900 added to the existing page",
    owner: "Marcus Oyelaran",
    gap: "Capability exists, documentation does not, so the engine cites the competitor who wrote it down.",
    angle: "Show the configuration, not the benefit. A described matrix is quotable; an adjective is not.",
    outline: [
      { heading: "How multi-entity approval works", detail: "Entity hierarchy, shared vendor master, allocation." },
      { heading: "Worked example: three entities", detail: "Real configuration from a customer, described in text and table." },
      { heading: "Inter-company allocation", detail: "How splits post back to each ERP ledger." },
      { heading: "Limits", detail: "Maximum hierarchy depth and what needs services help." },
    ],
    mustInclude: ["An HTML approval matrix table", "Named ERP posting behaviour", "Stated hierarchy limits"],
    recommendationId: "r-06",
  },
  {
    id: "c-06",
    title: "Trust & security at Harborflow",
    type: "service-page",
    status: "in-progress",
    priority: "critical",
    targetPath: "/security",
    audience: "Security reviewers and controllers running vendor due diligence",
    promptVolume: 1450,
    targetPrompts: ["p-016"],
    competingPages: [{ brand: "Nexora Pay", url: "nexorapay.com/trust" }],
    wordCount: "700–1,000",
    owner: "Tom Brennan",
    gap: "We hold SOC 2 Type II and publish nothing an engine can confirm it from.",
    angle: "A plain compliance record: what we hold, when it was attested, who processes data, how to request the report.",
    outline: [
      { heading: "Certifications", detail: "SOC 2 Type II with attestation date and auditor." },
      { heading: "Data handling", detail: "Encryption at rest and in transit, retention, residency options." },
      { heading: "Subprocessors", detail: "Named list with purpose and region." },
      { heading: "Access controls", detail: "SSO, SCIM, role model, audit log retention." },
      { heading: "Request the report", detail: "Unganted path with NDA step described." },
    ],
    mustInclude: ["Attestation date", "Named auditor", "Subprocessor list", "Organization schema"],
    recommendationId: "r-02",
    startedAt: "2026-10-30",
  },
  {
    id: "c-07",
    title: "How long AP automation implementation really takes",
    type: "article",
    status: "verification",
    priority: "high",
    targetPath: "/implementation",
    audience: "Buyers comparing deployment risk across vendors",
    promptVolume: 1600,
    targetPrompts: ["p-014"],
    competingPages: [],
    wordCount: "1,100–1,400",
    owner: "Priya Raghunathan",
    gap: "Our 21-day claim is already quoted; the method behind it is not published, which caps how confidently engines use it.",
    angle: "Show the schedule, the prerequisites and what makes it slip. Credibility comes from naming the failure modes.",
    outline: [
      { heading: "The 21-day schedule", detail: "Week-by-week with owner per task." },
      { heading: "Prerequisites", detail: "What must be ready before day one." },
      { heading: "What extends the timeline", detail: "Multi-entity, custom dimensions, historical data loads." },
      { heading: "Data from 40 implementations", detail: "Median, p90 and the two longest outliers explained." },
    ],
    mustInclude: ["Week-by-week table", "Stated prerequisites", "Median and p90 from real projects"],
    recommendationId: "r-10",
    startedAt: "2026-09-16",
  },
  {
    id: "c-08",
    title: "Harborflow for NetSuite: field-level sync reference",
    type: "service-page",
    status: "completed",
    priority: "high",
    targetPath: "/integrations/netsuite",
    audience: "NetSuite administrators validating integration depth",
    promptVolume: 3300,
    targetPrompts: ["p-006"],
    competingPages: [{ brand: "Payline Ops", url: "paylineops.com/integrations/netsuite" }],
    wordCount: "1,300",
    owner: "Marcus Oyelaran",
    gap: "Integration depth was our strongest differentiator and was described only in marketing language.",
    angle: "A reference page, not a pitch: every object, every direction, every cadence, in one table.",
    outline: [
      { heading: "What syncs", detail: "Objects, directions and cadence in one table." },
      { heading: "Field mapping", detail: "Default mappings and how to override them." },
      { heading: "Dimension handling", detail: "Classes, departments, locations, custom segments." },
      { heading: "Setup", detail: "SuiteApp install steps with screenshots described in text." },
    ],
    mustInclude: ["Sync table", "SuiteApp listing link", "Named NetSuite versions"],
    completedAt: "2026-06-18",
    result: "Now the most-cited page we own. Holds position 1 for the NetSuite prompt on all three primary engines.",
  },
  {
    id: "c-09",
    title: "FAQ blocks for the nine product pages with existing Q&A",
    type: "faq",
    status: "pending",
    priority: "medium",
    targetPath: "/product/* (9 pages)",
    audience: "Buyers asking narrow capability questions mid-evaluation",
    promptVolume: 2100,
    targetPrompts: ["p-003", "p-015", "p-016"],
    competingPages: [],
    wordCount: "No new copy — markup only",
    owner: "Tom Brennan",
    gap: "Nine pages already answer real prompts in prose that no engine can parse as a question-answer pair.",
    angle: "Cheapest win in the plan: wrap what already exists in FAQPage schema and tighten each answer to one paragraph.",
    outline: [
      { heading: "Audit existing Q&A", detail: "List the 37 questions already on the nine pages." },
      { heading: "Rewrite answers to one paragraph", detail: "Lead with the direct answer." },
      { heading: "Add FAQPage markup", detail: "Via the CMS component so it applies site-wide." },
    ],
    mustInclude: ["One-paragraph answers", "FAQPage schema", "Questions phrased as buyers ask them"],
    recommendationId: "r-05",
  },
  {
    id: "c-10",
    title: "Case study: Brightmoor Health cut AP cycle time from 11 days to 3",
    type: "case-study",
    status: "pending",
    priority: "medium",
    targetPath: "/customers/brightmoor-health",
    audience: "Mid-market controllers in regulated industries",
    promptVolume: 870,
    targetPrompts: ["p-014", "p-017"],
    competingPages: [{ brand: "Corvus AP", url: "corvusap.com/customers" }],
    wordCount: "900–1,100",
    owner: "Marcus Oyelaran",
    gap: "We have no named customer proof with numbers. Engines quote competitors' case studies on ROI prompts.",
    angle: "Named customer, stated numbers, named timeframe. Approved quotes only.",
    outline: [
      { heading: "Before", detail: "Invoice volume, cycle time, headcount, cost per invoice." },
      { heading: "What changed", detail: "Configuration decisions, not features." },
      { heading: "After, with numbers", detail: "Cycle time, cost per invoice, exception rate at 6 months." },
      { heading: "In their words", detail: "Two approved quotes from the controller." },
    ],
    mustInclude: ["Customer approval on file", "Before and after numbers", "Named timeframe"],
  },
]

export const briefById = (id: string) => contentBriefs.find((b) => b.id === id)
export const briefsByType = (type: ContentType) => contentBriefs.filter((b) => b.type === type)

export const contentSummary = {
  opportunities: contentBriefs.length,
  volume: contentBriefs.reduce((sum, b) => sum + b.promptVolume, 0),
  inFlight: contentBriefs.filter((b) => b.status === "in-progress" || b.status === "verification").length,
  shipped: contentBriefs.filter((b) => b.status === "completed").length,
}
