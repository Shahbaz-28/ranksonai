import type { PlatformId, TrendPoint } from "./types"

export interface Platform {
  id: PlatformId
  name: string
  vendor: string
  /** Chart series colour. Fixed per entity, never reassigned by rank. */
  color: string
  /** Blended visibility score out of 100. */
  score: number
  scoreDelta: number
  /** Share of tracked prompts where the brand is named. */
  mentionRate: number
  mentionRateDelta: number
  /** Share of tracked prompts where harborflow.io is cited as a source. */
  citationRate: number
  recommendationRate: number
  /** Average rank when the brand appears in a listed answer. */
  avgPosition: number | null
  responsesSampled: number
  promptsTracked: number
  /** How this engine tends to build answers — shown on the platform detail page. */
  behaviour: string
  topSource: string
  primary: boolean
}

export const platforms: Platform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    color: "#2a78d6",
    score: 64,
    scoreDelta: 9,
    mentionRate: 41,
    mentionRateDelta: 6,
    citationRate: 24,
    recommendationRate: 28,
    avgPosition: 3.2,
    responsesSampled: 96,
    promptsTracked: 240,
    behaviour:
      "Leans on a small set of high-authority roundups and review sites. Rarely cites vendor documentation unless the prompt names the product.",
    topSource: "g2.com",
    primary: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    color: "#eb6834",
    score: 58,
    scoreDelta: 5,
    mentionRate: 34,
    mentionRateDelta: 3,
    citationRate: 19,
    recommendationRate: 21,
    avgPosition: 4.1,
    responsesSampled: 72,
    promptsTracked: 240,
    behaviour:
      "Mirrors Google's web index closely, so pages that rank organically tend to get cited. Strong preference for pages with FAQ and Product schema.",
    topSource: "capterra.com",
    primary: true,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    color: "#1baf7a",
    score: 67,
    scoreDelta: 11,
    mentionRate: 44,
    mentionRateDelta: 9,
    citationRate: 31,
    recommendationRate: 33,
    avgPosition: 2.8,
    responsesSampled: 72,
    promptsTracked: 240,
    behaviour:
      "Cites 5–8 sources per answer and links them inline, so it is the fastest engine to reflect new comparison and documentation pages.",
    topSource: "harborflow.io",
    primary: true,
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    color: "#eda100",
    score: 55,
    scoreDelta: 4,
    mentionRate: 29,
    mentionRateDelta: 2,
    citationRate: 16,
    recommendationRate: 18,
    avgPosition: 3.9,
    responsesSampled: 48,
    promptsTracked: 180,
    behaviour:
      "Answers conservatively and hedges on vendor choice unless the category has well-structured, neutral comparison material.",
    topSource: "cfodive.com",
    primary: false,
  },
  {
    id: "copilot",
    name: "Copilot",
    vendor: "Microsoft",
    color: "#e87ba4",
    score: 49,
    scoreDelta: -2,
    mentionRate: 24,
    mentionRateDelta: -3,
    citationRate: 12,
    recommendationRate: 14,
    avgPosition: 4.6,
    responsesSampled: 42,
    promptsTracked: 180,
    behaviour:
      "Heavily weights Bing results and Microsoft-ecosystem content. Dynamics 365 integration pages are the main entry point for this engine.",
    topSource: "bing-indexed docs",
    primary: false,
  },
]

export const primaryPlatforms = platforms.filter((p) => p.primary)

export const platformById = (id: string) => platforms.find((p) => p.id === id)

export const platformName = (id: PlatformId) => platformById(id)?.name ?? id

/** Eight months of tracking, Apr–Nov 2026. */
export const visibilityTrend: TrendPoint[] = [
  { month: "Apr", period: "April 2026", chatgpt: 31, gemini: 28, perplexity: 34, overall: 31 },
  { month: "May", period: "May 2026", chatgpt: 36, gemini: 31, perplexity: 39, overall: 35 },
  { month: "Jun", period: "June 2026", chatgpt: 41, gemini: 35, perplexity: 44, overall: 40 },
  { month: "Jul", period: "July 2026", chatgpt: 44, gemini: 39, perplexity: 49, overall: 44 },
  { month: "Aug", period: "August 2026", chatgpt: 49, gemini: 44, perplexity: 52, overall: 48 },
  { month: "Sep", period: "September 2026", chatgpt: 55, gemini: 51, perplexity: 58, overall: 54 },
  { month: "Oct", period: "October 2026", chatgpt: 59, gemini: 55, perplexity: 62, overall: 57 },
  { month: "Nov", period: "November 2026", chatgpt: 64, gemini: 58, perplexity: 67, overall: 61 },
]

/** Mention-rate history, used on the AI Visibility page. */
export const mentionRateTrend: TrendPoint[] = [
  { month: "Apr", period: "April 2026", chatgpt: 18, gemini: 14, perplexity: 21, overall: 17 },
  { month: "May", period: "May 2026", chatgpt: 22, gemini: 17, perplexity: 25, overall: 21 },
  { month: "Jun", period: "June 2026", chatgpt: 26, gemini: 21, perplexity: 29, overall: 25 },
  { month: "Jul", period: "July 2026", chatgpt: 29, gemini: 24, perplexity: 33, overall: 28 },
  { month: "Aug", period: "August 2026", chatgpt: 33, gemini: 27, perplexity: 36, overall: 32 },
  { month: "Sep", period: "September 2026", chatgpt: 36, gemini: 30, perplexity: 39, overall: 35 },
  { month: "Oct", period: "October 2026", chatgpt: 38, gemini: 32, perplexity: 41, overall: 37 },
  { month: "Nov", period: "November 2026", chatgpt: 41, gemini: 34, perplexity: 44, overall: 38 },
]

/** Citation-rate history, used on the Citation Intelligence page. */
export const citationRateTrend: TrendPoint[] = [
  { month: "Apr", period: "April 2026", chatgpt: 8, gemini: 6, perplexity: 11, overall: 8 },
  { month: "May", period: "May 2026", chatgpt: 10, gemini: 8, perplexity: 14, overall: 11 },
  { month: "Jun", period: "June 2026", chatgpt: 13, gemini: 10, perplexity: 18, overall: 14 },
  { month: "Jul", period: "July 2026", chatgpt: 15, gemini: 12, perplexity: 21, overall: 16 },
  { month: "Aug", period: "August 2026", chatgpt: 18, gemini: 14, perplexity: 24, overall: 19 },
  { month: "Sep", period: "September 2026", chatgpt: 21, gemini: 16, perplexity: 27, overall: 21 },
  { month: "Oct", period: "October 2026", chatgpt: 22, gemini: 18, perplexity: 29, overall: 23 },
  { month: "Nov", period: "November 2026", chatgpt: 24, gemini: 19, perplexity: 31, overall: 25 },
]
