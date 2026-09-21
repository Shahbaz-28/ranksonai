import PageShell from "@/components/page-shell"
import CTASection from "@/components/cta-section"
import JsonLd from "@/components/json-ld"
import { breadcrumbSchema, buildMetadata, jsonLdGraph, organizationSchema, siteConfig } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Why we built Visilm: B2B buyers now start with an AI assistant, and most vendors have no idea whether they are being recommended. Our mission, method, and team.",
  path: "/about",
  keywords: ["about Visilm", "AI search visibility company", "answer engine optimization team"],
})

const aboutPageSchema = {
  "@type": "AboutPage",
  "@id": `${siteConfig.url}/about#webpage`,
  url: `${siteConfig.url}/about`,
  name: `About ${siteConfig.name}`,
  description: "Visilm helps B2B brands see and improve how AI answer engines recommend them to buyers.",
  about: { "@id": `${siteConfig.url}/#organization` },
  isPartOf: { "@id": `${siteConfig.url}/#website` },
}

const stats = [
  { value: "6", label: "AI engines monitored" },
  { value: "40k+", label: "Buyer prompts tracked monthly" },
  { value: "3.4x", label: "Median lift in citation share" },
  { value: "2023", label: "Founded" },
]

const values = [
  {
    title: "Measure before advising",
    description:
      "Every recommendation we make starts from observed engine output, not from guesses about how models rank sources.",
  },
  {
    title: "Own the source, not the trick",
    description:
      "We improve the material AI engines actually read: docs, comparisons, schema, third-party reviews. No prompt gaming.",
  },
  {
    title: "Plain reporting",
    description:
      "One visibility index, the prompts behind it, and the citations we can point to. If a number moved, you can see why.",
  },
  {
    title: "Built for GTM teams",
    description:
      "Marketing, product marketing, and RevOps share the same dashboard, so AI visibility lands in the pipeline conversation.",
  },
]

const timeline = [
  {
    year: "2023",
    title: "The gap shows up",
    description:
      "While running SEO for B2B SaaS teams, we noticed qualified buyers arriving from ChatGPT and Perplexity, with no way to tell why some vendors got named and others never did.",
  },
  {
    year: "2024",
    title: "First visibility index",
    description:
      "We built the prompt-set methodology and the scoring model behind the index, then ran it across hundreds of category queries to learn which source signals actually moved answers.",
  },
  {
    year: "2025",
    title: "Visilm launches",
    description:
      "The tracker, competitor share, and signal-fix workflow became a single product for GTM teams who need AI search to work as a channel.",
  },
]

const team = [
  { name: "Founding team", role: "Search & GTM", detail: "A decade of technical SEO and B2B demand generation." },
  { name: "Research", role: "Model behaviour", detail: "Studies how answer engines select and cite sources." },
  { name: "Engineering", role: "Data platform", detail: "Runs the crawl, prompt, and scoring pipelines daily." },
]

export default function AboutPage() {
  return (
    <PageShell
      badge="About us"
      title="We make B2B brands visible to AI buyers"
      description="Buyers now ask an assistant before they ask a vendor. Visilm exists so you can see that conversation, understand why a competitor gets named, and fix the signals behind it."
    >
      <JsonLd
        data={jsonLdGraph(
          aboutPageSchema,
          organizationSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />

      {/* Stats */}
      <div className="self-stretch px-6 md:px-24 py-10 md:py-14 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
        <div className="w-full max-w-[1060px] grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <div className="text-[#37322F] text-3xl md:text-4xl font-normal font-serif leading-tight">
                {stat.value}
              </div>
              <div className="text-[#605A57] text-[13px] font-medium leading-5 font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
        <div className="w-full max-w-[1060px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
              Our mission
            </h2>
            <p className="text-[#605A57] text-base font-normal leading-7 font-sans">
              Ten years of search optimisation assumed a page of blue links. That assumption is breaking. When a buyer
              asks an assistant which vendor fits their stack, one answer comes back, and the vendors inside it win the
              shortlist before a marketing team ever hears about it.
            </p>
            <p className="text-[#605A57] text-base font-normal leading-7 font-sans">
              We think every B2B company deserves to know whether it appears in that answer, and what to change when it
              does not. That is the whole product.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-5 bg-white rounded-lg border border-[rgba(55,50,47,0.10)] shadow-[0px_1px_2px_rgba(55,50,47,0.06)] flex flex-col gap-1.5"
              >
                <div className="text-[#49423D] text-sm font-semibold leading-6 font-sans">{value.title}</div>
                <div className="text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">
                  {value.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-center gap-8">
        <h2 className="text-center text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
          How we got here
        </h2>
        <div className="w-full max-w-[820px] flex flex-col">
          {timeline.map((item) => (
            <div key={item.year} className="flex gap-5 md:gap-8 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-[10px] h-[10px] rounded-full bg-[#37322F] mt-2"></div>
                <div className="w-[1px] flex-1 bg-[rgba(55,50,47,0.16)]"></div>
              </div>
              <div className="flex flex-col gap-1.5 pb-2">
                <div className="text-[rgba(73,66,61,0.50)] text-xs font-medium leading-5 font-sans">{item.year}</div>
                <div className="text-[#49423D] text-base font-semibold leading-6 font-sans">{item.title}</div>
                <div className="text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-center gap-8">
        <div className="w-full max-w-[586px] flex flex-col items-center gap-3">
          <h2 className="text-center text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans tracking-tight">
            The team
          </h2>
          <p className="text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            A small group of search, research, and data engineers working on one problem.
          </p>
        </div>
        <div className="w-full max-w-[1060px] grid grid-cols-1 md:grid-cols-3 gap-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="p-6 bg-white rounded-lg border border-[rgba(55,50,47,0.10)] shadow-[0px_1px_2px_rgba(55,50,47,0.06)] flex flex-col gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(55,50,47,0.08)] flex items-center justify-center text-[#37322F] text-sm font-semibold font-sans">
                {member.name.charAt(0)}
              </div>
              <div className="text-[#49423D] text-sm font-semibold leading-6 font-sans">{member.name}</div>
              <div className="text-[rgba(73,66,61,0.50)] text-xs font-medium leading-5 font-sans">{member.role}</div>
              <div className="text-[#605A57] text-[13px] font-normal leading-[22px] font-sans">{member.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <CTASection />
    </PageShell>
  )
}
