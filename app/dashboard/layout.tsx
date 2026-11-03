import type React from "react"
import type { Metadata } from "next"

import AppShell from "@/components/dashboard/app-shell"
import { DashboardProvider } from "@/components/dashboard/dashboard-state"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "AI search visibility, citations, competitors and optimization work for your brand.",
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <AppShell>{children}</AppShell>
    </DashboardProvider>
  )
}
