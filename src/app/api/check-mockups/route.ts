import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MOCKUPS_DIR = path.join(process.cwd(), "public", "mockups");

const VARIANTS = ["dark", "light", "bold", "classic", "modern"] as const;

const STRIP_SUFFIXES = [
  "ltd",
  "limited",
  "solutions",
  "services",
  "group",
  "company",
  "co",
  "inc",
  "uk",
  "plumbing",
  "electrical",
  "building",
  "roofing",
  "landscaping",
  "construction",
  "contractors",
  "developments",
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateCandidates(rawSlug: string): string[] {
  const words = rawSlug.split("-").filter(Boolean);
  const candidates: string[] = [];

  // 1. Full slug as-is
  candidates.push(words.join("-"));

  // 2. Strip common suffixes from the end
  let stripped = [...words];
  while (
    stripped.length > 1 &&
    STRIP_SUFFIXES.includes(stripped[stripped.length - 1])
  ) {
    stripped = stripped.slice(0, -1);
  }
  const strippedSlug = stripped.join("-");
  if (strippedSlug !== words.join("-")) {
    candidates.push(strippedSlug);
  }

  // 3. First 3 words (after stripping)
  if (stripped.length > 3) {
    candidates.push(stripped.slice(0, 3).join("-"));
  }

  // 4. First 2 words (after stripping)
  if (stripped.length > 2) {
    candidates.push(stripped.slice(0, 2).join("-"));
  }

  // 5. First 2 words of original (before stripping)
  if (words.length > 2) {
    const first2 = words.slice(0, 2).join("-");
    if (!candidates.includes(first2)) {
      candidates.push(first2);
    }
  }

  return candidates;
}

function findMockups(slug: string): string[] {
  const found: string[] = [];
  for (const variant of VARIANTS) {
    const dir = path.join(MOCKUPS_DIR, `${slug}-${variant}`);
    try {
      if (fs.statSync(dir).isDirectory()) {
        found.push(
          `https://construction-sites.co.uk/mockups/${slug}-${variant}`
        );
      }
    } catch {
      // doesn't exist
    }
  }
  return found;
}

export async function GET(req: NextRequest) {
  const rawSlug = req.nextUrl.searchParams.get("slug");
  if (!rawSlug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const slug = slugify(rawSlug);
  const candidates = generateCandidates(slug);

  for (const candidate of candidates) {
    const found = findMockups(candidate);
    if (found.length > 0) {
      return NextResponse.json({ slug: candidate, mockups: found });
    }
  }

  return NextResponse.json({ slug, mockups: [] });
}
