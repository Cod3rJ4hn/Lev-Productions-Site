-- D1 schema. Apply with:
--   npx wrangler d1 execute <site>-db --file=schema.sql --remote
-- Add tables per site; this submissions table is the starter for a quote/contact form.

CREATE TABLE IF NOT EXISTS submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  meta       TEXT -- JSON for any extra fields this site's form collects
);
