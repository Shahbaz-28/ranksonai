import type React from "react"

import SiteNav from "./site-nav"
import FooterSection from "./footer-section"

export default function PageShell({
  badge,
  title,
  description,
  children,
}: {
  badge?: string
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1400px] lg:w-[1400px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-start items-center relative z-10">
            <SiteNav />

            {/* Page header */}
            <div className="self-stretch pt-[92px] sm:pt-[104px] lg:pt-[140px] pb-10 md:pb-16 px-6 md:px-24 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
              <div className="w-full max-w-[720px] flex flex-col justify-start items-center gap-4">
                {badge && (
                  <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-center items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#37322F]"></div>
                    <div className="text-center text-[#37322F] text-xs font-medium leading-3 font-sans">{badge}</div>
                  </div>
                )}
                <h1 className="self-stretch text-center text-balance text-[#37322F] text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] font-serif">
                  {title}
                </h1>
                {description && (
                  <p className="self-stretch text-center text-pretty text-[rgba(55,50,47,0.80)] text-sm sm:text-base md:text-lg font-medium leading-[1.6] font-sans max-w-[620px] mx-auto">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Page content */}
            <main className="self-stretch flex flex-col justify-start items-center">{children}</main>

            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
