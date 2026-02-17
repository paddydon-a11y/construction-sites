import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "crm.json");

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
  statusHistory: { status: string; date: string }[];
}

interface CRMData {
  leads: Lead[];
}

function readData(): CRMData {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { leads: [] };
  }
}

function writeData(data: CRMData) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readData();
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
    monthlyFee: 100,
    statusHistory: [{ status: "new", date: now }],
  };
  data.leads.push(lead);
  writeData(data);
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data = readData();
  const index = data.leads.findIndex((l) => l.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = data.leads[index];

  // Track status change
  if (body.status && body.status !== existing.status) {
    if (!existing.statusHistory) existing.statusHistory = [];
    existing.statusHistory.push({
      status: body.status,
      date: new Date().toISOString(),
    });
  }

  data.leads[index] = { ...existing, ...body };
  writeData(data);
  return NextResponse.json(data.leads[index]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const data = readData();
  data.leads = data.leads.filter((l) => l.id !== id);
  writeData(data);
  return NextResponse.json({ success: true });
}
