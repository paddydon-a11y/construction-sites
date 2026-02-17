"use client";

import { useState } from "react";
import { trades } from "@/lib/data";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    trade: "",
    phone: "",
    email: "",
    project: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/mjgewpwj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        // Send to CRM
        fetch("/api/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, _source: "website-contact" }),
        }).catch(() => {});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-dark text-white">
      {/* HEADER */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold mb-4">
          Let&apos;s Get <span className="text-hivis">Building</span>
        </h1>
        <p className="text-lg text-slate-light max-w-2xl mx-auto">
          Fancy a brew and a chat about your new site? Give us a bell or fill in
          the form below.
        </p>
        <div className="construction-tape mt-8" />
      </section>

      {/* TWO COLUMN LAYOUT */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* LEFT — CONTACT FORM */}
        <div className="lg:col-span-3 bg-charcoal rounded-2xl p-8">
          {status === "success" ? (
            <div className="bg-green-900/50 border border-green-500 rounded-xl p-8 text-center">
              <p className="text-xl font-bold text-green-400 mb-2">
                Nice one! We&apos;ve got your details.
              </p>
              <p className="text-slate-light">
                We&apos;ll be in touch faster than you can say &lsquo;first
                fix&rsquo;.{" "}
                <span role="img" aria-label="construction">
                  🏗️
                </span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Your Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none"
                />
              </div>

              {/* Business Name */}
              <div>
                <label
                  htmlFor="business"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="business"
                  name="business"
                  required
                  value={formData.business}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none"
                />
              </div>

              {/* Your Trade */}
              <div>
                <label
                  htmlFor="trade"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Your Trade
                </label>
                <select
                  id="trade"
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none"
                >
                  <option value="">Select your trade...</option>
                  {trades.map((trade) => (
                    <option key={trade} value={trade}>
                      {trade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none"
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none"
                />
              </div>

              {/* Tell Us About Your Project */}
              <div>
                <label
                  htmlFor="project"
                  className="text-sm font-medium text-slate-light mb-1 block"
                >
                  Tell Us About Your Project
                </label>
                <textarea
                  id="project"
                  name="project"
                  rows={4}
                  placeholder="What are you looking for? New website? Rebuild? Just exploring? Give us the details..."
                  value={formData.project}
                  onChange={handleChange}
                  className="bg-navy border border-white/10 rounded-lg text-white focus:border-hivis focus:ring-1 focus:ring-hivis p-3 w-full outline-none resize-none"
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 text-center">
                  <p className="text-red-400 font-semibold">
                    Something went wrong. Please try again or message us on WhatsApp.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-hivis text-dark font-bold py-4 rounded-lg text-lg hover:bg-hivis-bright transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending..." : "Send Enquiry 🔨"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT — CONTACT INFO */}
        <div className="lg:col-span-2 space-y-8">
          {/* WhatsApp */}
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span role="img" aria-label="whatsapp">💬</span> WhatsApp Us
            </h3>
            <a
              href="https://wa.me/447572698923"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-hivis hover:text-hivis-bright transition-colors"
            >
              Message us on WhatsApp
            </a>
          </div>

          {/* Drop Us an Email */}
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span role="img" aria-label="email">📧</span> Drop Us an Email
            </h3>
            <a
              href="mailto:patrick@construction-sites.co.uk"
              className="text-hivis hover:text-hivis-bright transition-colors"
            >
              patrick@construction-sites.co.uk
            </a>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span role="img" aria-label="clock">⏰</span> Office Hours
            </h3>
            <p className="text-slate-light">Monday - Friday, 8am - 6pm</p>
            <p className="text-slate-light">Saturday by appointment</p>
            <p className="text-slate-light">Sunday: Even builders need a day off</p>
          </div>

          {/* Response Time */}
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span role="img" aria-label="construction">🏗️</span> Response Time
            </h3>
            <p className="text-slate-light">
              We get back to every enquiry same day. Usually within the hour.
            </p>
          </div>
        </div>
      </section>

      {/* EXTRA LINE */}
      <section className="text-center pb-16 px-4">
        <p className="text-slate-light text-lg max-w-2xl mx-auto">
          Not ready to commit? No pressure. We don&apos;t do hard sells, just
          honest chats over a brew. ☕
        </p>
      </section>
    </main>
  );
}
