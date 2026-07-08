import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  try {
    const data = await request.json();
    const { firstName, lastName, email, message } = data;
    
    if (!firstName || !lastName || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Cloudflare Workers runtime environment variable (Astro v6)
    // @ts-ignore
    const cfEnv = await import("cloudflare:workers").then(m => m.env).catch(() => ({}));
    const resendApiKey = cfEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    const { data: resendData, error } = await resend.emails.send({
      from: 'MortgageDash <hello@mortgagedash.app>',
      to: ['palerectangle@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <h2>New Message from MortgageDash.app</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return new Response(JSON.stringify({ error: error.message || 'Failed to send email' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, id: resendData?.id }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

