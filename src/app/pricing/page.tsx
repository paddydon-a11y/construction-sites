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
        {
          "@type": "Question",
          name: "What about Google Ads?",
          acceptedAnswer: { "@type": "Answer", text: "Every site we build is optimised for Google Ads from the ground up. Proper landing pages, conversion tracking, the lot. When you're ready to run ads, your site is already built to convert." },
        },
        {
          "@type": "Question",
          name: "I already have a website. Can you rebuild it?",
          acceptedAnswer: { "@type": "Answer", text: "Course we can. We'll rebuild it from scratch, move your domain over, and make sure you don't lose any Google rankings in the process." },
        },
        {
          "@type": "Question",
          name: "What if I need more than a basic website?",
          acceptedAnswer: { "@type": "Answer", text: "We can add extras like booking systems, gallery pages, or multi-location setups. We'll quote anything extra upfront, no surprises." },
        },
        {
          "@type": "Question",
          name: "Do you do e-commerce / online shops?",
          acceptedAnswer: { "@type": "Answer", text: "Nah, that's not our thing. We build websites for construction and trade businesses who want their phone to ring. If you want leads? We're your lot." },
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

const strikethroughPrices = [
  { service: "Custom Website Build", price: "£6,000" },
  { service: "Monthly SEO & Hosting", price: "£150/month" },
  { service: "Google Ads Optimisation", price: "£500" },
  { service: "Monthly Edits", price: "£50/hour" },
];

const comparisonRows = [
  { feature: "Custom Website", typical: "£3,000 - £6,000", us: "Included" },
  { feature: "Monthly Hosting", typical: "£30 - £50/month", us: "Included" },
  { feature: "Monthly Edits (1hr)", typical: "£50 - £100/hour", us: "FREE" },
  { feature: "Google Ads Optimised", typical: "£300 - £500", us: "Included" },
  {
    feature: "Google Business Setup",
    typical: "£200 - £400",
    us: "Included",
  },
  { feature: "SEO Setup", typical: "£500 - £1,500", us: "Included" },
  { feature: "SSL Certificate", typical: "£50 - £100/year", us: "Included" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-dark">
      <JsonLd data={pricingJsonLd} />
      {/* ─── 1. HEADER ─── */}
      <section className="relative overflow-hidden">
        <div className="blueprint-grid absolute inset-0 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Pricing That{" "}
            <span className="text-hivis hivis-glow">Won&rsquo;t Break</span>{" "}
            the Bank
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-light sm:text-xl">
            No Hidden Extras. No Scaffolding Charges.
          </p>
        </div>

        <div className="construction-tape" />
      </section>

      {/* ─── 2. THE BIG PRICING REVEAL ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-3xl">
          {/* What it normally costs */}
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            What It Would Normally Cost
          </h2>

          <div className="mt-12 space-y-5">
            {strikethroughPrices.map((item) => (
              <div
                key={item.service}
                className="flex items-center justify-between border-b border-white/5 pb-5"
              >
                <span className="text-gray-400 text-lg">{item.service}</span>
                <span className="price-strike text-red-400 text-xl font-bold">
                  {item.price}
                </span>
              </div>
            ))}

            {/* Total first year */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-gray-400 text-xl font-semibold">
                Total First Year
              </span>
              <span className="price-strike text-red-400 text-3xl sm:text-4xl font-extrabold">
                £8,000+
              </span>
            </div>
          </div>

          {/* The reveal card */}
          <div className="mt-16 bg-hivis rounded-2xl p-10 text-center hivis-box-glow animate-pulse-glow">
            <p className="text-dark/70 text-sm font-bold uppercase tracking-widest">
              Your Price
            </p>
            <p className="mt-3 text-dark text-6xl md:text-7xl font-black">
              £100/month
            </p>
            <p className="mt-4 text-dark/80 text-lg">
              Everything included. Seriously, everything.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. KEY SELLING POINTS ─── */}
      <section className="bg-charcoal py-16 px-6">
        <div className="mx-auto max-w-3xl space-y-5">
          {[
            "No contract. Cancel anytime.",
            "No setup fee. No hidden costs.",
            "Less than a tank of diesel for a website that pays for itself.",
          ].map((point) => (
            <p
              key={point}
              className="text-white text-lg sm:text-xl font-semibold"
            >
              <span className="text-hivis mr-2" aria-hidden="true">
                &#x2705;
              </span>
              {point}
            </p>
          ))}
        </div>
      </section>

      {/* ─── 4. COMPARISON TABLE ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl mb-12">
            See How We Stack Up
          </h2>

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
                    <td className="px-6 py-4 text-red-400">{row.typical}</td>
                    <td className="px-6 py-4 text-hivis font-bold">
                      <span aria-hidden="true">&#x2705; </span>
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ SECTION ─── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Got Questions? We&rsquo;ve Got Answers.
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

      {/* ─── 6. BOTTOM CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="construction-tape" />

        <div className="blueprint-grid-dense relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Convinced Yet?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-light sm:text-xl">
            Join 2,000+ construction and trade businesses who ditched overpriced agencies.
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
