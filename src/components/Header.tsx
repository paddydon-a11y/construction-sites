"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Main nav bar */}
      <nav className="bg-charcoal border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl" aria-hidden="true">
                🏗️
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-white uppercase">
                Construction Sites
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-display)] px-3 py-2 text-lg tracking-wider text-slate-light rounded-md transition-colors hover:text-hivis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA + Mobile hamburger */}
            <div className="flex items-center gap-3">
              {/* CTA button — hidden on mobile */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center justify-center rounded-md bg-hivis px-5 py-2 font-[family-name:var(--font-display)] text-lg tracking-wider text-dark transition-colors hover:bg-hivis-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
              >
                Get Started
              </Link>

              {/* Hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-slate-light transition-colors hover:text-hivis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hivis"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  /* X icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  /* Hamburger icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 font-[family-name:var(--font-display)] text-xl tracking-wider text-slate-light transition-colors hover:bg-white/5 hover:text-hivis"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-md bg-hivis px-3 py-2 text-center font-[family-name:var(--font-display)] text-xl tracking-wider text-dark transition-colors hover:bg-hivis-bright"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Construction tape stripe */}
      <div className="construction-tape-thin" aria-hidden="true" />
    </header>
  );
}
