/** The demo tenant. Every screen in the dashboard describes this business. */

export const business = {
  name: "Harborflow",
  legalName: "Harborflow Technologies, Inc.",
  domain: "harborflow.io",
  url: "https://harborflow.io",
  tagline: "Accounts payable automation for mid-market finance teams",
  industry: "B2B SaaS — Finance Automation",
  subCategory: "Accounts payable automation",
  foundedYear: 2019,
  headcount: "85 employees",
  hq: "Austin, Texas",
  markets: ["United States", "Canada", "United Kingdom"],
  icp: "Controllers and AP managers at 200–2,000 employee companies running NetSuite, Sage Intacct or Dynamics 365",
  plan: "Professional",
  trackingSince: "2026-04-02",
  lastCrawl: "2026-11-02T04:15:00Z",
  nextCrawl: "2026-11-09T04:15:00Z",
  services: [
    { name: "Invoice capture & OCR", pages: 4, geoReady: true },
    { name: "Approval workflows", pages: 3, geoReady: true },
    { name: "Payment orchestration", pages: 5, geoReady: false },
    { name: "Spend controls & cards", pages: 2, geoReady: false },
    { name: "ERP integrations", pages: 11, geoReady: true },
    { name: "Vendor management", pages: 2, geoReady: false },
  ],
  team: [
    { name: "Dana Whitfield", role: "Head of Demand Gen", email: "dana@harborflow.io", access: "Owner", initials: "DW" },
    { name: "Marcus Oyelaran", role: "Product Marketing", email: "marcus@harborflow.io", access: "Editor", initials: "MO" },
    { name: "Priya Raghunathan", role: "Content Lead", email: "priya@harborflow.io", access: "Editor", initials: "PR" },
    { name: "Tom Brennan", role: "Web Engineer", email: "tom@harborflow.io", access: "Implementer", initials: "TB" },
    { name: "Elise Kaufman", role: "VP Marketing", email: "elise@harborflow.io", access: "Viewer", initials: "EK" },
  ],
  integrations: [
    { name: "harborflow.io (site crawl)", kind: "Website", status: "connected", detail: "412 pages indexed · weekly crawl" },
    { name: "Google Search Console", kind: "Analytics", status: "connected", detail: "Property verified 12 Apr 2026" },
    { name: "Webflow", kind: "CMS", status: "connected", detail: "Publishes to 182 marketing pages" },
    { name: "GA4", kind: "Analytics", status: "connected", detail: "Stream G-7Q2NX · AI referral segment on" },
    { name: "HubSpot", kind: "CRM", status: "disconnected", detail: "Needed to attribute AI-sourced pipeline" },
    { name: "Slack", kind: "Alerts", status: "disconnected", detail: "Send weekly visibility digests" },
  ],
} as const

export type BusinessProfile = typeof business
