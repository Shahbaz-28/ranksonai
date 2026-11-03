"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { auditIssues, contentBriefs, recommendations } from "@/lib/mock"
import type { WorkStatus } from "@/lib/mock/types"

/**
 * Client-side workflow state for the demo.
 *
 * Status changes made in the UI (approve, start, mark complete, verify) are
 * held here and mirrored to localStorage so the journey holds together across
 * navigation and reloads. Nothing leaves the browser — there is no backend.
 */

export type WorkKind = "recommendation" | "issue" | "brief"

type Overrides = Record<string, WorkStatus>

export interface OnboardingProfile {
  company: string
  domain: string
  industry: string
  location: string
  services: string[]
  competitors: string[]
  completedAt: string
}

interface DashboardState {
  statusOf: (kind: WorkKind, id: string) => WorkStatus
  setStatus: (kind: WorkKind, id: string, status: WorkStatus) => void
  /** Ids whose status has been changed in this browser. */
  changed: string[]
  profile: OnboardingProfile | null
  saveProfile: (profile: OnboardingProfile) => void
  resetDemo: () => void
  /** False until localStorage has been read, so SSR and first paint agree. */
  hydrated: boolean
}

const STORE_KEY = "visilm.demo.workflow"
const PROFILE_KEY = "visilm.demo.profile"

const baseStatus: Record<string, WorkStatus> = {}
for (const r of recommendations) baseStatus[`recommendation:${r.id}`] = r.status
for (const i of auditIssues) baseStatus[`issue:${i.id}`] = i.status
for (const b of contentBriefs) baseStatus[`brief:${b.id}`] = b.status

const DashboardContext = createContext<DashboardState | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({})
  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY)
      if (raw) setOverrides(JSON.parse(raw) as Overrides)
      const rawProfile = window.localStorage.getItem(PROFILE_KEY)
      if (rawProfile) setProfile(JSON.parse(rawProfile) as OnboardingProfile)
    } catch {
      // Private mode or blocked storage: run from the seeded dataset instead.
    }
    setHydrated(true)
  }, [])

  const persist = useCallback((next: Overrides) => {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next))
    } catch {
      // Non-fatal: state still applies for this session.
    }
  }, [])

  const setStatus = useCallback(
    (kind: WorkKind, id: string, status: WorkStatus) => {
      setOverrides((prev) => {
        const next = { ...prev, [`${kind}:${id}`]: status }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const statusOf = useCallback(
    (kind: WorkKind, id: string) => overrides[`${kind}:${id}`] ?? baseStatus[`${kind}:${id}`] ?? "pending",
    [overrides],
  )

  const saveProfile = useCallback((next: OnboardingProfile) => {
    setProfile(next)
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
    } catch {
      // Non-fatal.
    }
  }, [])

  const resetDemo = useCallback(() => {
    setOverrides({})
    setProfile(null)
    try {
      window.localStorage.removeItem(STORE_KEY)
      window.localStorage.removeItem(PROFILE_KEY)
    } catch {
      // Non-fatal.
    }
  }, [])

  const changed = useMemo(
    () => Object.keys(overrides).filter((key) => overrides[key] !== baseStatus[key]),
    [overrides],
  )

  const value = useMemo<DashboardState>(
    () => ({ statusOf, setStatus, changed, profile, saveProfile, resetDemo, hydrated }),
    [statusOf, setStatus, changed, profile, saveProfile, resetDemo, hydrated],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider")
  return ctx
}

/** The transitions each state offers, used to build the action buttons. */
export const nextStates: Record<WorkStatus, { to: WorkStatus; label: string; primary?: boolean }[]> = {
  pending: [
    { to: "needs-approval", label: "Send for approval", primary: true },
    { to: "in-progress", label: "Start work" },
  ],
  "needs-approval": [
    { to: "in-progress", label: "Approve & start", primary: true },
    { to: "pending", label: "Send back to backlog" },
  ],
  "in-progress": [
    { to: "verification", label: "Mark ready for verification", primary: true },
    { to: "pending", label: "Pause" },
  ],
  verification: [
    { to: "completed", label: "Verify & complete", primary: true },
    { to: "in-progress", label: "Send back to work" },
  ],
  completed: [{ to: "verification", label: "Reopen for verification" }],
}
