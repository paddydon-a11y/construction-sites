import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Single brief by slug
  const slug = searchParams.get("slug");
  if (slug) {
    const brief = await redis.get(`mockup:${slug}`);
    if (!brief) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(brief);
  }

  // List all briefs
  if (searchParams.get("list") === "true") {
    const keys: string[] = [];
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, {
        match: "mockup:*",
        count: 100,
      });
      cursor = Number(result[0]);
      keys.push(...result[1]);
    } while (cursor !== 0);

    if (keys.length === 0) {
      return NextResponse.json([]);
    }

    const briefs = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get<Record<string, unknown>>(key);
        if (!data) return null;
        return {
          slug: data.slug,
          company: data.company,
          trade: data.trade,
          location: data.location,
          createdAt: data.createdAt,
        };
      })
    );

    const sorted = briefs
      .filter(Boolean)
      .sort((a, b) => {
        const da = a!.createdAt as string || "";
        const db = b!.createdAt as string || "";
        return db.localeCompare(da);
      });

    return NextResponse.json(sorted);
  }

  return NextResponse.json({ error: "Provide ?slug=x or ?list=true" }, { status: 400 });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.slug || !body.company || !body.trade) {
    return NextResponse.json(
      { error: "Missing required fields: slug, company, trade" },
      { status: 400 }
    );
  }

  const brief = {
    ...body,
    createdAt: new Date().toISOString(),
  };

  await redis.set(`mockup:${body.slug}`, brief);
  return NextResponse.json({ success: true, slug: body.slug });
}
