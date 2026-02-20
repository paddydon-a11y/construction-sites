import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
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
    default: "Websites for Construction Businesses | Construction Sites",
    template: "%s",
  },
  description:
    "We build stunning websites for construction businesses and tradespeople. Custom design, SEO, Google Ads optimised, all included for just £100/month. No templates. No nonsense.",
  keywords: [
    "construction website design",
    "construction business website",
    "web design for construction companies",
    "builder website",
    "plumber website",
    "electrician website",
    "roofer website",
    "trade website design",
    "affordable construction website",
    "SEO for construction businesses",
    "tradesman website",
    "web design for tradespeople",
  ],
  authors: [{ name: "Construction Sites" }],
  creator: "Construction Sites",
  publisher: "Construction Sites",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://construction-sites.co.uk",
    siteName: "Construction Sites",
    title: "Get Better Work with a Better Website",
    description:
      "Construction Sites. We build sites. You build everything else.",
    images: [
      {
        url: "https://construction-sites.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Construction Sites: We Build Sites. You Build Everything Else.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Better Work with a Better Website",
    description:
      "Construction Sites. We build sites. You build everything else.",
    images: ["https://construction-sites.co.uk/og-image.png"],
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
      description: "Web Design Agency for Construction and Trade Businesses",
      publisher: { "@id": "https://construction-sites.co.uk/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://construction-sites.co.uk/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://construction-sites.co.uk/#organization",
      name: "Construction Sites",
      url: "https://construction-sites.co.uk",
      logo: "https://construction-sites.co.uk/og-image.png",
      description:
        "We build stunning websites for construction businesses and tradespeople. Custom design, SEO, Google Ads optimised, all included.",
      email: "patrick@construction-sites.co.uk",
      telephone: "+447926535524",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+447926535524",
        contactType: "sales",
        availableLanguage: "English",
        areaServed: { "@type": "Country", name: "United Kingdom" },
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://construction-sites.co.uk/#localbusiness",
      name: "Construction Sites",
      description: "Web design agency specialising in websites for construction and trade businesses across the UK.",
      url: "https://construction-sites.co.uk",
      telephone: "+447926535524",
      email: "patrick@construction-sites.co.uk",
      image: "https://construction-sites.co.uk/og-image.png",
      priceRange: "££",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
      ],
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
    <html lang="en-GB" className={`${barlow.className} ${barlow.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable}`}>
      <head>
        <meta name="google-site-verification" content="XxT71Eqhp8-mMvRdME2D6yJS9Uw8YcND9GrlK2-M2Ps" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('D69KIIRC77U2V3Q5J9EG');
  ttq.page();
}(window, document, 'ttq');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17958918628"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17958918628');
  gtag('config', 'G-WG747WXNB6');`,
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
