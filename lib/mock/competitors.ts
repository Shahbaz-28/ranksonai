import type { PlatformId } from "./types"

export interface Competitor {
  slug: string
  name: string
  domain: string
  /** Fixed chart colour per entity. "us" always keeps slot 1. */
  color: string
  isUs?: boolean
  /** Share of voice across the 240 tracked prompts, in percent. */
  shareOfVoice: number
  shareDelta: number
  visibilityScore: number
  mentionRate: number
  citationRate: number
  /** Blended rank position when listed. */
  avgPosition: number
  byPlatform: Record<PlatformId, number>
  positioning: string
  strengths: string[]
  /** Domains that cite this brand most often. */
  topSources: { domain: string; citations: number }[]
  /** Prompt ids where this competitor appears and Harborflow does not. */
  winsOn: string[]
}

export const competitors: Competitor[] = [
  {
    slug: "harborflow",
    name: "Harborflow",
    domain: "harborflow.io",
    color: "#2a78d6",
    isUs: true,
    shareOfVoice: 14.2,
    shareDelta: 3.6,
    visibilityScore: 61,
    mentionRate: 38,
    citationRate: 22,
    avgPosition: 3.4,
    byPlatform: { chatgpt: 41, gemini: 34, perplexity: 44, claude: 29, copilot: 24 },
    positioning: "Mid-market AP automation with deep ERP coverage and fast implementation.",
    strengths: ["ERP integration depth", "Implementation speed", "Perplexity citations"],
    topSources: [
      { domain: "harborflow.io", citations: 86 },
      { domain: "g2.com", citations: 41 },
      { domain: "capterra.com", citations: 24 },
      { domain: "cfodive.com", citations: 12 },
    ],
    winsOn: [],
  },
  {
    slug: "payline-ops",
    name: "Payline Ops",
    domain: "paylineops.com",
    color: "#eb6834",
    shareOfVoice: 31.5,
    shareDelta: -1.2,
    visibilityScore: 84,
    mentionRate: 72,
    citationRate: 49,
    avgPosition: 1.6,
    byPlatform: { chatgpt: 78, gemini: 71, perplexity: 74, claude: 66, copilot: 61 },
    positioning: "Category incumbent. Named first in most 'best AP automation' answers.",
    strengths: [
      "Owns the top three comparison roundups",
      "4,100+ reviews across G2 and Capterra",
      "Cited in 9 of 12 'best tools' listicles we track",
    ],
    topSources: [
      { domain: "g2.com", citations: 188 },
      { domain: "paylineops.com", citations: 164 },
      { domain: "cfo.com", citations: 97 },
      { domain: "capterra.com", citations: 88 },
      { domain: "reddit.com", citations: 54 },
    ],
    winsOn: ["p-002", "p-005", "p-009", "p-013", "p-017", "p-019"],
  },
  {
    slug: "nexora-pay",
    name: "Nexora Pay",
    domain: "nexorapay.com",
    color: "#1baf7a",
    shareOfVoice: 23.8,
    shareDelta: 2.4,
    visibilityScore: 76,
    mentionRate: 61,
    citationRate: 42,
    avgPosition: 2.1,
    byPlatform: { chatgpt: 66, gemini: 64, perplexity: 59, claude: 54, copilot: 58 },
    positioning: "Enterprise-leaning challenger with heavy analyst and press coverage.",
    strengths: [
      "Gartner and Forrester mentions carry into Gemini answers",
      "Publishes a public pricing calculator that engines quote",
      "Strong Microsoft-ecosystem content for Copilot",
    ],
    topSources: [
      { domain: "nexorapay.com", citations: 142 },
      { domain: "gartner.com", citations: 76 },
      { domain: "capterra.com", citations: 71 },
      { domain: "forbes.com", citations: 38 },
    ],
    winsOn: ["p-004", "p-009", "p-012", "p-016", "p-019"],
  },
  {
    slug: "settlewise",
    name: "Settlewise",
    domain: "settlewise.com",
    color: "#eda100",
    shareOfVoice: 17.1,
    shareDelta: 0.8,
    visibilityScore: 68,
    mentionRate: 52,
    citationRate: 35,
    avgPosition: 2.9,
    byPlatform: { chatgpt: 55, gemini: 49, perplexity: 61, claude: 47, copilot: 38 },
    positioning: "Mid-market peer, closest direct comparison in buyer prompts.",
    strengths: [
      "Comparison pages target our brand name directly",
      "Active in r/Accounting threads that Perplexity cites",
      "Transparent pricing page",
    ],
    topSources: [
      { domain: "settlewise.com", citations: 118 },
      { domain: "reddit.com", citations: 64 },
      { domain: "g2.com", citations: 59 },
      { domain: "accountingtoday.com", citations: 27 },
    ],
    winsOn: ["p-005", "p-011", "p-013", "p-017"],
  },
  {
    slug: "corvus-ap",
    name: "Corvus AP",
    domain: "corvusap.com",
    color: "#6250d6",
    shareOfVoice: 8.6,
    shareDelta: -0.9,
    visibilityScore: 47,
    mentionRate: 31,
    citationRate: 18,
    avgPosition: 4.4,
    byPlatform: { chatgpt: 34, gemini: 29, perplexity: 33, claude: 26, copilot: 22 },
    positioning: "Niche player focused on construction and manufacturing AP.",
    strengths: ["Owns vertical-specific prompts", "Case studies with named customers"],
    topSources: [
      { domain: "corvusap.com", citations: 61 },
      { domain: "constructiondive.com", citations: 29 },
      { domain: "g2.com", citations: 18 },
    ],
    winsOn: ["p-008", "p-015"],
  },
  {
    slug: "ledgerloop",
    name: "Ledgerloop",
    domain: "ledgerloop.com",
    color: "#e34948",
    shareOfVoice: 4.8,
    shareDelta: -0.4,
    visibilityScore: 33,
    mentionRate: 19,
    citationRate: 9,
    avgPosition: 5.2,
    byPlatform: { chatgpt: 21, gemini: 17, perplexity: 24, claude: 14, copilot: 11 },
    positioning: "Early-stage entrant, mostly surfaces on pricing-sensitive prompts.",
    strengths: ["Free tier mentioned in budget prompts"],
    topSources: [
      { domain: "ledgerloop.com", citations: 33 },
      { domain: "producthunt.com", citations: 14 },
    ],
    winsOn: ["p-011"],
  },
]

export const us = competitors.find((c) => c.isUs)!
export const rivals = competitors.filter((c) => !c.isUs)
export const competitorBySlug = (slug: string) => competitors.find((c) => c.slug === slug)

/** Share-of-voice ranking, highest first. */
export const shareOfVoiceRanking = [...competitors].sort((a, b) => b.shareOfVoice - a.shareOfVoice)
export const ourRank = shareOfVoiceRanking.findIndex((c) => c.isUs) + 1
