import type { FunnelStage, PlatformId, Priority, SearchIntent } from "./types"

export interface PromptResponse {
  platform: PlatformId
  /** Was Harborflow named anywhere in the answer? */
  appeared: boolean
  /** Rank in the answer's list, when the answer was a list. */
  position: number | null
  checkedAt: string
  /** Excerpt of the engine's answer, as captured during the run. */
  answer: string
  /** Brands named in the answer, in the order the engine listed them. */
  brandsMentioned: string[]
  citations: string[]
  /** Analyst note explaining the result — the "why" behind an absence. */
  note?: string
}

export interface TrackedPrompt {
  id: string
  question: string
  stage: FunnelStage
  intent: SearchIntent
  priority: Priority
  /** Estimated monthly buyer searches for this question shape. */
  monthlyVolume: number
  responses: PromptResponse[]
  /** The brand that most often wins this prompt. */
  topBrand: string
  opportunity?: string
}

export const stageLabels: Record<FunnelStage, string> = {
  discovery: "Discovery",
  exploration: "Exploration",
  comparison: "Comparison",
  evaluation: "Evaluation",
  purchase: "Purchase intent",
}

export const stageDescriptions: Record<FunnelStage, string> = {
  discovery: "Buyer is naming the problem and does not yet know the category exists.",
  exploration: "Buyer is mapping the category and building a longlist of vendors.",
  comparison: "Buyer is weighing named vendors against each other.",
  evaluation: "Buyer is validating fit, security, effort and proof before a shortlist.",
  purchase: "Buyer is ready to price, trial or talk to sales.",
}

