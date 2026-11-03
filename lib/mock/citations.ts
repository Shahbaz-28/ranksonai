import type { PlatformId, Priority, SourceType } from "./types"

export interface CitedSource {
  /** Slug used in URLs — the domain with dots replaced by dashes. */
  slug: string
  domain: string
  label: string
  type: SourceType
  /** Times this domain was cited across the 210 sampled responses. */
  citations: number
  citationsDelta: number
  /** Share of all citations in the category, percent. */
  share: number
  /** Authority estimate 0–100 used for prioritisation. */
  authority: number
  /** Do answers citing this source mention us? */
  mentionsUs: boolean
  /** Competitor slugs that this source favours. */
  favours: string[]
  platforms: PlatformId[]
  /** Prompt ids whose answers cited this domain. */
  prompts: string[]
  summary: string
  /** What we would need to do to earn or improve presence here. */
  action?: string
}

export const citedSources: CitedSource[] = [
  {
    slug: "g2-com",
    domain: "g2.com",
    label: "G2",
    type: "review",
    citations: 188,
    citationsDelta: 12,
    share: 17.4,
    authority: 92,
    mentionsUs: true,
    favours: ["payline-ops", "settlewise"],
    platforms: ["chatgpt", "gemini", "perplexity", "claude"],
    prompts: ["p-003", "p-005", "p-006", "p-007", "p-009", "p-010", "p-012", "p-013", "p-014", "p-016", "p-018"],
    summary:
      "The single most cited source in the category. Appears in 11 of our 20 tracked prompts and anchors every 'best tools' answer.",
    action:
      "We hold 128 reviews against Payline Ops' 1,340. G2 category placement follows review volume, so a review drive is the lever.",
  },
  {
    slug: "harborflow-io",
    domain: "harborflow.io",
    label: "Harborflow (owned)",
    type: "owned",
    citations: 86,
    citationsDelta: 31,
    share: 7.9,
    authority: 61,
    mentionsUs: true,
    favours: ["harborflow"],
    platforms: ["chatgpt", "gemini", "perplexity"],
    prompts: ["p-001", "p-003", "p-006", "p-007", "p-010", "p-012", "p-014", "p-018", "p-020"],
    summary:
      "Our own site is now the second most cited source for prompts we win. Integration docs and the implementation benchmark do most of the work.",
    action: "Extend the pattern: the pages that get cited all state a concrete, checkable fact in the first paragraph.",
  },
  {
    slug: "capterra-com",
    domain: "capterra.com",
    label: "Capterra",
    type: "review",
    citations: 171,
    citationsDelta: 6,
    share: 15.8,
    authority: 88,
    mentionsUs: true,
    favours: ["payline-ops", "nexora-pay"],
    platforms: ["chatgpt", "gemini", "claude", "copilot"],
    prompts: ["p-001", "p-005", "p-006", "p-007", "p-009", "p-011", "p-012", "p-013", "p-015", "p-018"],
    summary: "Gemini's most-used source. Our profile is complete but has no recent reviews and no pricing field filled in.",
    action: "Fill the pricing field and refresh the feature matrix — Gemini quotes both directly.",
  },
  {
    slug: "reddit-com",
    domain: "reddit.com",
    label: "Reddit (r/Accounting, r/netsuite)",
    type: "community",
    citations: 142,
    citationsDelta: 24,
    share: 13.1,
    authority: 74,
    mentionsUs: true,
    favours: ["settlewise", "payline-ops"],
    platforms: ["perplexity", "chatgpt"],
    prompts: ["p-002", "p-008", "p-009", "p-010", "p-011", "p-013", "p-014", "p-018", "p-019"],
    summary:
      "Perplexity cites Reddit threads in two thirds of its answers. We appear in threads but usually as an aside rather than a recommendation.",
    action: "Practitioner-led answers in r/netsuite implementation threads are the realistic path; no promotional posting.",
  },
  {
    slug: "paylineops-com",
    domain: "paylineops.com",
    label: "Payline Ops (competitor)",
    type: "owned",
    citations: 164,
    citationsDelta: -4,
    share: 15.1,
    authority: 79,
    mentionsUs: false,
    favours: ["payline-ops"],
    platforms: ["chatgpt", "gemini", "perplexity", "claude", "copilot"],
    prompts: ["p-001", "p-002", "p-005", "p-007", "p-009", "p-016", "p-017", "p-019", "p-020"],
    summary:
      "Competitor-owned content cited as if neutral — their benchmark study and ROI calculator are quoted as category facts.",
    action: "Publish our own benchmark with stated methodology; engines quote whichever study is citable.",
  },
  {
    slug: "nexorapay-com",
    domain: "nexorapay.com",
    label: "Nexora Pay (competitor)",
    type: "owned",
    citations: 142,
    citationsDelta: 9,
    share: 13.1,
    authority: 76,
    mentionsUs: false,
    favours: ["nexora-pay"],
    platforms: ["chatgpt", "gemini", "perplexity", "copilot"],
    prompts: ["p-003", "p-004", "p-005", "p-012", "p-015", "p-016", "p-019"],
    summary: "Their security portal and multi-entity documentation are the default citation for trust and workflow prompts.",
    action: "Two pages of ours — a trust page and a multi-entity workflow page — would contest five of these seven prompts.",
  },
  {
    slug: "cfodive-com",
    domain: "cfodive.com",
    label: "CFO Dive",
    type: "publication",
    citations: 64,
    citationsDelta: 3,
    share: 5.9,
    authority: 81,
    mentionsUs: true,
    favours: [],
    platforms: ["chatgpt", "gemini", "claude"],
    prompts: ["p-001", "p-003", "p-014", "p-017"],
    summary: "Neutral trade publication. One contributed article from our VP Finance already earns citations.",
    action: "A second contributed piece on implementation benchmarks is the highest-yield earned-media play.",
  },
  {
    slug: "trustradius-com",
    domain: "trustradius.com",
    label: "TrustRadius",
    type: "review",
    citations: 58,
    citationsDelta: 7,
    share: 5.4,
    authority: 83,
    mentionsUs: true,
    favours: ["payline-ops"],
    platforms: ["chatgpt", "perplexity"],
    prompts: ["p-003", "p-005", "p-006", "p-007", "p-009"],
    summary: "Smaller volume but heavily weighted by ChatGPT for mid-market prompts.",
    action: "Only 9 reviews on our profile. Twenty would move the category placement.",
  },
  {
    slug: "gartner-com",
    domain: "gartner.com",
    label: "Gartner Peer Insights",
    type: "directory",
    citations: 76,
    citationsDelta: 2,
    share: 7.0,
    authority: 95,
    mentionsUs: false,
    favours: ["nexora-pay", "payline-ops"],
    platforms: ["gemini", "claude"],
    prompts: ["p-005", "p-009"],
    summary: "Gemini treats Gartner as near-authoritative. We have no Peer Insights presence at all.",
    action: "Claim the Peer Insights listing and collect the 15 reviews needed to appear in the category view.",
  },
  {
    slug: "settlewise-com",
    domain: "settlewise.com",
    label: "Settlewise (competitor)",
    type: "owned",
    citations: 118,
    citationsDelta: 14,
    share: 10.9,
    authority: 70,
    mentionsUs: false,
    favours: ["settlewise"],
    platforms: ["chatgpt", "gemini", "perplexity"],
    prompts: ["p-004", "p-011", "p-013", "p-016", "p-017", "p-019"],
    summary:
      "Their alternatives and pricing pages are cited across six prompts. The 'Payline Ops alternatives' page alone appears in three.",
    action: "Direct template to copy: a neutral alternatives page with a comparison table and stated criteria.",
  },
  {
    slug: "journalofaccountancy-com",
    domain: "journalofaccountancy.com",
    label: "Journal of Accountancy",
    type: "publication",
    citations: 44,
    citationsDelta: 1,
    share: 4.1,
    authority: 86,
    mentionsUs: false,
    favours: [],
    platforms: ["chatgpt", "gemini"],
    prompts: ["p-001", "p-002"],
    summary: "Used for definitional and process answers. Vendor-neutral, so inclusion comes via contributed expertise.",
  },
  {
    slug: "accountingtoday-com",
    domain: "accountingtoday.com",
    label: "Accounting Today",
    type: "publication",
    citations: 39,
    citationsDelta: 4,
    share: 3.6,
    authority: 84,
    mentionsUs: true,
    favours: ["settlewise"],
    platforms: ["gemini", "claude"],
    prompts: ["p-004", "p-014"],
    summary: "Our 2026 product launch coverage still earns citations seven months on.",
  },
  {
    slug: "netsuite-com",
    domain: "netsuite.com",
    label: "Oracle NetSuite marketplace",
    type: "directory",
    citations: 41,
    citationsDelta: 11,
    share: 3.8,
    authority: 90,
    mentionsUs: true,
    favours: ["harborflow"],
    platforms: ["chatgpt", "gemini", "perplexity"],
    prompts: ["p-006", "p-007"],
    summary: "Our SuiteApp listing is the reason we win every NetSuite prompt. The strongest third-party asset we own.",
    action: "Mirror this with the Sage Intacct and Dynamics marketplaces, where our listings are incomplete.",
  },
  {
    slug: "ardentpartners-com",
    domain: "ardentpartners.com",
    label: "Ardent Partners",
    type: "publication",
    citations: 28,
    citationsDelta: 0,
    share: 2.6,
    authority: 78,
    mentionsUs: false,
    favours: ["payline-ops"],
    platforms: ["chatgpt", "perplexity"],
    prompts: ["p-002", "p-017"],
    summary: "Independent benchmark data. Cited whenever an answer needs a cost or payback figure.",
    action: "Participate in their next AP benchmark survey to be named in the vendor set.",
  },
]

