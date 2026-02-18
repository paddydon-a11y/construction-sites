"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AgreementData {
  slug: string;
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  date: string;
  monthlyFee: string;
  signed: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AgreementClient({ data }: { data: AgreementData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [alreadySigned, setAlreadySigned] = useState(false);

  useEffect(() => {
    const key = `agreement-signed-${data.slug}`;
    if (localStorage.getItem(key) === "true" || data.signed) {
      setAlreadySigned(true);
    }
  }, [data.slug, data.signed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [alreadySigned]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasSigned) setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSigned(false);
  }, []);

  const handleSubmit = async () => {
    if (!agreed || !hasSigned) return;
    setStatus("sending");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL("image/png");

    try {
      const res = await fetch("https://formspree.io/f/mjgewpwj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Agreement Signed: ${data.businessName}`,
          clientName: data.clientName,
          businessName: data.businessName,
          email: data.email,
          phone: data.phone,
          monthlyFee: `£${data.monthlyFee} + VAT`,
          dateSigned: new Date().toISOString(),
          agreementDate: data.date,
          termsAccepted: true,
          signature: signatureData,
        }),
      });

      if (res.ok) {
        localStorage.setItem(`agreement-signed-${data.slug}`, "true");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (alreadySigned || status === "success") {
    return (
      <div className="min-h-screen bg-dark text-white">
        <div className="construction-tape" />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="bg-charcoal border border-green-500/30 rounded-2xl p-10">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4 font-[family-name:var(--font-display)] uppercase">
              Agreement Signed
            </h1>
            <p className="text-lg text-slate-light mb-2">
              Thank you, {data.clientName} — we&apos;ll be in touch within 24 hours to get started.
            </p>
            <p className="text-sm text-slate-light/60">
              A copy of this agreement has been sent to our team. If you have any questions, call us on{" "}
              <a href="tel:+447564039216" className="text-hivis hover:underline">07564 039 216</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          header, footer, .floating-cta, .no-print { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          .print-white { background: #fff !important; color: #000 !important; border-color: #ddd !important; }
          .print-text { color: #333 !important; }
          .print-heading { color: #000 !important; }
          .print-muted { color: #666 !important; }
          .print-accent { color: #b45309 !important; }
          .print-border { border-color: #ddd !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-dark text-white">
        <div className="construction-tape no-print" />

        {/* Agreement Header */}
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-hivis uppercase tracking-[0.2em] mb-3 print-accent">
              Service Agreement
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] uppercase tracking-wide print-heading">
              Construction Sites <span className="text-hivis print-accent">&</span> {data.businessName}
            </h1>
          </div>

          {/* Client Details Card */}
          <div className="bg-charcoal border border-white/10 rounded-xl p-6 md:p-8 mb-12 print-white print-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-light/60 uppercase tracking-wider mb-1 print-muted">Prepared For</p>
                <p className="text-lg font-semibold print-text">{data.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-light/60 uppercase tracking-wider mb-1 print-muted">Business</p>
                <p className="text-lg font-semibold print-text">{data.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-light/60 uppercase tracking-wider mb-1 print-muted">Date</p>
                <p className="print-text">{formatDate(data.date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-light/60 uppercase tracking-wider mb-1 print-muted">Monthly Fee</p>
                <p className="text-lg font-bold text-hivis print-accent">£{data.monthlyFee} <span className="text-sm font-normal text-slate-light print-muted">+ VAT / month</span></p>
              </div>
            </div>
          </div>

          {/* Skip to signing */}
          <div className="text-center mb-12 no-print print-hide">
            <button
              type="button"
              onClick={() => document.getElementById("sign")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-hivis text-charcoal font-bold py-3 px-8 rounded-xl text-lg hover:bg-hivis-bright transition-all active:scale-[0.98] cursor-pointer font-[family-name:var(--font-subheading)] uppercase tracking-wide"
            >
              Skip to Signing
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>

          {/* Agreement Sections */}
          <div className="space-y-10 print-text">

            <Section title="Overview">
              <p>
                Construction Sites designs, builds, hosts, and maintains websites for trade and construction businesses.
                This is an ongoing service agreement that remains in effect for as long as the client continues to use the service.
              </p>
            </Section>

            <Section title="What Is Included">
              <ul className="space-y-2">
                <Li>Custom website design and build, tailored to your trade and service area</Li>
                <Li>Hosting, SSL certificate, and domain management</Li>
                <Li>Search engine optimisation and Google Ads readiness</Li>
                <Li>Click-to-call and WhatsApp integration on every page</Li>
                <Li>Up to 1 hour of content edits per calendar month</Li>
                <Li>Ongoing technical support and performance monitoring</Li>
              </ul>
            </Section>

            <Section title="Investment">
              <p className="mb-4">
                We invest significant time and resource into every website we build. Each site is custom-designed,
                developed, optimised for search engines, and deployed — representing a build value of £3,000–£5,000.
                This investment is made at our cost, with no charge to the client, on the basis that the monthly
                service agreement remains active.
              </p>
              <ul className="space-y-2">
                <Li>There is no upfront cost. The website is built at no charge.</Li>
                <Li>The monthly fee is <strong className="text-white print-text">£{data.monthlyFee} + VAT</strong>, payable by Direct Debit.</Li>
                <Li>The first payment is due on the day the website goes live.</Li>
                <Li>There are no setup fees, hidden charges, or additional costs.</Li>
                <Li>This agreement is ongoing and continues for as long as the client remains active.</Li>
              </ul>
            </Section>

            <Section title="Timeline">
              <ul className="space-y-2">
                <Li>The website will be live within 7 working days of receiving content and business details.</Li>
                <Li>Monthly edit requests are completed within 3 working days.</Li>
                <Li>Support queries are responded to within 24 hours on working days.</Li>
              </ul>
            </Section>

            <Section title="What We Need From You">
              <ul className="space-y-2">
                <Li>Business name, phone number, services offered, and areas covered.</Li>
                <Li>Photos of completed work. Phone photos are fine.</Li>
                <Li>Logo, if available.</Li>
                <Li>Responses to approval requests within 7 days.</Li>
                <Li>An active Direct Debit mandate.</Li>
              </ul>
            </Section>

            <Section title="Cancellation">
              <ul className="space-y-2">
                <Li>Either party may cancel with 30 days written notice.</Li>
                <Li>There are no cancellation fees or penalties.</Li>
                <Li>Upon cancellation, the website is taken offline at the end of the final paid month.</Li>
              </ul>
            </Section>

            <Section title="Ownership">
              <ul className="space-y-2">
                <Li>The website design, code, and hosting infrastructure remain the sole property of Construction Sites for the duration of and following this agreement.</Li>
                <Li>All content provided by the client — including photos, text, and logos — remains the property of the client and will be returned on request.</Li>
                <Li>The website cannot be transferred to another provider or hosting platform.</Li>
              </ul>
            </Section>

            <Section title="Payments">
              <ul className="space-y-2">
                <Li>The monthly fee is collected by Direct Debit on the same date each month.</Li>
                <Li>If a payment fails, the client will be notified and has 7 days to resolve it.</Li>
                <Li>If payment is not received within 7 days, the website will be taken offline until the outstanding balance is cleared.</Li>
              </ul>
            </Section>

            <Section title="Price Adjustments">
              <ul className="space-y-2">
                <Li>Any changes to the monthly fee will be communicated with a minimum of 60 days written notice.</Li>
                <Li>The client may cancel within the notice period if they do not wish to continue at the revised rate.</Li>
              </ul>
            </Section>

            <Section title="Service Availability">
              <ul className="space-y-2">
                <Li>Construction Sites maintains high standards of uptime and performance but does not guarantee uninterrupted service.</Li>
                <Li>Construction Sites accepts no liability for any losses, damages, or costs arising from website downtime, third-party service failures, or any circumstances beyond our control.</Li>
              </ul>
            </Section>

            <Section title="Governing Law">
              <p>This agreement is governed by the laws of England and Wales.</p>
            </Section>
          </div>

          {/* Signature Area */}
          <div id="sign" className="mt-16 mb-20 print-hide no-print">
            <div className="construction-tape-thin mb-10" />

            <div className="bg-charcoal border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold font-[family-name:var(--font-subheading)] uppercase tracking-wide mb-1">
                Sign This Agreement
              </h2>
              <p className="text-sm text-slate-light/60 mb-6">
                Draw your signature below using your finger or mouse.
              </p>

              {/* Signature Pad */}
              <div className="relative mb-4">
                <canvas
                  ref={canvasRef}
                  className="w-full bg-navy/50 border-2 border-white/10 rounded-xl cursor-crosshair touch-none"
                  style={{ height: "180px" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-light/30 text-sm">Sign here</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-slate-light/60 hover:text-white transition-colors mb-6 cursor-pointer"
              >
                Clear signature
              </button>

              {/* Agree Checkbox */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-navy/50 text-hivis focus:ring-hivis focus:ring-offset-0 cursor-pointer accent-[#f59e0b]"
                />
                <span className="text-sm text-slate-light leading-relaxed">
                  I, <strong className="text-white">{data.clientName}</strong>, confirm I have read and agree to the terms of this agreement
                  between <strong className="text-white">{data.businessName}</strong> and Construction Sites.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!agreed || !hasSigned || status === "sending"}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all cursor-pointer
                  ${agreed && hasSigned && status !== "sending"
                    ? "bg-hivis text-charcoal hover:bg-hivis-bright active:scale-[0.98]"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
              >
                {status === "sending" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Sign & Accept Agreement"
                )}
              </button>

              {status === "error" && (
                <p className="mt-4 text-sm text-red-400 text-center">
                  Something went wrong. Please try again or call us on{" "}
                  <a href="tel:+447564039216" className="underline">07564 039 216</a>.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold font-[family-name:var(--font-subheading)] uppercase tracking-wide text-hivis mb-3 print-accent print-heading">
        {title}
      </h2>
      <div className="text-[0.95rem] leading-relaxed text-slate-light print-text">
        {children}
      </div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg className="w-4 h-4 text-hivis mt-1 flex-shrink-0 print-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
