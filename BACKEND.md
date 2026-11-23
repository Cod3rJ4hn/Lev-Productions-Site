# BACKEND.md — setup checklist for this site

Claude fills this in as it builds. Every dynamic feature (form, payment, booking, anything that talks to a service) gets an entry here so I know exactly what to set up and where the keys go. Nothing client-specific is hard-coded — it all lives in environment variables and secrets listed below.

## How this site's backend runs

- Backend: Cloudflare Pages Functions in `functions/`.
- Local dev: `npx wrangler pages dev .` (not `serve.mjs`, which is static only).
- Secrets in local dev: copy `.dev.vars.example` to `.dev.vars` and fill it. `.dev.vars` is gitignored.
- Secrets in production: `npx wrangler pages secret put NAME` for each one below.

## Starters to copy

- Contact/quote form: `functions/contact.js` + `examples/contact-form.html`
- Payments: `functions/checkout.js` + `functions/stripe-webhook.js` (helpers in `functions/_shared/stripe.js`)
- Bookings: `examples/booking-embed.html` (provider embed, no Function needed)

## Features on this site

<!-- Claude adds one block per feature it builds. Example shape: -->

<!--
### Contact / quote form
- What it does: validates, blocks spam, stores the submission, emails me.
- Function: functions/contact.js
- Needs: Turnstile site+secret key, email provider API key, notify-to address.
- Secrets: TURNSTILE_SECRET_KEY, EMAIL_API_KEY, NOTIFY_EMAIL
- Storage: D1 table `submissions` (see schema.sql)
- I must: create the Turnstile widget, create the email provider account + key, create the D1 db.
-->

## Secrets to set (master list)

<!-- Claude keeps this list current. Each row: name — what it is — where to get it. -->

## One-off setup I must do

<!-- Claude lists the accounts/resources I create by hand: D1 database, Turnstile widget,
     Stripe account + test/live keys, email provider, booking account, custom domain. -->

## Before this site goes live

- [ ] All secrets set in production.
- [ ] Every form submitted for real and the email/record arrived.
- [ ] Payments tested in Stripe **test mode**, then switched to live keys.
- [ ] Bookings/third-party flows completed end to end.
- [ ] `web-quality-audit` run and findings fixed.
