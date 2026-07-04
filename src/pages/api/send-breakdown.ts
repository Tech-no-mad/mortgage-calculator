import type { APIRoute } from 'astro';
import { SITE_EMAIL } from '../../config';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, monthly, pi, tax, ins, totalInterest, totalCost } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    // Astro provides secrets via import.meta.env. 
    // In a Cloudflare Worker, this can also be bound to process.env or context depending on config.
    const resendApiKey = import.meta.env.RESEND_API_KEY || (globalThis as any).process?.env?.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set. Simulating email send for:", email);
      return new Response(JSON.stringify({ success: true, message: "Demo mode: Email not sent" }), { status: 200 });
    }

    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2>Your Mortgage Breakdown</h2>
        <p>Here is the personalized mortgage breakdown you requested from MortgageDash.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Estimated Monthly Payment</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 1.2em; color: #2563eb;">${monthly}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Principal & Interest</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${pi}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Property Taxes</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${tax}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Home Insurance</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${ins}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Total Interest Paid</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${totalInterest}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Total Cost of Loan</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${totalCost}</td>
          </tr>
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
        from: `MortgageDash <onboarding@resend.dev>`, // Resend requires a verified domain or onboarding@resend.dev for testing to the registered email address.
        reply_to: SITE_EMAIL,
        to: email,
        subject: 'Your MortgageDash Breakdown',
        html: htmlContent
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return new Response(JSON.stringify({ error: "Failed to send email via Resend" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error("Error sending breakdown:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
