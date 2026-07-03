"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Ranksonai and how does it help?",
    answer:
      "Ranksonai is an AI Search Engine Optimization (AEO) and visibility platform. We help B2B brands analyze where they are being recommended in AI search engines (like ChatGPT, Perplexity, Claude, Gemini, etc.), find gaps where competitors are chosen instead, and optimize their online presence to get cited.",
  },
  {
    question: "What engines do we check for visibility?",
    answer:
      "We monitor and run queries against all major AI search surfaces, including ChatGPT (OpenAI), Perplexity AI, Claude (Anthropic), Gemini (Google), Grok (xAI), and Copilot (Microsoft), alongside newer emerging search networks.",
  },
  {
    question: "How do you optimize for AI recommendations?",
    answer:
      "AI models rely on specific digital signals: structured schema data, third-party comparison guides, authoritative review sites, and clear answer-first page layouts. We analyze what signals the engines use to answer B2B buyer questions and guide you on correcting or improving those source materials.",
  },
  {
    question: "Do we need to write new content or run another marketing channel?",
    answer:
      "No, you don't need to run a new channel. Ranksonai focuses on optimizing your existing high-intent pages, documentation, and product comparison sheets, alongside fixing key external signals that AI crawlers scan.",
  },
  {
    question: "How do we measure success and track leads?",
    answer:
      "We track your brand's citation share (percentage of times you are recommended for relevant buyer queries), direct inbound traffic from AI engines, and conversion actions on your landing pages, presenting everything in a single, clear dashboard.",
  },
  {
    question: "Is there support for enterprise compliance?",
    answer:
      "Yes. Our enterprise tier includes SSO integration, priority custom crawling schedules, SOC 2 compliance support, and a dedicated AI visibility expert to align GTM strategy.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Explore your data, build your dashboard,
            <br className="hidden md:block" />
            bring your team together.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
