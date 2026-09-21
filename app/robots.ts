import type { MetadataRoute } from "next"

import { absoluteUrl, siteConfig } from "@/lib/seo"

/**
 * AI answer engines only cite what their crawlers are allowed to read,
 * so every major AI user-agent is explicitly allowed here.
 */
const aiCrawlers = [
  "GPTBot", // OpenAI training + ChatGPT browsing index
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT live fetches
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended", // Gemini grounding
  "Applebot-Extended",
  "Bingbot",
  "DuckDuckBot",
  "CCBot", // Common Crawl, a source for several models
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "YouBot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/api/"],
      },
      {
        userAgent: aiCrawlers,
        allow: "/",
        disallow: ["/login"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  }
}
