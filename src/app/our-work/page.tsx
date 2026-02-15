import Link from "next/link";

export const metadata = {
  title: "Our Work | Construction Sites",
  description:
    "Browse 2,000+ websites we've built for tradespeople across the UK. Electricians, plumbers, builders, roofers and more.",
};

const sites = [
  { file: "site-01.html", name: "Spark Brothers Electrical", trade: "Electricians", location: "Manchester", bg: "#0b1929" },
  { file: "site-02.html", name: "AquaFlow Plumbing & Heating", trade: "Plumbers", location: "Leeds", bg: "#f8f9fa" },
  { file: "site-39.html", name: "Mosaic Bathrooms", trade: "Bathroom Fitters", location: "Aberdeen", bg: "#111111" },
  { file: "site-31.html", name: "Ridgeline Roofing", trade: "Roofers", location: "Coventry", bg: "#1f1f1f" },
  { file: "site-35.html", name: "Atlas Access Solutions", trade: "Scaffolders", location: "Derby", bg: "#0c1b33" },
  { file: "site-03.html", name: "NorthPoint Roofing", trade: "Roofers", location: "Newcastle", bg: "#1a1a1a" },
  { file: "site-05.html", name: "Apex Building Solutions", trade: "Builders", location: "Birmingham", bg: "#1e293b" },
  { file: "site-07.html", name: "Summit Scaffolding Solutions", trade: "Scaffolders", location: "London", bg: "#0a0a0a" },
  { file: "site-23.html", name: "Meadow Lane Landscapes", trade: "Landscapers", location: "Worcester", bg: "#d4c5a9" },
  { file: "site-12.html", name: "Cornerstone Brickwork", trade: "Bricklayers", location: "Nottingham", bg: "#4a4a4a" },
  { file: "site-08.html", name: "Precision Plastering & Rendering", trade: "Plasterers", location: "Edinburgh", bg: "#fefefe" },
  { file: "site-09.html", name: "Metro Kitchen Fitters", trade: "Kitchen Fitters", location: "London", bg: "#111111" },
  { file: "site-11.html", name: "Redfern Bricklaying", trade: "Bricklayers", location: "Sheffield", bg: "#1e3a5f" },
  { file: "site-13.html", name: "Heritage Brickwork", trade: "Bricklayers", location: "Oxford", bg: "#2d4a3e" },
  { file: "site-14.html", name: "Whitfield Construction", trade: "Builders", location: "York", bg: "#2c2c2c" },
  { file: "site-15.html", name: "Bridgewater Builders", trade: "Builders", location: "Bath", bg: "#0f2942" },
  { file: "site-16.html", name: "Volt Electrical Services", trade: "Electricians", location: "Glasgow", bg: "#2d1b4e" },
  { file: "site-18.html", name: "Oakwood Kitchens", trade: "Kitchen Fitters", location: "Cheltenham", bg: "#f5f0e8" },
  { file: "site-19.html", name: "The Kitchen Workshop", trade: "Kitchen Fitters", location: "Norwich", bg: "#ffffff" },
  { file: "site-20.html", name: "Stone & Oak Kitchens", trade: "Kitchen Fitters", location: "Reading", bg: "#1a1a1a" },
  { file: "site-21.html", name: "Hampshire Kitchen Design", trade: "Kitchen Fitters", location: "Southampton", bg: "#ffffff" },
  { file: "site-22.html", name: "Bloom & Branch Gardens", trade: "Landscapers", location: "Canterbury", bg: "#f5f0e8" },
  { file: "site-24.html", name: "Eden Garden Design", trade: "Landscapers", location: "Harrogate", bg: "#f8f6f0" },
  { file: "site-25.html", name: "Thornfield Landscaping", trade: "Landscapers", location: "Chester", bg: "#ffffff" },
  { file: "site-26.html", name: "Willowbrook Gardens", trade: "Landscapers", location: "Cambridge", bg: "#faf8f5" },
  { file: "site-27.html", name: "Forgepoint Welding & Fabrication", trade: "Welding & Fabrication", location: "Wolverhampton", bg: "#111111" },
  { file: "site-28.html", name: "Colour & Co Decorating", trade: "Painters & Decorators", location: "Durham", bg: "#fafafa" },
  { file: "site-29.html", name: "Pinnacle Painters", trade: "Painters & Decorators", location: "Exeter", bg: "#f8f4ef" },
  { file: "site-30.html", name: "Cascade Plumbing Services", trade: "Plumbers", location: "Swansea", bg: "#1e40af" },
  { file: "site-04.html", name: "Greenway Landscapes", trade: "Landscapers", location: "Bristol", bg: "#faf9f6" },
  { file: "site-32.html", name: "Heritage Roofing", trade: "Roofers", location: "Lincoln", bg: "#faf5eb" },
  { file: "site-33.html", name: "Skyline Scaffolding", trade: "Scaffolders", location: "Plymouth", bg: "#1e3a5f" },
  { file: "site-10.html", name: "K&S Bricklaying", trade: "Bricklayers", location: "Brighton", bg: "#f5f0ea" },
  { file: "site-34.html", name: "Tower Scaffolding Services", trade: "Scaffolders", location: "Leicester", bg: "#1a1a1a" },
  { file: "site-17.html", name: "ClearView Windows & Doors", trade: "Window Installers", location: "Cardiff", bg: "#ffffff" },
  { file: "site-06.html", name: "Hargreaves Heating & Gas", trade: "Heating Engineers", location: "Liverpool", bg: "#faf7f2" },
  { file: "site-36.html", name: "Cathedral Scaffolding", trade: "Scaffolders", location: "Salisbury", bg: "#172554" },
  { file: "site-37.html", name: "Cotswold Stonework", trade: "Stone Masons", location: "Cirencester", bg: "#f8f5ef" },
  { file: "site-38.html", name: "Tilecraft Bathrooms", trade: "Bathroom Fitters", location: "Sunderland", bg: "#ffffff" },
  { file: "site-40.html", name: "Waterline Bathrooms & Tiling", trade: "Bathroom Fitters", location: "Bournemouth", bg: "#ffffff" },
];

export default function OurWorkPage() {
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
            tradespeople across the UK.
          </p>
        </div>

        <div className="construction-tape" />
      </section>

      {/* ── Portfolio Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div
              key={site.file}
              className="group rounded-xl border border-white/5 bg-charcoal p-3 transition-all duration-300 hover:border-hivis/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
                style={{ backgroundColor: site.bg }}
              >
                <iframe
                  src={`/portfolio-sites/${site.file}`}
                  title={site.name}
                  className="pointer-events-none absolute left-0 top-0 border-none select-none"
                  width={1440}
                  height={1080}
                  style={{
                    transform: "scale(0.278)",
                    transformOrigin: "top left",
                  }}
                  loading="lazy"
                  tabIndex={-1}
                />
              </div>

              <div className="mt-3 px-1">
                <h3 className="truncate font-semibold text-white text-sm">
                  {site.name}
                </h3>
                <p className="text-xs text-hivis mt-0.5">{site.trade}</p>
                <p className="text-xs text-slate-light">{site.location}</p>
              </div>
            </div>
          ))}
        </div>
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
