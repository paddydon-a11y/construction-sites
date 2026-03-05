"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { upload } from "@vercel/blob/client";

// ─── Constants ───────────────────────────────────────────────────────────────

const USERS: Record<string, { id: string; label: string; role: "user" | "admin" }> = {
  "cs2026":    { id: "zs1",     label: "ZS1",      role: "user" },
  "sales1pw":  { id: "sales1",  label: "Sales 1",  role: "user" },
  "sales2pw":  { id: "sales2",  label: "Sales 2",  role: "user" },
  "sales3pw":  { id: "sales3",  label: "Sales 3",  role: "user" },
  "sales4pw":  { id: "sales4",  label: "Sales 4",  role: "user" },
  "sales5pw":  { id: "sales5",  label: "Sales 5",  role: "user" },
  "sales6pw":  { id: "sales6",  label: "Sales 6",  role: "user" },
  "sales7pw":  { id: "sales7",  label: "Sales 7",  role: "user" },
  "sales8pw":  { id: "sales8",  label: "Sales 8",  role: "user" },
  "sales9pw":  { id: "sales9",  label: "Sales 9",  role: "user" },
  "sales10pw": { id: "sales10", label: "Sales 10", role: "user" },
  "admin2026": { id: "admin",   label: "Admin",    role: "admin" },
};

const LS_KEY = "crm-auth";
const LS_ROLE = "crm-role";
const LS_LABEL = "crm-label";
const DRAFT_KEY = "mockup-creator-draft";

const TRADES = [
  "Electrician",
  "Plumber",
  "Gas Engineer",
  "Heating Engineer",
  "Boiler Engineer",
  "General Builder",
  "Roofer",
  "Painter & Decorator",
  "Carpenter / Joiner",
  "Plasterer",
  "Tiler",
  "Landscaper",
  "Kitchen Fitter",
  "Bathroom Fitter",
  "Handyman",
  "EV Charger Installer",
  "Solar Panel Installer",
  "Locksmith",
  "Damp Proofing",
  "Drainage",
  "Fencing",
  "Flooring",
  "Glazier",
  "Guttering",
  "Insulation",
  "Paving",
  "Pest Control",
  "Rendering",
  "Scaffolding",
  "Skip Hire",
  "Tree Surgeon",
  "Window Fitter",
  "Other",
];

const ALL_ACCREDITATIONS = [
  { id: "gas-safe", label: "Gas Safe", trades: ["Gas Engineer", "Heating Engineer", "Boiler Engineer", "Plumber"] },
  { id: "part-p", label: "Part P", trades: ["Electrician", "EV Charger Installer"] },
  { id: "niceic", label: "NICEIC", trades: ["Electrician", "EV Charger Installer"] },
  { id: "napit", label: "NAPIT", trades: ["Electrician", "EV Charger Installer"] },
  { id: "18th-edition", label: "18th Edition", trades: ["Electrician", "EV Charger Installer"] },
  { id: "checkatrade", label: "Checkatrade", trades: [] },
  { id: "trustmark", label: "TrustMark", trades: [] },
  { id: "ozev", label: "OZEV", trades: ["Electrician", "EV Charger Installer"] },
  { id: "mcs", label: "MCS", trades: ["Solar Panel Installer", "Heating Engineer"] },
  { id: "which-trusted", label: "Which Trusted Trader", trades: [] },
  { id: "fully-insured", label: "Fully Insured", trades: [] },
  { id: "dbs-checked", label: "DBS Checked", trades: [] },
];

const SLUG_STRIP_WORDS = [
  "ltd", "limited", "services", "solutions", "electrical", "plumbing",
  "heating", "building", "construction", "maintenance", "property",
  "group", "company", "co", "uk", "the", "and",
];

const THEMES = ["Auto", "Dark", "Light"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, "and")
    .split(/[\s\-_]+/)
    .filter((w) => !SLUG_STRIP_WORDS.includes(w))
    .join("-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toLocationShort(location: string): string {
  return location
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return raw;
}

function toWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "44" + digits.slice(1);
  return digits;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  company: string;
  slug: string;
  trade: string;
  location: string;
  locationShort: string;
  phone: string;
  email: string;
  postcode: string;
  existingWebsite: string;
  rawInfo: string;
  areas: string;
  accreditations: string[];
  accreditationOther: string;
  googleRating: string;
  googleCount: string;
  theme: string;
  accentColor: string;
  styleNotes: string;
}

