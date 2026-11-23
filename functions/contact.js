// POST /contact — the LevProductions enquiry form.
// Validates server-side, checks Turnstile, stores the lead in D1 first (so an
// email failure never loses it), then emails Ari via Resend.
//
// Env: TURNSTILE_SECRET_KEY, EMAIL_API_KEY, NOTIFY_EMAIL, optional EMAIL_FROM,
// and a D1 binding named DB (see wrangler.toml / schema.sql). Listed in BACKEND.md.

import { isEmail, required, clean, json, verifyTurnstile } from './_shared/validation.js';

const SERVICES = new Set(['Full Production', 'Co-Written Song']);

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const firstName = clean(data.firstName, 60);
  const lastName = clean(data.lastName, 60);
  const email = clean(data.email, 200);
  const message = clean(data.message, 4000);
  const service = SERVICES.has(data.service) ? data.service : '';
  const name = [firstName, lastName].filter(Boolean).join(' ');

  if (!required(firstName) || !isEmail(email) || !required(message)) {
    return json({ error: 'Please fill in your first name, a valid email and a message.' }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const ok = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return json({ error: 'Spam check failed. Please refresh and try again.' }, 403);

  let stored = false;
  if (env.DB) {
    try {
      await env.DB.prepare(
        'INSERT INTO submissions (name, email, message, meta) VALUES (?, ?, ?, ?)'
      ).bind(name, email, message, JSON.stringify({ service, source: 'levproductions.com.au' })).run();
      stored = true;
    } catch (err) {
      console.error('D1 insert failed', err);
    }
  }

  let emailed = false;
  if (env.EMAIL_API_KEY && env.NOTIFY_EMAIL) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM || 'LevProductions Website <onboarding@resend.dev>',
          to: env.NOTIFY_EMAIL,
          reply_to: email,
          subject: `New enquiry from ${name}${service ? ` (${service})` : ''}`,
          text: `${name} <${email}>${service ? `\nEnquiring about: ${service}` : ''}\n\n${message}`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) console.error('Email send failed', res.status, await res.text());
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  // The lead must land somewhere. If neither storage nor email worked, say so.
  if (!stored && !emailed) {
    return json({ error: 'Sorry, that did not go through. Please email create@levproductions.com.au instead.' }, 502);
  }

  return json({ ok: true });
}
