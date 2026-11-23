# Website Dev Template

Starter repo for building websites with Claude Code. Click **Use this template** to create a new repo for each site.

## Start a new site

1. Create the repo from this template, then clone it.
2. `npm install` (installs Puppeteer for screenshots).
3. Put logos, colour guides and images in `brand_assets/`.
4. Open Claude Code in the repo and describe what you want. It reads `CLAUDE.md`, shows a plan, and waits for your approval.

## What's in here

- `CLAUDE.md`: always-on rules (workflow, performance, verification, design guardrails).
- `.claude/skills/`: skills that load when a task matches.
- `serve.mjs`: local server at `http://localhost:3000`.
- `screenshot.mjs`: `node screenshot.mjs http://localhost:3000 [label] [--width=375]`.
- `brand_assets/`: brand files Claude checks before designing.
