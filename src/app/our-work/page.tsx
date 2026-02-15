"use client";

import { useState } from "react";
import Link from "next/link";

const sites = [
  { file: "site-01.html", name: "Spark Brothers Electrical", trade: "Electricians", location: "Manchester", image: "/portfolio-images/electrician-01.jpg" },
  { file: "site-40.html", name: "Waterline Bathrooms & Tiling", trade: "Bathroom Fitters", location: "Bournemouth", image: "/portfolio-images/tiler-04.jpg" },
  { file: "site-39.html", name: "Mosaic Bathrooms", trade: "Bathroom Fitters", location: "Aberdeen", image: "/portfolio-images/tiler-03.jpg" },
  { file: "site-31.html", name: "Ridgeline Roofing", trade: "Roofers", location: "Coventry", image: "/portfolio-images/roofer-02.jpg" },
  { file: "site-35.html", name: "Atlas Access Solutions", trade: "Scaffolders", location: "Derby", image: "/portfolio-images/scaffolder-04.jpg" },
  { file: "site-03.html", name: "NorthPoint Roofing", trade: "Roofers", location: "Newcastle", image: "/portfolio-images/roofer-01.jpg" },
  { file: "site-05.html", name: "Apex Building Solutions", trade: "Builders", location: "Birmingham", image: "/portfolio-images/builder-01.jpg" },
  { file: "site-07.html", name: "Summit Scaffolding Solutions", trade: "Scaffolders", location: "London", image: "/portfolio-images/scaffolder-01.jpg" },
  { file: "site-23.html", name: "Meadow Lane Landscapes", trade: "Landscapers", location: "Worcester", image: "/portfolio-images/landscaper-03.jpg" },
  { file: "site-12.html", name: "Cornerstone Brickwork", trade: "Bricklayers", location: "Nottingham", image: "/portfolio-images/bricklayer-03.jpg" },
  { file: "site-08.html", name: "Precision Plastering & Rendering", trade: "Plasterers", location: "Edinburgh", image: "/portfolio-images/tiler-01.jpg" },
  { file: "site-09.html", name: "Metro Kitchen Fitters", trade: "Kitchen Fitters", location: "London", image: "/portfolio-images/kitchen-fitter-01.jpg" },
  { file: "site-37.html", name: "Cotswold Stonework", trade: "Stone Masons", location: "Cirencester", image: "/portfolio-images/stonemason-01.jpg" },
  { file: "site-11.html", name: "Redfern Bricklaying", trade: "Bricklayers", location: "Sheffield", image: "/portfolio-images/bricklayer-02.jpg" },
  { file: "site-02.html", name: "AquaFlow Plumbing & Heating", trade: "Plumbers", location: "Leeds", image: "/portfolio-images/plumber-01.jpg" },
  { file: "site-13.html", name: "Heritage Brickwork", trade: "Bricklayers", location: "Oxford", image: "/portfolio-images/bricklayer-04.jpg" },
  { file: "site-14.html", name: "Whitfield Construction", trade: "Builders", location: "York", image: "/portfolio-images/builder-02.jpg" },
  { file: "site-15.html", name: "Bridgewater Builders", trade: "Builders", location: "Bath", image: "/portfolio-images/builder-03.jpg" },
  { file: "site-16.html", name: "Volt Electrical Services", trade: "Electricians", location: "Glasgow", image: "/portfolio-images/electrician-02.jpg" },
  { file: "site-18.html", name: "Oakwood Kitchens", trade: "Kitchen Fitters", location: "Cheltenham", image: "/portfolio-images/kitchen-fitter-02.jpg" },
  { file: "site-19.html", name: "The Kitchen Workshop", trade: "Kitchen Fitters", location: "Norwich", image: "/portfolio-images/kitchen-fitter-03.jpg" },
  { file: "site-20.html", name: "Stone & Oak Kitchens", trade: "Kitchen Fitters", location: "Reading", image: "/portfolio-images/kitchen-fitter-04.jpg" },
  { file: "site-21.html", name: "Hampshire Kitchen Design", trade: "Kitchen Fitters", location: "Southampton", image: "/portfolio-images/kitchen-fitter-05.jpg" },
  { file: "site-22.html", name: "Bloom & Branch Gardens", trade: "Landscapers", location: "Canterbury", image: "/portfolio-images/landscaper-02.jpg" },
  { file: "site-24.html", name: "Eden Garden Design", trade: "Landscapers", location: "Harrogate", image: "/portfolio-images/landscaper-04.jpg" },
  { file: "site-25.html", name: "Thornfield Landscaping", trade: "Landscapers", location: "Chester", image: "/portfolio-images/landscaper-05.jpg" },
  { file: "site-26.html", name: "Willowbrook Gardens", trade: "Landscapers", location: "Cambridge", image: "/portfolio-images/landscaper-06.jpg" },
  { file: "site-27.html", name: "Forgepoint Welding & Fabrication", trade: "Welding & Fabrication", location: "Wolverhampton", image: "/portfolio-images/metalworker-01.jpg" },
  { file: "site-28.html", name: "Colour & Co Decorating", trade: "Painters & Decorators", location: "Durham", image: "/portfolio-images/painter-01.jpg" },
  { file: "site-29.html", name: "Pinnacle Painters", trade: "Painters & Decorators", location: "Exeter", image: "/portfolio-images/painter-02.jpg" },
  { file: "site-30.html", name: "Cascade Plumbing Services", trade: "Plumbers", location: "Swansea", image: "/portfolio-images/plumber-03.jpg" },
  { file: "site-04.html", name: "Greenway Landscapes", trade: "Landscapers", location: "Bristol", image: "/portfolio-images/landscaper-01.jpg" },
  { file: "site-32.html", name: "Heritage Roofing", trade: "Roofers", location: "Lincoln", image: "/portfolio-images/roofer-03.jpg" },
  { file: "site-33.html", name: "Skyline Scaffolding", trade: "Scaffolders", location: "Plymouth", image: "/portfolio-images/scaffolder-02.jpg" },
  { file: "site-10.html", name: "K&S Bricklaying", trade: "Bricklayers", location: "Brighton", image: "/portfolio-images/bricklayer-01.jpg" },
  { file: "site-34.html", name: "Tower Scaffolding Services", trade: "Scaffolders", location: "Leicester", image: "/portfolio-images/scaffolder-03.jpg" },
  { file: "site-17.html", name: "ClearView Windows & Doors", trade: "Window Installers", location: "Cardiff", image: "/portfolio-images/glazier-01.jpg" },
  { file: "site-06.html", name: "Hargreaves Heating & Gas", trade: "Heating Engineers", location: "Liverpool", image: "/portfolio-images/plumber-02.jpg" },
  { file: "site-36.html", name: "Cathedral Scaffolding", trade: "Scaffolders", location: "Salisbury", image: "/portfolio-images/scaffolder-05.jpg" },
  { file: "site-38.html", name: "Tilecraft Bathrooms", trade: "Bathroom Fitters", location: "Sunderland", image: "/portfolio-images/tiler-02.jpg" },
];

