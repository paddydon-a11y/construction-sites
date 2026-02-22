"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  trade: string;
  website: string;
  status: string;
  dateAdded: string;
  notes: string;
  mockupLinks: string[];
  agreementSlug: string;
  gocardlessLink: string;
  monthlyFee: number;
  source: string;
  statusHistory: { status: string; date: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "new", label: "New Lead", color: "#3b82f6" },
  { id: "mockups-sent", label: "Mockups Sent", color: "#8b5cf6" },
  { id: "agreement-sent", label: "Agreement Sent", color: "#f97316" },
  { id: "signed", label: "Signed", color: "#10b981" },
  { id: "live", label: "Live", color: "#22c55e" },
  { id: "churned", label: "Churned", color: "#ef4444" },
] as const;

const PASSWORD = "cs2026";
const LS_KEY = "crm-auth";

// ─── API helpers ─────────────────────────────────────────────────────────────

async function api(method: string, body?: unknown) {
  const res = await fetch("/api/crm", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ─── Password Gate ───────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      localStorage.setItem(LS_KEY, "1");
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
      <form onSubmit={submit} className="bg-[#1a1a2e] p-8 rounded-lg w-80">
        <h1 className="text-xl font-bold text-white mb-4">CRM Dashboard</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] mb-3"
        />
        {error && (
          <p className="text-red-400 text-sm mb-3">Wrong password</p>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────

function StatsBar({ leads }: { leads: Lead[] }) {
  const now = new Date();
  const thisMonth = (l: Lead) => {
    const d = new Date(l.dateAdded);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const thisMonthByStatus = (status: string) => {
    return leads.filter((l) => {
      const history = l.statusHistory || [];
      return history.some((h) => {
        if (h.status !== status) return false;
        const d = new Date(h.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }).length;
  };

  const newThisMonth = leads.filter((l) => thisMonth(l)).length;
  const mockupsSent = thisMonthByStatus("mockups-sent");
  const signed = leads.filter((l) => {
    if (l.status !== "signed" && l.status !== "live") return false;
    const history = l.statusHistory || [];
    return history.some((h) => {
      if (h.status !== "signed") return false;
      const d = new Date(h.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }).length;
  const liveClients = leads.filter((l) => l.status === "live").length;
  const mrr = liveClients * 100;

  const stats = [
    { label: "Leads This Month", value: newThisMonth },
    { label: "Mockups Sent", value: mockupsSent },
    { label: "Signed This Month", value: signed },
    { label: "Live Clients", value: liveClients },
    { label: "MRR", value: `£${mrr.toLocaleString()}` },
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex-shrink-0 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-5 py-3 min-w-[140px]"
        >
          <div className="text-2xl font-bold text-[#f59e0b]">{s.value}</div>
          <div className="text-xs text-[#94a3b8] mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onClick,
  compact,
}: {
  lead: Lead;
  onClick: () => void;
  compact: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", lead.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onClick}
      className={`bg-[#0f0f1a] border border-[#2a2a4a] rounded cursor-pointer hover:border-[#f59e0b]/50 transition-colors group ${compact ? "px-2 py-1.5" : "p-3"}`}
    >
      <div className={`font-semibold text-white truncate group-hover:text-[#f59e0b] transition-colors ${compact ? "text-xs" : "text-sm"}`}>
        {lead.businessName || "Untitled"}
      </div>
      {!compact && (
        <>
          {lead.contactName && (
            <div className="text-xs text-[#94a3b8] mt-1">{lead.contactName}</div>
          )}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {lead.trade && (
              <span className="inline-block text-xs bg-[#1a1a2e] text-[#f59e0b] px-2 py-0.5 rounded">
                {lead.trade}
              </span>
            )}
            {lead.source && (
              <span
                className="inline-block text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor:
                    lead.source === "Google"
                      ? "#1d4ed820"
                      : lead.source === "TikTok"
                      ? "#ec489920"
                      : lead.source === "Referral"
                      ? "#10b98120"
                      : lead.source === "Cold Call"
                      ? "#f59e0b20"
                      : "#94a3b820",
                  color:
                    lead.source === "Google"
                      ? "#60a5fa"
                      : lead.source === "TikTok"
                      ? "#f472b6"
                      : lead.source === "Referral"
                      ? "#34d399"
                      : lead.source === "Cold Call"
                      ? "#fbbf24"
                      : "#94a3b8",
                }}
              >
                {lead.source}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            {lead.phone && (
              <div className="text-xs text-[#94a3b8]">{lead.phone}</div>
            )}
            <div className="text-xs text-[#94a3b8]/50">
              {new Date(lead.dateAdded).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  leads,
  onDrop,
  onCardClick,
}: {
  column: (typeof COLUMNS)[number];
  leads: Lead[];
  onDrop: (leadId: string, newStatus: string) => void;
  onCardClick: (lead: Lead) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [compact, setCompact] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Auto-compact when cards would overflow the column height
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    const check = () => {
      // Available height for cards (viewport minus header/stats/padding ~200px, minus column header ~44px)
      const availableHeight = window.innerHeight - 244;
      // Full card ~96px (padding + content + gap), compact ~32px
      const fullHeight = leads.length * 96;
      setCompact(fullHeight > availableHeight && leads.length > 4);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [leads.length]);

  return (
    <div
      className={`flex-shrink-0 w-[260px] flex flex-col rounded-lg transition-colors ${
        dragOver ? "bg-[#1a1a2e]/80" : "bg-[#1a1a2e]/40"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const leadId = e.dataTransfer.getData("text/plain");
        if (leadId) onDrop(leadId, column.id);
      }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#2a2a4a]">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <span className="text-sm font-semibold text-white truncate">
          {column.label}
        </span>
        <span className="ml-auto text-xs text-[#94a3b8] bg-[#0f0f1a] px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className={`flex flex-col p-2 overflow-y-auto flex-1 min-h-[100px] ${compact ? "gap-1" : "gap-2"}`}>
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onCardClick(lead)}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Add Lead Modal ──────────────────────────────────────────────────────────

function AddLeadModal({
  onAdd,
  onClose,
}: {
  onAdd: (data: Partial<Lead>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    trade: "",
    website: "",
    source: "Referral",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    onAdd(form);
  };

  const fields = [
    { key: "businessName", label: "Business Name *", type: "text" },
    { key: "contactName", label: "Contact Name", type: "text" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "trade", label: "Trade", type: "text" },
    { key: "website", label: "Current Website", type: "url" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Add New Lead</h2>
        <div className="flex flex-col gap-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-[#94a3b8] mb-1 block">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b]"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Source</label>
            <select
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm outline-none focus:border-[#f59e0b]"
            >
              <option value="Referral">Referral</option>
              <option value="Google">Google</option>
              <option value="TikTok">TikTok</option>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors text-sm"
          >
            Add Lead
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Lead Detail Panel ───────────────────────────────────────────────────────

function LeadDetail({
  lead,
  onUpdate,
  onClose,
  onMarkCold,
  onDelete,
}: {
  lead: Lead;
  onUpdate: (data: Partial<Lead>) => void;
  onClose: () => void;
  onMarkCold: () => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [mockupLinks, setMockupLinks] = useState<string[]>(
    lead.mockupLinks || ["", "", ""]
  );
  const [gocardlessLink, setGocardlessLink] = useState(
    lead.gocardlessLink || ""
  );
  const [monthlyFee, setMonthlyFee] = useState(lead.monthlyFee || 100);
  const notesTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Auto-detect mockups on load
  useEffect(() => {
    const slug = lead.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!slug) return;

    fetch(`/api/check-mockups?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.mockups?.length) return;
        const current = lead.mockupLinks || ["", "", ""];
        // Only fill empty slots
        const hasManualLinks = current.some((l: string) => l !== "");
        if (hasManualLinks) return;
        // Pad to 3 slots
        const filled = [...data.mockups.slice(0, 3)];
        while (filled.length < 3) filled.push("");
        setMockupLinks(filled);
        onUpdate({ id: lead.id, mockupLinks: filled } as Partial<Lead>);
      })
      .catch(() => {});
    // Only run on mount (lead open)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  // Auto-save notes
  const saveNotes = useCallback(
    (val: string) => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
      notesTimer.current = setTimeout(() => {
        onUpdate({ id: lead.id, notes: val } as Partial<Lead>);
      }, 500);
    },
    [lead.id, onUpdate]
  );

  const handleNotesChange = (val: string) => {
    setNotes(val);
    saveNotes(val);
  };

  const saveMockupLink = (index: number, val: string) => {
    const updated = [...mockupLinks];
    updated[index] = val;
    setMockupLinks(updated);
    onUpdate({ id: lead.id, mockupLinks: updated } as Partial<Lead>);
  };

  const saveGocardless = (val: string) => {
    setGocardlessLink(val);
    onUpdate({ id: lead.id, gocardlessLink: val } as Partial<Lead>);
  };

  const saveMonthlyFee = (val: number) => {
    setMonthlyFee(val);
    onUpdate({ id: lead.id, monthlyFee: val } as Partial<Lead>);
  };

  const generateAgreementSlug = () => {
    const slug = lead.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    onUpdate({ id: lead.id, agreementSlug: slug } as Partial<Lead>);
    window.open(`/agreement/${slug}`, "_blank");
  };

  const statusLabel = (status: string) =>
    status === "cold"
      ? "Cold Lead"
      : COLUMNS.find((c) => c.id === status)?.label || status;

  const statusColor = (status: string) =>
    status === "cold"
      ? "#64748b"
      : COLUMNS.find((c) => c.id === status)?.color || "#94a3b8";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a1a2e] w-full max-w-lg h-full overflow-y-auto border-l border-[#2a2a4a]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-[#2a2a4a] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-white">
              {lead.businessName || "Untitled"}
            </h2>
            <div
              className="inline-block text-xs px-2 py-0.5 rounded mt-1"
              style={{
                backgroundColor: statusColor(lead.status) + "20",
                color: statusColor(lead.status),
              }}
            >
              {statusLabel(lead.status)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Contact Details */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
              Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[#94a3b8] text-xs">Contact</div>
                <div className="text-white">{lead.contactName || "—"}</div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Phone</div>
                <div className="text-white">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-[#f59e0b]"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Email</div>
                <div className="text-white truncate">
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-[#f59e0b]"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Trade</div>
                <div className="text-white">{lead.trade || "—"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[#94a3b8] text-xs">Current Website</div>
                <div className="text-white truncate">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#f59e0b] underline"
                    >
                      {lead.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Date Added</div>
                <div className="text-white">
                  {new Date(lead.dateAdded).toLocaleDateString("en-GB")}
                </div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Source</div>
                <div className="text-white">{lead.source || "—"}</div>
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">Monthly Fee</div>
                <div className="flex items-center gap-1">
                  <span className="text-[#94a3b8]">£</span>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) =>
                      saveMonthlyFee(parseInt(e.target.value) || 100)
                    }
                    className="w-20 bg-[#0f0f1a] border border-[#2a2a4a] rounded px-2 py-1 text-white text-sm outline-none focus:border-[#f59e0b]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes..."
              rows={4}
              className="w-full bg-[#0f0f1a] border border-[#2a2a4a] rounded p-3 text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b] resize-y"
            />
          </section>

          {/* Mockup Links */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              Mockup Links
            </h3>
            <div className="flex flex-col gap-2">
              {mockupLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => saveMockupLink(i, e.target.value)}
                    placeholder={`Mockup ${i + 1} URL`}
                    className="flex-1 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                  />
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 border border-[#2a2a4a] rounded text-[#f59e0b] hover:bg-[#2a2a4a] transition-colors text-sm"
                    >
                      Open
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Agreement */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              Agreement
            </h3>
            {lead.agreementSlug ? (
              <div className="flex gap-2 items-center">
                <code className="text-sm text-[#f59e0b] bg-[#0f0f1a] px-2 py-1 rounded">
                  /agreement/{lead.agreementSlug}
                </code>
                <a
                  href={`/agreement/${lead.agreementSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#f59e0b] hover:underline"
                >
                  Open
                </a>
              </div>
            ) : (
              <button
                onClick={generateAgreementSlug}
                className="px-4 py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors text-sm"
              >
                Generate Agreement Link
              </button>
            )}
          </section>

          {/* GoCardless */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              GoCardless Link
            </h3>
            <input
              type="url"
              value={gocardlessLink}
              onChange={(e) => saveGocardless(e.target.value)}
              placeholder="Paste GoCardless DD link..."
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b]"
            />
            {gocardlessLink && (
              <a
                href={gocardlessLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#f59e0b] hover:underline mt-1 inline-block"
              >
                Open GoCardless link
              </a>
            )}
          </section>

          {/* Status History */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              Status History
            </h3>
            <div className="flex flex-col gap-1">
              {(lead.statusHistory || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusColor(h.status) }}
                  />
                  <span className="text-white">{statusLabel(h.status)}</span>
                  <span className="text-[#94a3b8] text-xs ml-auto">
                    {new Date(h.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <section className="border-t border-[#2a2a4a] pt-4 flex flex-col gap-3">
            {lead.status === "cold" ? (
              <button
                onClick={() =>
                  onUpdate({ id: lead.id, status: "new" } as Partial<Lead>)
                }
                className="w-full py-2.5 bg-[#3b82f6] text-white font-semibold rounded hover:bg-[#2563eb] transition-colors text-sm"
              >
                Reactivate Lead
              </button>
            ) : (
              <button
                onClick={onMarkCold}
                className="w-full py-2.5 bg-[#334155] text-[#94a3b8] font-semibold rounded hover:bg-[#475569] hover:text-white transition-colors text-sm"
              >
                Mark as Cold
              </button>
            )}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors text-sm"
              >
                Delete Lead
              </button>
            ) : (
              <div className="bg-[#0f0f1a] border border-red-500/30 rounded p-3">
                <p className="text-sm text-red-400 mb-3">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onDelete}
                    className="flex-1 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete Forever
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Cold Leads Table ────────────────────────────────────────────────────────

function ColdLeadsTable({
  leads,
  onReactivate,
  onCardClick,
}: {
  leads: Lead[];
  onReactivate: (id: string) => void;
  onCardClick: (lead: Lead) => void;
}) {
  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 text-[#94a3b8] py-20">
        No cold leads
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[#94a3b8] uppercase tracking-wider border-b border-[#2a2a4a]">
            <th className="pb-3 pr-4 font-semibold">Business</th>
            <th className="pb-3 pr-4 font-semibold">Contact</th>
            <th className="pb-3 pr-4 font-semibold">Phone</th>
            <th className="pb-3 pr-4 font-semibold">Trade</th>
            <th className="pb-3 pr-4 font-semibold">Date Added</th>
            <th className="pb-3 pr-4 font-semibold">Date Marked Cold</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const coldEntry = [...(lead.statusHistory || [])]
              .reverse()
              .find((h) => h.status === "cold");
            return (
              <tr
                key={lead.id}
                className="border-b border-[#2a2a4a]/50 hover:bg-[#1a1a2e]/50 cursor-pointer"
                onClick={() => onCardClick(lead)}
              >
                <td className="py-3 pr-4 text-white font-medium">
                  {lead.businessName || "Untitled"}
                </td>
                <td className="py-3 pr-4 text-[#94a3b8]">
                  {lead.contactName || "—"}
                </td>
                <td className="py-3 pr-4 text-[#94a3b8]">
                  {lead.phone || "—"}
                </td>
                <td className="py-3 pr-4">
                  {lead.trade ? (
                    <span className="text-xs bg-[#1a1a2e] text-[#f59e0b] px-2 py-0.5 rounded">
                      {lead.trade}
                    </span>
                  ) : (
                    <span className="text-[#94a3b8]">—</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-[#94a3b8]">
                  {new Date(lead.dateAdded).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3 pr-4 text-[#94a3b8]">
                  {coldEntry
                    ? new Date(coldEntry.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReactivate(lead.id);
                    }}
                    className="px-3 py-1.5 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors text-xs font-semibold"
                  >
                    Reactivate
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState<"pipeline" | "cold">("pipeline");

  // Check auth on mount
  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      const data = await api("GET");
      setLeads(data.leads || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchLeads();
  }, [authed, fetchLeads]);

  // Active leads (not cold) for pipeline & stats
  const activeLeads = leads.filter((l) => l.status !== "cold");
  const coldLeads = leads.filter((l) => l.status === "cold");

  // CRUD operations
  const addLead = async (data: Partial<Lead>) => {
    const lead = await api("POST", data);
    setLeads((prev) => [...prev, lead]);
    setShowAddModal(false);
  };

  const updateLead = async (data: Partial<Lead>) => {
    const updated = await api("PUT", data);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLead?.id === updated.id) {
      setSelectedLead(updated);
    }
  };

  const deleteLead = async (id: string) => {
    await api("DELETE", { id });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
  };

  const markCold = async (id: string) => {
    await updateLead({ id, status: "cold" } as Partial<Lead>);
    setSelectedLead(null);
  };

  const reactivateLead = async (id: string) => {
    await updateLead({ id, status: "new" } as Partial<Lead>);
  };

  const moveLead = (leadId: string, newStatus: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;
    updateLead({ id: leadId, status: newStatus });
  };

  // Password gate
  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#2a2a4a] bg-[#1a1a2e]/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">
            <span className="text-[#f59e0b]">CS</span> CRM
          </h1>
          {/* View toggle */}
          <div className="flex items-center bg-[#0f0f1a] rounded overflow-hidden border border-[#2a2a4a] ml-2">
            <button
              onClick={() => setView("pipeline")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                view === "pipeline"
                  ? "bg-[#f59e0b] text-black"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("cold")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                view === "cold"
                  ? "bg-[#64748b] text-white"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Cold Leads{coldLeads.length > 0 && ` (${coldLeads.length})`}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors text-sm"
          >
            + Add Lead
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(LS_KEY);
              setAuthed(false);
            }}
            className="text-xs text-[#94a3b8] hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats (only for pipeline view, only active leads) */}
      {view === "pipeline" && <StatsBar leads={activeLeads} />}

      {/* Main content */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-[#94a3b8]">
          Loading...
        </div>
      ) : view === "pipeline" ? (
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full min-h-[calc(100vh-200px)]">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                leads={activeLeads.filter((l) => l.status === col.id)}
                onDrop={moveLead}
                onCardClick={setSelectedLead}
              />
            ))}
          </div>
        </div>
      ) : (
        <ColdLeadsTable
          leads={coldLeads}
          onReactivate={reactivateLead}
          onCardClick={setSelectedLead}
        />
      )}

      {/* Lead detail panel */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
          onMarkCold={() => markCold(selectedLead.id)}
          onDelete={() => deleteLead(selectedLead.id)}
        />
      )}

      {/* Add lead modal */}
      {showAddModal && (
        <AddLeadModal
          onAdd={addLead}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
