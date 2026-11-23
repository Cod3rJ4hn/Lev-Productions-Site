// Example Pages Function: start a Stripe Checkout. POST to /checkout.
// Copy and adapt per site — the price(s) and URLs depend on what the client sells.
// Needs env: STRIPE_SECRET_KEY. Build with test keys, switch to live at launch.

import { json } from './_shared/validation.js';
import { createCheckoutSession } from './_shared/stripe.js';

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payments not configured.' }, 500);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Map the incoming product to a Stripe Price ID server-side. Never trust a
  // price sent from the browser — look it up from a fixed list per site.
  const priceId = data.priceId; // replace with your own product -> price mapping
  if (!priceId) return json({ error: 'Unknown product.' }, 422);

  const origin = new URL(request.url).origin;
  try {
    const session = await createCheckoutSession(env, {
      priceId,
      quantity: Math.max(1, Math.min(Number(data.quantity) || 1, 20)),
      successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/`,
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('Checkout failed', err);
    return json({ error: 'Could not start checkout.' }, 502);
  }
}
