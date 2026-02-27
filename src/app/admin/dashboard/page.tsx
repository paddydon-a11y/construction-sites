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
  agreementSentAt: string;
  agreementStatus: "not-sent" | "sent" | "signed";
  gocardlessLink: string;
  monthlyFee: number;
  source: string;
  statusHistory: { status: string; date: string }[];
  callbackDate?: string;
  callbackNote?: string;
  callbackCount?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "new", label: "New Lead", color: "#3b82f6" },
  { id: "mockups-sent", label: "Mockups Sent", color: "#8b5cf6" },
  { id: "agreement-sent", label: "Agreement Sent", color: "#f97316" },
  { id: "signed", label: "Signed", color: "#10b981" },
  { id: "live", label: "Live", color: "#22c55e" },
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

function StatsBar({ leads, callbacksDueToday }: { leads: Lead[]; callbacksDueToday: number }) {
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
    { label: "Callbacks Due", value: callbacksDueToday, highlight: callbacksDueToday > 0 },
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`flex-shrink-0 bg-[#1a1a2e] border rounded-lg px-5 py-3 min-w-[140px] ${
            (s as { highlight?: boolean }).highlight
              ? "border-[#f97316]/50"
              : "border-[#2a2a4a]"
          }`}
        >
          <div className={`text-2xl font-bold ${
            (s as { highlight?: boolean }).highlight ? "text-[#f97316]" : "text-[#f59e0b]"
          }`}>{s.value}</div>
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
  onChurn,
}: {
  lead: Lead;
  onClick: () => void;
  compact: boolean;
  onChurn?: (id: string) => void;
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
      <div className="flex items-center gap-1">
        <div className={`font-semibold text-white truncate group-hover:text-[#f59e0b] transition-colors flex-1 ${compact ? "text-xs" : "text-sm"}`}>
          {lead.businessName || "Untitled"}
        </div>
        {onChurn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChurn(lead.id);
            }}
            title="Mark as Churned"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#94a3b8] hover:text-red-400 text-xs p-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
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
                      : lead.source === "Meta"
                      ? "#1877f220"
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
                      : lead.source === "Meta"
                      ? "#4599f7"
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
  onChurn,
}: {
  column: (typeof COLUMNS)[number];
  leads: Lead[];
  onDrop: (leadId: string, newStatus: string) => void;
  onCardClick: (lead: Lead) => void;
  onChurn?: (id: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [compact, setCompact] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Auto-compact when cards would overflow the column height
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    const check = () => {
      const availableHeight = window.innerHeight - 244;
      const fullHeight = leads.length * 96;
      setCompact(fullHeight > availableHeight && leads.length > 4);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [leads.length]);

  return (
    <div
      className={`flex-1 min-w-0 flex flex-col rounded-lg transition-colors ${
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
            onChurn={onChurn}
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
    { key: "website", label: "Current Website", type: "text" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
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
              <option value="Meta">Meta</option>
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
  onMoveToCallback,
  onPushCallback,
}: {
  lead: Lead;
  onUpdate: (data: Partial<Lead>) => void;
  onClose: () => void;
  onMarkCold: () => void;
  onDelete: () => void;
  onMoveToCallback: (date: string, note: string) => void;
  onPushCallback: (newDate: string) => void;
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
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendingAgreement, setSendingAgreement] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackDateInput, setCallbackDateInput] = useState("");
  const [callbackNoteInput, setCallbackNoteInput] = useState("");
  const [showPushMenu, setShowPushMenu] = useState(false);
  const [editForm, setEditForm] = useState({
    businessName: lead.businessName || "",
    contactName: lead.contactName || "",
    phone: lead.phone || "",
    email: lead.email || "",
    trade: lead.trade || "",
    website: lead.website || "",
    source: lead.source || "",
  });

  const saveEdit = () => {
    onUpdate({ id: lead.id, ...editForm } as Partial<Lead>);
    setEditing(false);
  };

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

  const generateAgreementSlug = async () => {
    const slug = lead.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      await fetch("/api/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          clientName: lead.contactName,
          businessName: lead.businessName,
          email: lead.email,
          phone: lead.phone,
          monthlyFee: String(lead.monthlyFee || 100),
        }),
      });
    } catch {
      // Agreement page will still load if Redis has the data
    }

    onUpdate({ id: lead.id, agreementSlug: slug } as Partial<Lead>);
    window.open(`/agreement/${slug}`, "_blank");
  };

  const handleSendAgreement = async () => {
    if (!lead.email) return;
    setSendingAgreement(true);

    // Ensure agreement exists in Redis first
    const slug = lead.agreementSlug || lead.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      await fetch("/api/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          clientName: lead.contactName,
          businessName: lead.businessName,
          email: lead.email,
          phone: lead.phone,
          monthlyFee: String(lead.monthlyFee || 100),
        }),
      });
    } catch {
      // continue — agreement may already exist
    }

    try {
      const firstName = (lead.contactName || "").split(" ")[0] || "";
      const res = await fetch("/api/agreement/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          email: lead.email,
          firstName,
          businessName: lead.businessName,
        }),
      });

      if (res.ok) {
        const sentAt = new Date().toISOString();
        onUpdate({
          id: lead.id,
          agreementSlug: slug,
          agreementSentAt: sentAt,
          agreementStatus: "sent",
        } as Partial<Lead>);
        setToast(`Agreement sent to ${lead.email}`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      // allow retry
    } finally {
      setSendingAgreement(false);
      setShowSendModal(false);
    }
  };

  const statusLabel = (status: string) =>
    status === "cold"
      ? "Cold Lead"
      : status === "churned"
      ? "Churned"
      : status === "callback"
      ? "Callback"
      : COLUMNS.find((c) => c.id === status)?.label || status;

  const statusColor = (status: string) =>
    status === "cold"
      ? "#64748b"
      : status === "churned"
      ? "#ef4444"
      : status === "callback"
      ? "#f97316"
      : COLUMNS.find((c) => c.id === status)?.color || "#94a3b8";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-end z-50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a1a2e] w-full max-w-lg h-full overflow-y-auto border-l border-[#2a2a4a]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-[#2a2a4a] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (editing) {
                  saveEdit();
                } else {
                  setEditing(true);
                }
              }}
              className={`p-1.5 rounded transition-colors ${editing ? "bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30" : "text-[#94a3b8] hover:text-[#f59e0b] hover:bg-[#2a2a4a]"}`}
              title={editing ? "Save changes" : "Edit details"}
            >
              {editing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              )}
            </button>
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
              {editing && <span className="text-[#f59e0b] ml-2 normal-case tracking-normal font-normal">Editing</span>}
            </h3>
            {editing ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { key: "businessName", label: "Business Name", type: "text", span: 2 },
                  { key: "contactName", label: "Contact", type: "text" },
                  { key: "phone", label: "Phone", type: "tel" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "trade", label: "Trade", type: "text" },
                  { key: "website", label: "Current Website", type: "text", span: 2 },
                ].map((f) => (
                  <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                    <div className="text-[#94a3b8] text-xs mb-1">{f.label}</div>
                    <input
                      type={f.type}
                      value={editForm[f.key as keyof typeof editForm]}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#f59e0b]/30 rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                ))}
                <div>
                  <div className="text-[#94a3b8] text-xs mb-1">Source</div>
                  <select
                    value={editForm.source}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#f59e0b]/30 rounded text-white text-sm outline-none focus:border-[#f59e0b]"
                  >
                    <option value="">—</option>
                    <option value="Referral">Referral</option>
                    <option value="Google">Google</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Website">Website</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Meta">Meta</option>
                  </select>
                </div>
                <div>
                  <div className="text-[#94a3b8] text-xs mb-1">Monthly Fee</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#94a3b8]">£</span>
                    <input
                      type="number"
                      value={monthlyFee}
                      onChange={(e) => saveMonthlyFee(parseInt(e.target.value) || 100)}
                      className="w-20 bg-[#0f0f1a] border border-[#f59e0b]/30 rounded px-2 py-2 text-white text-sm outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                </div>
                <div className="col-span-2 flex gap-2 mt-1">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditForm({
                        businessName: lead.businessName || "",
                        contactName: lead.contactName || "",
                        phone: lead.phone || "",
                        email: lead.email || "",
                        trade: lead.trade || "",
                        website: lead.website || "",
                        source: lead.source || "",
                      });
                      setEditing(false);
                    }}
                    className="flex-1 py-2 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[#94a3b8] text-xs">Contact</div>
                  <div className="text-white">{lead.contactName || "—"}</div>
                </div>
                <div>
                  <div className="text-[#94a3b8] text-xs">Phone</div>
                  <div className="text-white">
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="hover:text-[#f59e0b]">{lead.phone}</a>
                    ) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[#94a3b8] text-xs">Email</div>
                  <div className="text-white truncate">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="hover:text-[#f59e0b]">{lead.email}</a>
                    ) : "—"}
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
                      <a href={lead.website} target="_blank" rel="noreferrer" className="hover:text-[#f59e0b] underline">{lead.website}</a>
                    ) : "—"}
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
                      onChange={(e) => saveMonthlyFee(parseInt(e.target.value) || 100)}
                      className="w-20 bg-[#0f0f1a] border border-[#2a2a4a] rounded px-2 py-1 text-white text-sm outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                </div>
              </div>
            )}
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
                    type="text"
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
              {lead.agreementStatus === "signed" ? (
                <span className="ml-2 text-[#22c55e] normal-case tracking-normal font-normal">Signed</span>
              ) : lead.agreementStatus === "sent" ? (
                <span className="ml-2 text-[#f97316] normal-case tracking-normal font-normal">Sent</span>
              ) : null}
            </h3>

            {/* Agreement link + open */}
            {lead.agreementSlug ? (
              <div className="flex gap-2 items-center mb-3">
                <code className="text-sm text-[#f59e0b] bg-[#0f0f1a] px-2 py-1 rounded">
                  /agreement/{lead.agreementSlug}
                </code>
                <button
                  onClick={generateAgreementSlug}
                  className="text-sm text-[#f59e0b] hover:underline cursor-pointer bg-transparent border-none"
                >
                  Open
                </button>
              </div>
            ) : (
              <button
                onClick={generateAgreementSlug}
                className="px-4 py-2 bg-[#f59e0b] text-black font-semibold rounded hover:bg-[#fbbf24] transition-colors text-sm cursor-pointer mb-3"
              >
                Generate Agreement Link
              </button>
            )}

            {/* Send agreement button */}
            {lead.agreementStatus !== "signed" && (
              <button
                onClick={() => {
                  if (!lead.email) {
                    setToast("No email address — add one first");
                    setTimeout(() => setToast(null), 3000);
                    return;
                  }
                  setShowSendModal(true);
                }}
                className="w-full py-2 bg-[#3b82f6] text-white font-semibold rounded hover:bg-[#2563eb] transition-colors text-sm cursor-pointer"
              >
                {lead.agreementSentAt ? "Resend Agreement" : "Send Agreement"}
              </button>
            )}

            {/* Sent/signed info */}
            {lead.agreementSentAt && (
              <p className="text-xs text-[#94a3b8] mt-2">
                Sent {new Date(lead.agreementSentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </section>

          {/* GoCardless */}
          <section>
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
              GoCardless Link
            </h3>
            <input
              type="text"
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

          {/* Callback Info (when status is callback) */}
          {lead.status === "callback" && (
            <section>
              <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
                Callback Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[#94a3b8] text-xs">Callback Date</div>
                  <div className={`text-white font-medium ${
                    lead.callbackDate && lead.callbackDate <= new Date().toISOString().split("T")[0]
                      ? "text-red-400"
                      : ""
                  }`}>
                    {lead.callbackDate
                      ? new Date(lead.callbackDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[#94a3b8] text-xs">Times Pushed</div>
                  <div className="text-white">{lead.callbackCount || 0}</div>
                </div>
                {lead.callbackNote && (
                  <div className="col-span-2">
                    <div className="text-[#94a3b8] text-xs">Note</div>
                    <div className="text-white">{lead.callbackNote}</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="border-t border-[#2a2a4a] pt-4 flex flex-col gap-3">
            {lead.status === "callback" ? (
              <>
                <button
                  onClick={() => {
                    onUpdate({ id: lead.id, status: "new", callbackDate: "", callbackNote: "", callbackCount: 0 } as Partial<Lead>);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#3b82f6] text-white font-semibold rounded hover:bg-[#2563eb] transition-colors text-sm"
                >
                  Move to Pipeline
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowPushMenu(!showPushMenu)}
                    className="w-full py-2.5 bg-[#f97316] text-white font-semibold rounded hover:bg-[#ea580c] transition-colors text-sm"
                  >
                    Push Callback
                  </button>
                  {showPushMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg overflow-hidden z-10 shadow-lg">
                      {[
                        { label: "1 Week", days: 7 },
                        { label: "2 Weeks", days: 14 },
                        { label: "1 Month", days: 30 },
                        { label: "3 Months", days: 90 },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + opt.days);
                            onPushCallback(d.toISOString().split("T")[0]);
                            setShowPushMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a4a] transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                      <div className="px-4 py-2 border-t border-[#2a2a4a]">
                        <input
                          type="date"
                          onChange={(e) => {
                            if (e.target.value) {
                              onPushCallback(e.target.value);
                              setShowPushMenu(false);
                            }
                          }}
                          className="w-full px-2 py-1 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm outline-none focus:border-[#f59e0b]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    onUpdate({ id: lead.id, status: "cold", callbackDate: "", callbackNote: "", callbackCount: 0 } as Partial<Lead>);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#334155] text-[#94a3b8] font-semibold rounded hover:bg-[#475569] hover:text-white transition-colors text-sm"
                >
                  Move to Cold
                </button>
              </>
            ) : lead.status === "cold" ? (
              <>
                <button
                  onClick={() =>
                    onUpdate({ id: lead.id, status: "new" } as Partial<Lead>)
                  }
                  className="w-full py-2.5 bg-[#3b82f6] text-white font-semibold rounded hover:bg-[#2563eb] transition-colors text-sm"
                >
                  Reactivate Lead
                </button>
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="w-full py-2.5 bg-[#f97316] text-white font-semibold rounded hover:bg-[#ea580c] transition-colors text-sm"
                >
                  Move to Callback
                </button>
              </>
            ) : lead.status === "churned" ? (
              <button
                onClick={() =>
                  onUpdate({ id: lead.id, status: "live" } as Partial<Lead>)
                }
                className="w-full py-2.5 bg-[#22c55e] text-white font-semibold rounded hover:bg-[#16a34a] transition-colors text-sm"
              >
                Reactivate to Live
              </button>
            ) : (
              <>
                <button
                  onClick={onMarkCold}
                  className="w-full py-2.5 bg-[#334155] text-[#94a3b8] font-semibold rounded hover:bg-[#475569] hover:text-white transition-colors text-sm"
                >
                  Mark as Cold
                </button>
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="w-full py-2.5 bg-[#f97316] text-white font-semibold rounded hover:bg-[#ea580c] transition-colors text-sm"
                >
                  Move to Callback
                </button>
              </>
            )}

            {/* Move to Callback Form */}
            {showCallbackForm && (
              <div className="bg-[#0f0f1a] border border-[#f97316]/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Schedule Callback</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { label: "1 Week", days: 7 },
                    { label: "2 Weeks", days: 14 },
                    { label: "1 Month", days: 30 },
                    { label: "3 Months", days: 90 },
                  ].map((opt) => {
                    const d = new Date();
                    d.setDate(d.getDate() + opt.days);
                    const val = d.toISOString().split("T")[0];
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setCallbackDateInput(val)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          callbackDateInput === val
                            ? "bg-[#f97316] text-white"
                            : "bg-[#2a2a4a] text-[#94a3b8] hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="date"
                  value={callbackDateInput}
                  onChange={(e) => setCallbackDateInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4a] rounded text-white text-sm outline-none focus:border-[#f59e0b] mb-2"
                />
                <input
                  type="text"
                  value={callbackNoteInput}
                  onChange={(e) => setCallbackNoteInput(e.target.value)}
                  placeholder="Note (e.g. Said call back in March)"
                  className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4a] rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b] mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!callbackDateInput) return;
                      onMoveToCallback(callbackDateInput, callbackNoteInput);
                      setShowCallbackForm(false);
                      setCallbackDateInput("");
                      setCallbackNoteInput("");
                    }}
                    disabled={!callbackDateInput}
                    className="flex-1 py-2 bg-[#f97316] text-white font-semibold rounded hover:bg-[#ea580c] transition-colors text-sm disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowCallbackForm(false);
                      setCallbackDateInput("");
                      setCallbackNoteInput("");
                    }}
                    className="flex-1 py-2 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#22c55e] text-white px-6 py-3 rounded-lg shadow-lg text-sm font-semibold animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* Send Agreement Modal */}
      {showSendModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setShowSendModal(false)}
        >
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {lead.agreementSentAt ? "Resend Agreement" : "Send Agreement"}
            </h2>

            {lead.agreementSentAt && (
              <div className="bg-[#f97316]/10 border border-[#f97316]/30 rounded p-3 mb-4">
                <p className="text-sm text-[#f97316]">
                  This agreement was already sent on{" "}
                  {new Date(lead.agreementSentAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}. Send again?
                </p>
              </div>
            )}

            <div className="bg-[#0f0f1a] border border-[#2a2a4a] rounded p-4 mb-4">
              <p className="text-sm text-white mb-1">
                Send to <strong>{lead.contactName || lead.businessName}</strong>
              </p>
              <p className="text-sm text-[#f59e0b]">{lead.email}</p>
            </div>

            <div className="bg-[#0f0f1a] border border-[#2a2a4a] rounded p-4 mb-5">
              <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-2">Email Preview</p>
              <p className="text-sm text-white mb-1">
                Hi {(lead.contactName || "").split(" ")[0] || "there"},
              </p>
              <p className="text-sm text-[#94a3b8] mb-2">
                Your website agreement is ready to review and sign. It only takes a minute.
              </p>
              <div className="bg-[#f59e0b] text-black text-center text-xs font-bold py-2 rounded">
                Review &amp; Sign Agreement
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-2.5 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAgreement}
                disabled={sendingAgreement}
                className="flex-1 py-2.5 bg-[#3b82f6] text-white font-semibold rounded hover:bg-[#2563eb] transition-colors text-sm disabled:opacity-50"
              >
                {sendingAgreement ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cold Leads Table ────────────────────────────────────────────────────────

function ColdLeadsTable({
  leads,
  onReactivate,
  onCardClick,
  onMoveToCallback,
}: {
  leads: Lead[];
  onReactivate: (id: string) => void;
  onCardClick: (lead: Lead) => void;
  onMoveToCallback: (id: string) => void;
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
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReactivate(lead.id);
                      }}
                      className="px-3 py-1.5 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors text-xs font-semibold"
                    >
                      Reactivate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveToCallback(lead.id);
                      }}
                      className="px-3 py-1.5 bg-[#f97316] text-white rounded hover:bg-[#ea580c] transition-colors text-xs font-semibold"
                    >
                      Callback
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Churned Leads Table ─────────────────────────────────────────────────────

function ChurnedLeadsTable({
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
        No churned clients
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
            <th className="pb-3 pr-4 font-semibold">Date Churned</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const churnedEntry = [...(lead.statusHistory || [])]
              .reverse()
              .find((h) => h.status === "churned");
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
                  {churnedEntry
                    ? new Date(churnedEntry.date).toLocaleDateString("en-GB", {
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
                    className="px-3 py-1.5 bg-[#22c55e] text-white rounded hover:bg-[#16a34a] transition-colors text-xs font-semibold"
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

// ─── Callback Table ─────────────────────────────────────────────────────────

function CallbackTable({
  leads,
  onCardClick,
  onMoveToPipeline,
  onPushCallback,
  onMoveToCold,
  onUpdateNote,
}: {
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
  onMoveToPipeline: (id: string) => void;
  onPushCallback: (id: string, newDate: string) => void;
  onMoveToCold: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}) {
  const [pushMenuOpen, setPushMenuOpen] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const dueToday = leads.filter((l) => l.callbackDate && l.callbackDate <= today).length;

  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 text-[#94a3b8] py-20">
        No scheduled callbacks
      </div>
    );
  }

  const getUrgency = (date?: string) => {
    if (!date) return "default";
    if (date <= today) return "overdue";
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    if (date <= threeDays.toISOString().split("T")[0]) return "soon";
    return "default";
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Due Today Banner */}
      {dueToday > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-5 py-3 mb-4 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-semibold text-sm">
            {dueToday} callback{dueToday !== 1 ? "s" : ""} due today or overdue
          </span>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[#94a3b8] uppercase tracking-wider border-b border-[#2a2a4a]">
            <th className="pb-3 pr-4 font-semibold">Business</th>
            <th className="pb-3 pr-4 font-semibold">Contact</th>
            <th className="pb-3 pr-4 font-semibold">Phone</th>
            <th className="pb-3 pr-4 font-semibold">Trade</th>
            <th className="pb-3 pr-4 font-semibold">Date Moved</th>
            <th className="pb-3 pr-4 font-semibold">Callback Date</th>
            <th className="pb-3 pr-4 font-semibold">Note</th>
            <th className="pb-3 pr-4 font-semibold">#</th>
            <th className="pb-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const urgency = getUrgency(lead.callbackDate);
            const callbackEntry = [...(lead.statusHistory || [])]
              .reverse()
              .find((h) => h.status === "callback");

            return (
              <tr
                key={lead.id}
                className={`border-b border-[#2a2a4a]/50 hover:bg-[#1a1a2e]/50 cursor-pointer ${
                  urgency === "overdue"
                    ? "border-l-4 border-l-red-500 bg-red-500/5"
                    : urgency === "soon"
                    ? "border-l-4 border-l-amber-500 bg-amber-500/5"
                    : ""
                }`}
                onClick={() => onCardClick(lead)}
              >
                <td className="py-3 pr-4 text-white font-medium">
                  {lead.businessName || "Untitled"}
                </td>
                <td className="py-3 pr-4 text-[#94a3b8]">
                  {lead.contactName || "—"}
                </td>
                <td className="py-3 pr-4">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#f59e0b] hover:underline"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-[#94a3b8]">—</span>
                  )}
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
                  {callbackEntry
                    ? new Date(callbackEntry.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </td>
                <td className={`py-3 pr-4 font-medium ${
                  urgency === "overdue"
                    ? "text-red-400"
                    : urgency === "soon"
                    ? "text-amber-400"
                    : "text-white"
                }`}>
                  {lead.callbackDate
                    ? new Date(lead.callbackDate + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="py-3 pr-4">
                  <input
                    type="text"
                    value={lead.callbackNote || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateNote(lead.id, e.target.value)}
                    placeholder="Add note..."
                    className="w-full bg-transparent border-b border-[#2a2a4a] text-white text-xs outline-none focus:border-[#f59e0b] py-1 placeholder-gray-600 max-w-[200px]"
                  />
                </td>
                <td className="py-3 pr-4">
                  {(lead.callbackCount || 0) > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f97316]/20 text-[#f97316] text-xs font-bold">
                      {lead.callbackCount}
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <div className="flex gap-1.5 items-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMoveToPipeline(lead.id)}
                      title="Move to Pipeline"
                      className="px-2 py-1.5 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors text-xs font-semibold"
                    >
                      Pipeline
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setPushMenuOpen(pushMenuOpen === lead.id ? null : lead.id)}
                        title="Push Callback"
                        className="px-2 py-1.5 bg-[#f97316] text-white rounded hover:bg-[#ea580c] transition-colors text-xs font-semibold"
                      >
                        Push
                      </button>
                      {pushMenuOpen === lead.id && (
                        <div className="absolute right-0 top-full mt-1 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg overflow-hidden z-20 shadow-lg min-w-[140px]">
                          {[
                            { label: "1 Week", days: 7 },
                            { label: "2 Weeks", days: 14 },
                            { label: "1 Month", days: 30 },
                            { label: "3 Months", days: 90 },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => {
                                const d = new Date();
                                d.setDate(d.getDate() + opt.days);
                                onPushCallback(lead.id, d.toISOString().split("T")[0]);
                                setPushMenuOpen(null);
                              }}
                              className="w-full px-3 py-2 text-left text-xs text-white hover:bg-[#2a2a4a] transition-colors"
                            >
                              {opt.label}
                            </button>
                          ))}
                          <div className="px-3 py-2 border-t border-[#2a2a4a]">
                            <input
                              type="date"
                              onChange={(e) => {
                                if (e.target.value) {
                                  onPushCallback(lead.id, e.target.value);
                                  setPushMenuOpen(null);
                                }
                              }}
                              className="w-full px-2 py-1 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-xs outline-none focus:border-[#f59e0b]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onMoveToCold(lead.id)}
                      title="Move to Cold"
                      className="px-2 py-1.5 bg-[#334155] text-[#94a3b8] rounded hover:bg-[#475569] hover:text-white transition-colors text-xs font-semibold"
                    >
                      Cold
                    </button>
                  </div>
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
  const [view, setView] = useState<"pipeline" | "cold" | "churned" | "callback">("pipeline");
  const [callbackModal, setCallbackModal] = useState<{ leadId: string } | null>(null);
  const [cbDateInput, setCbDateInput] = useState("");
  const [cbNoteInput, setCbNoteInput] = useState("");

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

  // Active leads (not cold/churned/callback) for pipeline & stats
  const activeLeads = leads.filter((l) => l.status !== "cold" && l.status !== "churned" && l.status !== "callback");
  const coldLeads = leads.filter((l) => l.status === "cold");
  const churnedLeads = leads.filter((l) => l.status === "churned");
  const callbackLeads = leads
    .filter((l) => l.status === "callback")
    .sort((a, b) => (a.callbackDate || "").localeCompare(b.callbackDate || ""));
  const today = new Date().toISOString().split("T")[0];
  const callbacksDueToday = callbackLeads.filter((l) => l.callbackDate && l.callbackDate <= today).length;

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

  const churnLead = async (id: string) => {
    await updateLead({ id, status: "churned" } as Partial<Lead>);
  };

  const reactivateChurned = async (id: string) => {
    await updateLead({ id, status: "live" } as Partial<Lead>);
  };

  const moveToCallback = async (leadId: string, date: string, note: string) => {
    await updateLead({
      id: leadId,
      status: "callback",
      callbackDate: date,
      callbackNote: note,
      callbackCount: 0,
    } as Partial<Lead>);
    setSelectedLead(null);
  };

  const pushCallback = async (leadId: string, newDate: string) => {
    const lead = leads.find((l) => l.id === leadId);
    await updateLead({
      id: leadId,
      callbackDate: newDate,
      callbackCount: (lead?.callbackCount || 0) + 1,
    } as Partial<Lead>);
  };

  const moveCallbackToPipeline = async (id: string) => {
    await updateLead({ id, status: "new", callbackDate: "", callbackNote: "", callbackCount: 0 } as Partial<Lead>);
  };

  const moveCallbackToCold = async (id: string) => {
    await updateLead({ id, status: "cold", callbackDate: "", callbackNote: "", callbackCount: 0 } as Partial<Lead>);
  };

  const updateCallbackNote = async (id: string, note: string) => {
    await updateLead({ id, callbackNote: note } as Partial<Lead>);
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
              Cold{coldLeads.length > 0 && ` (${coldLeads.length})`}
            </button>
            <button
              onClick={() => setView("churned")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                view === "churned"
                  ? "bg-[#ef4444] text-white"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Churned{churnedLeads.length > 0 && ` (${churnedLeads.length})`}
            </button>
            <button
              onClick={() => setView("callback")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                view === "callback"
                  ? "bg-[#f97316] text-white"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Callback{callbackLeads.length > 0 && ` (${callbackLeads.length})`}
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

      {/* Stats bar */}
      <StatsBar leads={activeLeads} callbacksDueToday={callbacksDueToday} />

      {/* Main content */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-[#94a3b8]">
          Loading...
        </div>
      ) : view === "pipeline" ? (
        <div className="flex-1 p-4">
          <div className="flex gap-3 h-full min-h-[calc(100vh-200px)]">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                leads={activeLeads.filter((l) => l.status === col.id)}
                onDrop={moveLead}
                onCardClick={setSelectedLead}
                onChurn={col.id === "live" ? churnLead : undefined}
              />
            ))}
          </div>
        </div>
      ) : view === "cold" ? (
        <ColdLeadsTable
          leads={coldLeads}
          onReactivate={reactivateLead}
          onCardClick={setSelectedLead}
          onMoveToCallback={(id) => setCallbackModal({ leadId: id })}
        />
      ) : view === "callback" ? (
        <CallbackTable
          leads={callbackLeads}
          onCardClick={setSelectedLead}
          onMoveToPipeline={moveCallbackToPipeline}
          onPushCallback={pushCallback}
          onMoveToCold={moveCallbackToCold}
          onUpdateNote={updateCallbackNote}
        />
      ) : (
        <ChurnedLeadsTable
          leads={churnedLeads}
          onReactivate={reactivateChurned}
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
          onMoveToCallback={(date, note) => moveToCallback(selectedLead.id, date, note)}
          onPushCallback={(newDate) => pushCallback(selectedLead.id, newDate)}
        />
      )}

      {/* Add lead modal */}
      {showAddModal && (
        <AddLeadModal
          onAdd={addLead}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Callback scheduling modal (from Cold tab) */}
      {callbackModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setCallbackModal(null)}
        >
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Schedule Callback</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "1 Week", days: 7 },
                { label: "2 Weeks", days: 14 },
                { label: "1 Month", days: 30 },
                { label: "3 Months", days: 90 },
              ].map((opt) => {
                const d = new Date();
                d.setDate(d.getDate() + opt.days);
                const val = d.toISOString().split("T")[0];
                return (
                  <button
                    key={opt.label}
                    onClick={() => setCbDateInput(val)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      cbDateInput === val
                        ? "bg-[#f97316] text-white"
                        : "bg-[#2a2a4a] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <input
              type="date"
              value={cbDateInput}
              onChange={(e) => setCbDateInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm outline-none focus:border-[#f59e0b] mb-2"
            />
            <input
              type="text"
              value={cbNoteInput}
              onChange={(e) => setCbNoteInput(e.target.value)}
              placeholder="Note (e.g. Said call back in March)"
              className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded text-white text-sm placeholder-gray-500 outline-none focus:border-[#f59e0b] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCallbackModal(null);
                  setCbDateInput("");
                  setCbNoteInput("");
                }}
                className="flex-1 py-2 border border-[#2a2a4a] text-[#94a3b8] rounded hover:bg-[#2a2a4a] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!cbDateInput) return;
                  moveToCallback(callbackModal.leadId, cbDateInput, cbNoteInput);
                  setCallbackModal(null);
                  setCbDateInput("");
                  setCbNoteInput("");
                }}
                disabled={!cbDateInput}
                className="flex-1 py-2 bg-[#f97316] text-white font-semibold rounded hover:bg-[#ea580c] transition-colors text-sm disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