export const prompts: TrackedPrompt[] = [
  {
    id: "p-001",
    question: "What is accounts payable automation and how does it work?",
    stage: "discovery",
    intent: "informational",
    priority: "medium",
    monthlyVolume: 5400,
    topBrand: "Payline Ops",
    opportunity: "Definitional answers rarely name vendors, but the cited explainer wins the follow-up prompt.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T09:12:00Z",
        answer:
          "Accounts payable automation replaces manual invoice handling with software that captures invoice data, routes approvals, and schedules payments. A typical workflow ingests an invoice by email or scan, extracts line items with OCR, matches it to a purchase order, then routes it for approval based on amount and cost centre.",
        brandsMentioned: [],
        citations: ["investopedia.com", "journalofaccountancy.com", "paylineops.com"],
        note: "Answer is purely definitional. Payline Ops' explainer is cited as the worked example, so it owns the follow-up.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T09:14:00Z",
        answer:
          "AP automation digitises the invoice-to-pay cycle. Most platforms handle capture, coding, approval routing, payment execution and reconciliation back into your ERP, and reduce per-invoice processing cost from roughly $12 to under $3.",
        brandsMentioned: [],
        citations: ["journalofaccountancy.com", "cfodive.com", "capterra.com"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 2,
        checkedAt: "2026-11-01T09:16:00Z",
        answer:
          "Accounts payable automation software handles invoice capture, approval routing and payment execution without manual data entry. Vendors such as Payline Ops and Harborflow describe a four-stage cycle — capture, code, approve, pay — with the ERP as the system of record.",
        brandsMentioned: ["Payline Ops", "Harborflow"],
        citations: ["harborflow.io", "paylineops.com", "journalofaccountancy.com"],
        note: "Our 'What is AP automation' guide is cited. This is the only engine where the guide surfaces.",
      },
    ],
  },
  {
    id: "p-002",
    question: "How can a mid-market finance team reduce invoice processing costs?",
    stage: "discovery",
    intent: "informational",
    priority: "high",
    monthlyVolume: 2900,
    topBrand: "Payline Ops",
    opportunity: "We have no cost-reduction content with benchmark numbers, so engines quote a competitor's study.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T09:20:00Z",
        answer:
          "The largest savings come from removing manual data entry and chasing approvals by email. Payline Ops' 2026 benchmark puts fully manual processing at $11.60 per invoice versus $2.40 once capture and approval routing are automated.",
        brandsMentioned: ["Payline Ops"],
        citations: ["paylineops.com", "cfo.com", "ardentpartners.com"],
        note: "The answer is built around a single cited benchmark study. We publish no equivalent figure.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T09:22:00Z",
        answer:
          "Consolidate invoice intake into one channel, automate three-way matching, and move approvals into a rules engine. Industry benchmarks suggest a 60–75% reduction in processing cost per invoice.",
        brandsMentioned: ["Payline Ops", "Nexora Pay"],
        citations: ["cfodive.com", "paylineops.com", "nexorapay.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T09:24:00Z",
        answer:
          "Start by measuring cost per invoice, then attack the three biggest drivers: manual coding, approval delay and payment errors. Published benchmarks from Payline Ops and Ardent Partners are the most commonly cited figures.",
        brandsMentioned: ["Payline Ops"],
        citations: ["paylineops.com", "ardentpartners.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-003",
    question: "What should finance leaders look for in an invoice-to-pay platform?",
    stage: "discovery",
    intent: "informational",
    priority: "medium",
    monthlyVolume: 1700,
    topBrand: "Nexora Pay",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 3,
        checkedAt: "2026-11-01T10:02:00Z",
        answer:
          "Prioritise ERP fit, approval flexibility, payment rails and audit trail. Vendors differ most on ERP depth — Nexora Pay and Harborflow both publish integration detail per ERP, which makes them easier to evaluate.",
        brandsMentioned: ["Nexora Pay", "Payline Ops", "Harborflow"],
        citations: ["cfodive.com", "nexorapay.com", "harborflow.io"],
      },
      {
        platform: "gemini",
        appeared: true,
        position: 4,
        checkedAt: "2026-11-01T10:04:00Z",
        answer:
          "Look for native ERP sync, configurable approval matrices, SOC 2 Type II attestation, and a clear implementation timeline. Harborflow documents a 21-day implementation; Nexora Pay publishes a security portal.",
        brandsMentioned: ["Nexora Pay", "Settlewise", "Payline Ops", "Harborflow"],
        citations: ["nexorapay.com", "harborflow.io", "g2.com"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 2,
        checkedAt: "2026-11-01T10:06:00Z",
        answer:
          "The evaluation criteria that matter most are ERP coverage, approval configurability, and time to go live. Harborflow's integration library and Nexora Pay's security documentation are the two most frequently referenced sources.",
        brandsMentioned: ["Harborflow", "Nexora Pay"],
        citations: ["harborflow.io", "nexorapay.com", "trustradius.com"],
      },
    ],
  },
  {
    id: "p-004",
    question: "Signs your finance team has outgrown manual accounts payable",
    stage: "discovery",
    intent: "informational",
    priority: "medium",
    monthlyVolume: 1200,
    topBrand: "Nexora Pay",
    opportunity: "A symptoms-style article with a self-assessment would be quotable here.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T10:12:00Z",
        answer:
          "Common signals: month-end close slipping past day ten, more than 2% duplicate payments, approvals tracked in email, and no visibility into accrued liabilities until close. Nexora Pay's readiness checklist is the most cited framing of these symptoms.",
        brandsMentioned: ["Nexora Pay"],
        citations: ["nexorapay.com", "cfo.com"],
        note: "Nexora Pay owns this prompt with a single checklist page. We have no comparable asset.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T10:14:00Z",
        answer:
          "If your AP clerk spends more than half their week on data entry, or you cannot answer 'what do we owe right now' without a spreadsheet, you have outgrown manual AP.",
        brandsMentioned: ["Nexora Pay"],
        citations: ["nexorapay.com", "accountingtoday.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T10:16:00Z",
        answer:
          "Watch for invoice volume above 500/month per AP clerk, repeated late-payment fees, and approval cycles longer than five days.",
        brandsMentioned: ["Nexora Pay", "Settlewise"],
        citations: ["nexorapay.com", "reddit.com", "settlewise.com"],
      },
    ],
  },
  {
    id: "p-005",
    question: "Best accounts payable automation software for mid-market companies",
    stage: "exploration",
    intent: "commercial",
    priority: "critical",
    monthlyVolume: 8100,
    topBrand: "Payline Ops",
    opportunity:
      "Highest-volume prompt in the set and we appear on none of the three primary engines. All three answers are assembled from the same four roundups.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T11:02:00Z",
        answer:
          "For mid-market finance teams the most frequently recommended platforms are Payline Ops, Nexora Pay, Settlewise and Corvus AP. Payline Ops is usually named first for breadth of ERP support and depth of review coverage.",
        brandsMentioned: ["Payline Ops", "Nexora Pay", "Settlewise", "Corvus AP"],
        citations: ["g2.com", "capterra.com", "cfo.com", "paylineops.com"],
        note:
          "We are absent from all four cited sources' mid-market lists. G2's grid places us in 'Niche' because of review volume, not capability.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T11:05:00Z",
        answer:
          "Top options include Payline Ops, Nexora Pay and Settlewise. Payline Ops and Nexora Pay lead on analyst coverage; Settlewise is often suggested for teams under 500 employees.",
        brandsMentioned: ["Payline Ops", "Nexora Pay", "Settlewise"],
        citations: ["capterra.com", "gartner.com", "softwareadvice.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T11:08:00Z",
        answer:
          "The shortlist most reviewers converge on is Payline Ops, Nexora Pay, Settlewise and Corvus AP, with Payline Ops cited most often for mid-market deployments.",
        brandsMentioned: ["Payline Ops", "Nexora Pay", "Settlewise", "Corvus AP"],
        citations: ["g2.com", "trustradius.com", "reddit.com", "paylineops.com"],
      },
    ],
  },
  {
    id: "p-006",
    question: "Which AP automation tools integrate natively with NetSuite?",
    stage: "exploration",
    intent: "commercial",
    priority: "critical",
    monthlyVolume: 3300,
    topBrand: "Harborflow",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T11:20:00Z",
        answer:
          "Harborflow, Payline Ops and Nexora Pay all offer certified NetSuite SuiteApp integrations. Harborflow documents two-way sync for vendor records, bills, and payment status, with field-level mapping.",
        brandsMentioned: ["Harborflow", "Payline Ops", "Nexora Pay"],
        citations: ["harborflow.io", "netsuite.com", "g2.com"],
        note: "Our ERP integration library is the cited source. This is our strongest prompt family.",
      },
      {
        platform: "gemini",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T11:22:00Z",
        answer:
          "Harborflow's NetSuite SuiteApp is listed in Oracle's marketplace and supports bill, vendor and payment sync. Payline Ops and Settlewise also integrate, though Settlewise uses a middleware connector.",
        brandsMentioned: ["Harborflow", "Payline Ops", "Settlewise"],
        citations: ["harborflow.io", "netsuite.com", "capterra.com"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T11:24:00Z",
        answer:
          "Harborflow is the most commonly cited NetSuite-native option, with documented two-way sync. Payline Ops and Nexora Pay also hold SuiteApp listings.",
        brandsMentioned: ["Harborflow", "Payline Ops", "Nexora Pay"],
        citations: ["harborflow.io", "netsuite.com", "trustradius.com"],
      },
    ],
  },
  {
    id: "p-007",
    question: "AP automation with two-way sync for Sage Intacct",
    stage: "exploration",
    intent: "commercial",
    priority: "high",
    monthlyVolume: 1400,
    topBrand: "Harborflow",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 2,
        checkedAt: "2026-11-01T11:40:00Z",
        answer:
          "Payline Ops and Harborflow both support Sage Intacct two-way sync. Harborflow's documentation covers dimension mapping and the sync cadence; Payline Ops requires its premium tier for real-time sync.",
        brandsMentioned: ["Payline Ops", "Harborflow"],
        citations: ["harborflow.io", "paylineops.com", "sageintacct.com"],
      },
      {
        platform: "gemini",
        appeared: true,
        position: 2,
        checkedAt: "2026-11-01T11:42:00Z",
        answer:
          "Sage Intacct's marketplace lists both Harborflow and Payline Ops for AP automation with bi-directional sync.",
        brandsMentioned: ["Payline Ops", "Harborflow"],
        citations: ["sageintacct.com", "harborflow.io"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T11:44:00Z",
        answer:
          "Harborflow documents the most detailed Sage Intacct sync, including dimensions and custom fields. Payline Ops supports it on higher tiers.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "sageintacct.com", "g2.com"],
      },
    ],
  },
  {
    id: "p-008",
    question: "Best AP automation for construction and project-based businesses",
    stage: "exploration",
    intent: "commercial",
    priority: "low",
    monthlyVolume: 980,
    topBrand: "Corvus AP",
    opportunity: "Vertical prompt we do not serve with content. Low priority unless construction becomes an ICP.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T12:02:00Z",
        answer:
          "Corvus AP is most often recommended for construction because of lien waiver handling and AIA billing support. Payline Ops is a general-purpose alternative.",
        brandsMentioned: ["Corvus AP", "Payline Ops"],
        citations: ["corvusap.com", "constructiondive.com", "g2.com"],
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T12:04:00Z",
        answer: "Construction-specific needs (retainage, lien waivers, job costing) point most buyers to Corvus AP.",
        brandsMentioned: ["Corvus AP"],
        citations: ["corvusap.com", "constructiondive.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T12:06:00Z",
        answer: "Corvus AP leads for construction; Payline Ops and Settlewise appear as general alternatives.",
        brandsMentioned: ["Corvus AP", "Payline Ops", "Settlewise"],
        citations: ["corvusap.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-009",
    question: "Payline Ops vs Nexora Pay: which is better for a 700-person company?",
    stage: "comparison",
    intent: "commercial",
    priority: "high",
    monthlyVolume: 2200,
    topBrand: "Payline Ops",
    opportunity:
      "A three-way comparison page that adds Harborflow to this matchup is the fastest way into a prompt we are structurally excluded from.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:02:00Z",
        answer:
          "Payline Ops suits companies that want the widest ERP and payment-rail coverage; Nexora Pay fits teams that need multi-entity consolidation and a formal security review. At 700 employees both are viable, with Payline Ops cheaper at that volume.",
        brandsMentioned: ["Payline Ops", "Nexora Pay"],
        citations: ["g2.com", "paylineops.com", "nexorapay.com", "trustradius.com"],
        note: "Head-to-head prompts only surface brands named in the question or in a cited comparison table.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:04:00Z",
        answer:
          "Both handle that size. Nexora Pay's analyst coverage is stronger; Payline Ops wins on review volume and implementation partners.",
        brandsMentioned: ["Payline Ops", "Nexora Pay"],
        citations: ["gartner.com", "capterra.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:06:00Z",
        answer:
          "Reviewers split roughly evenly. Payline Ops is cited for breadth, Nexora Pay for multi-entity. Some threads also raise Settlewise and Harborflow as mid-market alternatives.",
        brandsMentioned: ["Payline Ops", "Nexora Pay", "Settlewise", "Harborflow"],
        citations: ["reddit.com", "g2.com", "trustradius.com"],
        note: "We appear only in a trailing aside sourced from a Reddit thread, not in the comparison itself.",
      },
    ],
  },
  {
    id: "p-010",
    question: "Harborflow vs Payline Ops",
    stage: "comparison",
    intent: "commercial",
    priority: "critical",
    monthlyVolume: 760,
    topBrand: "Harborflow",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T13:20:00Z",
        answer:
          "Harborflow is positioned for mid-market teams that want fast implementation and deep ERP sync; Payline Ops is the broader incumbent with more integrations and a larger partner network. Harborflow publishes a 21-day implementation benchmark; Payline Ops does not publish implementation timelines.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "paylineops.com", "g2.com"],
      },
      {
        platform: "gemini",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T13:22:00Z",
        answer:
          "Harborflow emphasises ERP depth and speed to value. Payline Ops offers a wider feature surface. Pricing comparison is difficult because Harborflow does not publish list pricing.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "paylineops.com", "capterra.com"],
        note: "The engine explicitly flags our missing pricing page as a limitation in the comparison.",
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T13:24:00Z",
        answer:
          "Harborflow: mid-market, NetSuite/Intacct-first, 21-day implementation. Payline Ops: enterprise-capable, more rails, longer deployments. Reviewers on G2 rate Harborflow higher on support responsiveness.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "g2.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-011",
    question: "Cheapest AP automation tools for a small finance team",
    stage: "comparison",
    intent: "commercial",
    priority: "medium",
    monthlyVolume: 1900,
    topBrand: "Settlewise",
    opportunity: "Engines cannot place us in price-led answers because no pricing is published.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:40:00Z",
        answer:
          "Settlewise starts at $399/month for up to 500 invoices and Ledgerloop offers a free tier up to 50 invoices. Vendors that do not publish pricing, including Harborflow, could not be ranked here.",
        brandsMentioned: ["Settlewise", "Ledgerloop"],
        citations: ["settlewise.com", "ledgerloop.com", "capterra.com"],
        note: "Direct evidence that the missing pricing page costs us inclusion — the engine names the reason.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:42:00Z",
        answer: "Ledgerloop and Settlewise are the two lowest published entry prices in this category.",
        brandsMentioned: ["Ledgerloop", "Settlewise"],
        citations: ["ledgerloop.com", "settlewise.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T13:44:00Z",
        answer:
          "Settlewise ($399/mo) and Ledgerloop (free tier) publish pricing. Payline Ops and Harborflow are quote-only, so cost comparisons rely on user-reported figures.",
        brandsMentioned: ["Settlewise", "Ledgerloop", "Payline Ops", "Harborflow"],
        citations: ["settlewise.com", "ledgerloop.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-012",
    question: "Nexora Pay alternatives for a NetSuite shop",
    stage: "comparison",
    intent: "commercial",
    priority: "high",
    monthlyVolume: 1100,
    topBrand: "Nexora Pay",
    opportunity: "We are the strongest NetSuite answer in the category but absent from the alternatives list.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T14:02:00Z",
        answer:
          "Commonly suggested alternatives are Payline Ops and Settlewise. Both hold NetSuite listings, with Payline Ops offering the broader feature set.",
        brandsMentioned: ["Payline Ops", "Settlewise"],
        citations: ["g2.com", "capterra.com", "nexorapay.com"],
        note:
          "The cited alternatives pages are competitor-authored. We have no 'Nexora Pay alternatives' page, so we cannot enter this answer.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T14:04:00Z",
        answer: "Payline Ops, Settlewise and Corvus AP are the alternatives most frequently listed.",
        brandsMentioned: ["Payline Ops", "Settlewise", "Corvus AP"],
        citations: ["capterra.com", "softwareadvice.com"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 4,
        checkedAt: "2026-11-01T14:06:00Z",
        answer:
          "Alternatives include Payline Ops, Settlewise, Corvus AP and Harborflow — the last of which is cited for the deepest NetSuite sync.",
        brandsMentioned: ["Payline Ops", "Settlewise", "Corvus AP", "Harborflow"],
        citations: ["g2.com", "harborflow.io", "reddit.com"],
      },
    ],
  },
  {
    id: "p-013",
    question: "Best Payline Ops alternatives for mid-market finance teams",
    stage: "comparison",
    intent: "commercial",
    priority: "critical",
    monthlyVolume: 2600,
    topBrand: "Settlewise",
    opportunity:
      "Second-highest volume gap. Competitor-authored alternatives pages are the only cited sources; a neutral comparison page of our own would compete directly.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T14:20:00Z",
        answer:
          "Settlewise and Nexora Pay are the alternatives most often recommended for mid-market teams, with Corvus AP for project-based businesses.",
        brandsMentioned: ["Settlewise", "Nexora Pay", "Corvus AP"],
        citations: ["settlewise.com", "g2.com", "capterra.com"],
        note: "Settlewise's 'Payline Ops alternatives' page is cited in all three answers.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T14:22:00Z",
        answer: "Settlewise, Nexora Pay and Ledgerloop come up most often as Payline Ops alternatives.",
        brandsMentioned: ["Settlewise", "Nexora Pay", "Ledgerloop"],
        citations: ["settlewise.com", "softwareadvice.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T14:24:00Z",
        answer:
          "Most comparison write-ups name Settlewise and Nexora Pay. Reddit threads also mention Harborflow for NetSuite-heavy teams, though it is not in the published alternatives lists.",
        brandsMentioned: ["Settlewise", "Nexora Pay"],
        citations: ["settlewise.com", "reddit.com", "g2.com"],
      },
    ],
  },
  {
    id: "p-014",
    question: "How long does an AP automation implementation take?",
    stage: "evaluation",
    intent: "informational",
    priority: "high",
    monthlyVolume: 1600,
    topBrand: "Harborflow",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T15:02:00Z",
        answer:
          "Typical mid-market deployments run 6–12 weeks. Harborflow publishes a 21-day benchmark for single-entity NetSuite or Intacct implementations, which is the shortest documented timeline in the category.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "cfodive.com", "g2.com"],
        note: "Our implementation benchmark page is doing real work — it is quoted verbatim across engines.",
      },
      {
        platform: "gemini",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T15:04:00Z",
        answer:
          "Expect four to twelve weeks depending on entity count and ERP. Harborflow documents 21 days for a standard single-entity rollout.",
        brandsMentioned: ["Harborflow"],
        citations: ["harborflow.io", "accountingtoday.com"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T15:06:00Z",
        answer:
          "Harborflow: 21 days documented. Payline Ops: 8–16 weeks per customer reports. Multi-entity rollouts add 3–6 weeks regardless of vendor.",
        brandsMentioned: ["Harborflow", "Payline Ops"],
        citations: ["harborflow.io", "g2.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-015",
    question: "AP automation with multi-entity approval workflows",
    stage: "evaluation",
    intent: "commercial",
    priority: "high",
    monthlyVolume: 1300,
    topBrand: "Nexora Pay",
    opportunity: "Our approval workflow page describes features but gives no multi-entity example, so engines skip it.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:20:00Z",
        answer:
          "Nexora Pay and Corvus AP document multi-entity approval matrices with inter-company allocation. Payline Ops supports it through custom rules.",
        brandsMentioned: ["Nexora Pay", "Corvus AP", "Payline Ops"],
        citations: ["nexorapay.com", "corvusap.com", "g2.com"],
        note: "Capability parity exists but is undocumented on our site — nothing for an engine to cite.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:22:00Z",
        answer: "Nexora Pay is the most cited option for multi-entity approvals.",
        brandsMentioned: ["Nexora Pay"],
        citations: ["nexorapay.com", "capterra.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:24:00Z",
        answer: "Nexora Pay and Corvus AP both document multi-entity hierarchies; other vendors describe it only generically.",
        brandsMentioned: ["Nexora Pay", "Corvus AP"],
        citations: ["nexorapay.com", "corvusap.com"],
      },
    ],
  },
  {
    id: "p-016",
    question: "Is AP automation software SOC 2 compliant and how is payment data protected?",
    stage: "evaluation",
    intent: "informational",
    priority: "critical",
    monthlyVolume: 1450,
    topBrand: "Nexora Pay",
    opportunity: "We hold SOC 2 Type II but have no trust page, so engines cannot confirm it.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:40:00Z",
        answer:
          "Nexora Pay and Payline Ops both publish SOC 2 Type II reports and describe encryption at rest and in transit. For vendors without a public trust page, request the report directly during procurement.",
        brandsMentioned: ["Nexora Pay", "Payline Ops"],
        citations: ["nexorapay.com", "paylineops.com"],
        note: "Highest-leverage fix in the audit: a trust page turns a 'cannot confirm' into a citation.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:42:00Z",
        answer:
          "Most established vendors hold SOC 2 Type II. Nexora Pay's security portal is the most detailed public documentation in this category.",
        brandsMentioned: ["Nexora Pay"],
        citations: ["nexorapay.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T15:44:00Z",
        answer:
          "Nexora Pay, Payline Ops and Settlewise publish compliance details. Harborflow's certifications are referenced in third-party reviews but not on its own site.",
        brandsMentioned: ["Nexora Pay", "Payline Ops", "Settlewise"],
        citations: ["nexorapay.com", "g2.com", "settlewise.com"],
      },
    ],
  },
  {
    id: "p-017",
    question: "What ROI should we expect from AP automation in year one?",
    stage: "evaluation",
    intent: "commercial",
    priority: "high",
    monthlyVolume: 1750,
    topBrand: "Payline Ops",
    opportunity: "An ROI model with assumptions stated would be directly quotable; competitors' calculators are.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:02:00Z",
        answer:
          "Published models suggest payback in 7–11 months for teams processing 2,000+ invoices a month. Payline Ops and Settlewise both offer public ROI calculators with stated assumptions.",
        brandsMentioned: ["Payline Ops", "Settlewise"],
        citations: ["paylineops.com", "settlewise.com", "ardentpartners.com"],
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:04:00Z",
        answer: "Expect 60–70% reduction in processing cost and payback inside a year at mid-market volumes.",
        brandsMentioned: ["Payline Ops"],
        citations: ["paylineops.com", "cfodive.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:06:00Z",
        answer:
          "Vendor calculators from Payline Ops and Settlewise are the only public models; independent benchmarks from Ardent Partners put payback at 9 months median.",
        brandsMentioned: ["Payline Ops", "Settlewise"],
        citations: ["paylineops.com", "settlewise.com", "ardentpartners.com"],
      },
    ],
  },
  {
    id: "p-018",
    question: "How much does Harborflow cost?",
    stage: "purchase",
    intent: "transactional",
    priority: "critical",
    monthlyVolume: 420,
    topBrand: "Harborflow",
    opportunity: "Branded pricing prompt answered with 'not published' — the worst possible answer at this stage.",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T16:20:00Z",
        answer:
          "Harborflow does not publish list pricing; plans are quoted based on invoice volume, entities and payment rails. User-reported figures on review sites range from $1,100 to $2,900 per month for mid-market deployments.",
        brandsMentioned: ["Harborflow"],
        citations: ["harborflow.io", "g2.com", "capterra.com"],
        note: "The engine answers with third-party hearsay because we publish nothing authoritative.",
      },
      {
        platform: "gemini",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T16:22:00Z",
        answer: "Pricing is quote-based. Reviewers report roughly $1,200–$3,000/month depending on volume.",
        brandsMentioned: ["Harborflow"],
        citations: ["capterra.com", "harborflow.io"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T16:24:00Z",
        answer:
          "No public price list. Review-site figures suggest $1,100+/month at 2,000 invoices. Harborflow's site directs buyers to a demo request.",
        brandsMentioned: ["Harborflow"],
        citations: ["harborflow.io", "g2.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-019",
    question: "AP automation pricing for a 500-employee company",
    stage: "purchase",
    intent: "transactional",
    priority: "critical",
    monthlyVolume: 2400,
    topBrand: "Payline Ops",
    opportunity: "Unbranded pricing prompt at purchase intent. We are excluded from every answer for the same reason.",
    responses: [
      {
        platform: "chatgpt",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:40:00Z",
        answer:
          "At that size, Payline Ops starts around $1,500/month and Nexora Pay around $1,900/month based on published tiers. Settlewise lists $399/month for lower volumes.",
        brandsMentioned: ["Payline Ops", "Nexora Pay", "Settlewise"],
        citations: ["paylineops.com", "nexorapay.com", "settlewise.com"],
        note: "Only vendors with published tiers are included. This is the clearest revenue cost of the missing pricing page.",
      },
      {
        platform: "gemini",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:42:00Z",
        answer: "Published mid-market tiers run $1,500–$2,200/month. Quote-only vendors are excluded from this comparison.",
        brandsMentioned: ["Payline Ops", "Nexora Pay"],
        citations: ["paylineops.com", "nexorapay.com"],
      },
      {
        platform: "perplexity",
        appeared: false,
        position: null,
        checkedAt: "2026-11-01T16:44:00Z",
        answer:
          "Payline Ops and Nexora Pay publish tiers in the $1,500–$2,000 range. Others, including Harborflow, require a quote.",
        brandsMentioned: ["Payline Ops", "Nexora Pay"],
        citations: ["paylineops.com", "nexorapay.com", "reddit.com"],
      },
    ],
  },
  {
    id: "p-020",
    question: "Where can I book a demo of AP automation software for NetSuite?",
    stage: "purchase",
    intent: "navigational",
    priority: "medium",
    monthlyVolume: 560,
    topBrand: "Harborflow",
    responses: [
      {
        platform: "chatgpt",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T17:02:00Z",
        answer:
          "Harborflow, Payline Ops and Nexora Pay all offer demo booking for NetSuite environments. Harborflow's demo page lets you pick an ERP before booking.",
        brandsMentioned: ["Harborflow", "Payline Ops", "Nexora Pay"],
        citations: ["harborflow.io", "paylineops.com"],
      },
      {
        platform: "gemini",
        appeared: true,
        position: 2,
        checkedAt: "2026-11-01T17:04:00Z",
        answer: "Payline Ops and Harborflow both have NetSuite-specific demo flows.",
        brandsMentioned: ["Payline Ops", "Harborflow"],
        citations: ["paylineops.com", "harborflow.io"],
      },
      {
        platform: "perplexity",
        appeared: true,
        position: 1,
        checkedAt: "2026-11-01T17:06:00Z",
        answer: "Harborflow's demo request page is ERP-aware and is the most direct route for NetSuite teams.",
        brandsMentioned: ["Harborflow"],
        citations: ["harborflow.io"],
      },
    ],
  },
]

export const promptById = (id: string) => prompts.find((p) => p.id === id)

export const promptsByStage = (stage: FunnelStage) => prompts.filter((p) => p.stage === stage)

/** Share of primary-engine responses where the brand appeared. */
export function appearanceRate(prompt: TrackedPrompt) {
  const total = prompt.responses.length
  if (total === 0) return 0
  return Math.round((prompt.responses.filter((r) => r.appeared).length / total) * 100)
}

export const appearsAnywhere = (prompt: TrackedPrompt) => prompt.responses.some((r) => r.appeared)

/** Prompts where no primary engine mentions us — the gap list. */
export const gapPrompts = prompts.filter((p) => !appearsAnywhere(p))

export const stageSummary = (Object.keys(stageLabels) as FunnelStage[]).map((stage) => {
  const inStage = promptsByStage(stage)
  const covered = inStage.filter(appearsAnywhere).length
  return {
    stage,
    label: stageLabels[stage],
    total: inStage.length,
    covered,
    coverage: inStage.length ? Math.round((covered / inStage.length) * 100) : 0,
    volume: inStage.reduce((sum, p) => sum + p.monthlyVolume, 0),
  }
})

export const totalTrackedPrompts = 240