const BATCH = 9;

export default function OurWorkPage() {
  const [visible, setVisible] = useState(BATCH);
  const shown = sites.slice(0, visible);
  const hasMore = visible < sites.length;

  return (
    <main className="min-h-screen bg-dark">
      {/* ── Header ── */}
      <section className="relative overflow-hidden">
        <div className="blueprint-grid absolute inset-0 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Our <span className="text-hivis hivis-glow">Completed</span> Sites
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-light sm:text-xl">
            A selection of the 2,000+ websites we&rsquo;ve built for
            construction and trade businesses across the UK.
          </p>
        </div>

        <div className="construction-tape" />
      </section>

      {/* ── Portfolio Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((site) => (
            <div
              key={site.file}
              className="group rounded-xl border border-white/5 bg-charcoal p-3 transition-all duration-300 hover:border-hivis/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={site.image}
                  alt={`${site.name} - ${site.trade} in ${site.location}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                    {site.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 px-1">
                <h3 className="truncate font-semibold text-white text-base">
                  {site.name}
                </h3>
                <p className="text-sm text-hivis mt-0.5">{site.trade}</p>
                <p className="text-sm text-slate-light">{site.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisible((v) => Math.min(v + BATCH, sites.length))}
              className="inline-flex items-center gap-2 rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-all duration-200 hover:bg-hivis-bright hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
            >
              Load More Sites
              <span aria-hidden="true">🔨</span>
            </button>
            <p className="mt-3 text-sm text-slate-light">
              Showing {shown.length} of {sites.length} sites
            </p>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative overflow-hidden">
        <div className="construction-tape" />

        <div className="blueprint-grid-dense relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Like What You <span className="text-hivis hivis-glow">See?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-light">
            Let&rsquo;s build yours next. Every site is custom and no
            two are the same.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-all duration-200 hover:bg-hivis-bright hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
          >
            Start Your Build
          </Link>
        </div>
      </section>
    </main>
  );
}
