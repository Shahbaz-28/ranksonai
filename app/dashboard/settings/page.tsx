import type { Metadata } from "next"

import { Crumbs, PageHeader } from "@/components/dashboard/kit"
import SettingsWorkspace from "@/components/dashboard/settings-workspace"

export const metadata: Metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]} />
        <PageHeader
          eyebrow="Settings"
          title="Workspace settings"
          description="Your business profile, what we crawl, which brands and engines we track, and who on the team sees what."
        />
      </div>
      <SettingsWorkspace />
    </div>
  )
}
