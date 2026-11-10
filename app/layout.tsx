import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"

import JsonLd from "@/components/json-ld"
import { jsonLdGraph, ogImage, organizationSchema, siteConfig, softwareApplicationSchema, websiteSchema } from "@/lib/seo"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.title}`,
    description: siteConfig.description,
    locale: siteConfig.locale,
    ...(ogImage ? { images: [ogImage] } : {}),
  },
  twitter: {
    card: ogImage ? "summary_large_image" : "summary",
    title: `${siteConfig.name} - ${siteConfig.title}`,
    description: siteConfig.description,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    ...(ogImage ? { images: [ogImage.url] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  // Paste the values from Search Console / Bing Webmaster Tools once verified.
  // verification: { google: "", other: { "msvalidate.01": "" } },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F3",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={jsonLdGraph(organizationSchema, websiteSchema, softwareApplicationSchema)} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
