import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://construction-sites.co.uk/about" },
  ],
};

export const metadata = {
  title: "About Us | Construction Sites",
  description:
    "A better website means better work, better leads, and better people wanting to work for you. See what a professional online presence does for construction businesses.",
  alternates: {
    canonical: "https://construction-sites.co.uk/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      {/* ─── 1. HEADER ─── */}
      <section className="bg-dark px-6 pt-32 pb-0 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight">
          Get <span className="text-hivis">Better Work.</span> Win{" "}
          <span className="text-hivis">Bigger Contracts.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-light">
          Lay the groundwork with a stunning custom-built website that actually
          generates enquiries.
        </p>

        <div className="construction-tape mt-12" aria-hidden="true" />
      </section>

      {/* ─── 2. THE PROBLEM ─── */}
      <section className="bg-dark px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            Most construction businesses are leaving money on the table every
            single day.
          </p>

          <p className="mt-8 text-lg leading-relaxed text-slate-light">
            You&apos;re great at what you do. But when someone searches for your
            trade in your area, they&apos;re finding your competitors first.
            The ones with proper websites are getting the best jobs, the best
            rates, and the best people asking to work for them.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-slate-light">
            That should be you. And it can be.
          </p>
        </div>
      </section>

      {/* ─── 3. WHAT YOU GET ─── */}
      <section className="bg-charcoal px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            What <span className="text-hivis">Changes</span> When You Look
            Professional Online
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                📞
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                More Leads, Better Jobs
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Your phone rings more. And not with tyre-kickers. A proper
                website attracts customers who are ready to spend and happy to
                pay what the job is worth.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                💷
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                Charge What You&apos;re Worth
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                When you look professional, customers don&apos;t haggle. They
                see a serious business and they pay serious rates. No more
                racing to the bottom on price.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                🤝
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                Better Payment Terms
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Customers trust a business that looks established. That means
                fewer arguments about deposits, stage payments on time, and less
                chasing invoices.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                👷
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                Better People Want to Work for You
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Good tradespeople want to work for good firms. A strong online
                presence makes you look like the outfit to be at. You start
                getting messages from lads who can actually graft.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                🏆
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                Win the Work Before You Quote
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Customers check you out online before they even call. A site
                full of completed projects and testimonials means you&apos;ve
                already half-won the job before you turn up.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-charcoal p-8">
              <span className="text-4xl" aria-hidden="true">
                📈
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                Pick and Choose Your Work
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                When you&apos;ve got enough enquiries coming in, you stop
                saying yes to everything. You take the jobs you want, at the
                price you want, for customers you actually want to work with.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 4. WHY US ─── */}
      <section className="bg-dark px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Why <span className="text-hivis">Us</span>
          </h2>

          <div className="mt-12 space-y-6">
            <p className="text-lg leading-relaxed text-slate-light">
              We only build websites for construction businesses. That&apos;s
              it. We don&apos;t do restaurants, salons, or accountants. Just
              your industry.
            </p>
            <p className="text-lg leading-relaxed text-slate-light">
              That means we already know what your customers are searching for,
              what makes them pick up the phone, and what a site in your trade
              needs to say. We&apos;ve built over 2,000 of them.
            </p>
            <p className="text-lg leading-relaxed text-slate-light">
              No jargon. No waffle. No &pound;5k invoices. Just a site that
              looks the business, ranks on Google, and gets you more work than
              you can handle.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. CTA ─── */}
      <section className="bg-hivis px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl md:text-5xl">
            Ready to Start Getting Better Work?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dark/80 sm:text-xl">
            Your competitors already have websites. The good ones are cleaning
            up. Time to level the playing field.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-dark px-8 py-4 text-lg font-bold text-hivis transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
            >
              Get Started Today
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border-2 border-dark px-8 py-4 text-lg font-bold text-dark transition-colors hover:bg-dark hover:text-hivis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
