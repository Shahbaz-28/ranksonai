import type { Severity, WorkStatus } from "./types"

export type AuditCategory =
  | "technical"
  | "crawlability"
  | "schema"
  | "content"
  | "services"
  | "identity"
  | "linking"
  | "missing"
  | "gaps"

export const auditCategories: { id: AuditCategory; label: string; blurb: string }[] = [
  { id: "technical", label: "Technical SEO", blurb: "Rendering, speed and markup fundamentals AI crawlers depend on." },
  { id: "crawlability", label: "Crawlability", blurb: "Whether AI user-agents can reach and read your pages at all." },
  { id: "schema", label: "Structured data", blurb: "Schema.org markup that lets engines quote facts with confidence." },
  { id: "content", label: "Content quality", blurb: "Answer-first structure, specificity and verifiable claims." },
  { id: "services", label: "Service & product info", blurb: "Whether each offering is described in citable detail." },
  { id: "identity", label: "Business identity", blurb: "Consistency of name, category, location and claims across the web." },
  { id: "linking", label: "Internal linking", blurb: "Whether supporting pages are discoverable from hub pages." },
  { id: "missing", label: "Missing information", blurb: "Facts buyers and engines expect to find and cannot." },
  { id: "gaps", label: "Content gaps", blurb: "Buyer questions with no page to answer them." },
]

export interface AuditIssue {
  id: string
  title: string
  category: AuditCategory
  severity: Severity
  status: WorkStatus
  /** Affected URL path, or a count summary for site-wide issues. */
  page: string
  pagesAffected: number
  explanation: string
  whyItMatters: string
  fix: string
  effort: "low" | "medium" | "high"
  detectedAt: string
  /** Tracked prompts this issue holds us back on. */
  affectedPrompts: string[]
  /** Linked recommendation, when one exists. */
  recommendationId?: string
}

