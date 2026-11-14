import Image from "next/image"
import Link from "next/link"

import FAQSection from "../components/faq-section"
import PricingSection from "../components/pricing-section"
import FooterSection from "../components/footer-section"
import SiteNav from "../components/site-nav"
import JsonLd from "../components/json-ld"
import HeroAnswerStream from "../components/hero-answer-stream"
import HeroScoreCheck from "../components/hero-score-check"
import NeuralField from "../components/neural-field"
import EngineIcons from "../components/engine-icons"
import { Principles, ProofBar, TheLoop } from "../components/landing-sections"
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
              <div className="relative px-2 sm:px-4 md:px-8 lg:px-0 w-full flex flex-col items-center pb-8 sm:pb-12 md:pb-16">
                {/* Atmosphere — the field photograph, dissolved into the page */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-40 h-[1000px] z-0 overflow-hidden"
                  style={{
                    // Every layer below fades out on the same curve, so the
                    // atmosphere dissolves into the page instead of ending on a
                    // hard horizontal edge where the container stops.
                    maskImage:
                      "linear-gradient(180deg, #000 0%, #000 52%, rgba(0,0,0,0.6) 76%, rgba(0,0,0,0.2) 90%, transparent 99%)",
                    WebkitMaskImage:
                      "linear-gradient(180deg, #000 0%, #000 52%, rgba(0,0,0,0.6) 76%, rgba(0,0,0,0.2) 90%, transparent 99%)",
                  }}
                >
                  {/* The image, desaturated and faded so it reads as weather, not as a photo */}
                  <div
                    className="absolute inset-0 bg-[url('/bg.webp')] bg-cover bg-top bg-no-repeat"
                    style={{
                      opacity: 0.5,
                      filter: "saturate(0.62) contrast(0.94)",
                      maskImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #000 22%, #000 50%, rgba(0,0,0,0.45) 74%, transparent 94%)",
                      WebkitMaskImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #000 22%, #000 50%, rgba(0,0,0,0.45) 74%, transparent 94%)",
                    }}
                  />
                  {/* Pull the cool photo toward the warm palette */}
                  <div
                    className="absolute inset-0 mix-blend-soft-light"
                    style={{ background: "linear-gradient(180deg, rgba(247,245,243,0.5) 0%, rgba(214,189,160,0.55) 100%)" }}
                  />
                  {/* Side vignettes so it never meets the page edges hard */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, #F7F5F3 0%, rgba(247,245,243,0) 18%, rgba(247,245,243,0) 82%, #F7F5F3 100%)",
                    }}
                  />
                  {/* A little motion over the stillness */}
                  <NeuralField className="absolute inset-0 h-full w-full opacity-40" />
                  {/* Keep the copy on clean cream */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(44% 34% at 50% 27%, rgba(247,245,243,0.92) 0%, rgba(247,245,243,0.62) 50%, rgba(247,245,243,0) 78%)",
                    }}
                  />
                </div>
                <div className="relative z-10 w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-5 sm:gap-6">
                  {/* Who this is for */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(55,50,47,0.12)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#49423D] shadow-[0px_1px_2px_rgba(55,50,47,0.06)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1baf7a]" />
                    AI search visibility for B2B teams
                  </span>

                  <div className="self-stretch flex flex-col justify-center items-center gap-5 sm:gap-6">
                    <h1 className="w-full max-w-[800px] mx-auto text-center text-balance text-[#37322F] text-[34px] sm:text-[48px] md:text-[62px] lg:text-[80px] font-normal leading-[1.08] tracking-[-0.015em] font-serif px-2 sm:px-4 md:px-0">
                      Get recommended when buyers search AI for you
                    </h1>
                    <p className="w-full max-w-[600px] mx-auto text-center text-pretty text-[rgba(55,50,47,0.78)] text-[16px] sm:text-[18px] md:text-[19px] leading-[1.6] font-sans font-medium px-2 sm:px-4 md:px-0">
                      <strong className="font-semibold text-[#37322F]">Track</strong> where AI engines name you.{" "}
                      <strong className="font-semibold text-[#37322F]">Fix</strong> the sources they pull from.{" "}
                      <strong className="font-semibold text-[#37322F]">Become</strong> the brand they recommend.
                    </p>
                  </div>
                </div>

                {/* The engines we read */}
                <div className="relative z-10 mt-5 sm:mt-6">
                  <EngineIcons />
                </div>

                {/* Working front door */}
                <div className="relative z-10 mt-11 sm:mt-12 flex w-full flex-col items-center px-2">
                  <HeroScoreCheck />
                </div>

                {/* The hook: an answer writing itself, without you in it */}
                <div className="relative z-10 w-full max-w-[820px] px-1 sm:px-2 mt-12 sm:mt-14 md:mt-16">
                  <HeroAnswerStream />
                  <p className="mt-3.5 text-center text-[13px] text-[rgba(73,66,61,0.55)]">
                    This is what your buyers see. Visilm tracks it on every engine, every week.
                  </p>
                </div>

                {/* And here is where it lands */}
                <div className="relative z-10 w-full max-w-[1300px] lg:w-[1300px] px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center mt-16 sm:mt-20 md:mt-24">
                  {/* A thin mat around the screenshot: one hairline, a little
                      white, and a soft lift. Nothing else. */}
                  <div className="w-full rounded-[14px] bg-white/70 p-1.5 ring-1 ring-[rgba(55,50,47,0.09)] backdrop-blur-sm shadow-[0px_30px_80px_-36px_rgba(55,50,47,0.45)]">
                    <div className="overflow-hidden rounded-[9px] ring-1 ring-[rgba(55,50,47,0.10)]">
                      <Image
                        src="/dashboard.png"
                        alt="The Visilm dashboard: AI visibility score, brand mention rate, citation rate and share of voice, with a visibility trend by engine"
                        width={1465}
                        height={757}
                        sizes="(max-width: 1300px) 100vw, 1300px"
                        priority
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------- Body sections ------------------------- */}
              <ProofBar />
              <TheLoop />
              <Principles />
              <PricingSection />
              <FAQSection />
            </main>

            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
