import Link from "next/link";

export const metadata = {
  title: "Services",
  description:
    "Custom website design, SEO, Google Ads optimisation, monthly maintenance and more. Everything your construction or trade business needs to get found online.",
};

const services = [
  {
    icon: "\uD83C\uDFA8",
    title: "Custom Website Design",
    tagline: "No templates. No prefabs. Built from the ground up.",
    description:
      "Every site is designed bespoke for your business. We look at your trade, your area, and your competition \u2014 then build something that blows them out of the water. Your site won\u2019t look like anyone else\u2019s.",
  },
  {
    icon: "\uD83D\uDCC8",
    title: "SEO & Google Ranking",
    tagline:
      "Get found when customers search for your trade. We put you on the map.",
    description:
      "We bake SEO into every page from day one. Local keywords, meta tags, schema markup, Google Business \u2014 the works. When someone searches \u2018plumber near me\u2019, you\u2019ll be right there.",
  },
  {
    icon: "\uD83C\uDFAF",
    title: "Google Ads Ready",
    tagline:
      "Built to convert from day one. Your site launches ready to run ads the moment you are.",
    description:
      "Every site is optimised for Google Ads with proper landing pages, conversion tracking, and call-to-action placement. Targeted to your area, your trade, your ideal customers. Ready to deploy whenever you want.",
  },
  {
    icon: "\uD83D\uDD27",
    title: "Monthly Maintenance",
    tagline:
      "1 hour of edits per month included. Need more? We\u2019re only \u00A350/hour.",
    description:
      "Need to update your prices? Add a new service? Swap out some photos? Just send us a message and we\u2019ll sort it. No ticketing systems, no waiting around.",
  },
  {
    icon: "\uD83D\uDCF1",
    title: "Mobile Optimised",
    tagline:
      "70% of your customers are on their phones. Your site will look mint on all of them.",
    description:
      "Every site we build is mobile-first. Fast loading, easy to navigate, thumb-friendly buttons. Because nobody\u2019s hiring a contractor from a desktop anymore.",
  },
  {
    icon: "\uD83D\uDCE9",
    title: "Lead Capture Forms",
    tagline:
      "Enquiry forms that ping straight to your phone. Never miss a job again.",
    description:
      "Custom contact forms that send enquiries directly to your email and phone. Name, number, job description \u2014 everything you need to quote on the spot.",
  },
  {
    icon: "\uD83D\uDCCD",
    title: "Google Business Profile",
    tagline:
      "We\u2019ll get you on Google Maps so customers can find you round the corner.",
    description:
      "We\u2019ll set up or optimise your Google Business Profile. Photos, reviews, opening hours, service area \u2014 everything dialled in so you show up in the map pack.",
  },
  {
    icon: "\uD83D\uDD12",
    title: "SSL & Security",
    tagline:
      "Padlock in the browser. Keeps your customers\u2019 data safe and Google happy.",
    description:
      "Every site comes with a free SSL certificate. That little padlock in the browser bar? It builds trust and helps your Google ranking. Win-win.",
  },
] as const;

export default function ServicesPage() {
  return (
    <main>
      {/* ─── 1. HEADER ─── */}
      <section className="blueprint-grid relative px-6 pb-16 pt-24 text-center sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            What We{" "}
            <span className="text-hivis">Do</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-light sm:text-xl">
            Everything you need to get found online. No faff. No jargon. Just
            results.
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

          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-hivis px-8 py-4 text-lg font-bold text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