export const auditIssues: AuditIssue[] = [
  {
    id: "a-01",
    title: "No pricing information published anywhere on the site",
    category: "missing",
    severity: "critical",
    status: "needs-approval",
    page: "/pricing (does not exist)",
    pagesAffected: 1,
    explanation:
      "There is no pricing page, no price range, and no pricing field filled in on third-party profiles. Every pricing answer about Harborflow is assembled from user-reported figures on review sites.",
    whyItMatters:
      "Three pricing prompts worth 4,720 monthly searches are answered by listing only vendors with published tiers. ChatGPT states outright that quote-only vendors 'could not be ranked here'. This is the single largest exclusion cause in the dataset.",
    fix: "Publish a pricing page with at least a starting price and the three dimensions that drive cost (invoice volume, entities, payment rails). A stated range is enough — engines need a citable number, not a final quote.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-011", "p-018", "p-019"],
    recommendationId: "r-01",
  },
  {
    id: "a-02",
    title: "No trust or security page despite holding SOC 2 Type II",
    category: "missing",
    severity: "critical",
    status: "in-progress",
    page: "/security (does not exist)",
    pagesAffected: 1,
    explanation:
      "SOC 2 Type II, SSO and data-residency details appear only in the sales deck and in third-party review text. The site has no security, compliance or trust page.",
    whyItMatters:
      "On the compliance prompt, Perplexity says our certifications are 'referenced in third-party reviews but not on its own site' — the engine wants to confirm it and cannot. Nexora Pay's security portal takes the citation instead.",
    fix: "Publish a trust page listing certifications with attestation dates, subprocessors, encryption posture and a report-request path. Mark it up with Organization schema.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-016", "p-003"],
    recommendationId: "r-02",
  },
  {
    id: "a-03",
    title: "GPTBot and PerplexityBot blocked by robots.txt",
    category: "crawlability",
    severity: "critical",
    status: "completed",
    page: "/robots.txt",
    pagesAffected: 412,
    explanation:
      "A blanket disallow added during a 2025 scraping incident blocked GPTBot, OAI-SearchBot, PerplexityBot and ClaudeBot across the whole site.",
    whyItMatters:
      "While this was live no AI engine could read any page, so even perfect content could not be cited. Mention rate was flat at 17% for the first two months of tracking.",
    fix: "Replace the blanket disallow with explicit allow rules for AI user-agents, keeping /app/ and /api/ disallowed.",
    effort: "low",
    detectedAt: "2026-04-04",
    affectedPrompts: [],
    recommendationId: "r-03",
  },
  {
    id: "a-04",
    title: "Comparison pages render client-side only",
    category: "technical",
    severity: "serious",
    status: "pending",
    page: "/compare/* (6 pages)",
    pagesAffected: 6,
    explanation:
      "The comparison table on each /compare page is hydrated by JavaScript after load. Server HTML contains headings and an empty table shell.",
    whyItMatters:
      "Most AI crawlers do not execute JavaScript. The pages appear to contain no comparison data, which is why our one winning comparison prompt cites the homepage rather than the comparison page.",
    fix: "Server-render the comparison tables, or emit the same data as a static table inside the initial HTML.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-010", "p-013"],
    recommendationId: "r-04",
  },
  {
    id: "a-05",
    title: "No Product or SoftwareApplication schema on product pages",
    category: "schema",
    severity: "serious",
    status: "needs-approval",
    page: "/product/* (14 pages)",
    pagesAffected: 14,
    explanation:
      "Product pages carry Organization and WebPage schema only. No SoftwareApplication, Offer, FAQPage or AggregateRating markup is present anywhere on the site.",
    whyItMatters:
      "Gemini shows a measurable preference for pages with Product and FAQ schema; it is the engine where we are weakest. Structured facts are what let an engine state a feature as fact rather than hedge.",
    fix: "Add SoftwareApplication schema with featureList and offers to each product page, and FAQPage markup to the 9 pages that already have Q&A sections.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-005", "p-015"],
    recommendationId: "r-05",
  },
  {
    id: "a-06",
    title: "Multi-entity approval capability documented nowhere",
    category: "services",
    severity: "serious",
    status: "pending",
    page: "/product/approvals",
    pagesAffected: 1,
    explanation:
      "The approvals page describes rules and thresholds generically. Multi-entity hierarchies and inter-company allocation — both supported — are not mentioned.",
    whyItMatters:
      "An evaluation prompt worth 1,300 searches a month is won by Nexora Pay purely on documentation. We have the capability and lose the answer anyway.",
    fix: "Add a multi-entity section with a worked example: three entities, shared vendor master, allocation split, approval matrix screenshot described in text.",
    effort: "low",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-015"],
    recommendationId: "r-06",
  },
  {
    id: "a-07",
    title: "Payment orchestration pages have no detail pages per rail",
    category: "services",
    severity: "warning",
    status: "pending",
    page: "/product/payments",
    pagesAffected: 1,
    explanation:
      "ACH, virtual card, wire and international payments are listed as bullet points on a single page with no supporting detail.",
    whyItMatters:
      "Rail-specific prompts ('AP automation with virtual card rebates') cannot match a bullet list. Competitors have a page per rail.",
    fix: "Split into four pages, each stating fees, settlement time, country coverage and ERP posting behaviour.",
    effort: "high",
    detectedAt: "2026-10-28",
    affectedPrompts: [],
  },
  {
    id: "a-08",
    title: "Category name inconsistent across the site and profiles",
    category: "identity",
    severity: "serious",
    status: "needs-approval",
    page: "Site-wide (23 pages) + 4 external profiles",
    pagesAffected: 23,
    explanation:
      "We describe ourselves as 'AP automation', 'invoice-to-pay', 'spend management' and 'finance operations platform' across different pages, and as 'Procurement software' on Capterra.",
    whyItMatters:
      "Engines cluster vendors by category phrase. Inconsistent self-description dilutes every category prompt and is a likely cause of our absence from mid-market roundups.",
    fix: "Standardise on 'accounts payable automation' as the primary category phrase in all titles, H1s, meta descriptions and third-party profiles. Keep 'invoice-to-pay' as a secondary phrase only in body copy.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-005", "p-013"],
    recommendationId: "r-08",
  },
  {
    id: "a-09",
    title: "Integration pages are orphaned from the main navigation",
    category: "linking",
    severity: "warning",
    status: "completed",
    page: "/integrations/* (11 pages)",
    pagesAffected: 11,
    explanation:
      "The eleven ERP integration pages were reachable only from the footer and a blog post. Nine had zero internal links from product pages.",
    whyItMatters:
      "These are our highest-citation pages. Crawl depth of four or more meant AI crawlers found them late and refreshed them rarely.",
    fix: "Add an integrations hub linked from the primary navigation, and cross-link each product page to its relevant ERP pages.",
    effort: "low",
    detectedAt: "2026-05-12",
    affectedPrompts: ["p-006", "p-007"],
    recommendationId: "r-09",
  },
  {
    id: "a-10",
    title: "No published implementation methodology beyond the headline claim",
    category: "content",
    severity: "warning",
    status: "verification",
    page: "/implementation",
    pagesAffected: 1,
    explanation:
      "The page claims a 21-day implementation but gives no week-by-week breakdown, prerequisites or assumptions.",
    whyItMatters:
      "The claim is already our most-quoted fact. Engines that can see the method behind a number quote it more confidently and more often.",
    fix: "Publish the three-phase schedule with prerequisites, named roles and what extends the timeline. State assumptions explicitly.",
    effort: "low",
    detectedAt: "2026-09-14",
    affectedPrompts: ["p-014"],
    recommendationId: "r-10",
  },
  {
    id: "a-11",
    title: "No 'alternatives' or competitor-comparison content for rival brands",
    category: "gaps",
    severity: "critical",
    status: "needs-approval",
    page: "Missing (3 pages)",
    pagesAffected: 3,
    explanation:
      "We publish one comparison page (vs Payline Ops) and no alternatives pages. Settlewise publishes four, and its 'Payline Ops alternatives' page is cited in three of our gap prompts.",
    whyItMatters:
      "Alternatives prompts are pure consideration-stage demand worth 5,900 searches a month combined, and every cited source on them is competitor-authored.",
    fix: "Publish three neutral pages: Payline Ops alternatives, Nexora Pay alternatives, and a three-way comparison that includes both. State comparison criteria and where we are the wrong choice.",
    effort: "high",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-012", "p-013", "p-009"],
    recommendationId: "r-11",
  },
  {
    id: "a-12",
    title: "No cost or ROI benchmark data of our own",
    category: "gaps",
    severity: "serious",
    status: "pending",
    page: "Missing (1 page + model)",
    pagesAffected: 1,
    explanation:
      "Cost-per-invoice and payback answers quote Payline Ops' benchmark study and Ardent Partners. We publish no figures from our own customer base.",
    whyItMatters:
      "Two discovery and evaluation prompts worth 4,650 monthly searches are answered entirely with a competitor's numbers, which makes their brand the category authority.",
    fix: "Publish an AP cost benchmark from anonymised customer data with methodology and sample size stated, plus a simple ROI model with visible assumptions.",
    effort: "high",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-002", "p-017"],
    recommendationId: "r-12",
  },
  {
    id: "a-13",
    title: "H1 and title tag duplicated across 31 pages",
    category: "technical",
    severity: "warning",
    status: "pending",
    page: "Site-wide (31 pages)",
    pagesAffected: 31,
    explanation:
      "Thirty-one pages share the title 'Harborflow | AP Automation Platform', including nine integration pages and six comparison pages.",
    whyItMatters:
      "Duplicate titles make it harder for an engine to tell which page answers which question, and reduce the chance the right page is selected as a source.",
    fix: "Generate titles from page subject: '<Service> for <ERP> | Harborflow' on integration pages, '<Us> vs <Them>' on comparisons.",
    effort: "low",
    detectedAt: "2026-10-28",
    affectedPrompts: [],
  },
  {
    id: "a-14",
    title: "Service pages bury the answer below marketing copy",
    category: "content",
    severity: "warning",
    status: "pending",
    page: "/product/* (9 of 14 pages)",
    pagesAffected: 9,
    explanation:
      "Nine product pages open with a value proposition and reach the factual description of what the feature does only after 400+ words.",
    whyItMatters:
      "Engines extract from the opening of a page. The pages of ours that do get cited all state a concrete fact in the first paragraph.",
    fix: "Add an answer-first opening paragraph to each page: what it does, who it is for, what it connects to, in plain terms.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: ["p-005", "p-015"],
    recommendationId: "r-14",
  },
  {
    id: "a-15",
    title: "Largest Contentful Paint 4.8s on product pages",
    category: "technical",
    severity: "warning",
    status: "pending",
    page: "/product/* (14 pages)",
    pagesAffected: 14,
    explanation: "An unoptimised hero video poster and three blocking third-party scripts push LCP to 4.8s on mobile.",
    whyItMatters:
      "Slow pages are crawled less often and sampled less deeply. It is a second-order effect on citations, but it compounds with crawl depth.",
    fix: "Replace the video poster with a compressed image, defer the chat widget and move analytics to a server-side container.",
    effort: "medium",
    detectedAt: "2026-10-28",
    affectedPrompts: [],
  },
  {
    id: "a-16",
    title: "FAQ sections present on 9 pages but not marked up",
    category: "schema",
    severity: "info",
    status: "pending",
    page: "9 pages",
    pagesAffected: 9,
    explanation: "Nine pages have question-and-answer sections rendered as plain headings and paragraphs.",
    whyItMatters: "FAQPage markup is the cheapest way to make an existing answer machine-readable.",
    fix: "Wrap existing Q&A blocks in FAQPage schema. No copy changes needed.",
    effort: "low",
    detectedAt: "2026-10-28",
    affectedPrompts: [],
  },
]

export const auditIssueById = (id: string) => auditIssues.find((i) => i.id === id)

export const issuesByCategory = (category: AuditCategory) => auditIssues.filter((i) => i.category === category)

export const severityOrder: Severity[] = ["critical", "serious", "warning", "info"]

export const severityCounts = severityOrder.map((severity) => ({
  severity,
  count: auditIssues.filter((i) => i.severity === severity).length,
}))

/** Category scores shown on the audit overview, 0–100. */
export const auditScores: Record<AuditCategory, number> = {
  technical: 71,
  crawlability: 94,
  schema: 38,
  content: 62,
  services: 58,
  identity: 49,
  linking: 83,
  missing: 31,
  gaps: 27,
}

export const auditSummary = {
  score: 57,
  scoreDelta: 11,
  pagesCrawled: 412,
  pagesWithIssues: 118,
  lastRun: "2026-11-02T04:15:00Z",
  previousRun: "2026-10-26T04:15:00Z",
  openIssues: auditIssues.filter((i) => i.status !== "completed").length,
  resolvedIssues: auditIssues.filter((i) => i.status === "completed").length,
}
