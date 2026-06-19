import fs from 'fs';
import path from 'path';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, email, message } = data;
    
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const csvPath = path.resolve('./leads.csv');
    const date = new Date().toISOString();
    const cleanMsg = message ? message.replace(/\n/g, ' ').replace(/"/g, '""') : '';
    const row = `"${date}","${firstName}","${lastName}","${email}","${cleanMsg}"\n`;

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, 'Date,First Name,Last Name,Email,Message\n');
    }
    
    fs.appendFileSync(csvPath, row);

    return new Response(JSON.stringify({ success: true }), { 
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
