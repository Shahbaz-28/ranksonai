"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Globe } from "lucide-react"

/**
 * The hero's working front door: a domain goes in, and onboarding opens
 * pre-filled with it. No account, no gate — the first useful thing happens
 * before anyone is asked for anything.
 */

/** Strips protocol/path and keeps a bare hostname. */
function normalise(raw: string) {
  const v = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
  return v
}

const VALID = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/

export default function HeroScoreCheck() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const domain = normalise(value)

    if (!domain) {
      setError("Enter your website to start.")
      return
    }
    if (!VALID.test(domain)) {
      setError("That doesn't look like a domain — try yourcompany.com")
      return
    }

    setError(null)
    setBusy(true)
    router.push(`/onboarding?domain=${encodeURIComponent(domain)}`)
  }

  return (
    <div className="w-full max-w-[620px]">
      <form onSubmit={submit} noValidate>
        <div
          className={`flex flex-col gap-2 rounded-2xl border bg-white p-2 shadow-[0px_8px_30px_-12px_rgba(55,50,47,0.22)] transition-colors sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 ${
            error ? "border-[rgba(208,59,59,0.45)]" : "border-[rgba(55,50,47,0.14)]"
          }`}
        >
          <label htmlFor="hero-domain" className="sr-only">
            Your website
          </label>
          <div className="flex flex-1 items-center gap-2.5 px-3 sm:px-4">
            <Globe className="h-[18px] w-[18px] shrink-0 text-[rgba(73,66,61,0.45)]" aria-hidden="true" />
            <input
              id="hero-domain"
              name="domain"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="yourcompany.com"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(null)
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "hero-domain-error" : "hero-domain-hint"}
              className="h-11 w-full min-w-0 bg-transparent text-[16px] text-[#37322F] outline-none placeholder:text-[rgba(73,66,61,0.42)]"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#37322F] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#2A2520] disabled:opacity-70 sm:rounded-full"
          >
            {busy ? "Opening…" : "Check my visibility"}
            {!busy && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </form>

      {error ? (
        <p id="hero-domain-error" role="alert" className="mt-2.5 text-center text-[13px] font-medium text-[#9c2626]">
          {error}
        </p>
      ) : (
        <p id="hero-domain-hint" className="mt-3 text-center text-[12.5px] text-[rgba(73,66,61,0.5)]">
          No signup · No card
        </p>
      )}
    </div>
  )
}