export const sourceBySlug = (slug: string) => citedSources.find((s) => s.slug === slug)

export const ownedSources = citedSources.filter((s) => s.type === "owned" && s.favours.includes("harborflow"))
export const competitorOwnedSources = citedSources.filter((s) => s.type === "owned" && !s.favours.includes("harborflow"))
export const thirdPartySources = citedSources.filter((s) => s.type !== "owned")

export interface CitationOpportunity {
  id: string
  domain: string
  label: string
  type: SourceType
  priority: Priority
  /** Estimated citations per month if we were present. */
  estimatedCitations: number
  effort: "low" | "medium" | "high"
  /** Competitors already present on this source. */
  competitorsPresent: string[]
  rationale: string
  firstStep: string
}

export const citationOpportunities: CitationOpportunity[] = [
  {
    id: "co-01",
    domain: "gartner.com",
    label: "Gartner Peer Insights listing",
    type: "directory",
    priority: "critical",
    estimatedCitations: 34,
    effort: "medium",
    competitorsPresent: ["Payline Ops", "Nexora Pay", "Settlewise"],
    rationale: "Gemini and Claude both weight Peer Insights heavily. We are the only tracked vendor with no listing.",
    firstStep: "Claim the vendor profile, then run a review campaign to the 15-review threshold.",
  },
  {
    id: "co-02",
    domain: "g2.com",
    label: "G2 mid-market grid placement",
    type: "review",
    priority: "critical",
    estimatedCitations: 48,
    effort: "medium",
    competitorsPresent: ["Payline Ops", "Nexora Pay", "Settlewise", "Corvus AP"],
    rationale:
      "G2 is cited in 11 of 20 tracked prompts. Our 128 reviews put us in 'Niche'; 'Momentum Leader' needs ~95 more recent reviews.",
    firstStep: "Sequence review requests to the 340 accounts past 90-day onboarding.",
  },
  {
    id: "co-03",
    domain: "sageintacct.com",
    label: "Sage Intacct marketplace listing",
    type: "directory",
    priority: "high",
    estimatedCitations: 19,
    effort: "low",
    competitorsPresent: ["Payline Ops"],
    rationale: "Our NetSuite listing wins every NetSuite prompt. The Intacct equivalent is half-complete.",
    firstStep: "Complete the listing fields and attach the two-way sync documentation.",
  },
  {
    id: "co-04",
    domain: "cfo.com",
    label: "CFO.com contributed article",
    type: "publication",
    priority: "high",
    estimatedCitations: 22,
    effort: "high",
    competitorsPresent: ["Payline Ops", "Nexora Pay"],
    rationale: "Cited in the two highest-volume commercial prompts. Payline Ops has three bylines there; we have none.",
    firstStep: "Pitch the implementation-benchmark data as a contributed piece.",
  },
  {
    id: "co-05",
    domain: "softwareadvice.com",
    label: "Software Advice category profile",
    type: "review",
    priority: "medium",
    estimatedCitations: 12,
    effort: "low",
    competitorsPresent: ["Payline Ops", "Nexora Pay", "Settlewise", "Ledgerloop"],
    rationale: "Low authority but cited by Gemini on alternatives prompts, where we are weakest.",
    firstStep: "Claim and complete the profile, including the pricing range field.",
  },
  {
    id: "co-06",
    domain: "ardentpartners.com",
    label: "Ardent Partners AP benchmark",
    type: "publication",
    priority: "medium",
    estimatedCitations: 15,
    effort: "high",
    competitorsPresent: ["Payline Ops"],
    rationale: "The independent figure engines reach for on cost and ROI prompts.",
    firstStep: "Register for the 2027 benchmark survey vendor set before the January cut-off.",
  },
]

/** Donut/stack data for the citation mix. */
export const citationMix = [
  { type: "Review platforms", value: 34, color: "#2a78d6" },
  { type: "Competitor-owned", value: 26, color: "#eb6834" },
  { type: "Community", value: 13, color: "#1baf7a" },
  { type: "Trade publications", value: 16, color: "#eda100" },
  { type: "Our own site", value: 8, color: "#e87ba4" },
  { type: "Directories", value: 3, color: "#6250d6" },
]

export const citationTotals = {
  sampledResponses: 210,
  totalCitations: 1083,
  uniqueDomains: 142,
  ourCitations: 86,
  ourShare: 7.9,
  ourShareDelta: 2.4,
}
