// POST /contact — the LevProductions booking form.
// Validates server-side, checks Turnstile, stores the lead in D1 first (so an
// email failure never loses it), then emails Ari via Resend.
//
// Env: TURNSTILE_SECRET_KEY, EMAIL_API_KEY, NOTIFY_EMAIL, optional EMAIL_FROM,
// and a D1 binding named DB (see wrangler.toml / schema.sql). Listed in BACKEND.md.

import { isEmail, required, clean, json, verifyTurnstile } from './_shared/validation.js';

const SERVICES = new Set([
  'Music production – Stripped Back',
  'Music production – Full Production',
  'Record an EP or album',
  'Mix',
  'Master',
  'Mix & Master',
  'Editing',
]);

const oneLine = (value, max) => clean(value, max).replace(/[\r\n]+/g, ' ');

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!data || typeof data !== 'object') return json({ error: 'Invalid request.' }, 400);

  const name = oneLine(data.fullName, 120);
  const instagram = oneLine(data.instagram, 80);
  const phone = oneLine(data.phone, 40);
  const email = oneLine(data.email, 200);
  const message = clean(data.message, 4000);
  const service = SERVICES.has(data.service) ? data.service : '';

  if (![name, instagram, phone, message, service].every(required) || !isEmail(email)) {
    return json({ error: 'Please fill in every field with a valid email.' }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const ok = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return json({ error: 'Spam check failed. Please refresh and try again.' }, 403);

  let stored = false;
  if (env.DB) {
    try {
      await env.DB.prepare(
        'INSERT INTO submissions (name, email, message, meta) VALUES (?, ?, ?, ?)'
      ).bind(name, email, message, JSON.stringify({ service, instagram, phone })).run();
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
          subject: `New enquiry from ${name} (${service})`,
          text: `${name} <${email}>\nPhone: ${phone}\nInstagram: ${instagram}\nService: ${service}\n\n${message}`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) console.error('Email send failed', res.status);
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  // The lead must land somewhere. If neither storage nor email worked, say so.
  if (!stored && !emailed) {
    return json({ error: 'Your message did not send. Please email create@levproductions.com.au instead.' }, 502);
  }

  return json({ ok: true });
}
