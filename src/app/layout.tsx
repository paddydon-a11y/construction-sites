import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-subheading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://construction-sites.co.uk"),
  title: {
    default: "Construction Sites | Web Design for Tradespeople",
    template: "%s | Construction Sites",
  },
  description:
    "We build stunning websites for tradespeople and construction businesses. Custom design, SEO, Google Ads, all included for just £100/month. No templates. No nonsense.",
  keywords: [
    "tradesman website",
    "construction website design",
    "web design for tradespeople",
    "builder website",
    "plumber website",
    "electrician website",
    "roofer website",
    "trade website design",
    "affordable tradesman website",
    "SEO for tradespeople",
  ],
  authors: [{ name: "Construction Sites" }],
  creator: "Construction Sites",
  publisher: "Construction Sites",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://construction-sites.co.uk",
    siteName: "Construction Sites",
    title: "Construction Sites | Web Design for Tradespeople",
    description:
      "We build stunning websites for tradespeople and construction businesses. Custom design, SEO, Google Ads, all for £100/month.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Construction Sites: We Build Sites. You Build Everything Else.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Sites | Web Design for Tradespeople",
    description:
      "Stunning websites for tradespeople. Custom design, SEO, Google Ads, all for £100/month.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://construction-sites.co.uk",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://construction-sites.co.uk/#website",
      url: "https://construction-sites.co.uk",
      name: "Construction Sites",
      description: "Web Design Agency for Tradespeople and Construction Businesses",
      publisher: { "@id": "https://construction-sites.co.uk/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://construction-sites.co.uk/#organization",
      name: "Construction Sites",
      url: "https://construction-sites.co.uk",
      description:
        "We build stunning websites for tradespeople and construction businesses. Custom design, SEO, Google Ads, all included.",
      email: "hello@construction-sites.co.uk",
      telephone: "0800 123 4567",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "0800 123 4567",
        contactType: "sales",
        availableLanguage: "English",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://construction-sites.co.uk/#localbusiness",
      name: "Construction Sites",
      description: "Web design agency specialising in websites for tradespeople and construction businesses.",
      url: "https://construction-sites.co.uk",
      telephone: "0800 123 4567",
      email: "hello@construction-sites.co.uk",
      priceRange: "££",
      openingHours: "Mo-Fr 08:00-18:00",
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
      serviceType: "Web Design",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.className} ${barlow.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
