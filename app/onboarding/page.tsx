"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Check, Plus, X } from "lucide-react"

import { business, competitors } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { Card, NoteCallout } from "@/components/dashboard/kit"
import { useDashboard } from "@/components/dashboard/dashboard-state"

const steps = [
  { id: 1, label: "Your business", detail: "Website and company name" },
  { id: 2, label: "Market", detail: "Industry and where you sell" },
  { id: 3, label: "Services", detail: "What you want to be recommended for" },
  { id: 4, label: "Competitors", detail: "Who you are compared against" },
]

const suggestedServices = business.services.map((s) => s.name)
const suggestedCompetitors = competitors.filter((c) => !c.isUs).map((c) => c.name)

const industries = [
  "B2B SaaS — Finance Automation",
  "B2B SaaS — Sales & Marketing",
  "B2B SaaS — HR & People",
  "Professional services",
  "Healthcare technology",
  "Logistics & supply chain",
  "Other",
]

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(55,50,47,0.06)] py-1 pl-3 pr-1.5 text-[12px] font-medium text-[#37322F]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-[rgba(55,50,47,0.12)]"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { saveProfile } = useDashboard()

  const [step, setStep] = useState(1)
  const [domain, setDomain] = useState<string>(business.domain)
  const [company, setCompany] = useState<string>(business.name)
  const [industry, setIndustry] = useState<string>(business.industry)
  const [location, setLocation] = useState<string>(business.hq)
  const [services, setServices] = useState<string[]>(suggestedServices.slice(0, 4))
  const [serviceDraft, setServiceDraft] = useState("")
  const [rivals, setRivals] = useState<string[]>(suggestedCompetitors.slice(0, 3))
  const [rivalDraft, setRivalDraft] = useState("")

  const canContinue =
    step === 1 ? domain.trim().length > 3 && company.trim().length > 1 : step === 2 ? Boolean(industry && location.trim()) : step === 3 ? services.length > 0 : rivals.length > 0

  const submit = () => {
    saveProfile({
      company: company.trim(),
      domain: domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
      industry,
      location: location.trim(),
      services,
      competitors: rivals,
      completedAt: new Date().toISOString(),
    })
    router.push("/onboarding/analysis")
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-[640px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.55)]">
          Step {step} of 4
        </div>
        <h1 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#37322F] sm:text-[32px]">
          Tell us what you want AI to recommend you for
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[#605A57]">
          We use this to build your prompt set — the buyer questions we put to ChatGPT, Gemini, Perplexity, Claude and
          Copilot every week. The fields are pre-filled with the demo company so you can move straight through.
        </p>
      </div>

      {/* Stepper */}
      <ol className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        {steps.map((item) => {
          const done = step > item.id
          const active = step === item.id
          return (
            <li key={item.id} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold",
                  active
                    ? "border-transparent bg-[#37322F] text-white"
                    : done
                      ? "border-transparent bg-[rgba(12,163,12,0.14)] text-[#1f6b1f]"
                      : "border-[rgba(55,50,47,0.18)] text-[rgba(73,66,61,0.45)]",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : item.id}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-[13px] font-medium",
                    active ? "text-[#37322F]" : "text-[rgba(73,66,61,0.62)]",
                  )}
                >
                  {item.label}
                </span>
                <span className="block truncate text-[11px] text-[rgba(73,66,61,0.45)]">{item.detail}</span>
              </span>
              <span className="hidden h-px flex-1 bg-[rgba(55,50,47,0.10)] sm:block" />
            </li>
          )
        })}
      </ol>

      <Card className="p-6">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Business website</span>
                <input
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  placeholder="yourcompany.com"
                  className="h-10 rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] text-[#37322F] outline-none focus:border-[#37322F]"
                />
                <span className="text-[11px] text-[rgba(73,66,61,0.55)]">
                  We crawl this domain to read your identity, services and claims.
                </span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Company name</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Your company"
                  className="h-10 rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] text-[#37322F] outline-none focus:border-[#37322F]"
                />
                <span className="text-[11px] text-[rgba(73,66,61,0.55)]">
                  The exact string we look for in every AI answer.
                </span>
              </label>
            </div>
            <NoteCallout tone="info" title="Demo data">
              This walkthrough analyses Harborflow, a fictional AP automation vendor, so every screen afterwards is
              populated with a consistent dataset. Changing these fields renames the workspace but keeps the demo
              metrics.
            </NoteCallout>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#49423D]">Industry</span>
              <select
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className="h-10 rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] text-[#37322F] outline-none focus:border-[#37322F]"
              >
                {industries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[rgba(73,66,61,0.55)]">
                Determines the category phrase we track you against.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#49423D]">Primary location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, country"
                className="h-10 rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] text-[#37322F] outline-none focus:border-[#37322F]"
              />
              <span className="text-[11px] text-[rgba(73,66,61,0.55)]">
                Used for location-qualified prompts and local answer variants.
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[12px] font-medium text-[#49423D]">Services to be recommended for</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {services.map((service) => (
                  <Chip
                    key={service}
                    label={service}
                    onRemove={() => setServices((prev) => prev.filter((item) => item !== service))}
                  />
                ))}
                {services.length === 0 && (
                  <span className="text-[12px] text-[rgba(73,66,61,0.55)]">Add at least one service to continue.</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Add a service</span>
                <input
                  value={serviceDraft}
                  onChange={(event) => setServiceDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && serviceDraft.trim()) {
                      event.preventDefault()
                      setServices((prev) => Array.from(new Set([...prev, serviceDraft.trim()])))
                      setServiceDraft("")
                    }
                  }}
                  placeholder="e.g. Vendor management"
                  className="h-10 w-[240px] rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] outline-none focus:border-[#37322F]"
                />
              </label>
              <button
                type="button"
                disabled={!serviceDraft.trim()}
                onClick={() => {
                  setServices((prev) => Array.from(new Set([...prev, serviceDraft.trim()])))
                  setServiceDraft("")
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-4 text-[13px] font-medium text-[#37322F] transition-colors hover:bg-[rgba(55,50,47,0.03)] disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Detected on your site
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedServices
                  .filter((service) => !services.includes(service))
                  .map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => setServices((prev) => [...prev, service])}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[rgba(55,50,47,0.24)] px-3 py-1 text-[12px] text-[#605A57] transition-colors hover:border-[#37322F] hover:text-[#37322F]"
                    >
                      <Plus className="h-3 w-3" />
                      {service}
                    </button>
                  ))}
                {suggestedServices.every((service) => services.includes(service)) && (
                  <span className="text-[12px] text-[rgba(73,66,61,0.55)]">All detected services added.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[12px] font-medium text-[#49423D]">Competitors to track</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {rivals.map((rival) => (
                  <Chip key={rival} label={rival} onRemove={() => setRivals((prev) => prev.filter((item) => item !== rival))} />
                ))}
                {rivals.length === 0 && (
                  <span className="text-[12px] text-[rgba(73,66,61,0.55)]">Add at least one competitor to continue.</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-[#49423D]">Add a competitor</span>
                <input
                  value={rivalDraft}
                  onChange={(event) => setRivalDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && rivalDraft.trim()) {
                      event.preventDefault()
                      setRivals((prev) => Array.from(new Set([...prev, rivalDraft.trim()])))
                      setRivalDraft("")
                    }
                  }}
                  placeholder="e.g. Brightpay AP"
                  className="h-10 w-[240px] rounded-lg border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[13px] outline-none focus:border-[#37322F]"
                />
              </label>
              <button
                type="button"
                disabled={!rivalDraft.trim()}
                onClick={() => {
                  setRivals((prev) => Array.from(new Set([...prev, rivalDraft.trim()])))
                  setRivalDraft("")
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-4 text-[13px] font-medium text-[#37322F] transition-colors hover:bg-[rgba(55,50,47,0.03)] disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Found in AI answers for your category
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedCompetitors
                  .filter((rival) => !rivals.includes(rival))
                  .map((rival) => (
                    <button
                      key={rival}
                      type="button"
                      onClick={() => setRivals((prev) => [...prev, rival])}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[rgba(55,50,47,0.24)] px-3 py-1 text-[12px] text-[#605A57] transition-colors hover:border-[#37322F] hover:text-[#37322F]"
                    >
                      <Plus className="h-3 w-3" />
                      {rival}
                    </button>
                  ))}
                {suggestedCompetitors.every((rival) => rivals.includes(rival)) && (
                  <span className="text-[12px] text-[rgba(73,66,61,0.55)]">All detected competitors added.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(55,50,47,0.08)] pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex h-10 items-center rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-4 text-[13px] font-medium text-[#37322F] transition-colors hover:bg-[rgba(55,50,47,0.03)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={!canContinue}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#37322F] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canContinue}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#37322F] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyse my website
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>

      <p className="text-[12px] text-[rgba(73,66,61,0.55)]">
        Nothing is sent anywhere — this demo stores your answers in your browser only.
      </p>
    </div>
  )
}
