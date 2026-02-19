import Link from "next/link";
import { faqs } from "@/lib/data";
import JsonLd from "@/components/JsonLd";

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
        { "@type": "ListItem", position: 2, name: "Pricing", item: "https://construction-sites.co.uk/pricing" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What if I don't renew after 12 months?",
          acceptedAnswer: { "@type": "Answer", text: "No dramas. If you stop paying, we take the site down. No penalties, no exit fees, no hard feelings. We'll even give you your content if you want to go elsewhere." },
        },
        {
          "@type": "Question",
          name: "Can I make changes to my site?",
          acceptedAnswer: { "@type": "Answer", text: "Absolutely. You get 1 hour of edits per month included in your plan. Need a new photo, updated prices, or a new service page? Just ping us. Need more than an hour? It's only £50/hour after that." },
        },
        {
          "@type": "Question",
          name: "How long does it take to build?",
          acceptedAnswer: { "@type": "Answer", text: "Most sites are live within 5-7 working days. We've done same-week turnarounds for lads who needed it yesterday." },
        },
        {
          "@type": "Question",
          name: "Do I own my domain?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, 100%. Your domain is registered in your name. We'll sort out the purchase and setup, but it's yours. If you ever leave, you take it with you." },
        },
      ],
    },
  ],
};

export const metadata = {
  title: "Pricing | Construction Business Websites from £100/month",
  description:
    "Custom websites for construction and trade businesses from just £100/month. No hidden fees, no contracts. Everything included: hosting, SEO, Google Ads optimisation, and monthly edits.",
  alternates: {
    canonical: "https://construction-sites.co.uk/pricing",
  },
};

const painPoints = [
  {
    icon: "🔍",
    headline: "The Job That Went Next Door",
    text: "A homeowner with a big detached house Googled \"plumber near me\" last Tuesday. Full bathroom refit, paying upfront, no messing about. You were 3 miles away, sat in your van. But you didn't show up on Google. The bloke 10 miles away with a website did. He got the call. You didn't even know the job existed.",
  },
  {
    icon: "🏗️",
    headline: "The Contract You Never Heard About",
    text: "A property manager had 6 flats that needed rewiring. He Googled, checked websites, picked someone who looked legit. You could have done it in your sleep. But he couldn't find you, so you were never in the running.",
  },
  {
    icon: "🤡",
    headline: "The Cowboy With the Better Website",
    text: "You know the one. Half your experience, twice the complaints. But his website looks the part, so he gets the work. Customers can't tell good from bad online — they just pick whoever looks most professional.",
  },
  {
    icon: "💸",
    headline: "£50/Month to Checkatrade. For What?",
    text: "You're paying lead gen sites for enquiries you could be getting for free from Google. Your own website, your own leads, no commission, no sharing with 3 other traders. The maths is a no-brainer.",
  },
];

