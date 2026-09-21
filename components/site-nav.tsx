"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
      <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

      <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
        <div className="flex justify-start items-center">
          <Link
            href="/"
            className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans"
          >
            Visilm
          </Link>
        </div>
        <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-5">
          <div className="justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
            {navLinks.map((link) => (
              <div key={link.href} className="flex justify-start items-center">
                <Link
                  href={link.href}
                  className={`flex flex-col justify-center text-xs md:text-[13px] font-medium leading-[14px] font-sans transition-colors hover:text-[#37322F] ${
                    isActive(link.href) ? "text-[#37322F]" : "text-[rgba(49,45,43,0.80)]"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="h-6 sm:h-7 md:h-8 flex justify-start items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center hover:shadow-[0px_2px_4px_rgba(55,50,47,0.16)] transition-shadow"
            >
              <span className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                Log in
              </span>
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="sm:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-[rgba(55,50,47,0.06)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {mobileOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" stroke="#37322F" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="#37322F" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden absolute top-[52px] left-6 right-6 bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] shadow-[0px_8px_24px_rgba(55,50,47,0.12)] p-2 z-40 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-xl text-[13px] font-medium font-sans ${
                isActive(link.href) ? "bg-[rgba(55,50,47,0.06)] text-[#37322F]" : "text-[rgba(49,45,43,0.80)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
