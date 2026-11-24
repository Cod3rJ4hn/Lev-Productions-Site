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

### Contact / discovery-call form (`#contact`)
- What it does: validates (client and server), blocks spam with Turnstile, stores every enquiry in D1 first, then emails Ari. Fields match the live `/get-started` form: Full Name, Instagram, Phone, Email, Service Interested, Message (all required). "Get Started" buttons preselect the service. Needs JavaScript (Turnstile does too).
- Function: `functions/contact.js` (POST `/contact`), helpers in `functions/_shared/validation.js`.
- Front end: `public/index.html` (form) and `public/js/app.js` (submit, states).
- Services: Cloudflare Turnstile (spam), Cloudflare D1 (storage), Resend (email).
- Secrets: `TURNSTILE_SECRET_KEY`, `EMAIL_API_KEY`, `NOTIFY_EMAIL` (optional `EMAIL_FROM`).
- Public value (not a secret): the Turnstile **site key** goes in the `<meta name="turnstile-sitekey" content="">` tag in `public/index.html`. While it is empty the form still renders but the spam check fails, so submissions are rejected.
- Storage: D1 table `submissions` (see `schema.sql`); service, Instagram and phone are saved in the `meta` column as JSON.
- I must: create the D1 database and paste its id into `wrangler.toml`, create the Turnstile widget (domain levproductions.com.au), create the Resend account/key and verify the sending domain, set the secrets, then submit a real test enquiry.

### Spotify player (artists "Have a listen" button)
- What it does: opt-in. The playlist embed loads only when a visitor clicks, never on page load.
- Needs: nothing. Playlist id lives in `public/index.html` (`#player-frame`).

### Redirects
- `public/_redirects` sends the old `/about`, `/get-started`, `/hit-me-up` URLs to the matching section with a 301. Check after deploy that the `#section` is kept.

## Secrets to set (master list)

| Name | What it is | Where to get it |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | Turnstile secret for server-side token check | Cloudflare dashboard, Turnstile widget |
| `EMAIL_API_KEY` | Resend API key | resend.com, API Keys |
| `NOTIFY_EMAIL` | Where enquiries are emailed | Ari's inbox |
| `EMAIL_FROM` (optional) | Verified sender, e.g. `LevProductions <hello@levproductions.com.au>` | Resend, verified domain |

## One-off setup I must do

1. `npx wrangler d1 create lev-productions-db`, paste the printed `database_id` into `wrangler.toml`.
2. `npx wrangler d1 execute lev-productions-db --file=schema.sql --remote`.
3. Create the Turnstile widget, put the site key in the `turnstile-sitekey` meta tag.
4. Create the Resend key, verify the sending domain.
5. `npx wrangler pages secret put` for each secret above.
6. Connect the custom domain levproductions.com.au to the Pages project.
7. Not used on this site: `functions/checkout.js` and `functions/stripe-webhook.js` are template leftovers (no payments here). Delete them before launch so they are not deployed.

## Before this site goes live

- [ ] All secrets set in production.
- [ ] Every form submitted for real and the email/record arrived.
- [ ] Payments tested in Stripe **test mode**, then switched to live keys.
- [ ] Bookings/third-party flows completed end to end.
- [ ] `web-quality-audit` run and findings fixed.
