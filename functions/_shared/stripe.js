// Stripe helpers for Pages Functions. No SDK — plain fetch + Web Crypto, so it
// stays dependency-free on Workers. Secret keys come from env, never the repo.

// Create a Checkout Session and return its hosted URL. Cards never touch the site.
export async function createCheckoutSession(env, { priceId, quantity = 1, successUrl, cancelUrl, mode = 'payment' }) {
  const body = new URLSearchParams();
  body.append('mode', mode);
  body.append('success_url', successUrl);
  body.append('cancel_url', cancelUrl);
  body.append('line_items[0][price]', priceId);
  body.append('line_items[0][quantity]', String(quantity));

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) throw new Error(`Stripe error ${res.status}: ${await res.text()}`);
  return res.json();
}

// Verify a Stripe webhook signature using Web Crypto. Returns true/false.
// Pass the RAW request body text, the Stripe-Signature header, and the webhook secret.
export async function verifyStripeSignature(rawBody, header, secret, toleranceSec = 300) {
  if (!rawBody || !header || !secret) return false;

  const parts = header.split(',').map((p) => p.split('='));
  const t = parts.find(([k]) => k === 't')?.[1];
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!t || sigs.length === 0) return false;

  // Reject stale timestamps (replay protection).
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSec) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${rawBody}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');

  return sigs.some((sig) => timingSafeEqual(sig, expected));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
