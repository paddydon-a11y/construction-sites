import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MOCKUPS_DIR = path.join(process.cwd(), "public", "mockups");

const VARIANTS = ["dark", "light", "bold", "classic", "modern"] as const;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const found: string[] = [];

  for (const variant of VARIANTS) {
    const dir = path.join(MOCKUPS_DIR, `${slug}-${variant}`);
    try {
      const stat = fs.statSync(dir);
      if (stat.isDirectory()) {
        found.push(`https://construction-sites.co.uk/mockups/${slug}-${variant}`);
      }
    } catch {
      // doesn't exist
    }
  }

  return NextResponse.json({ slug, mockups: found });
}