const EMPTY_FORM: FormData = {
  company: "",
  slug: "",
  trade: "",
  location: "",
  locationShort: "",
  phone: "",
  email: "",
  postcode: "",
  existingWebsite: "",
  rawInfo: "",
  areas: "",
  accreditations: [],
  accreditationOther: "",
  googleRating: "",
  googleCount: "",
  theme: "Auto",
  accentColor: "",
  styleNotes: "",
};

// ─── Password Gate ───────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: (userId: string, role: string, label: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS[pw];
    if (user && user.role === "admin") {
      localStorage.setItem(LS_KEY, user.id);
      localStorage.setItem(LS_ROLE, user.role);
      localStorage.setItem(LS_LABEL, user.label);
      onAuth(user.id, user.role, user.label);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
      <form onSubmit={submit} className="bg-[#1a1a2e] p-8 rounded-lg w-80">
        <h1 className="text-xl font-bold text-white mb-4">Mockup Creator</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Admin password"
          autoFocus
          className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] mb-3"
        />
        {error && <p className="text-red-400 text-sm mb-3">Admin access required</p>}
        <button type="submit" className="w-full py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors">
          Enter
        </button>
      </form>
    </div>
  );
}

// ─── Drop Zone ───────────────────────────────────────────────────────────────

function DropZone({
  label,
  multiple,
  files,
  onFiles,
  onRemove,
}: {
  label: string;
  multiple: boolean;
  files: File[];
  onFiles: (f: File[]) => void;
  onRemove?: (i: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = "image/jpeg,image/png,image/webp,image/svg+xml";

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList).filter((f) =>
      ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(f.type)
    );
    if (multiple) {
      onFiles([...files, ...arr]);
    } else {
      onFiles(arr.slice(0, 1));
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-[#f59e0b] bg-[#f59e0b]/10" : "border-[#2a2a4a] hover:border-[#f59e0b]/50"
        }`}
      >
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-gray-600 text-xs mt-1">JPEG, PNG, WebP, SVG</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="relative group">
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-20 h-20 object-cover rounded border border-[#2a2a4a]"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MockupCreatorPage() {
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [styleOpen, setStyleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [success, setSuccess] = useState<{ company: string; slug: string; prompt: string } | null>(null);
  const [error, setError] = useState("");
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const slugManual = useRef(false);
  const locationShortManual = useRef(false);

  // Check auth on mount
  useEffect(() => {
    const id = localStorage.getItem(LS_KEY);
    const role = localStorage.getItem(LS_ROLE);
    if (id && role === "admin") {
      setAuthed(true);
      document.title = "CS Mockup Creator";
    }
  }, []);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FormData;
        setForm(parsed);
        if (parsed.slug && parsed.slug !== toSlug(parsed.company)) slugManual.current = true;
        if (parsed.locationShort && parsed.locationShort !== toLocationShort(parsed.location)) locationShortManual.current = true;
      }
    } catch {}
  }, []);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, 500);
    return () => { if (draftTimer.current) clearTimeout(draftTimer.current); };
  }, [form]);

  const update = useCallback((patch: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const filteredAccreditations = ALL_ACCREDITATIONS.filter(
    (a) => a.trades.length === 0 || a.trades.includes(form.trade)
  );

  const toggleAccreditation = (id: string) => {
    setForm((prev) => ({
      ...prev,
      accreditations: prev.accreditations.includes(id)
        ? prev.accreditations.filter((a) => a !== id)
        : [...prev.accreditations, id],
    }));
  };

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.slug || !form.company || !form.trade) {
      setError("Company name, trade, and slug are required.");
      return;
    }

    setSubmitting(true);
    setUploadProgress("");

    try {
      let logoUrl = "";
      const photoUrls: string[] = [];

      // Upload logo
      if (logoFiles.length > 0) {
        setUploadProgress("Uploading logo...");
        const file = logoFiles[0];
        const ext = file.name.split(".").pop() || "png";
        const blob = await upload(`mockup-briefs/${form.slug}/logo.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/mockup-briefs/upload",
        });
        logoUrl = blob.url;
      }

      // Upload photos sequentially
      for (let i = 0; i < photoFiles.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${photoFiles.length}...`);
        const file = photoFiles[i];
        const ext = file.name.split(".").pop() || "jpg";
        const blob = await upload(`mockup-briefs/${form.slug}/photo-${i + 1}.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/mockup-briefs/upload",
        });
        photoUrls.push(blob.url);
      }

      // Build brief
      setUploadProgress("Saving brief...");
      const phoneDigits = form.phone.replace(/\D/g, "");
      const brief = {
        slug: form.slug,
        company: form.company,
        trade: form.trade,
        location: form.location,
        locationShort: form.locationShort,
        phone: phoneDigits,
        phoneFormatted: formatPhone(form.phone),
        whatsapp: phoneDigits ? toWhatsApp(form.phone) : "",
        email: form.email,
        postcode: form.postcode,
        existingWebsite: form.existingWebsite,
        rawInfo: form.rawInfo,
        areas: form.areas
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        accreditations: [
          ...form.accreditations.map(
            (id) => ALL_ACCREDITATIONS.find((a) => a.id === id)?.label || id
          ),
          ...(form.accreditationOther ? [form.accreditationOther] : []),
        ],
        googleRating: form.googleRating ? parseFloat(form.googleRating) : null,
        googleCount: form.googleCount ? parseInt(form.googleCount) : null,
        logoUrl,
        photoUrls,
        style: {
          theme: form.theme !== "Auto" ? form.theme.toLowerCase() : null,
          accentColor: form.accentColor || null,
          notes: form.styleNotes || null,
        },
      };

      const res = await fetch("/api/mockup-briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save brief");
      }

      // Build Claude Code prompt
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const briefUrl = `${baseUrl}/api/mockup-briefs?slug=${form.slug}`;
      const prompt = [
        `Generate a mockup site for ${form.company} (${form.trade} in ${form.location}).`,
        ``,
        `Fetch the full brief: curl '${briefUrl}'`,
        ``,
        brief.logoUrl ? `Download logo: curl -o logo.${brief.logoUrl.split(".").pop()} '${brief.logoUrl}'` : null,
        ...brief.photoUrls.map(
          (url, i) => `Download photo ${i + 1}: curl -o photo-${i + 1}.${url.split(".").pop()} '${url}'`
        ),
        ``,
        `Key details:`,
        `- Trade: ${form.trade}`,
        `- Location: ${form.location}`,
        `- Slug: ${form.slug}`,
        form.phone ? `- Phone: ${formatPhone(form.phone)}` : null,
        brief.accreditations.length > 0 ? `- Accreditations: ${brief.accreditations.join(", ")}` : null,
        brief.googleRating ? `- Google: ${brief.googleRating}/5 (${brief.googleCount} reviews)` : null,
        form.rawInfo ? `\nRaw info dump:\n${form.rawInfo}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Clear draft
      localStorage.removeItem(DRAFT_KEY);

      setSuccess({ company: form.company, slug: form.slug, prompt });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setLogoFiles([]);
    setPhotoFiles([]);
    setSuccess(null);
    setError("");
    slugManual.current = false;
    locationShortManual.current = false;
    localStorage.removeItem(DRAFT_KEY);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <PasswordGate
        onAuth={(_, role) => {
          if (role === "admin") {
            setAuthed(true);
            document.title = "CS Mockup Creator";
          }
        }}
      />
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-8 text-center">
            <p className="text-4xl mb-4">&#10004;</p>
            <h2 className="text-xl font-bold mb-2">Brief saved for {success.company}</h2>
            <p className="text-gray-400 mb-6">Slug: {success.slug}</p>

            <div className="text-left bg-[#0f0f1a] border border-[#2a2a4a] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-300">Claude Code Prompt</p>
                <button
                  onClick={() => navigator.clipboard.writeText(success.prompt)}
                  className="text-xs px-2 py-1 bg-[#2a2a4a] rounded hover:bg-[#3a3a5a] transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words font-mono">{success.prompt}</pre>
            </div>

            <button
              onClick={resetForm}
              className="px-6 py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mockup Creator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Company Info ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Company Info</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => {
                    const company = e.target.value;
                    const patch: Partial<FormData> = { company };
                    if (!slugManual.current) patch.slug = toSlug(company);
                    update(patch);
                  }}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                  placeholder="e.g. Smith Electrical Services Ltd"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    slugManual.current = true;
                    update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, "") });
                  }}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] font-mono text-sm"
                  placeholder="smith"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Trade *</label>
                <select
                  value={form.trade}
                  onChange={(e) => update({ trade: e.target.value, accreditations: [] })}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white outline-none focus:border-[#f59e0b]"
                >
                  <option value="">Select trade...</option>
                  {TRADES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => {
                    const location = e.target.value;
                    const patch: Partial<FormData> = { location };
                    if (!locationShortManual.current) patch.locationShort = toLocationShort(location);
                    update(patch);
                  }}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                  placeholder="e.g. Chelmsford, Essex"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Location Short</label>
                <input
                  type="text"
                  value={form.locationShort}
                  onChange={(e) => {
                    locationShortManual.current = true;
                    update({ locationShort: e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, "") });
                  }}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] font-mono text-sm"
                  placeholder="chelmsford"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    onBlur={() => {
                      if (form.phone) update({ phone: formatPhone(form.phone) });
                    }}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                    placeholder="07123 456 789"
                  />
                  {form.phone && (
                    <p className="text-xs text-gray-500 mt-1">
                      WhatsApp: +{toWhatsApp(form.phone)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Postcode</label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(e) => update({ postcode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                    placeholder="CM1 1AA"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Existing Website</label>
                  <input
                    type="url"
                    value={form.existingWebsite}
                    onChange={(e) => update({ existingWebsite: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Raw Info Dump ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Raw Info Dump</h2>
            <textarea
              value={form.rawInfo}
              onChange={(e) => update({ rawInfo: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] resize-y"
              placeholder="Paste anything here — about page text, service lists, notes from call, Facebook bio, Google description..."
            />
          </section>

          {/* ── Areas ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Areas Covered</h2>
            <textarea
              value={form.areas}
              onChange={(e) => update({ areas: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] resize-y"
              placeholder="Chelmsford, Braintree, Colchester, Maldon..."
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
          </section>

          {/* ── Accreditations ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Accreditations</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {filteredAccreditations.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAccreditation(a.id)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    form.accreditations.includes(a.id)
                      ? "bg-[#f59e0b] text-black font-medium"
                      : "bg-[#0f0f1a] border border-[#2a2a4a] text-gray-300 hover:border-[#f59e0b]/50"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.accreditationOther}
              onChange={(e) => update({ accreditationOther: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
              placeholder="Other accreditation..."
            />
          </section>

          {/* ── Google Reviews ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Google Reviews</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={form.googleRating}
                  onChange={(e) => update({ googleRating: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                  placeholder="4.8"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Review Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.googleCount}
                  onChange={(e) => update({ googleCount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                  placeholder="127"
                />
              </div>
            </div>
          </section>

          {/* ── Logo Upload ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Logo</h2>
            <DropZone
              label="Drop logo here or click to browse"
              multiple={false}
              files={logoFiles}
              onFiles={setLogoFiles}
              onRemove={() => setLogoFiles([])}
            />
          </section>

          {/* ── Photo Upload ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#f59e0b]">Photos</h2>
            <DropZone
              label="Drop photos here or click to browse"
              multiple={true}
              files={photoFiles}
              onFiles={setPhotoFiles}
              onRemove={(i) => setPhotoFiles((prev) => prev.filter((_, j) => j !== i))}
            />
          </section>

          {/* ── Style Overrides (collapsible) ── */}
          <section className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a]">
            <button
              type="button"
              onClick={() => setStyleOpen(!styleOpen)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <h2 className="text-lg font-semibold text-[#f59e0b]">Style Overrides</h2>
              <span className="text-gray-400 text-sm">{styleOpen ? "Hide" : "Show"}</span>
            </button>
            {styleOpen && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Theme</label>
                    <select
                      value={form.theme}
                      onChange={(e) => update({ theme: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white outline-none focus:border-[#f59e0b]"
                    >
                      {THEMES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.accentColor}
                        onChange={(e) => update({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] font-mono text-sm"
                        placeholder="#f59e0b"
                      />
                      {form.accentColor && /^#[0-9a-fA-F]{6}$/.test(form.accentColor) && (
                        <div
                          className="w-10 rounded border border-[#2a2a4a]"
                          style={{ backgroundColor: form.accentColor }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={form.styleNotes}
                    onChange={(e) => update({ styleNotes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] resize-y"
                    placeholder="Any specific style requests..."
                  />
                </div>
              </div>
            )}
          </section>

          {/* ── Submit ── */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#f59e0b] text-black font-semibold rounded-lg hover:bg-[#fbbf24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? uploadProgress || "Submitting..." : "Save Brief"}
          </button>
        </form>
      </div>
    </div>
  );
}
