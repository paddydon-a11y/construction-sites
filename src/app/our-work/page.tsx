"use client";

import { useState } from "react";
import Link from "next/link";

const sites = [
  { file: "site-01", name: "Carter Brothers Electrical", trade: "Electricians", location: "Manchester" },
  { file: "site-40", name: "Waterline Bathrooms & Tiling", trade: "Bathroom Fitters", location: "Bournemouth" },
  { file: "site-39", name: "Mosaic Bathrooms", trade: "Bathroom Fitters", location: "Aberdeen" },
  { file: "site-31", name: "Ridgeline Roofing", trade: "Roofers", location: "Coventry" },
  { file: "site-35", name: "Atlas Access Solutions", trade: "Scaffolders", location: "Derby" },
  { file: "site-03", name: "NorthPoint Roofing", trade: "Roofers", location: "Newcastle" },
  { file: "site-05", name: "Apex Building Solutions", trade: "Builders", location: "Birmingham" },
  { file: "site-07", name: "Summit Scaffolding Solutions", trade: "Scaffolders", location: "London" },
  { file: "site-23", name: "Meadow Lane Landscapes", trade: "Landscapers", location: "Worcester" },
  { file: "site-12", name: "Cornerstone Brickwork", trade: "Bricklayers", location: "Nottingham" },
  { file: "site-08", name: "Precision Plastering & Rendering", trade: "Plasterers", location: "Edinburgh" },
  { file: "site-09", name: "Metro Kitchen Fitters", trade: "Kitchen Fitters", location: "London" },
  { file: "site-37", name: "Cotswold Stonework", trade: "Stone Masons", location: "Cirencester" },
  { file: "site-11", name: "Redfern Bricklaying", trade: "Bricklayers", location: "Sheffield" },
  { file: "site-02", name: "AquaFlow Plumbing & Heating", trade: "Plumbers", location: "Leeds" },
  { file: "site-13", name: "Heritage Brickwork", trade: "Bricklayers", location: "Oxford" },
  { file: "site-14", name: "Whitfield Construction", trade: "Builders", location: "York" },
  { file: "site-15", name: "Bridgewater Builders", trade: "Builders", location: "Bath" },
  { file: "site-16", name: "Volt Electrical Services", trade: "Electricians", location: "Glasgow" },
  { file: "site-18", name: "Oakwood Kitchens", trade: "Kitchen Fitters", location: "Cheltenham" },
  { file: "site-19", name: "The Kitchen Workshop", trade: "Kitchen Fitters", location: "Norwich" },
  { file: "site-20", name: "Stone & Oak Kitchens", trade: "Kitchen Fitters", location: "Reading" },
  { file: "site-21", name: "Hampshire Kitchen Design", trade: "Kitchen Fitters", location: "Southampton" },
  { file: "site-22", name: "Bloom & Branch Gardens", trade: "Landscapers", location: "Canterbury" },
  { file: "site-24", name: "Eden Garden Design", trade: "Landscapers", location: "Harrogate" },
  { file: "site-25", name: "Thornfield Landscaping", trade: "Landscapers", location: "Chester" },
  { file: "site-26", name: "Willowbrook Gardens", trade: "Landscapers", location: "Cambridge" },
  { file: "site-27", name: "Forgepoint Welding & Fabrication", trade: "Welding & Fabrication", location: "Wolverhampton" },
  { file: "site-28", name: "Colour & Co Decorating", trade: "Painters & Decorators", location: "Durham" },
  { file: "site-29", name: "Pinnacle Painters", trade: "Painters & Decorators", location: "Exeter" },
  { file: "site-30", name: "Cascade Plumbing Services", trade: "Plumbers", location: "Swansea" },
  { file: "site-04", name: "Greenway Landscapes", trade: "Landscapers", location: "Bristol" },
  { file: "site-32", name: "Heritage Roofing", trade: "Roofers", location: "Lincoln" },
  { file: "site-33", name: "Skyline Scaffolding", trade: "Scaffolders", location: "Plymouth" },
  { file: "site-10", name: "K&S Bricklaying", trade: "Bricklayers", location: "Brighton" },
  { file: "site-34", name: "Tower Scaffolding Services", trade: "Scaffolders", location: "Leicester" },
  { file: "site-17", name: "ClearView Windows & Doors", trade: "Window Installers", location: "Cardiff" },
  { file: "site-06", name: "Hargreaves Heating & Gas", trade: "Heating Engineers", location: "Liverpool" },
  { file: "site-36", name: "Cathedral Scaffolding", trade: "Scaffolders", location: "Salisbury" },
  { file: "site-38", name: "Tilecraft Bathrooms", trade: "Bathroom Fitters", location: "Sunderland" },
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
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={`/thumbnails/${site.file}.jpg`}
                  alt={`${site.name} website preview`}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy"
                />
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

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-hivis px-8 py-4 text-lg font-bold text-dark transition-all duration-200 hover:bg-hivis-bright hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
            >
              Start Your Build
            </Link>
            <Link
              href="/services"
              className="inline-block rounded-lg border-2 border-hivis px-8 py-4 text-lg font-bold text-hivis transition-all duration-200 hover:bg-hivis hover:text-dark active:scale-95"
            >
              See What We Do
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
