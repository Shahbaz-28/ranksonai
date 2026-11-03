import type { Priority, WorkStatus } from "./types"

export type RecCategory = "technical" | "content" | "citations" | "brand" | "competitor-gap"

export const recCategories: { id: RecCategory; label: string; blurb: string }[] = [
  { id: "technical", label: "Technical improvements", blurb: "Make the site readable and quotable by AI crawlers." },
  { id: "content", label: "Content improvements", blurb: "Answer the questions buyers actually put to engines." },
  { id: "citations", label: "Citation & authority", blurb: "Earn presence on the sources engines already trust." },
  { id: "brand", label: "Brand information", blurb: "Make who you are and what you do unambiguous." },
  { id: "competitor-gap", label: "Competitor gap plays", blurb: "Contest the prompts rivals currently own outright." },
]

export interface Recommendation {
  id: string
  title: string
  category: RecCategory
  priority: Priority
  status: WorkStatus
  /** Expected visibility-score points over 90 days. */
  impact: number
  effort: "low" | "medium" | "high"
  owner: string
  problem: string
  whyItMatters: string
  expectedBenefit: string
  action: string
  steps: string[]
  affectedPrompts: string[]
  auditIssueId?: string
  /** Set once work has started or finished. */
  startedAt?: string
  completedAt?: string
  /** Measured result, only present on completed items. */
  result?: string
}

