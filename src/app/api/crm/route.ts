import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ─── Users Config ─────────────────────────────────────────────────────────────

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

const ALL_USER_IDS = Object.values(USERS)
  .filter((u) => u.role === "user")
  .map((u) => u.id);

const USER_LABELS: Record<string, string> = {};
for (const u of Object.values(USERS)) {
  USER_LABELS[u.id] = u.label;
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  callbackDate?: string;
  callbackNote?: string;
  callbackCount?: number;
}

// ─── Per-user Redis helpers ───────────────────────────────────────────────────

function leadsKey(userId: string): string {
  return `crm:leads:${userId}`;
}

async function getLeads(userId: string): Promise<Lead[]> {
  const data = await redis.get<Lead[]>(leadsKey(userId));
  return data || [];
}

async function setLeads(userId: string, leads: Lead[]) {
  await redis.set(leadsKey(userId), leads);
}

function getUserById(userId: string) {
  return Object.values(USERS).find((u) => u.id === userId);
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Migration endpoint: copy old crm:leads → crm:leads:zs1
  if (searchParams.get("migrate") === "true") {
    const old = await redis.get<Lead[]>("crm:leads");
    if (old && old.length > 0) {
      const existing = await redis.get<Lead[]>(leadsKey("zs1"));
      if (!existing || existing.length === 0) {
        await redis.set(leadsKey("zs1"), old);
        return NextResponse.json({ migrated: old.length });
      }
      return NextResponse.json({ message: "zs1 already has data, skipping migration", existing: existing.length });
    }
    return NextResponse.json({ message: "No old data to migrate" });
  }

  const userId = searchParams.get("user");
  if (!userId) {
    return NextResponse.json({ error: "Missing user param" }, { status: 400 });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "Unknown user" }, { status: 403 });
  }

  // Admin aggregation: return all users' data
  if (user.role === "admin" && searchParams.get("all") === "true") {
    const result: Record<string, { leads: Lead[]; label: string }> = {};
    for (const uid of ALL_USER_IDS) {
      result[uid] = {
        leads: await getLeads(uid),
        label: USER_LABELS[uid] || uid,
      };
    }
    return NextResponse.json({ users: result });
  }

  // Regular user or admin viewing own (admin has no leads of their own, but handle gracefully)
  const leads = await getLeads(userId);
  return NextResponse.json({ leads });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.user;
  if (!userId || !getUserById(userId)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 403 });
  }

  const leads = await getLeads(userId);
  const now = new Date().toISOString();
  const lead: Lead = {
    id: crypto.randomUUID(),
    businessName: body.businessName || "",
    contactName: body.contactName || "",
    phone: body.phone || "",
    email: body.email || "",
    trade: body.trade || "",
    website: body.website || "",
    status: "new",
    dateAdded: now,
    notes: "",
    mockupLinks: ["", "", ""],
    agreementSlug: "",
    gocardlessLink: "",
    source: body.source || "",
    monthlyFee: 100,
    statusHistory: [{ status: "new", date: now }],
  };
  leads.push(lead);
  await setLeads(userId, leads);
  return NextResponse.json(lead);
}

// ─── PUT ──────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const userId = body.user;
  if (!userId || !getUserById(userId)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 403 });
  }

  const leads = await getLeads(userId);
  const index = leads.findIndex((l) => l.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = leads[index];

  // Track status change
  if (body.status && body.status !== existing.status) {
    if (!existing.statusHistory) existing.statusHistory = [];
    existing.statusHistory.push({
      status: body.status,
      date: new Date().toISOString(),
    });
  }

  // Strip the 'user' field before spreading onto the lead
  const { user: _user, ...updates } = body;
  leads[index] = { ...existing, ...updates };
  await setLeads(userId, leads);
  return NextResponse.json(leads[index]);
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const userId = body.user;
  if (!userId || !getUserById(userId)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 403 });
  }

  const { id } = body;
  const leads = await getLeads(userId);
  const filtered = leads.filter((l) => l.id !== id);
  await setLeads(userId, filtered);
  return NextResponse.json({ success: true });
}
