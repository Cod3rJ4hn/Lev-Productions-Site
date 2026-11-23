// Example Pages Function: Stripe webhook. POST to /stripe-webhook.
// Confirms a payment actually happened before fulfilling — don't fulfil from the
// browser redirect, which can be faked. Needs env: STRIPE_WEBHOOK_SECRET (+ DB if storing).

import { verifyStripeSignature } from './_shared/stripe.js';

export async function onRequestPost({ request, env }) {
  const raw = await request.text(); // RAW body — required for signature check
  const sig = request.headers.get('Stripe-Signature');

  const valid = await verifyStripeSignature(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(raw);

  switch (event.type) {
    case 'checkout.session.completed': {
      // Payment confirmed. Fulfil here: record the order, email the owner,
      // email the customer, mark the booking paid — whatever this site needs.
      // Use the Stripe event id for idempotency so a retry doesn't double-fulfil.
      break;
    }
    default:
      break;
  }

  return new Response('ok', { status: 200 });
}
