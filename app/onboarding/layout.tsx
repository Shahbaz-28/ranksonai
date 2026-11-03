import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { DashboardProvider } from "@/components/dashboard/dashboard-state"

export const metadata: Metadata = {
  title: "Set up your workspace",
  description: "Add your business, run the first analysis and see your initial GEO report.",
  robots: { index: false, follow: false },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#F7F5F3]">
        <header className="border-b border-[rgba(55,50,47,0.10)] bg-[rgba(247,245,243,0.92)] backdrop-blur-sm">
          <div className="mx-auto flex h-[60px] w-full max-w-[1100px] items-center gap-3 px-4 sm:px-6">
            <Link href="/" className="text-[17px] font-semibold text-[#2F3037]">
              Visilm
            </Link>
            <span className="rounded-full bg-[rgba(55,50,47,0.06)] px-1.5 py-[1px] text-[10px] font-semibold text-[rgba(73,66,61,0.62)]">
              Demo
            </span>
            <Link
              href="/dashboard"
              className="ml-auto text-[12px] font-medium text-[#605A57] transition-colors hover:text-[#37322F]"
            >
              Skip to the dashboard →
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </div>
    </DashboardProvider>
  )
}
