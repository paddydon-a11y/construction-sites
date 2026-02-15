import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
  return (
    <footer>
      {/* Construction tape stripe */}
      <div className="construction-tape" aria-hidden="true" />

      {/* Main footer */}
      <div className="bg-dark blueprint-grid">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Column 1 — Company info */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  🏗️
                </span>
                <span className="text-lg font-bold tracking-tight text-white">
                  Construction Sites
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-light">
                We Build Sites. You Build Everything Else.
              </p>
              <p className="mt-2 text-sm text-slate-light/70">
                Professional websites for tradespeople who want their phone to
                ring. No faff, no jargon. Just results.
              </p>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-hivis">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-light transition-colors hover:text-hivis"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-hivis">
                Contact
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-hivis"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:08001234567"
                    className="text-sm text-slate-light transition-colors hover:text-hivis"
                  >
                    0800 123 4567
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-hivis"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:hello@construction-sites.co.uk"
                    className="text-sm text-slate-light transition-colors hover:text-hivis"
                  >
                    hello@construction-sites.co.uk
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-slate-light/60">
              &copy; 2025 Construction Sites. Built different.
            </p>
            <p className="text-xs text-slate-light/40">
              No hard hats required for browsing. 🏗️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
