// Example Pages Function: a quote/contact form endpoint. POST to /contact.
// This is the pattern to copy per site — adapt fields, storage and email to
// what the client wants, and record the secrets it needs in BACKEND.md.
//
// Expects env: TURNSTILE_SECRET_KEY, EMAIL_API_KEY, NOTIFY_EMAIL, and a D1
// binding named DB (see wrangler.toml / schema.sql). Drop any the site skips.

import { isEmail, required, clean, json, verifyTurnstile } from './_shared/validation.js';

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const message = clean(data.message, 4000);

  if (!required(name) || !isEmail(email) || !required(message)) {
    return json({ error: 'Please fill in your name, a valid email and a message.' }, 422);
  }

  // Spam protection
  const ip = request.headers.get('CF-Connecting-IP');
  const ok = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return json({ error: 'Spam check failed. Please try again.' }, 403);

  // Store the lead first, so an email failure never loses it.
  if (env.DB) {
    try {
      await env.DB.prepare(
        'INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)'
      ).bind(name, email, message).run();
    } catch (err) {
      console.error('D1 insert failed', err);
    }
  }

  // Notify the owner. Swap this block for whatever email provider the site uses.
  if (env.EMAIL_API_KEY && env.NOTIFY_EMAIL) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Website <onboarding@resend.dev>',
          to: env.NOTIFY_EMAIL,
          reply_to: email,
          subject: `New enquiry from ${name}`,
          text: `${name} <${email}>\n\n${message}`,
        }),
      });
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  return json({ ok: true });
}
