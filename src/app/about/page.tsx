import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "We're a web design agency that works exclusively with tradespeople and construction businesses. No suits, no jargon, no agency prices.",
};

export default function AboutPage() {
  return (
    <main>
      {/* ─── 1. HEADER ─── */}
      <section className="bg-dark px-6 pt-32 pb-0 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight">
          About <span className="text-hivis">Construction Sites</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-light">
          We&rsquo;re not your average web agency.
        </p>

        <div
          className="construction-tape mt-12"
          aria-hidden="true"
        />
      </section>

      {/* ─── 2. INTRO SECTION ─── */}
      <section className="bg-dark px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            We don&rsquo;t wear suits, we don&rsquo;t do jargon, and we
            definitely don&rsquo;t charge agency prices.
          </p>

          <p className="mt-8 text-lg leading-relaxed text-slate-light">
            We&rsquo;re a team of web designers and developers who work
            exclusively with tradespeople and construction businesses.
            That&rsquo;s it. That&rsquo;s all we do. We don&rsquo;t build sites
            for restaurants, salons, or accountants. Just trades.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-slate-light">
            Why? Because we know the industry. We know what your customers are
            searching for. We know what makes them pick up the phone. And we know
            how to build websites that make that happen.
          </p>
        </div>
      </section>

      {/* ─── 3. WHY TRADESPEOPLE ─── */}
      <section className="bg-charcoal px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Why We Only Work With Trades
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <article className="rounded-xl bg-charcoal border border-white/10 p-8">
              <span className="text-4xl" aria-hidden="true">
                🎯
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                We Know Your Customers
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Every tradesperson&rsquo;s customer does the same thing: they
                Google the trade they need + their location. &lsquo;Plumber
                Leeds&rsquo;. &lsquo;Electrician Manchester&rsquo;. We build
                sites that show up for exactly those searches.
              </p>
            </article>

            {/* Card 2 */}
            <article className="rounded-xl bg-charcoal border border-white/10 p-8">
              <span className="text-4xl" aria-hidden="true">
                💬
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                We Speak Your Language
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                No tech waffle. No buzzwords. We explain everything in plain
                English. If you can understand a quote for a bathroom refit, you
                can understand how we work.
              </p>
            </article>

            {/* Card 3 */}
            <article className="rounded-xl bg-charcoal border border-white/10 p-8">
              <span className="text-4xl" aria-hidden="true">
                💷
              </span>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                We Know Your Budget
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">
                Most tradespeople don&rsquo;t want to drop &pound;5k on a
                website. We get it. That&rsquo;s why we built a model that gets
                you a premium site for less than your monthly diesel bill.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 4. OUR PROCESS ─── */}
      <section className="bg-dark px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            How It Works. Dead Simple.
          </h2>

          <div className="mt-14 space-y-0">
            {/* Step 1 */}
            <div className="relative flex gap-6">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hivis text-lg font-extrabold text-dark">
                  1
                </div>
                <div className="w-0.5 grow bg-hivis/30" />
              </div>
              {/* Content */}
              <div className="pb-12">
                <h3 className="text-xl font-bold sm:text-2xl">
                  You Get In Touch
                </h3>
                <p className="mt-2 leading-relaxed text-slate-light">
                  Fill in the form, give us a bell, send a carrier pigeon.
                  Whatever works. We&rsquo;ll have a quick chat about your
                  trade, your area, and what you need.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hivis text-lg font-extrabold text-dark">
                  2
                </div>
                <div className="w-0.5 grow bg-hivis/30" />
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-bold sm:text-2xl">
                  We Get to Work
                </h3>
                <p className="mt-2 leading-relaxed text-slate-light">
                  Our team designs and builds your site. We&rsquo;ll send you a
                  preview link so you can check it over. Usually ready within a
                  week.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hivis text-lg font-extrabold text-dark">
                  3
                </div>
                <div className="w-0.5 grow bg-hivis/30" />
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-bold sm:text-2xl">
                  You Go Live
                </h3>
                <p className="mt-2 leading-relaxed text-slate-light">
                  Happy with it? We press the big red button. Your site goes
                  live, optimised for Google Ads, and your phone starts ringing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hivis text-lg font-extrabold text-dark">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold sm:text-2xl">
                  We Keep It Running
                </h3>
                <p className="mt-2 leading-relaxed text-slate-light">
                  Hosting, security, updates, edits. We handle the lot. You
                  focus on the tools, we&rsquo;ll focus on the tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FUN SIGN-OFF ─── */}
      <section className="blueprint-grid px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl font-semibold leading-relaxed sm:text-2xl">
            Still reading? You should probably just get in touch.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
