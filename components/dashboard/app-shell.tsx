"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Eye,
  FileSearch,
  FileText,
  LayoutDashboard,
  Link2,
  ListChecks,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

import { auditIssues, business, recommendations } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { useDashboard } from "./dashboard-state"
import { ResetDemoButton } from "./workflow"

const navGroups: {
  label: string
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: "approvals" | "critical" }[]
}[] = [
  {
    label: "Monitor",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/visibility", label: "AI visibility", icon: Eye },
      { href: "/dashboard/prompts", label: "Prompt intelligence", icon: MessageSquare },
      { href: "/dashboard/citations", label: "Citation intelligence", icon: Link2 },
      { href: "/dashboard/competitors", label: "Competitor analysis", icon: Users },
    ],
  },
  {
    label: "Improve",
    items: [
      { href: "/dashboard/audit", label: "Website audit", icon: FileSearch, badge: "critical" },
      { href: "/dashboard/recommendations", label: "GEO recommendations", icon: ListChecks, badge: "approvals" },
      { href: "/dashboard/content", label: "Content optimization", icon: FileText },
    ],
  },
  {
    label: "Track",
    items: [
      { href: "/dashboard/reports", label: "Progress & reports", icon: TrendingUp },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
]

const titles: { match: string; title: string }[] = [
  { match: "/dashboard/visibility", title: "AI visibility" },
  { match: "/dashboard/prompts", title: "Prompt intelligence" },
  { match: "/dashboard/citations", title: "Citation intelligence" },
  { match: "/dashboard/competitors", title: "Competitor analysis" },
  { match: "/dashboard/audit", title: "Website audit" },
  { match: "/dashboard/recommendations", title: "GEO recommendations" },
  { match: "/dashboard/content", title: "Content optimization" },
  { match: "/dashboard/reports", title: "Progress & reports" },
  { match: "/dashboard/settings", title: "Settings" },
  { match: "/dashboard", title: "Overview" },
]

const recIds = recommendations.map((r) => r.id)
const criticalIssueIds = auditIssues.filter((i) => i.severity === "critical").map((i) => i.id)

function NavBadge({ kind }: { kind: "approvals" | "critical" }) {
  const { statusOf } = useDashboard()
  const count =
    kind === "approvals"
      ? recIds.filter((id) => statusOf("recommendation", id) === "needs-approval").length
      : criticalIssueIds.filter((id) => statusOf("issue", id) !== "completed").length

  if (count === 0) return null

  return (
    <span
      className="ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums"
      style={
        kind === "approvals"
          ? { backgroundColor: "rgba(250,178,25,0.18)", color: "#8a6000" }
          : { backgroundColor: "rgba(208,59,59,0.10)", color: "#9c2626" }
      }
    >
      {count}
    </span>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useDashboard()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  const pageTitle = titles.find((t) => pathname.startsWith(t.match))?.title ?? "Dashboard"
  const companyName = profile?.company || business.name
  const companyDomain = profile?.domain || business.domain

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgba(73,66,61,0.45)]">
            {group.label}
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-white text-[#37322F] shadow-[0px_1px_2px_rgba(55,50,47,0.08)]"
                        : "text-[#605A57] hover:bg-[rgba(55,50,47,0.04)] hover:text-[#37322F]",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#37322F]" : "text-[rgba(73,66,61,0.55)]")} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && <NavBadge kind={item.badge} />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[rgba(55,50,47,0.10)] bg-[#FCFBFA] lg:flex">
        <div className="flex h-[60px] items-center gap-2 border-b border-[rgba(55,50,47,0.08)] px-5">
          <Link href="/" className="text-[17px] font-semibold text-[#2F3037]">
            Visilm
          </Link>
          <span className="rounded-full bg-[rgba(55,50,47,0.06)] px-1.5 py-[1px] text-[10px] font-semibold text-[rgba(73,66,61,0.62)]">
            Demo
          </span>
        </div>
        {nav}
        <div className="border-t border-[rgba(55,50,47,0.08)] p-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[rgba(55,50,47,0.04)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#37322F] text-[12px] font-semibold text-white">
              {companyName.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[#37322F]">{companyName}</span>
              <span className="block truncate text-[11px] text-[rgba(73,66,61,0.55)]">{companyDomain}</span>
            </span>
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-[rgba(55,50,47,0.35)]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[270px] flex-col bg-[#FCFBFA]">
            <div className="flex h-[60px] items-center justify-between border-b border-[rgba(55,50,47,0.08)] px-5">
              <span className="text-[17px] font-semibold text-[#2F3037]">Visilm</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[rgba(55,50,47,0.06)]"
              >
                <X className="h-4 w-4 text-[#37322F]" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-[rgba(55,50,47,0.10)] bg-[rgba(247,245,243,0.92)] px-4 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[rgba(55,50,47,0.06)] lg:hidden"
          >
            <Menu className="h-[18px] w-[18px] text-[#37322F]" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-[#37322F]">{pageTitle}</div>
            <div className="truncate text-[11px] text-[rgba(73,66,61,0.55)]">
              {companyName} · 240 prompts tracked · 5 engines
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ResetDemoButton />
            <Link
              href="/dashboard/reports"
              className="hidden h-8 items-center rounded-full border border-[rgba(55,50,47,0.16)] bg-white px-3 text-[12px] font-medium text-[#37322F] transition-colors hover:bg-[rgba(55,50,47,0.03)] sm:inline-flex"
            >
              Latest report
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
