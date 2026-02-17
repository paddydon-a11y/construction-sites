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
  source: string;
  monthlyFee: number;
  statusHistory: { status: string; date: string }[];
}

function detectSource(formSource: string): string {
  if (formSource === "google-ads-get-started") return "Google";
  if (formSource === "tiktok-free-mockups") return "TikTok";
  return "Website";
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Formspree sends form fields directly in the JSON body
  const source = detectSource(body._source || "");
  const now = new Date().toISOString();

  const lead: Lead = {
    id: crypto.randomUUID(),
    businessName: body.business || "",
    contactName: body.name || "",
    phone: body.phone || "",
    email: body.email || body._replyto || "",
    trade: body.trade || "",
    website: body.website || "",
    status: "new",
    dateAdded: now,
    notes: "",
    mockupLinks: ["", "", ""],
    agreementSlug: "",
    gocardlessLink: "",
    source,
    monthlyFee: 100,
    statusHistory: [{ status: "new", date: now }],
  };

  const leads = await redis.get<Lead[]>(LEADS_KEY) || [];
  leads.push(lead);
  await redis.set(LEADS_KEY, leads);

  return NextResponse.json({ ok: true, id: lead.id });
}
