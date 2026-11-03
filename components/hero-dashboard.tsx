import { series, status } from "@/components/dashboard/tokens"

/**
 * The hero product shot, rendered as real markup rather than a screenshot:
 * sharp at any resolution, weighs nothing, and can never drift out of date
 * against the dashboard it depicts. Decorative — hidden from assistive tech,
 * since the page states everything it shows.
 */

const NAV = [
  { label: "Overview", active: true },
  { label: "AI visibility" },
  { label: "Prompt intelligence" },
  { label: "Citation intelligence" },
  { label: "Competitors" },
  { label: "Website audit" },
  { label: "Recommendations" },
]

const TILES = [
  { label: "Visibility score", value: "58", delta: "+6", caption: "across 5 engines" },
  { label: "Prompts won", value: "9", delta: "+2", caption: "of 20 sampled" },
  { label: "Citation rate", value: "24%", delta: "+3", caption: "answers citing you" },
  { label: "Share of voice", value: "14.2%", delta: "+1.4", caption: "rank 4 of 6" },
]

const ENGINES = [
  { name: "Perplexity", value: 67, color: series.s3 },
  { name: "ChatGPT", value: 64, color: series.s1 },
  { name: "Gemini", value: 58, color: series.s2 },
  { name: "Claude", value: 55, color: series.s4 },
  { name: "Copilot", value: 49, color: series.s5 },
]

const WORK = [
  { title: "Publish a public pricing page", tone: "critical" as const, meta: "+18 pts" },
  { title: "Add Product schema to 6 pages", tone: "progress" as const, meta: "+12 pts" },
  { title: "Comparison page vs Payline Ops", tone: "pending" as const, meta: "+9 pts" },
]

const TONES = {
  critical: { bg: "rgba(208,59,59,0.08)", fg: status.criticalText, label: "Needs approval" },
  progress: { bg: "rgba(42,120,214,0.10)", fg: "#1d5ba6", label: "In progress" },
  pending: { bg: "rgba(55,50,47,0.06)", fg: "#605A57", label: "Pending" },
}

export default function HeroDashboard() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-[10px] border border-[rgba(55,50,47,0.12)] bg-white shadow-[0px_24px_60px_-28px_rgba(55,50,47,0.35),0px_2px_6px_rgba(55,50,47,0.06)]"
    >
      {/* Topbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(55,50,47,0.10)] bg-[#FCFBFA] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#37322F] text-[11px] font-semibold text-white">
            V
          </span>
          <span className="text-[13px] font-semibold text-[#37322F]">Harborflow</span>
          <span className="hidden text-[12px] text-[rgba(73,66,61,0.55)] sm:inline">harborflow.io</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-[rgba(12,163,12,0.10)] px-2 py-[3px] text-[11px] font-medium text-[#1f6b1f] sm:inline">
            Scan complete · 2 Nov
          </span>
          <span className="hidden h-6 w-6 rounded-full bg-[rgba(55,50,47,0.08)] sm:inline-block" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-[182px] shrink-0 flex-col gap-0.5 border-r border-[rgba(55,50,47,0.10)] bg-[#FCFBFA] p-3 md:flex lg:w-[200px]">
          <span className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.45)]">
            Monitor
          </span>
          {NAV.map((n) => (
            <span
              key={n.label}
              className={`truncate rounded-md px-2 py-[7px] text-[12.5px] ${
                n.active ? "bg-white font-semibold text-[#37322F] shadow-[0px_1px_2px_rgba(55,50,47,0.06)]" : "text-[#605A57]"
              }`}
            >
              {n.label}
            </span>
          ))}
          <span className="mt-2 flex items-center justify-between rounded-md bg-[rgba(250,178,25,0.12)] px-2 py-[7px]">
            <span className="text-[12px] font-medium text-[#8a6000]">Needs you</span>
            <span className="text-[12px] font-semibold text-[#8a6000]">4</span>
          </span>
        </aside>

        {/* Body */}
        <div className="min-w-0 flex-1 bg-[#F7F5F3] p-3.5 sm:p-5">
          <div className="mb-3.5 flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.5)]">
                Overview
              </div>
              <div className="mt-0.5 text-[15px] font-semibold text-[#37322F] sm:text-[17px]">
                How AI engines answer about you
              </div>
            </div>
            <span className="hidden rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-3 py-1 text-[11.5px] font-medium text-[#37322F] sm:inline">
              Last 30 days
            </span>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {TILES.map((t) => (
              <div
                key={t.label}
                className="rounded-lg border border-[rgba(55,50,47,0.10)] bg-white p-3 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]"
              >
                <div className="flex items-baseline justify-between gap-1.5">
                  <span className="truncate text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
                    {t.label}
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#1f6b1f]">▲ {t.delta}</span>
                </div>
                <div className="mt-1.5 text-[22px] font-semibold leading-none text-[#37322F] sm:text-[26px]">
                  {t.value}
                </div>
                <div className="mt-1 truncate text-[10.5px] text-[#605A57]">{t.caption}</div>
              </div>
            ))}
          </div>

          {/* Engines + work */}
          <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.25fr_1fr]">
            <div className="rounded-lg border border-[rgba(55,50,47,0.10)] bg-white p-3.5 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-[#37322F]">Visibility by engine</span>
                <span className="text-[10.5px] text-[rgba(73,66,61,0.55)]">240 prompts</span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {ENGINES.map((e) => (
                  <div key={e.name}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11.5px] font-medium text-[#49423D]">{e.name}</span>
                      <span className="text-[11.5px] font-semibold tabular-nums text-[#37322F]">{e.value}</span>
                    </div>
                    <div className="mt-1 h-[6px] w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.07)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${e.value}%`, backgroundColor: e.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[rgba(55,50,47,0.10)] bg-white p-3.5 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-[#37322F]">Next actions</span>
                <span className="text-[10.5px] text-[rgba(73,66,61,0.55)]">+90 pts open</span>
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {WORK.map((w) => {
                  const tone = TONES[w.tone]
                  return (
                    <li key={w.title} className="border-b border-[rgba(55,50,47,0.06)] pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11.5px] font-medium leading-[17px] text-[#37322F]">{w.title}</span>
                        <span className="shrink-0 text-[10.5px] font-semibold text-[#1f6b1f]">{w.meta}</span>
                      </div>
                      <span
                        className="mt-1.5 inline-block rounded-full px-1.5 py-[2px] text-[10px] font-semibold"
                        style={{ backgroundColor: tone.bg, color: tone.fg }}
                      >
                        {tone.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
