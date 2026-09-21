import SiteNav from "@/components/site-nav"
import LoginForm from "@/components/login-form"
import { buildMetadata } from "@/lib/seo"

// Gated page: useful to users, no value in the index.
export const metadata = buildMetadata({
  title: "Log in",
  description: "Log in to your Visilm workspace to track AI search visibility, citations, and competitor share.",
  path: "/login",
  noIndex: true,
})

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1400px] lg:w-[1400px] relative flex flex-col justify-start items-start min-h-screen">
        {/* Left vertical line */}
        <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

        {/* Right vertical line */}
        <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

        <div className="self-stretch pt-[9px] flex-1 flex flex-col justify-start items-center relative z-10">
          <SiteNav />

          <div className="self-stretch flex-1 pt-[120px] sm:pt-[140px] lg:pt-[170px] pb-16 px-6 flex flex-col justify-start items-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
