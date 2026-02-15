import Link from "next/link";
import { testimonials } from "@/lib/data";
import JsonLd from "@/components/JsonLd";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://construction-sites.co.uk/#localbusiness",
      name: "Construction Sites",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "6",
        bestRating: "5",
        worstRating: "5",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Mark, Spark Brothers Electrical" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Enquiries doubled in the first month and we're now turning work away. Didn't expect that from a website.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Pete, AquaFlow Plumbing" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "We paid a guy four grand for our last website a few years back and it was nowhere near this level. Proper professionals.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Sarah, Apex Roofing" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "The site looks so professional that clients trust us before we even turn up. We've landed three commercial contracts since launch.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Kev, K&S Bricklaying" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Went from zero online presence to page one of Google in our area. Getting 3-4 new enquiries a week now.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "James, Thompson Landscapes" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "The website paid for itself in the first month. Landed a £12k garden project from someone who found us on Google.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Rob, J&R Plastering" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Clean, professional, does exactly what it needs to. We've seen a real uplift in the quality of enquiries coming through.",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <main>
      <JsonLd data={homeJsonLd} />
      {/* ─── 1. HERO SECTION ─── */}
      <section className="blueprint-grid relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Get <span className="text-hivis">Better Work.</span>
          <br />
          Win <span className="text-hivis">Bigger Contracts.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-subheading)] text-2xl tracking-wide text-slate-light sm:text-3xl md:text-4xl">
          Lay the groundwork with a stunning custom-built website that actually
          generates enquiries.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-hivis px-8 py-4 text-lg font-semibold text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/our-work"
            className="inline-flex items-center justify-center rounded-md border-2 border-hivis px-8 py-4 text-lg font-semibold text-hivis transition-colors hover:bg-hivis hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
          >
            See Our Work
          </Link>
        </div>

        {/* Construction tape stripe at bottom of hero */}
        <div
          className="construction-tape absolute bottom-0 left-0 right-0"
          aria-hidden="true"
        />
      </section>

      {/* ─── 2. STATS BAR ─── */}
      <section className="bg-navy py-16 px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div>
            <span className="text-4xl" aria-hidden="true">
              🏗️
            </span>
            <p className="mt-2 text-3xl font-bold text-hivis sm:text-4xl">
              2,000+
            </p>
            <p className="mt-1 text-sm font-medium text-white sm:text-base">
              Sites Built
            </p>
          </div>

          <div>
            <span className="text-4xl" aria-hidden="true">
              ✅
            </span>
            <p className="mt-2 text-3xl font-bold text-hivis sm:text-4xl">
              Zero
            </p>
            <p className="mt-1 text-sm font-medium text-white sm:text-base">
              Snagging
            </p>
          </div>

          <div>
            <span className="text-4xl" aria-hidden="true">
              ⚡
            </span>
            <p className="mt-2 text-3xl font-bold text-hivis sm:text-4xl">
              7 Day
            </p>
            <p className="mt-1 text-sm font-medium text-white sm:text-base">
              Build Time
            </p>
          </div>

          <div>
            <span className="text-4xl" aria-hidden="true">
              ⭐
            </span>
            <p className="mt-2 text-3xl font-bold text-hivis sm:text-4xl">
              5 Star
            </p>
            <p className="mt-1 text-sm font-medium text-white sm:text-base">
              Rated
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW WE BUILD ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            How We Build Your Site
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <article className="rounded-xl border-l-4 border-hivis bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                📋
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                1. The Site Survey
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                We jump on a call, learn about your business, and plan your site.
                No jargon, no waffle. Just a proper chat about what you need.
              </p>
            </article>

            {/* Step 2 */}
            <article className="rounded-xl border-l-4 border-hivis bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                🔨
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                2. Breaking Ground
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Our team cracks on with your build. Custom design, mobile-ready,
                SEO baked in from day one. Most sites done in under a week.
              </p>
            </article>

            {/* Step 3 */}
            <article className="rounded-xl border-l-4 border-hivis bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                🔑
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                3. Handover
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Your site goes live, fully optimised for Google Ads and SEO.
                We hand you the keys. Your phone starts ringing.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 4. TESTIMONIALS ─── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            What the Lads Say
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-xl bg-navy p-8"
              >
                <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-hivis text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <blockquote className="mt-4 text-lg italic leading-relaxed text-slate-light">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <p className="mt-4 font-semibold text-white">
                  {testimonial.name}, {testimonial.trade},{" "}
                  {testimonial.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. PRICING TEASER ─── */}
      <section className="bg-dark py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            No Hidden Extras. No Scaffolding&nbsp;Charges.
          </h2>

          <div className="mt-12">
            <p className="price-strike text-3xl font-bold text-slate-light sm:text-4xl">
              £6,000
            </p>
            <p className="hivis-glow mt-4 text-5xl font-extrabold text-hivis sm:text-6xl md:text-7xl">
              £100/month
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-slate-light sm:text-xl">
            Custom website. Hosting. SEO. Google Ads ready. Monthly edits.
            Everything included.
          </p>

          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-hivis px-8 py-4 text-lg font-semibold text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
            >
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. FINAL CTA ─── */}
      <section className="bg-hivis py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl md:text-5xl">
            Ready to Break Ground?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dark/80 sm:text-xl">
            Your competitors already have websites. Time to level up.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-dark px-8 py-4 text-lg font-semibold text-hivis transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
