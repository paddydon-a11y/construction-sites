import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function agreementKey(slug: string) {
  return `agreement:${slug}`;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const data = await redis.get(agreementKey(slug));
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, clientName, businessName, email, phone, monthlyFee } = body;

  if (!slug || !businessName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const agreement = {
    slug,
    clientName: clientName || "",
    businessName,
    email: email || "",
    phone: phone || "",
    date: today,
    monthlyFee: monthlyFee || "100",
    signed: false,
  };

  await redis.set(agreementKey(slug), agreement);
  return NextResponse.json(agreement);
}
