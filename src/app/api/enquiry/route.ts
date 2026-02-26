import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import clients from "../../../../config/clients.json";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

type ClientConfig = { name: string; email: string; domain: string };
const clientMap = clients as Record<string, ClientConfig>;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const referer = req.headers.get("referer") || "";

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectTo(referer, "#error");
  }

  // Honeypot check — if filled, silently redirect as if successful
  const honeypot = formData.get("_gotcha")?.toString() || "";
  if (honeypot) {
    return redirectTo(referer, "#thank-you");
  }

  // Identify client
  const siteId = formData.get("_site_id")?.toString() || "";
  const client = clientMap[siteId];

  if (!client) {
    console.error(`[enquiry] Unknown site_id: "${siteId}"`);
    return redirectTo(referer, "#error");
  }

  // Extract form fields
  const firstName = formData.get("first_name")?.toString() || "";
  const lastName = formData.get("last_name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const service = formData.get("service")?.toString() || "General Enquiry";
  const message = formData.get("message")?.toString() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  // Build email HTML
  const html = buildEmailHtml({ fullName, email, phone, service, message, clientName: client.name });

  // Send email via Resend
  try {
    const { error } = await resend.emails.send({
      from: "Construction Sites <enquiries@construction-sites.co.uk>",
      to: [client.email],
      replyTo: email,
      subject: `New Enquiry — ${service}`,
      html,
    });

    if (error) {
      console.error(`[enquiry] Resend error for ${siteId}:`, error.message);
      return redirectTo(referer, "#error");
    }
  } catch (err) {
    console.error(`[enquiry] Failed to send for ${siteId}:`, err);
    return redirectTo(referer, "#error");
  }

  // Log to KV — no personal data, just metrics
  try {
    await redis.lpush("enquiry:log", JSON.stringify({
      site_id: siteId,
      service,
      timestamp: new Date().toISOString(),
    }));
  } catch (err) {
    // Non-critical — don't fail the submission over logging
    console.error("[enquiry] KV log error:", err);
  }

  return redirectTo(referer, "#thank-you");
}

function redirectTo(referer: string, hash: string) {
  // Build redirect URL: use referer if available, otherwise fall back to main site
  let url: string;

  if (referer) {
    // Strip any existing hash and append ours
    url = referer.split("#")[0] + hash;
  } else {
    url = `https://construction-sites.co.uk/${hash}`;
  }

  return NextResponse.redirect(url, {
    status: 303,
    headers: corsHeaders(),
  });
}

function buildEmailHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  clientName: string;
}) {
  const { fullName, email, phone, service, message, clientName } = data;

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
  <div style="background: #1a1a2e; padding: 28px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Enquiry</h1>
    <p style="color: #94a3b8; margin: 6px 0 0; font-size: 14px;">${clientName}</p>
  </div>

  <div style="padding: 28px 24px; background: #ffffff;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; width: 100px; vertical-align: top;">Name</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 15px;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Phone</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 15px;">
          <a href="tel:${phone}" style="color: #1e293b; text-decoration: none;">${phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Email</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 15px;">
          <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Service</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 15px;">
          <span style="background: #f59e0b; color: #1a1a2e; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px;">${service}</span>
        </td>
      </tr>
      ${message ? `
      <tr>
        <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Message</td>
        <td style="padding: 12px 0; color: #1e293b; font-size: 15px; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
      </tr>
      ` : ""}
    </table>

    <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
      <p style="margin: 0; color: #15803d; font-size: 13px; font-weight: 600;">
        Hit reply to respond directly to ${fullName || "the enquirer"}.
      </p>
    </div>
  </div>

  <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #eee;">
    <p style="color: #999; font-size: 12px; margin: 0;">
      Powered by <a href="https://construction-sites.co.uk" style="color: #f59e0b; text-decoration: none; font-weight: 600;">construction-sites.co.uk</a>
    </p>
  </div>
</div>`;
}
