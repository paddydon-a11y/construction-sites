import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://construction-sites.co.uk/services" },
  ],
};

export const metadata = {
  title: "What We Do | Web Design for Construction Businesses",
  description:
    "Custom website design, SEO, Google Ads optimisation, monthly maintenance and more. Everything your construction or trade business needs to get found online.",
  alternates: {
    canonical: "https://construction-sites.co.uk/services",
  },
};

const services = [
  {
    icon: "🎨",
    title: "Custom Website Design",
    tagline: "Look like the biggest outfit in your area.",
    description:
      "No templates. Every site is built from scratch around your business. We study your competitors and build something that makes you look like the firm to hire. Customers see your site and think: these lot know what they\u2019re doing.",
  },
  {
    icon: "📞",
    title: "More Enquiries, Better Jobs",
    tagline: "Your phone rings. And not with tyre-kickers.",
    description:
      "We build your site so that when someone searches for your trade in your area, they find you first. More calls, more emails, more people ready to pay what the job is actually worth.",
  },
  {
    icon: "🎯",
    title: "Google Ads Ready",
    tagline: "Start running ads the moment you want to. Everything is already set up.",
    description:
      "Your site launches ready to take paid traffic. Targeted to your area, your trade, your ideal customers. When you\u2019re ready to turn the tap on, everything is already in place.",
  },
  {
    icon: "🔧",
    title: "We Keep It Updated",
    tagline: "New photos? Updated prices? Just send us a message.",
    description:
      "You get an hour of edits every month, included. Need to add a new service, swap some photos, or update your number? Just ping us and it\u2019s done. No waiting around, no extra charges.",
  },
  {
    icon: "📱",
    title: "Looks Great on Every Phone",
    tagline: "70% of your customers are searching on their phones. Your site will look mint.",
    description:
      "Every site works perfectly on mobiles, tablets, and desktops. Fast loading, easy to use, tap-to-call buttons. Because nobody\u2019s hiring a contractor from a clunky website.",
  },
  {
    icon: "💷",
    title: "Charge What You\u2019re Worth",
    tagline: "Customers pay more when you look professional.",
    description:
      "A proper website changes the conversation. You stop being \u2018the cheap option\u2019 and start being the professional choice. Better rates, better payment terms, less haggling.",
  },
  {
    icon: "👷",
    title: "Attract Better People",
    tagline: "Good tradespeople want to work for good firms.",
    description:
      "A strong online presence doesn\u2019t just attract customers. It attracts better staff too. You\u2019ll start getting messages from experienced people who want to be part of your team.",
  },
  {
    icon: "📍",
    title: "Found on Google Maps",
    tagline: "Show up when customers search nearby.",
    description:
      "We get your business on Google Maps with photos, reviews, and your service area all set up properly. When someone searches your trade near them, you\u2019re right there.",
  },
] as const;

export default function ServicesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      {/* ─── 1. HEADER ─── */}
      <section className="blueprint-grid relative px-6 pb-16 pt-24 text-center sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            What We{" "}
            <span className="text-hivis">Do</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-light sm:text-xl">
            More customers. Better rates. Your phone actually ringing. Here&apos;s
            how we make it happen.
          </p>
        </div>

        <div
          className="construction-tape absolute bottom-0 left-0 right-0"
          aria-hidden="true"
        />
      </section>

      {/* ─── 2. SERVICES GRID ─── */}
      <section className="bg-dark px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-xl border-l-4 border-hivis bg-charcoal p-8"
              >
                <span className="text-4xl" aria-hidden="true">
                  {service.icon}
                </span>

                <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                  {service.title}
                </h2>

                <p className="mt-2 font-semibold text-hivis">
                  {service.tagline}
                </p>

                <p className="mt-3 leading-relaxed text-slate-light">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. BOTTOM CTA ─── */}
      <section className="bg-charcoal px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            The Full Package. One Monthly&nbsp;Price.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-light sm:text-xl">
            Everything above is included in your &pound;100/month plan. No
            extras. No surprises.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-hivis px-8 py-4 text-lg font-bold text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
            >
              See Pricing
            </Link>
            <Link
              href="/our-work"
              className="inline-flex items-center justify-center rounded-md border-2 border-hivis px-8 py-4 text-lg font-bold text-hivis transition-colors hover:bg-hivis hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
