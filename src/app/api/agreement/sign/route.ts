import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { slug, signatureData } = await req.json();

    if (!slug || !signatureData) {
      return NextResponse.json({ error: "Missing slug or signature" }, { status: 400 });
    }

    const key = `agreement:${slug}`;
    const existing = await redis.get<Record<string, unknown>>(key);
    if (!existing) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const signedAt = new Date().toISOString();

    // Update agreement in Redis
    await redis.set(key, {
      ...existing,
      signed: true,
      signedAt,
      signatureData,
      signedFromIP: ip,
      status: "signed",
    });

    // Send notification email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const businessName = (existing.businessName as string) || "Unknown";
      const contactName = (existing.contactName as string) || "Unknown";
      const monthlyFee = (existing.monthlyFee as string) || "100";
      const agreementUrl = `https://construction-sites.co.uk/agreement/${slug}`;
      const signedDate = new Date(signedAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      await resend.emails.send({
        from: "Construction Sites <agreements@4atrades.co.uk>",
        to: ["patrick@construction-sites.co.uk"],
        subject: `${businessName} has signed their agreement`,
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
  <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #22c55e; margin: 0; font-size: 20px;">Agreement Signed ✅</h1>
  </div>
  <div style="background: #ffffff; padding: 24px; border: 1px solid #eee;">
    <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
      <strong>${contactName}</strong> from <strong>${businessName}</strong> signed their agreement on ${signedDate}.
    </p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 0; color: #666; font-size: 14px;">Monthly Fee</td>
        <td style="padding: 8px 0; text-align: right; color: #333; font-weight: 600; font-size: 14px;">£${monthlyFee} + VAT</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 0; color: #666; font-size: 14px;">Signed From</td>
        <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px;">${ip}</td>
      </tr>
    </table>
    <div style="text-align: center;">
      <a href="${agreementUrl}" style="display: inline-block; background: #f59e0b; color: #1a1a2e; font-weight: 700; font-size: 14px; padding: 10px 24px; border-radius: 6px; text-decoration: none;">
        View Agreement
      </a>
    </div>
  </div>
  <div style="background: #f8f9fa; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
    <p style="color: #999; font-size: 12px; margin: 0;">Construction Sites — Agreement Notifications</p>
  </div>
</div>`,
      });
    } catch {
      // Don't fail the signing if notification fails
    }

    return NextResponse.json({ success: true, signedAt });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
