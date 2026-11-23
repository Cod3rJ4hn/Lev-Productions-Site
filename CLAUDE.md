# CLAUDE.md — Frontend Website Rules

## Environment

* You're working inside my GitHub repo. Everything you change is tracked by git and can be pushed back to GitHub.
* The `main` branch is the live site. Never commit or push to it directly.
* For every approved edit: create a new branch, commit with a clear message, push, and open a pull request. I review and merge.
* Skills live in `.claude/skills/`. See the Skills section for which to use when.
* Keep the repo clean: don't commit `temporary screenshots/`, `node_modules/`, or secrets. Add them to `.gitignore` if they aren't already.

## Workflow (every edit request, no exceptions)

1. **Read first.** Read the relevant code and `brand_assets/`. Never assume what's there.
2. **Plan, then stop.** Before touching any code, give me a plan:
   - What I asked for, in your words
   - Files and sections you'll change, and what changes in each
   - Performance impact (better, same, or worse, and why)
   - What could break
   - Anything unclear (ask one question, don't guess)
   Then wait for my approval. No code changes until I say go.
3. **Build only what was approved.** Spot something else worth fixing? Mention it afterwards, don't do it.
4. **Verify** (see Verification below) before saying it's done.
5. **Git:** work on a new branch, commit with clear messages, open a PR. Never push straight to main.

If my request is a bad idea, conflicts with existing code, or hurts performance, say so plainly and recommend one better option before proceeding.

## Skills — what to use when

Skills load on their own when a task matches, so I don't have to name them. Use this as the map, and read a skill's `SKILL.md` before you rely on it. If two could apply, pick the one listed for the job; don't load three design skills for one task.

**Designing and building**
* `impeccable` — the lead for design quality. Reach for it first on any look-and-feel work and for its shape/critique/audit/polish commands to remove AI-slop tells. Full features use an engine binary installed once on the machine (`npx skills add pbakaus/impeccable`); without it, it still runs in a reduced mode. Don't also load `frontend-design` for the same pass.
* `frontend-design` — a lighter aesthetic-direction pass when `impeccable`'s engine isn't set up or the job doesn't need it.
* `ui-ux-pro-max` — concrete UI/UX decisions: palettes, font pairings, layout, component patterns.
* `design-system-starter` — when a site needs reusable tokens and documented components, not a one-off page.
* `tailwind-patterns` — any Tailwind v4 work (`@theme`, container queries, CSS-first config).
* `scroll-experience` — scroll animations, parallax, scroll-driven storytelling. Mind the performance rules before adding GSAP.
* `3dviz-pro-max` — 3D scenes or models (Three.js, Blender). Only when a site actually calls for 3D.

**Content**
* `copywriting` — writing new copy from scratch (headlines, hero, CTAs, page sections).
* `copy-editing` — improving or de-slopping copy that already exists.
* `image-optimization` — preparing any image for the web: WebP/AVIF, `srcset`, lazy loading.

**Before launch — run these without being asked**
* `web-quality-audit` — the full pre-launch sweep. Run it before any site goes live, then fix what it flags.
* `performance`, `core-web-vitals`, `seo`, `accessibility`, `best-practices` — the focused audits behind the sweep. Use one directly when a single area needs work.
* `webapp-testing` — click every link, button and form and check the console. Part of verifying real functionality, not just looks.
* `geo-fundamentals` — optimising to be cited by AI search (ChatGPT, Claude, Perplexity). Run alongside `seo`.

**Backend and deploying**
* `cloudflare-deploy` — the platform: Pages Functions, D1, Turnstile, secrets, deploys.
* `stripe-integration` — any payment, checkout, subscription or billing feature.
* `api-integration-specialist` — wiring any other third-party service (email, booking, CRM, webhooks) with proper auth, retries and error handling.

## Performance (always the priority)

* Target: Lighthouse 90+ on mobile for Performance, Accessibility, Best Practices and SEO.
* Core Web Vitals: LCP under 2.5s, CLS under 0.1, INP under 200ms.
* Images: modern formats (WebP/AVIF), correctly sized, explicit `width` and `height`, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero image only.
* Fonts: max 2 families, `font-display: swap`, preload the critical one, subset where possible.
* JavaScript: minimal. No library for something CSS or a few lines of JS can do. Defer or async all scripts.
* CSS: no unused styles, no render-blocking where avoidable.
* No layout shift: reserve space for images, embeds and late-loading content.
* Tailwind via CDN is for prototyping only. Before a site goes live, compile and purge the CSS.
* Before adding any dependency, state its size and why it's needed.

## Verification (after every change)

* Re-read the changed code. Check for broken links, imports and typos.
* Serve on localhost, screenshot at mobile (375px), tablet (768px) and desktop (1440px), and look at them.
* Check the browser console: zero errors or warnings.
* Test every interactive element touched: hover, focus-visible, active, and keyboard navigation.
* Confirm existing features still work.
* Report what you checked and anything you couldn't verify. Don't say "done" without this.

## Professional Standards

* Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1` per page, logical heading order.
* Accessibility: alt text on all images, 4.5:1 minimum contrast, visible focus states, labels on all form fields, tap targets at least 44px.
* SEO basics on every page: unique `title` and meta description, Open Graph tags, favicon, canonical URL, clean URLs.
* Forms: validate, show clear error states, and show a success state.
* Clean, consistent code: no dead code, no leftover comments, consistent naming, CSS custom properties for colours, spacing and type scale.
* Never hard-code secrets or API keys.
* Mobile-first. Test the smallest screen first.

## Backend (any form, payment, booking or dynamic feature)

A site isn't done when it looks right — it's done when it works. No fake buttons, dead forms or `href="#"`.

* Build the backend as Cloudflare Pages Functions in `functions/`. Copy `functions/contact.js` as the starting pattern.
* Every client-specific value (emails, keys, prices, booking links) is an environment variable or secret, never hard-coded, so each site is configured without touching code. Local: `.dev.vars` (gitignored, example in `.dev.vars.example`). Production: `wrangler pages secret put`.
* Record every feature in `BACKEND.md`: what it does, the service chosen, the secrets it needs, and what the owner must set up by hand. That file is my setup checklist — keep it current.
* Forms: validate server-side, add spam protection (Turnstile), store the submission (D1, see `schema.sql`) so a lead survives an email failure, and show real success and error states.
* Payments: hosted checkout only (Stripe Checkout). Card details never touch the site. Build and test in test mode; I switch to live keys.
* Bookings and other services: prefer the provider's embed or API over custom logic. Load heavy embeds on interaction so they don't hurt performance.
* Never commit a secret. If a key is needed, add it to `.dev.vars.example` and `BACKEND.md`, and tell me to set it.
* Local dev for anything with a Function is `npx wrangler pages dev .`, not `serve.mjs` (which is static only).
* Not done until the real flow is tested end to end — form actually sends, payment actually completes in test mode — not just screenshotted.

## Reference Images

* If a reference image is provided: match layout, spacing, typography and colour exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
* If no reference image: design from scratch with high craft (see guardrails below).
* Screenshot your output, compare against the reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or I say so.

## Local Server

* Always serve on localhost. Never screenshot a `file:///` URL.
* Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`).
* `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
* If the server is already running, do not start a second instance.

## Screenshot Workflow

* Puppeteer is a project dependency. Run `npm install` once if `node_modules/` is missing.
* Always screenshot from localhost: `node screenshot.mjs http://localhost:3000`
* Screenshots save automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
* Optional label: `node screenshot.mjs http://localhost:3000 label` saves as `screenshot-N-label.png`.
* Optional width: `--width=375` (mobile), `--width=768` (tablet), default 1440 (desktop).
* `screenshot.mjs` lives in the project root. Use it as-is.
* After screenshotting, read the PNG from `temporary screenshots/` with the Read tool.
* When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px".
* Check: spacing/padding, font size/weight/line-height, colours (exact hex), alignment, border-radius, shadows, image sizing.

## Output Defaults

* Single `index.html` file, all styles inline, unless I say otherwise.
* Tailwind CSS v4 via the browser build while prototyping: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`. Configure with `<style type="text/tailwindcss">` and `@theme`.
* Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
* Mobile-first responsive.

## Brand Assets

* Always check `brand_assets/` before designing. It may contain logos, colour guides, style guides or images.
* If assets exist, use them. No placeholders where real assets are available.
* If a logo is present, use it. If a colour palette is defined, use those exact values. Do not invent brand colours.

## Anti-Generic Guardrails

* **Colours:** Never use the default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand colour and derive from it.
* **Shadows:** Never use flat `shadow-md`. Use layered, colour-tinted shadows with low opacity.
* **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
* **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
* **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing. Respect `prefers-reduced-motion`.
* **Three.js / WebGL:** Use Three.js (via `3dviz-pro-max`) only for genuine 3D or WebGL moments — a 3D hero, a product viewer, a real WebGL effect — never for ordinary UI motion, which stays on CSS. When used, lazy-load it on interaction or when it scrolls into view, keep it off the critical path, and provide a static fallback for reduced-motion and low-power devices. State its weight before adding it (dependency rule).
* **Interactive states:** Every clickable element needs hover, focus-visible and active states. No exceptions.
* **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a colour treatment layer with `mix-blend-multiply`.
* **Spacing:** Intentional, consistent spacing tokens, not random Tailwind steps.
* **Depth:** Surfaces need a layering system (base → elevated → floating), not all on the same plane.

## Hard Rules

* Do not write code before I approve the plan.
* Do not add sections, features or content not in the reference or the approved plan.
* Do not "improve" a reference design. Match it.
* Do not stop after one screenshot pass.
* Do not use `transition-all`.
* Do not use default Tailwind blue/indigo as the primary colour.
* Do not push to main.
* Do not say "done" without running the verification checks.
