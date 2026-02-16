"use client";

import { useState } from "react";

export default function NewAgreementPage() {
  const [form, setForm] = useState({
    clientName: "",
    businessName: "",
    email: "",
    phone: "",
    monthlyFee: "100",
  });
  const [output, setOutput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generate = () => {
    const slug = form.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const today = new Date().toISOString().split("T")[0];

    const json = JSON.stringify(
      {
        slug,
        clientName: form.clientName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        date: today,
        monthlyFee: form.monthlyFee,
        signed: false,
      },
      null,
      2
    );

    setOutput(json);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const slug = form.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="construction-tape" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] uppercase mb-2">
          New <span className="text-hivis">Agreement</span>
        </h1>
        <p className="text-slate-light mb-8">
          Fill in the client details. This generates the JSON file to add to{" "}
          <code className="text-hivis text-sm bg-white/5 px-2 py-0.5 rounded">data/agreements/</code>
        </p>

        <div className="bg-charcoal rounded-2xl p-6 md:p-8 space-y-5 mb-8">
          <Field label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} placeholder="e.g. Brad Kershaw" />
          <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="e.g. Craig Kershaw Ltd" />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. brad@example.com" type="email" />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 01282 413851" type="tel" />
          <Field label="Monthly Fee (£)" name="monthlyFee" value={form.monthlyFee} onChange={handleChange} placeholder="100" />

          <button
            onClick={generate}
            disabled={!form.clientName || !form.businessName}
            className="w-full py-3 px-6 rounded-xl font-bold text-lg bg-hivis text-charcoal hover:bg-hivis-bright transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Generate JSON
          </button>
        </div>

        {output && (
          <div className="bg-charcoal rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-light">
                Save as: <code className="text-hivis bg-white/5 px-2 py-0.5 rounded">{slug}.json</code>
              </p>
              <button
                onClick={copyToClipboard}
                className="text-sm text-hivis hover:text-hivis-bright transition-colors cursor-pointer"
              >
                Copy JSON
              </button>
            </div>
            <pre className="bg-navy/50 border border-white/10 rounded-xl p-4 text-sm text-slate-light overflow-x-auto">
              {output}
            </pre>
            <div className="mt-4 p-4 bg-navy/30 border border-white/5 rounded-xl">
              <p className="text-xs text-slate-light/60 mb-2">Steps:</p>
              <ol className="text-sm text-slate-light space-y-1 list-decimal list-inside">
                <li>Copy the JSON above</li>
                <li>Create <code className="text-hivis text-xs bg-white/5 px-1 rounded">data/agreements/{slug}.json</code></li>
                <li>Paste and save</li>
                <li>Push to GitHub — Vercel will deploy</li>
                <li>
                  Send link:{" "}
                  <code className="text-hivis text-xs bg-white/5 px-1 rounded break-all">
                    construction-sites.co.uk/agreement/{slug}
                  </code>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-light mb-1.5">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-hivis/50 transition-colors"
      />
    </div>
  );
}