export const recommendations: Recommendation[] = [
  {
    id: "r-01",
    title: "Publish a pricing page with a starting price and cost drivers",
    category: "content",
    priority: "critical",
    status: "needs-approval",
    impact: 9,
    effort: "medium",
    owner: "Elise Kaufman",
    problem:
      "Harborflow publishes no pricing anywhere. Engines answering pricing questions list only vendors with published tiers and say so explicitly.",
    whyItMatters:
      "Three purchase-intent prompts worth 4,720 monthly searches exclude us for this one reason. ChatGPT's answer names the cause: 'vendors that do not publish pricing, including Harborflow, could not be ranked here.'",
    expectedBenefit:
      "Entry into all three pricing prompts, plus a citable number for comparison answers. Modelled at +9 visibility points and roughly 34 additional monthly citations.",
    action:
      "Publish /pricing with a starting price, the three cost drivers, and a worked example at 2,000 invoices/month. A range is sufficient — engines need a citable figure, not a final quote.",
    steps: [
      "Agree the published starting price and what it includes (pricing committee)",
      "Draft the page: starting price, three cost drivers, worked example, FAQ block",
      "Add Offer schema and link from navigation and every product page",
      "Fill the pricing field on G2, Capterra and Software Advice profiles",
    ],
    affectedPrompts: ["p-011", "p-018", "p-019"],
    auditIssueId: "a-01",
  },
  {
    id: "r-02",
    title: "Build a trust page documenting SOC 2 Type II and data handling",
    category: "brand",
    priority: "critical",
    status: "in-progress",
    impact: 7,
    effort: "medium",
    owner: "Tom Brennan",
    problem:
      "We hold SOC 2 Type II but publish nothing about it. Perplexity states our certifications are 'referenced in third-party reviews but not on its own site'.",
    whyItMatters:
      "Security is a gate at evaluation stage. Nexora Pay's security portal is cited on every compliance prompt in the set, which also lifts them on adjacent prompts.",
    expectedBenefit: "Contest the compliance prompt (1,450 searches/month) and strengthen three evaluation-stage answers.",
    action:
      "Publish /security listing certifications with attestation dates, subprocessors, encryption posture, data residency and a report-request path.",
    steps: [
      "Collect current attestation dates and subprocessor list from Legal",
      "Draft page content and get Security sign-off",
      "Implement page with Organization schema and link from the footer and demo flow",
      "Request re-crawl and verify citation pickup over two cycles",
    ],
    affectedPrompts: ["p-016", "p-003"],
    auditIssueId: "a-02",
    startedAt: "2026-10-30",
  },
  {
    id: "r-03",
    title: "Unblock AI crawlers in robots.txt",
    category: "technical",
    priority: "critical",
    status: "completed",
    impact: 14,
    effort: "low",
    owner: "Tom Brennan",
    problem:
      "A blanket disallow from a 2025 scraping incident blocked GPTBot, OAI-SearchBot, PerplexityBot and ClaudeBot sitewide.",
    whyItMatters: "No engine could read any page. Nothing else we did could have worked until this was fixed.",
    expectedBenefit: "Baseline access for every engine, and the precondition for every other recommendation.",
    action: "Replace the blanket disallow with explicit allow rules per AI user-agent, keeping /app/ and /api/ disallowed.",
    steps: [
      "Audit current robots.txt and list blocked user-agents",
      "Add explicit allow rules for the eight AI crawlers we track",
      "Keep /app/ and /api/ disallowed; confirm with a fetch test per agent",
      "Verify crawl activity in server logs over 14 days",
    ],
    affectedPrompts: [],
    auditIssueId: "a-03",
    startedAt: "2026-04-05",
    completedAt: "2026-04-09",
    result: "Crawl hits from AI agents went from 0 to 1,840/week. Mention rate moved 17% → 25% over the next six weeks.",
  },
  {
    id: "r-04",
    title: "Server-render the comparison tables",
    category: "technical",
    priority: "high",
    status: "pending",
    impact: 5,
    effort: "medium",
    owner: "Tom Brennan",
    problem: "Comparison tables on six /compare pages are injected by JavaScript. Server HTML ships an empty table shell.",
    whyItMatters:
      "AI crawlers generally do not execute JavaScript, so our only comparison content is invisible to them. Our one winning comparison prompt cites the homepage instead.",
    expectedBenefit: "Makes existing content readable; prerequisite for the alternatives pages in r-11.",
    action: "Render comparison data server-side, or emit the same rows as a static table in the initial HTML.",
    steps: [
      "Move comparison data from the client fetch into the page payload",
      "Render the table in server HTML; keep sorting as client enhancement",
      "Re-test with a JavaScript-disabled fetch per page",
    ],
    affectedPrompts: ["p-010", "p-013"],
    auditIssueId: "a-04",
  },
  {
    id: "r-05",
    title: "Add SoftwareApplication and FAQPage schema to product pages",
    category: "technical",
    priority: "high",
    status: "needs-approval",
    impact: 6,
    effort: "medium",
    owner: "Tom Brennan",
    problem: "No Product, SoftwareApplication, Offer, FAQPage or AggregateRating markup exists anywhere on the site.",
    whyItMatters:
      "Gemini is our weakest engine and the one that most favours structured pages. Schema is what lets an engine state a capability as fact instead of hedging.",
    expectedBenefit: "Modelled at +6 points, concentrated on Gemini, plus better feature-level matching on exploration prompts.",
    action: "Add SoftwareApplication schema with featureList and offers to 14 product pages; FAQPage markup to the 9 pages with Q&A.",
    steps: [
      "Define the schema template and featureList vocabulary",
      "Implement via the CMS component so new pages inherit it",
      "Validate every page in the Rich Results test",
      "Re-run the site audit to confirm coverage",
    ],
    affectedPrompts: ["p-005", "p-015"],
    auditIssueId: "a-05",
  },
  {
    id: "r-06",
    title: "Document multi-entity approval workflows with a worked example",
    category: "content",
    priority: "high",
    status: "pending",
    impact: 4,
    effort: "low",
    owner: "Marcus Oyelaran",
    problem:
      "We support multi-entity approval hierarchies and inter-company allocation, and describe neither on the approvals page.",
    whyItMatters:
      "Nexora Pay wins a 1,300-search prompt on documentation alone. This is capability we already have and an answer we lose for free.",
    expectedBenefit: "Contest one evaluation prompt and strengthen the mid-market roundup case.",
    action:
      "Add a multi-entity section to /product/approvals with a three-entity worked example: shared vendor master, allocation split, approval matrix described in text.",
    steps: [
      "Interview two multi-entity customers for the real configuration",
      "Write the section with the matrix as an HTML table, not an image",
      "Cross-link from /product/payments and the ERP pages",
    ],
    affectedPrompts: ["p-015"],
    auditIssueId: "a-06",
  },
  {
    id: "r-07",
    title: "Claim and populate the Gartner Peer Insights listing",
    category: "citations",
    priority: "critical",
    status: "pending",
    impact: 8,
    effort: "medium",
    owner: "Dana Whitfield",
    problem: "We are the only tracked vendor with no Gartner Peer Insights presence.",
    whyItMatters:
      "Gemini and Claude treat Peer Insights as near-authoritative. Its 76 citations in our sample all favour Payline Ops and Nexora Pay.",
    expectedBenefit: "Modelled at +8 points on Gemini and Claude, roughly 34 additional monthly citations.",
    action: "Claim the vendor profile, complete the category and capability fields, then run a review campaign to the 15-review threshold.",
    steps: [
      "Claim the profile and verify domain ownership",
      "Complete category, capabilities and integrations fields",
      "Sequence review requests to 40 reference customers",
      "Reach 15 published reviews to enter the category view",
    ],
    affectedPrompts: ["p-005", "p-009"],
  },
  {
    id: "r-08",
    title: "Standardise the category phrase across site and third-party profiles",
    category: "brand",
    priority: "high",
    status: "needs-approval",
    impact: 6,
    effort: "medium",
    owner: "Elise Kaufman",
    problem:
      "We describe ourselves four different ways across 23 pages, and as 'Procurement software' on Capterra.",
    whyItMatters:
      "Engines cluster vendors by category phrase. Inconsistency dilutes every category prompt and is a plausible cause of our absence from mid-market roundups.",
    expectedBenefit: "Clearer category association on the two highest-volume commercial prompts.",
    action:
      "Standardise on 'accounts payable automation' in all titles, H1s and meta descriptions, and correct the four third-party profiles.",
    steps: [
      "Agree primary and secondary category phrasing",
      "Rewrite titles, H1s and meta descriptions on 23 pages",
      "Update G2, Capterra, Software Advice and TrustRadius profiles",
      "Re-audit for drift in 30 days",
    ],
    affectedPrompts: ["p-005", "p-013"],
    auditIssueId: "a-08",
  },
  {
    id: "r-09",
    title: "Add an integrations hub and cross-link ERP pages",
    category: "technical",
    priority: "medium",
    status: "completed",
    impact: 7,
    effort: "low",
    owner: "Tom Brennan",
    problem: "Eleven ERP integration pages sat at crawl depth four, reachable only from the footer.",
    whyItMatters: "These are our highest-citation pages and engines were finding them late and refreshing them rarely.",
    expectedBenefit: "Faster refresh and deeper sampling of the pages that already win prompts.",
    action: "Publish /integrations as a hub in the primary navigation and cross-link each product page to its ERP pages.",
    steps: [
      "Build the hub page listing all 11 integrations with capability summaries",
      "Add to primary navigation",
      "Cross-link from all 14 product pages",
      "Re-submit the sitemap",
    ],
    affectedPrompts: ["p-006", "p-007"],
    auditIssueId: "a-09",
    startedAt: "2026-05-14",
    completedAt: "2026-05-27",
    result:
      "NetSuite and Intacct prompts moved from position 3 to position 1 on all three primary engines. harborflow.io citations rose 31% quarter on quarter.",
  },
  {
    id: "r-10",
    title: "Publish the implementation methodology behind the 21-day claim",
    category: "content",
    priority: "high",
    status: "verification",
    impact: 5,
    effort: "low",
    owner: "Priya Raghunathan",
    problem: "The 21-day implementation claim has no published method, prerequisites or assumptions behind it.",
    whyItMatters:
      "It is already our most-quoted fact. Engines quote a number more confidently, and more often, when the method behind it is visible.",
    expectedBenefit: "Defends the one evaluation prompt we win outright and feeds the comparison pages.",
    action: "Publish the three-phase schedule with prerequisites, named roles, and what extends the timeline.",
    steps: [
      "Pull actual timelines from the last 40 implementations",
      "Write the week-by-week breakdown with stated assumptions",
      "Add to /implementation and link from comparison pages",
      "Verify the engines pick up the detail, not just the headline",
    ],
    affectedPrompts: ["p-014"],
    auditIssueId: "a-10",
    startedAt: "2026-09-16",
  },
  {
    id: "r-11",
    title: "Publish three neutral alternatives and comparison pages",
    category: "competitor-gap",
    priority: "critical",
    status: "needs-approval",
    impact: 11,
    effort: "high",
    owner: "Priya Raghunathan",
    problem:
      "Every cited source on alternatives prompts is competitor-authored. Settlewise's 'Payline Ops alternatives' page appears in three of our gap prompts.",
    whyItMatters:
      "Alternatives prompts are pure consideration-stage demand worth 5,900 monthly searches, and we are structurally absent from all of them.",
    expectedBenefit:
      "Largest modelled gain in the plan: +11 points and entry into three critical gap prompts within two crawl cycles.",
    action:
      "Publish Payline Ops alternatives, Nexora Pay alternatives, and a three-way comparison — each with stated criteria and an honest 'when we are the wrong choice' section.",
    steps: [
      "Agree comparison criteria and the honest-limitations position with Legal and Product",
      "Write three pages against the same criteria table",
      "Server-render the tables (depends on r-04)",
      "Cross-link from /compare and the pricing page",
      "Track prompt entry weekly for six weeks",
    ],
    affectedPrompts: ["p-009", "p-012", "p-013"],
    auditIssueId: "a-11",
  },
  {
    id: "r-12",
    title: "Publish an AP cost benchmark from our own customer data",
    category: "competitor-gap",
    priority: "high",
    status: "pending",
    impact: 8,
    effort: "high",
    owner: "Priya Raghunathan",
    problem: "Cost and ROI answers quote Payline Ops' benchmark and Ardent Partners. We publish no figures of our own.",
    whyItMatters:
      "Two prompts worth 4,650 monthly searches are answered entirely with a competitor's numbers, which makes their brand the category authority.",
    expectedBenefit: "A citable figure of our own, which historically earns citations well beyond the originating prompt.",
    action: "Publish a cost-per-invoice benchmark from anonymised customer data with methodology and sample size stated, plus an ROI model with visible assumptions.",
    steps: [
      "Define methodology and get Data sign-off on anonymisation",
      "Analyse 210 accounts for cost per invoice, cycle time and exception rate",
      "Publish report page plus a lightweight calculator",
      "Pitch the dataset to CFO Dive as a contributed piece (pairs with r-13)",
    ],
    affectedPrompts: ["p-002", "p-017"],
    auditIssueId: "a-12",
  },
  {
    id: "r-13",
    title: "Place a contributed article on CFO.com",
    category: "citations",
    priority: "high",
    status: "pending",
    impact: 5,
    effort: "high",
    owner: "Dana Whitfield",
    problem: "CFO.com is cited on both of our highest-volume commercial prompts. Payline Ops has three bylines there; we have none.",
    whyItMatters: "Trade-publication citations are the only neutral third-party signal we can influence directly.",
    expectedBenefit: "Roughly 22 monthly citations and a neutral source that mentions us on roundup prompts.",
    action: "Pitch the implementation-benchmark data as a contributed piece with an editorial angle, not a product story.",
    steps: [
      "Prepare the data summary (depends on r-12)",
      "Pitch three angles to the CFO.com editor",
      "Draft to their contributor guidelines",
      "Track citation pickup for 60 days after publication",
    ],
    affectedPrompts: ["p-002", "p-005"],
  },
  {
    id: "r-14",
    title: "Rewrite nine product pages answer-first",
    category: "content",
    priority: "medium",
    status: "pending",
    impact: 6,
    effort: "medium",
    owner: "Marcus Oyelaran",
    problem: "Nine product pages reach the factual description of the feature only after 400+ words of value proposition.",
    whyItMatters:
      "Engines extract from the opening of a page. Every page of ours that gets cited states a concrete fact in the first paragraph.",
    expectedBenefit: "Better feature-level matching across exploration and evaluation prompts.",
    action: "Add an answer-first opening to each page: what it does, who it is for, what it connects to, in plain terms.",
    steps: [
      "Draft openings for all nine pages against one template",
      "Review with Product for factual accuracy",
      "Publish and re-crawl",
    ],
    affectedPrompts: ["p-005", "p-015"],
    auditIssueId: "a-14",
  },
  {
    id: "r-15",
    title: "Run a G2 review campaign to reach mid-market grid placement",
    category: "citations",
    priority: "critical",
    status: "in-progress",
    impact: 10,
    effort: "medium",
    owner: "Dana Whitfield",
    problem: "G2 is cited in 11 of 20 tracked prompts. Our 128 reviews place us in 'Niche' while Payline Ops holds 1,340.",
    whyItMatters:
      "G2 grid position is the input engines use when they say 'most frequently recommended'. Capability is not what is missing — review volume is.",
    expectedBenefit: "Modelled at +10 points, the second-largest single gain available and the one that lifts roundup prompts.",
    action: "Sequence review requests to the 340 accounts past 90-day onboarding, targeting 95 additional recent reviews.",
    steps: [
      "Segment eligible accounts and set up the request sequence",
      "Launch in two waves with CSM follow-up",
      "Reach 95 new reviews inside the recency window",
      "Re-check grid placement and prompt entry after the next G2 refresh",
    ],
    affectedPrompts: ["p-005", "p-013", "p-009"],
    startedAt: "2026-10-12",
  },
  {
    id: "r-16",
    title: "Complete the Sage Intacct and Dynamics marketplace listings",
    category: "citations",
    priority: "medium",
    status: "completed",
    impact: 4,
    effort: "low",
    owner: "Marcus Oyelaran",
    problem: "Our NetSuite SuiteApp listing wins every NetSuite prompt. The Intacct and Dynamics listings were half-complete.",
    whyItMatters: "Marketplace listings are high-authority directories that engines treat as vendor-neutral confirmation.",
    expectedBenefit: "Replicates the NetSuite pattern on two more ERP prompt families.",
    action: "Complete all listing fields and attach the two-way sync documentation to each.",
    steps: [
      "Complete Sage Intacct marketplace fields and attach sync docs",
      "Complete Dynamics 365 AppSource listing",
      "Link both from /integrations",
    ],
    affectedPrompts: ["p-007"],
    startedAt: "2026-08-04",
    completedAt: "2026-08-21",
    result: "Sage Intacct prompt moved from position 4 to position 2 on ChatGPT and position 1 on Perplexity.",
  },
]

export const recommendationById = (id: string) => recommendations.find((r) => r.id === id)

export const recsByCategory = (category: RecCategory) => recommendations.filter((r) => r.category === category)

export const statusLabels: Record<WorkStatus, string> = {
  pending: "Pending",
  "needs-approval": "Needs approval",
  "in-progress": "In progress",
  verification: "Verification required",
  completed: "Completed",
}

export const statusOrder: WorkStatus[] = ["needs-approval", "in-progress", "verification", "pending", "completed"]

/** Total modelled upside still on the table. */
export const openImpact = recommendations
  .filter((r) => r.status !== "completed")
  .reduce((sum, r) => sum + r.impact, 0)

export const deliveredImpact = recommendations
  .filter((r) => r.status === "completed")
  .reduce((sum, r) => sum + r.impact, 0)
