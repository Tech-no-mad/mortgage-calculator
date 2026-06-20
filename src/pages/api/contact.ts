import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, email, message } = data;
    
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // On Cloudflare Pages, we cannot write to a local "leads.csv" file
    // because serverless edge networks do not have a local filesystem.
    // Leads should be forwarded to a database (like Cloudflare D1) or email API.
    // TODO: Implement Resend/SendGrid or Cloudflare D1 integration here.
    console.log("Lead captured (Cloudflare env / DEMO MODE - no email sent):", { firstName, lastName, email });

    return new Response(JSON.stringify({ success: true, demo: true }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
