import type { Metadata } from "next"

/**
 * Single source of truth for site-wide SEO values.
 * Change the brand name / domain here and every title, canonical,
 * sitemap entry, and JSON-LD block follows.
 */
export const siteConfig = {
  name: "Visilm",
  legalName: "Visilm",
  domain: "visilm.com",
  url: "https://visilm.com",
  title: "AI Search Visibility & Answer Engine Optimization for B2B",
  description:
    "Visilm tracks whether ChatGPT, Perplexity, Gemini, Claude, Grok, and Copilot recommend your brand to B2B buyers, finds the queries where competitors are cited instead, and fixes the source signals behind them.",
  shortDescription: "Get cited and recommended when B2B buyers ask AI which vendor to hire.",
  locale: "en_US",
  /**
   * Social share image. Set this to "/og.png" once a real 1200x630 asset is in
   * `public/` — until then the metadata below omits the image rather than
   * pointing at a file that does not exist.
   */
  ogImage: "",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterHandle: "@visilm",
  email: "hello@visilm.com",
  social: ["https://x.com/visilm", "https://www.linkedin.com/company/visilm", "https://github.com/visilm"],
  keywords: [
    "AI search visibility",
    "answer engine optimization",
    "AEO",
    "generative engine optimization",
    "GEO",
    "ChatGPT brand visibility",
    "Perplexity citation tracking",
    "AI SEO tool",
    "B2B SaaS marketing",
    "LLM brand monitoring",
    "AI citation tracking",
    "share of voice in AI search",
  ],
} as const

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString()

export const ogImage = siteConfig.ogImage
  ? {
      url: absoluteUrl(siteConfig.ogImage),
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
      alt: `${siteConfig.name} - ${siteConfig.title}`,
    }
  : null

/** Page-level metadata builder: keeps canonical + OG + Twitter in sync. */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true, nocache: true } } : {}),
  }
}

/* ------------------------------ JSON-LD ------------------------------ */

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/icon.svg"),
  },
  ...(ogImage ? { image: ogImage.url } : {}),
  description: siteConfig.description,
  email: siteConfig.email,
  foundingDate: "2023",
  sameAs: [...siteConfig.social],
}

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: { "@id": `${siteConfig.url}/#organization` },
  inLanguage: "en-US",
}

export const softwareApplicationSchema = {
  "@type": "SoftwareApplication",
  "@id": `${siteConfig.url}/#software`,
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Marketing Analytics",
  operatingSystem: "Web",
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: { "@id": `${siteConfig.url}/#organization` },
  featureList: [
    "AI search citation tracking across ChatGPT, Perplexity, Gemini, Claude, Grok, and Copilot",
    "Competitor share of voice in AI answers",
    "Buyer-intent prompt monitoring",
    "Content and schema signal audits",
    "AI visibility index reporting",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "0",
      priceCurrency: "USD",
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Professional",
      price: "16",
      priceCurrency: "USD",
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      price: "160",
      priceCurrency: "USD",
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
  ],
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

/** Wraps one or more schema nodes into a single @graph document. */
export function jsonLdGraph(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  }
}
