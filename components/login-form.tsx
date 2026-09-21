"use client"

import Link from "next/link"
import { useState } from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)

    if (!email.includes("@")) {
      setError("Enter a valid work email address.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setError(null)
    // TODO: connect to the authentication backend once it is available.
    setNotice("Sign-in is not connected yet. Request access and we will set your workspace up.")
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-6">
      <div className="p-6 md:p-8 bg-white rounded-2xl border border-[rgba(55,50,47,0.10)] shadow-[0px_2px_8px_rgba(55,50,47,0.08)] flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#37322F] text-2xl font-semibold leading-8 font-sans">Log in to Visilm</h1>
          <p className="text-[#605A57] text-[13px] font-normal leading-5 font-sans">
            Track your AI visibility index, citations, and competitor share.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[#49423D] text-[13px] font-medium leading-5 font-sans">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="h-10 px-3 rounded-lg border border-[rgba(55,50,47,0.16)] bg-[#FDFCFB] text-[#37322F] text-sm font-sans outline-none focus:border-[#37322F] focus:ring-2 focus:ring-[rgba(55,50,47,0.10)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[#49423D] text-[13px] font-medium leading-5 font-sans">
                Password
              </label>
              <button
                type="button"
                onClick={() => setNotice("Password resets open once your workspace is provisioned.")}
                className="text-[rgba(73,66,61,0.70)] text-xs font-medium font-sans hover:text-[#37322F]"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="h-10 px-3 rounded-lg border border-[rgba(55,50,47,0.16)] bg-[#FDFCFB] text-[#37322F] text-sm font-sans outline-none focus:border-[#37322F] focus:ring-2 focus:ring-[rgba(55,50,47,0.10)]"
            />
          </div>

          {error && (
            <div role="alert" className="text-[#B4342A] text-[13px] font-medium leading-5 font-sans">
              {error}
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="px-3 py-2 rounded-lg bg-[rgba(55,50,47,0.05)] text-[#49423D] text-[13px] font-medium leading-5 font-sans"
            >
              {notice}
            </div>
          )}

          <button
            type="submit"
            className="h-10 px-6 bg-[#37322F] text-white text-[13px] font-medium leading-5 font-sans rounded-full shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:bg-[#2A2520] transition-colors"
          >
            Log in
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-[rgba(55,50,47,0.12)]"></div>
          <span className="text-[rgba(73,66,61,0.50)] text-xs font-medium font-sans">or</span>
          <div className="flex-1 h-[1px] bg-[rgba(55,50,47,0.12)]"></div>
        </div>

        <button
          type="button"
          onClick={() => setNotice("SSO is available on the Enterprise plan. Talk to us to enable it.")}
          className="h-10 px-6 bg-white border border-[rgba(55,50,47,0.16)] text-[#37322F] text-[13px] font-medium leading-5 font-sans rounded-full hover:bg-[rgba(55,50,47,0.03)] transition-colors"
        >
          Continue with SSO
        </button>
      </div>

      <p className="text-center text-[#605A57] text-[13px] font-normal leading-5 font-sans">
        No account yet?{" "}
        <Link href="/pricing" className="text-[#37322F] font-medium hover:underline">
          Start on the free plan
        </Link>
      </p>
    </div>
  )
}
