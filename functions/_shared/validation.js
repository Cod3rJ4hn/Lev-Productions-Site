// Shared helpers for Pages Functions. Server-side validation is the real guard —
// client-side validation is only for UX.

export function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function clean(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Verify a Cloudflare Turnstile token. Returns true/false.
export async function verifyTurnstile(token, secret, ip) {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = await res.json().catch(() => ({ success: false }));
  return data.success === true;
}
