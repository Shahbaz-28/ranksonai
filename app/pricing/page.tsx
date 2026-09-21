import PageShell from "@/components/page-shell"
import PricingSection from "@/components/pricing-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import JsonLd from "@/components/json-ld"
import { faqData } from "@/lib/faq-data"
import { breadcrumbSchema, buildMetadata, faqSchema, jsonLdGraph, softwareApplicationSchema } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Simple plans for B2B teams tracking AI search visibility across ChatGPT, Perplexity, Gemini, Claude, Grok, and Copilot. Start free, upgrade when you need daily coverage and competitor benchmarks.",
  path: "/pricing",
  keywords: [
    "AI visibility pricing",
    "answer engine optimization pricing",
    "AI SEO tool cost",
    "AI citation tracking plans",
  ],
})

const included = [
  {
    title: "Citation tracking",
    description: "Daily runs of your buyer-intent prompts across every major AI answer engine.",
  },
  {
    title: "Competitor share",
    description: "See which vendors get named instead of you, and on which exact queries.",
  },
  {
    title: "Signal fixes",
    description: "Prioritised actions on schema, comparison pages, docs, and third-party sources.",
  },
  {
    title: "Visibility index",
    description: "One score that tracks how often AI engines recommend your brand over time.",
  },
]

const planComparison = [
  { feature: "Tracked prompts", starter: "25", professional: "500", enterprise: "Unlimited" },
  { feature: "AI engines monitored", starter: "2", professional: "6", enterprise: "6 + custom" },
  { feature: "Refresh frequency", starter: "Weekly", professional: "Daily", enterprise: "Hourly" },
  { feature: "Competitor tracking", starter: "1 brand", professional: "10 brands", enterprise: "Unlimited" },
  { feature: "Content signal audits", starter: "—", professional: "Monthly", enterprise: "Continuous" },
  { feature: "Seats", starter: "1", professional: "10", enterprise: "Unlimited" },
  { feature: "SSO & SOC 2 support", starter: "—", professional: "—", enterprise: "Included" },
  { feature: "Support", starter: "Email", professional: "Priority email", enterprise: "Dedicated expert" },
]

const pricingFaq = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes. Upgrade or downgrade at any time from your billing settings. Changes are prorated to the day, so you only pay for what you use.",
  },
  {
    question: "What counts as a tracked prompt?",
    answer:
      "A tracked prompt is one buyer question we run against the engines on your schedule, for example \"best AI SDR tools for mid-market SaaS\". Each engine result on that prompt is included in your plan.",
  },
  {
    question: "Do you offer annual billing?",
    answer: "Annual billing saves 20% on the Professional and Enterprise plans and can be invoiced for procurement.",
  },
]

export default function PricingPage() {
  return (
    <PageShell
      badge="Plans & Pricing"
      title="Pricing that scales with your AI visibility"
      description="Start on the free tier to see where AI engines already mention you. Move up when you want daily coverage, competitor benchmarks, and hands-on signal fixes."
    >
      <JsonLd
        data={jsonLdGraph(
          softwareApplicationSchema,
          faqSchema([...pricingFaq, ...faqData]),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        )}
      />

      <PricingSection />

      {/* What's included in every plan */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-center gap-8">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-3">
          <h2 className="text-center text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
            Included in every plan
          </h2>
          <p className="text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Even the free tier gives you a real read on how AI engines answer your category.
          </p>
        </div>
        <div className="w-full max-w-[1060px] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {included.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white rounded-lg border border-[rgba(55,50,47,0.10)] shadow-[0px_1px_2px_rgba(55,50,47,0.06)] flex flex-col gap-2"
            >
              <div className="text-[#49423D] text-sm font-semibold leading-6 font-sans">{item.title}</div>
              <div className="text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-center gap-8">
        <h2 className="text-center text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
          Compare the plans
        </h2>
        <div className="w-full max-w-[1060px] overflow-x-auto rounded-lg border border-[rgba(55,50,47,0.10)] bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(55,50,47,0.10)]">
                <th className="px-5 py-4 text-[#49423D] text-sm font-semibold font-sans">Feature</th>
                <th className="px-5 py-4 text-[#49423D] text-sm font-semibold font-sans">Starter</th>
                <th className="px-5 py-4 text-[#49423D] text-sm font-semibold font-sans">Professional</th>
                <th className="px-5 py-4 text-[#49423D] text-sm font-semibold font-sans">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {planComparison.map((row) => (
                <tr key={row.feature} className="border-b border-[rgba(55,50,47,0.06)] last:border-b-0">
                  <td className="px-5 py-4 text-[#49423D] text-[13px] font-medium leading-5 font-sans">{row.feature}</td>
                  <td className="px-5 py-4 text-[#605A57] text-[13px] font-normal leading-5 font-sans">{row.starter}</td>
                  <td className="px-5 py-4 text-[#605A57] text-[13px] font-normal leading-5 font-sans">
                    {row.professional}
                  </td>
                  <td className="px-5 py-4 text-[#605A57] text-[13px] font-normal leading-5 font-sans">
                    {row.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing FAQ */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-center gap-8">
        <h2 className="text-center text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
          Billing questions
        </h2>
        <div className="w-full max-w-[720px] flex flex-col gap-4">
          {pricingFaq.map((item) => (
            <div key={item.question} className="p-6 bg-white rounded-lg border border-[rgba(55,50,47,0.10)]">
              <div className="text-[#49423D] text-sm font-semibold leading-6 font-sans">{item.question}</div>
              <p className="mt-2 text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </PageShell>
  )
}
