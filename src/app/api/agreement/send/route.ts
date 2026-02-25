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
    const { slug, email, firstName, businessName } = await req.json();

    if (!slug || !email) {
      return NextResponse.json({ error: "Missing slug or email" }, { status: 400 });
    }

    const agreementUrl = `https://construction-sites.co.uk/agreement/${slug}`;

    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
  <div style="background: #1a1a2e; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <div style="font-size: 32px; margin-bottom: 8px;">🏗️</div>
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Construction Sites</h1>
  </div>

  <div style="padding: 32px 24px; background: #ffffff;">
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Hi ${firstName || "there"},
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 28px;">
      Your website agreement is ready to review and sign. It only takes a minute.
    </p>

    <div style="text-align: center; margin: 0 0 28px;">
      <a href="${agreementUrl}" style="display: inline-block; background: #f59e0b; color: #1a1a2e; font-weight: 700; font-size: 16px; padding: 14px 36px; border-radius: 8px; text-decoration: none; letter-spacing: 0.3px;">
        Review &amp; Sign Agreement
      </a>
    </div>

    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
      If you have any questions, give us a call or drop us a message on
      <a href="tel:+447926535524" style="color: #f59e0b; text-decoration: none; font-weight: 600;">07926 535524</a>.
    </p>
  </div>

  <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #eee;">
    <p style="color: #999; font-size: 13px; margin: 0; font-style: italic;">
      Construction Sites — We Build Sites. You Build Everything Else.
    </p>
  </div>
</div>`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Construction Sites <agreements@construction-sites.co.uk>",
      to: [email],
      subject: `${businessName || "Your"} Website Agreement — Ready to Sign`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Update the agreement record with sent timestamp
    const existing = await redis.get<Record<string, unknown>>(`agreement:${slug}`);
    if (existing) {
      await redis.set(`agreement:${slug}`, {
        ...existing,
        agreementSentAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, sentAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
