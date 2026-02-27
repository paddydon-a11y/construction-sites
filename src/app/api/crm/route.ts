import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const LEADS_KEY = "crm:leads";

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

async function getLeads(): Promise<Lead[]> {
  const data = await redis.get<Lead[]>(LEADS_KEY);
  return data || [];
}

async function setLeads(leads: Lead[]) {
  await redis.set(LEADS_KEY, leads);
}

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const leads = await getLeads();
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
  await setLeads(leads);
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const leads = await getLeads();
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

  leads[index] = { ...existing, ...body };
  await setLeads(leads);
  return NextResponse.json(leads[index]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const leads = await getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  await setLeads(filtered);
  return NextResponse.json({ success: true });
}
