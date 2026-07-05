import type { APIRoute } from 'astro';
import { SITE_EMAIL } from '../../config';
// @ts-ignore
import { env as cfEnv } from 'cloudflare:workers';

export const POST: APIRoute = async (context) => {
  try {
    const data = await context.request.json();
    const { email, title, fields } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }
    if (!fields || !Array.isArray(fields)) {
      return new Response(JSON.stringify({ error: "Fields array is required" }), { status: 400 });
    }

    // Astro provides secrets via import.meta.env in dev.
    // In Astro v6 for Cloudflare, we must use cloudflare:workers for runtime env.
    const env = cfEnv || import.meta.env || (globalThis as any).process?.env || {};
    const resendApiKey = env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY in Cloudflare Worker environment.");
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY in server environment. Please ensure the secret is bound to the Cloudflare Worker." }), { status: 500 });
    }

    const reportTitle = title || "Your Mortgage Breakdown";

    const rowsHtml = fields.map((f: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${f.highlight ? '<strong>' : ''}${f.label}${f.highlight ? '</strong>' : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; ${f.highlight ? 'font-weight: bold; font-size: 1.2em; color: #2563eb;' : ''}">${f.value}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2>${reportTitle}</h2>
        <p>Here is the personalized breakdown you requested from MortgageDash.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${rowsHtml}
        </table>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
          Thank you for using MortgageDash!<br/>
          If you have any questions, you can reply directly to this email.
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `MortgageDash <no-reply@mortgagedash.app>`,
        reply_to: 'no-reply@mortgagedash.app',
        to: email,
        subject: reportTitle,
        html: htmlContent
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error("Error sending breakdown:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error: " + error.message }), { status: 500 });
  }
}