const comparisonRows = [
  { feature: "Upfront Cost", agency: "£3,000 - £6,000", us: "£0" },
  { feature: "Time to Launch", agency: "4-8 weeks", us: "5-7 days" },
  { feature: "Monthly Hosting", agency: "£30 - £50/month", us: "Included" },
  { feature: "Monthly Edits (1hr)", agency: "£50 - £100/hour", us: "Included" },
  { feature: "Google Ads Optimised", agency: "£300 - £500 extra", us: "Included" },
  { feature: "Google Business Setup", agency: "£200 - £400 extra", us: "Included" },
  { feature: "SEO Setup", agency: "£500 - £1,500 extra", us: "Included" },
  { feature: "SSL Certificate", agency: "£50 - £100/year", us: "Included" },
  { feature: "Cancel Anytime", agency: "12-24 month contract", us: "Yes" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-dark">
      <JsonLd data={pricingJsonLd} />

      {/* ─── 1. HERO: THE COST OF DOING NOTHING ─── */}
      <section className="relative overflow-hidden">
        <div className="blueprint-grid absolute inset-0 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 pt-24 pb-6 sm:px-6 lg:px-8 text-center">
          <p className="text-hivis text-sm font-bold uppercase tracking-widest mb-4">
            The Real Cost
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            What&rsquo;s a Bad Website{" "}
            <span className="text-hivis hivis-glow">Really Costing</span> You?
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-light sm:text-xl">
            You&rsquo;re already paying for not having a website.
            You just can&rsquo;t see the invoice.
          </p>
        </div>

        <div className="construction-tape" />
      </section>

      {/* ─── 2. PAIN POINTS ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {painPoints.map((point) => (
              <div
                key={point.headline}
                className="rounded-xl bg-charcoal border border-white/5 p-7"
              >
                <span className="text-3xl">{point.icon}</span>
                <h3 className="mt-4 text-xl font-extrabold text-white">
                  {point.headline}
                </h3>
                <p className="mt-3 text-slate-light leading-relaxed">
                  {point.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-red-950/30 border border-red-500/20 p-8 text-center">
            <p className="text-red-400 text-lg font-bold">
              Every week without a proper website is jobs walking past your door.
            </p>
            <p className="mt-2 text-slate-light">
              You can&rsquo;t win work people can&rsquo;t find you for.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. THE FIX ─── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-hivis text-sm font-bold uppercase tracking-widest mb-4">
            The Fix
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            A Website That Wins You Work
          </h2>
          <p className="mt-4 text-slate-light text-lg max-w-2xl mx-auto">
            Custom built for your trade. Designed to get your phone ringing.
            Live in under a week.
          </p>

          {/* Price reveal */}
          <div className="mt-12 bg-hivis rounded-2xl p-10 hivis-box-glow animate-pulse-glow">
            <p className="text-dark/70 text-sm font-bold uppercase tracking-widest">
              Your Price
            </p>
            <p className="mt-3 text-dark text-6xl md:text-7xl font-black">
              £100<span className="text-4xl md:text-5xl">/month</span>
            </p>
            <p className="mt-2 text-dark/70 text-base font-bold">
              +VAT &middot; Zero upfront &middot; Cancel anytime
            </p>
          </div>

          {/* Context comparisons */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Less than", comparison: "your phone bill" },
              { label: "Less than", comparison: "one hour's labour" },
              { label: "Less than", comparison: "a Checkatrade sub" },
              { label: "Less than", comparison: "one tank of diesel" },
            ].map((item) => (
              <div
                key={item.comparison}
                className="rounded-lg bg-dark border border-white/5 p-4"
              >
                <p className="text-slate-light text-xs uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="mt-1 text-white font-bold text-sm">
                  {item.comparison}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. THE MATHS ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Do the Maths
          </h2>
          <p className="text-center mt-4 text-slate-light text-lg">
            One job from your website pays for a whole year of it.
          </p>

          <div className="mt-12 space-y-6">
            {[
              {
                label: "Average job value",
                value: "£500 - £2,000",
                sub: "Even a small callout covers months of your site",
              },
              {
                label: "Cost of your website",
                value: "£100/month",
                sub: "Everything included. Hosting, edits, SEO, the lot",
              },
              {
                label: "One new job per month from Google",
                value: "5-20x return",
                sub: "100% of our clients report vast turnover increases once they go live",
              },
              {
                label: "Upfront cost",
                value: "£0",
                sub: "No deposit, no setup fee, no catch",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-6"
              >
                <div>
                  <p className="text-white font-semibold text-lg">{row.label}</p>
                  <p className="text-slate-light text-sm mt-0.5">{row.sub}</p>
                </div>
                <span className="text-hivis font-extrabold text-2xl sm:text-3xl whitespace-nowrap">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-all duration-200 hover:bg-hivis-bright hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
            >
              Get Started — £0 Upfront
            </Link>
            <p className="mt-3 text-slate-light text-sm">
              Live in 5-7 days. Cancel anytime. No nonsense.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. US vs AGENCIES ─── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-hivis text-sm font-bold uppercase tracking-widest mb-4">
            Comparison
          </p>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
            Us vs a Typical Web Agency
          </h2>
          <p className="text-center text-slate-light mb-12 max-w-xl mx-auto">
            Agencies charge thousands upfront and take months.
            We charge nothing upfront and launch in days.
          </p>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy">
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-light">
                    What You Get
                  </th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-light">
                    Typical Agency
                  </th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-light">
                    Construction Sites
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={
                      idx % 2 === 0 ? "bg-charcoal" : "bg-charcoal/50"
                    }
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-red-400">{row.agency}</td>
                    <td className="px-6 py-4 text-hivis font-bold">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 6. WHAT'S INCLUDED ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl mb-12">
            Everything Included. No Extras.
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Custom Website Design",
              "Mobile Responsive",
              "Hosting & SSL",
              "SEO Optimised",
              "Google Ads Ready",
              "Google Business Setup",
              "1hr Monthly Edits",
              "Performance Monitoring",
              "Cancel Anytime",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg bg-charcoal border border-white/5 px-5 py-4"
              >
                <span className="text-hivis font-bold text-lg">&#10003;</span>
                <span className="text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ─── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Got Questions?
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl bg-charcoal border border-white/5 p-6"
              >
                <h3 className="font-bold text-lg text-white">
                  {faq.question}
                </h3>
                <p className="text-slate-light mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. BOTTOM CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="construction-tape" />

        <div className="blueprint-grid-dense relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Stop Losing Jobs to Blokes With Better Websites
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-light sm:text-xl">
            £100/month. Zero upfront. Live in a week.
            One job pays for the whole year.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-block rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-all duration-200 hover:bg-hivis-bright hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
