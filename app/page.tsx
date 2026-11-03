import Image from "next/image"
import Link from "next/link"

import FAQSection from "../components/faq-section"
import PricingSection from "../components/pricing-section"
import CTASection from "../components/cta-section"
import FooterSection from "../components/footer-section"
import SiteNav from "../components/site-nav"
import JsonLd from "../components/json-ld"
import ProductTour from "../components/product-tour"
import { EngineCoverage, PlatformSections, Principles, TheLoop } from "../components/landing-sections"
import { faqData } from "@/lib/faq-data"
import { breadcrumbSchema, faqSchema, jsonLdGraph } from "@/lib/seo"

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <JsonLd data={jsonLdGraph(faqSchema(faqData), breadcrumbSchema([{ name: "Home", path: "/" }]))} />
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1400px] lg:w-[1400px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Vertical rules */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0" />
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0" />

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            <SiteNav />

            <main className="pt-12 sm:pt-14 md:pt-16 lg:pt-[120px] flex flex-col justify-start items-center w-full">
              {/* ------------------------------ Hero ------------------------------ */}
              <div className="px-2 sm:px-4 md:px-8 lg:px-0 w-full flex flex-col items-center pb-8 sm:pb-12 md:pb-16">
                <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    <h1 className="w-full max-w-[748.71px] lg:w-[748.71px] mx-auto text-center text-balance text-[#37322F] text-[28px] sm:text-[40px] md:text-[56px] lg:text-[80px] font-normal leading-[1.15] md:leading-[1.1] font-serif px-2 sm:px-4 md:px-0">
                      Get recommended when buyers search AI for you
                    </h1>
                    <p className="w-full max-w-[620px] lg:w-[620px] mx-auto text-center text-pretty text-[rgba(55,50,47,0.80)] text-sm sm:text-base md:text-lg leading-[1.5] md:leading-[1.6] font-sans font-medium px-2 sm:px-4 md:px-0">
                      Visilm finds where AI search engine citations miss your brand, fixes the source signals, and
                      tracks your visibility score.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 relative z-10 mt-8 sm:mt-10 md:mt-12">
                  <Link
                    href="/onboarding"
                    className="h-11 md:h-12 px-7 sm:px-9 md:px-11 relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center transition-colors hover:bg-[#2A2520]"
                  >
                    <span className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
                      Get AI Visibility Score
                    </span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="h-11 md:h-12 px-7 sm:px-9 md:px-10 rounded-full border border-[rgba(55,50,47,0.18)] bg-white flex justify-center items-center text-[#37322F] text-sm sm:text-base md:text-[15px] font-medium transition-colors hover:border-[rgba(55,50,47,0.35)]"
                  >
                    See a live workspace
                  </Link>
                </div>

                <p className="mt-4 text-[12.5px] text-[rgba(73,66,61,0.55)]">
                  No credit card · Your first scan runs in minutes
                </p>

                {/* Product shot */}
                <div className="w-full max-w-[1300px] lg:w-[1300px] px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center mt-10 sm:mt-14 md:mt-16">
                  <div className="w-full aspect-[1735/906] h-auto bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] relative">
                    <Image
                      src="/visilm-dashboard.png"
                      alt="Visilm dashboard showing AI visibility score, cited sources and competitor share of voice"
                      fill
                      sizes="(max-width: 1400px) 100vw, 1300px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------- Body sections ------------------------- */}
              <EngineCoverage />
              <ProductTour />
              <TheLoop />
              <PlatformSections />
              <Principles />
              <PricingSection />
              <FAQSection />
              <CTASection />
            </main>

            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
