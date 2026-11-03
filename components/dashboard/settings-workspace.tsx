"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { business, competitors, platforms } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { Card, CardHead, DefList, NoteCallout, SectionTitle, Tag, formatDate } from "./kit"
import { useDashboard } from "./dashboard-state"

type TabId = "profile" | "website" | "competitors" | "integrations" | "engines" | "notifications" | "team"

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "Business profile" },
  { id: "website", label: "Website" },
  { id: "competitors", label: "Competitors" },
  { id: "integrations", label: "Integrations" },
  { id: "engines", label: "AI engines" },
  { id: "notifications", label: "Notifications" },
  { id: "team", label: "Team" },
]

function Toggle({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  detail?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(55,50,47,0.06)] py-3 last:border-0">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-[#37322F]">{label}</div>
        {detail && <div className="mt-0.5 text-[12px] leading-[19px] text-[#605A57]">{detail}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors",
          checked ? "bg-[#37322F]" : "bg-[rgba(55,50,47,0.18)]",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all",
            checked ? "left-[19px]" : "left-[3px]",
          )}
        />
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  hint,
  onChange,
}: {
  label: string
  value: string
  hint?: string
  /** Controlled when provided; otherwise the field keeps its own draft state. */
  onChange?: (next: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const current = onChange ? value : draft
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[#49423D]">{label}</span>
      <input
        value={current}
        onChange={(event) => (onChange ? onChange(event.target.value) : setDraft(event.target.value))}
        className="h-9 rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] text-[#37322F] outline-none focus:border-[#37322F]"
      />
      {hint && <span className="text-[11px] text-[rgba(73,66,61,0.55)]">{hint}</span>}
    </label>
  )
}

export default function SettingsWorkspace() {
  const { profile, saveProfile, resetDemo, changed } = useDashboard()
  const [tab, setTab] = useState<TabId>("profile")
  const [draftProfile, setDraftProfile] = useState({
    company: profile?.company || business.name,
    industry: profile?.industry || business.industry,
    location: profile?.location || business.hq,
  })
  const [saved, setSaved] = useState(false)

  const [trackedCompetitors, setTrackedCompetitors] = useState(
    competitors.filter((c) => !c.isUs).map((c) => ({ name: c.name, domain: c.domain })),
  )
  const [newCompetitor, setNewCompetitor] = useState({ name: "", domain: "" })

  const [integrations, setIntegrations] = useState(
    business.integrations.map((i) => ({ ...i, enabled: i.status === "connected" })),
  )
  const [enginePrefs, setEnginePrefs] = useState(
    platforms.map((p) => ({ id: p.id, name: p.name, color: p.color, enabled: p.primary, frequency: p.primary ? "Daily" : "Weekly" })),
  )
  const [notifications, setNotifications] = useState({
    weeklyDigest: true,
    visibilityDrop: true,
    newCompetitor: true,
    approvalNeeded: true,
    monthlyReport: true,
    promptWon: false,
  })

  const companyName = profile?.company || business.name
  const companyDomain = profile?.domain || business.domain

  const addCompetitor = () => {
    const name = newCompetitor.name.trim()
    if (!name) return
    setTrackedCompetitors((prev) => [...prev, { name, domain: newCompetitor.domain.trim() || "—" }])
    setNewCompetitor({ name: "", domain: "" })
  }

  return (
    <div className="flex flex-col gap-5">
      <NoteCallout tone="info" title="UI demo">
        This settings area is interactive but local: changes live in your browser for this demo and are not sent
        anywhere.{" "}
        {changed.length > 0 && (
          <button type="button" onClick={resetDemo} className="font-medium underline">
            Reset the {changed.length} workflow change{changed.length === 1 ? "" : "s"} you have made
          </button>
        )}
      </NoteCallout>

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTab(option.id)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-medium transition-colors",
              tab === option.id
                ? "border-transparent bg-[#37322F] text-white"
                : "border-[rgba(55,50,47,0.14)] bg-white text-[#605A57] hover:text-[#37322F]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHead title="Business profile" subtitle="How we describe you to the engines when we build prompt sets" />
            <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
              <Field
                label="Company name"
                value={draftProfile.company}
                onChange={(next) => {
                  setDraftProfile((prev) => ({ ...prev, company: next }))
                  setSaved(false)
                }}
              />
              <Field label="Legal name" value={business.legalName} />
              <Field
                label="Industry"
                value={draftProfile.industry}
                onChange={(next) => {
                  setDraftProfile((prev) => ({ ...prev, industry: next }))
                  setSaved(false)
                }}
              />
              <Field label="Category phrase" value={business.subCategory} hint="Used to cluster you against competitors" />
              <Field
                label="Headquarters"
                value={draftProfile.location}
                onChange={(next) => {
                  setDraftProfile((prev) => ({ ...prev, location: next }))
                  setSaved(false)
                }}
              />
              <Field label="Headcount" value={business.headcount} />
              <div className="sm:col-span-2">
                <Field label="Ideal customer profile" value={business.icp} hint="Shapes which buyer prompts we track" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(55,50,47,0.08)] px-5 py-4">
              <span className="text-[12px] text-[rgba(73,66,61,0.62)]">
                {saved
                  ? "Saved. The workspace name in the sidebar and header now uses it."
                  : "Company, industry and location are used across the dashboard header and reports."}
              </span>
              <button
                type="button"
                onClick={() => {
                  saveProfile({
                    company: draftProfile.company.trim() || business.name,
                    domain: companyDomain,
                    industry: draftProfile.industry,
                    location: draftProfile.location,
                    services: profile?.services?.length ? profile.services : business.services.map((item) => item.name),
                    competitors: trackedCompetitors.map((item) => item.name),
                    completedAt: profile?.completedAt || new Date().toISOString(),
                  })
                  setSaved(true)
                }}
                className="inline-flex h-9 items-center rounded-full bg-[#37322F] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520]"
              >
                {saved ? "Saved" : "Save profile"}
              </button>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHead title="Services tracked" subtitle="Each service maps to the pages that describe it" />
              <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
                {(profile?.services?.length ? profile.services.map((name) => ({ name, pages: 0, geoReady: false })) : business.services).map(
                  (service) => (
                    <li key={service.name} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div>
                        <div className="text-[13px] font-medium text-[#37322F]">{service.name}</div>
                        {service.pages > 0 && (
                          <div className="mt-0.5 text-[12px] text-[rgba(73,66,61,0.62)]">{service.pages} pages</div>
                        )}
                      </div>
                      {service.geoReady ? (
                        <Tag tone="accent">Citable</Tag>
                      ) : (
                        <span className="text-[11px] font-medium text-[#8a6000]">Needs detail</span>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </Card>
            <Card>
              <CardHead title="Markets" />
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                {business.markets.map((market) => (
                  <Tag key={market}>{market}</Tag>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "website" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHead title="Website information" subtitle="What we crawl, and how often" />
            <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
              <Field label="Primary domain" value={companyDomain} />
              <Field label="Crawl root" value={`https://${companyDomain}/`} />
              <Field label="Crawl frequency" value="Weekly (Mondays, 04:00 UTC)" />
              <Field label="Pages discovered" value="412" />
              <div className="sm:col-span-2">
                <Field
                  label="Paths excluded from crawling"
                  value="/app/*, /api/*, /careers/apply/*"
                  hint="Matches the disallow rules in robots.txt"
                />
              </div>
            </div>
          </Card>
          <Card>
            <CardHead title="Crawl status" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Last crawl", value: formatDate(business.lastCrawl) },
                  { label: "Next crawl", value: formatDate(business.nextCrawl) },
                  { label: "Tracking since", value: formatDate(business.trackingSince) },
                  { label: "AI crawler access", value: <Tag tone="accent">All 8 agents allowed</Tag> },
                ]}
              />
              <div className="mt-4">
                <Link href="/dashboard/audit" className="text-[13px] font-medium text-[#37322F] hover:underline">
                  View the latest audit →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "competitors" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHead
              title="Tracked competitors"
              subtitle="Brands we watch in every answer. Removing one stops it appearing in comparisons."
            />
            <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
              {trackedCompetitors.map((competitor) => {
                const known = competitors.find((c) => c.name === competitor.name)
                return (
                  <li key={competitor.name} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {known && (
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: known.color }} aria-hidden />
                        )}
                        {known ? (
                          <Link
                            href={`/dashboard/competitors/${known.slug}`}
                            className="text-[13px] font-medium text-[#37322F] hover:underline"
                          >
                            {competitor.name}
                          </Link>
                        ) : (
                          <span className="text-[13px] font-medium text-[#37322F]">{competitor.name}</span>
                        )}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{competitor.domain}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {known && (
                        <span className="text-[12px] tabular-nums text-[#605A57]">{known.shareOfVoice}% SOV</span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setTrackedCompetitors((prev) => prev.filter((item) => item.name !== competitor.name))
                        }
                        aria-label={`Stop tracking ${competitor.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(73,66,61,0.55)] transition-colors hover:bg-[rgba(208,59,59,0.08)] hover:text-[#9c2626]"
                      >
                        <Trash2 className="h-[15px] w-[15px]" />
                      </button>
                    </div>
                  </li>
                )
              })}
              {trackedCompetitors.length === 0 && (
                <li className="px-5 py-8 text-center text-[13px] text-[#605A57]">
                  No competitors tracked. Add one below to restore comparisons.
                </li>
              )}
            </ul>
            <div className="flex flex-wrap items-end gap-3 border-t border-[rgba(55,50,47,0.08)] px-5 py-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Brand name</span>
                <input
                  value={newCompetitor.name}
                  onChange={(event) => setNewCompetitor((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="e.g. Brightpay AP"
                  className="h-9 w-[180px] rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] outline-none focus:border-[#37322F]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Domain</span>
                <input
                  value={newCompetitor.domain}
                  onChange={(event) => setNewCompetitor((prev) => ({ ...prev, domain: event.target.value }))}
                  placeholder="brightpay.com"
                  className="h-9 w-[180px] rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] outline-none focus:border-[#37322F]"
                />
              </label>
              <button
                type="button"
                onClick={addCompetitor}
                disabled={!newCompetitor.name.trim()}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#37322F] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Track competitor
              </button>
            </div>
          </Card>

          <Card>
            <CardHead title="How tracking works" />
            <div className="px-5 pb-5 text-[13px] leading-6 text-[#605A57]">
              <p>
                Each tracked brand is matched in every sampled answer, so share of voice, prompt wins and citation
                sources stay comparable across the whole set.
              </p>
              <p className="mt-3">
                We also detect brands you have not added. Five were found during onboarding; any new entrant that
                appears in more than 3% of answers is flagged in your weekly digest.
              </p>
            </div>
          </Card>
        </div>
      )}

      {tab === "integrations" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHead title="Connected sources" subtitle="Where we read your site and performance data from" />
            <div className="px-5 pb-5">
              {integrations.map((integration, index) => (
                <Toggle
                  key={integration.name}
                  checked={integration.enabled}
                  onChange={(next) =>
                    setIntegrations((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, enabled: next } : item)),
                    )
                  }
                  label={`${integration.name} · ${integration.kind}`}
                  detail={integration.detail}
                />
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="What each one adds" />
            <div className="flex flex-col gap-3 px-5 pb-5">
              <NoteCallout tone="info" title="Site crawl is required">
                Everything in the audit, content and recommendation sections comes from the weekly crawl of your
                domain.
              </NoteCallout>
              <NoteCallout tone="critical" title="CRM is disconnected">
                Without HubSpot we can show citations and visibility but cannot attribute pipeline to AI-sourced
                sessions.
              </NoteCallout>
            </div>
          </Card>
        </div>
      )}

      {tab === "engines" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHead title="AI engines monitored" subtitle="Turn an engine off to exclude it from your blended score" />
            <div className="px-5 pb-5">
              {enginePrefs.map((engine, index) => (
                <Toggle
                  key={engine.id}
                  checked={engine.enabled}
                  onChange={(next) =>
                    setEnginePrefs((prev) => prev.map((item, i) => (i === index ? { ...item, enabled: next } : item)))
                  }
                  label={engine.name}
                  detail={`Sampling: ${engine.frequency}`}
                />
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Sampling frequency" subtitle="How often each prompt is re-run per engine" />
            <div className="px-5 pb-5">
              <DefList
                items={platforms.map((platform) => ({
                  label: platform.name,
                  value: (
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: platform.color }} aria-hidden />
                      {platform.primary ? "Daily · 240 prompts" : "Weekly · 180 prompts"}
                    </span>
                  ),
                }))}
              />
              <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
                Primary engines are sampled daily because their answers change most often. Lower-frequency engines are
                smoothed over a seven-day window.
              </p>
            </div>
          </Card>
        </div>
      )}

      {tab === "notifications" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHead title="Notification preferences" subtitle="What we email the team about" />
            <div className="px-5 pb-5">
              <Toggle
                checked={notifications.weeklyDigest}
                onChange={(next) => setNotifications((prev) => ({ ...prev, weeklyDigest: next }))}
                label="Weekly visibility digest"
                detail="Monday summary of score, prompt wins and new gaps"
              />
              <Toggle
                checked={notifications.visibilityDrop}
                onChange={(next) => setNotifications((prev) => ({ ...prev, visibilityDrop: next }))}
                label="Visibility drop alert"
                detail="When any engine falls more than 3 points week on week"
              />
              <Toggle
                checked={notifications.newCompetitor}
                onChange={(next) => setNotifications((prev) => ({ ...prev, newCompetitor: next }))}
                label="New competitor detected"
                detail="When an unlisted brand appears in more than 3% of answers"
              />
              <Toggle
                checked={notifications.approvalNeeded}
                onChange={(next) => setNotifications((prev) => ({ ...prev, approvalNeeded: next }))}
                label="Approval needed"
                detail="When a recommendation is waiting on a decision from your team"
              />
              <Toggle
                checked={notifications.monthlyReport}
                onChange={(next) => setNotifications((prev) => ({ ...prev, monthlyReport: next }))}
                label="Monthly performance report"
                detail="Published on the first working day of each month"
              />
              <Toggle
                checked={notifications.promptWon}
                onChange={(next) => setNotifications((prev) => ({ ...prev, promptWon: next }))}
                label="Prompt won"
                detail="Every time you enter an answer you were previously absent from"
              />
            </div>
          </Card>
          <Card>
            <CardHead title="Recipients" subtitle="Based on team access level" />
            <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
              {business.team.map((member) => (
                <li key={member.email} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <div className="text-[13px] font-medium text-[#37322F]">{member.name}</div>
                    <div className="mt-0.5 text-[12px] text-[rgba(73,66,61,0.62)]">{member.email}</div>
                  </div>
                  <Tag>{member.access}</Tag>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "team" && (
        <Card>
          <CardHead
            title="Team management"
            subtitle="Who can see the dashboard and who can approve work"
            action={<span className="text-[12px] text-[rgba(73,66,61,0.62)]">{business.team.length} members</span>}
          />
          <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
            {business.team.map((member) => (
              <li key={member.email} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(55,50,47,0.06)] text-[12px] font-semibold text-[#37322F]">
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-[#37322F]">{member.name}</div>
                  <div className="mt-0.5 text-[12px] text-[rgba(73,66,61,0.62)]">
                    {member.role} · {member.email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag>{member.access}</Tag>
                  {member.access === "Owner" && <span className="text-[11px] text-[rgba(73,66,61,0.45)]">Billing contact</span>}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-[rgba(55,50,47,0.08)] px-5 py-4">
            <SectionTitle
              title="Access levels"
              description="Owners approve recommendations and manage billing. Editors can move work through the workflow. Implementers see only assigned items. Viewers are read-only."
            />
          </div>
        </Card>
      )}
    </div>
  )
}
