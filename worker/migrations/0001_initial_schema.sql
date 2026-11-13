-- Baseline schema, reverse-engineered from worker/src/lib/db.ts and worker/src/lib/security.ts.
-- Tables already exist on the production D1 DB (created manually before migrations were tracked),
-- so every statement is IF NOT EXISTS / idempotent and safe to apply there.

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  type TEXT NOT NULL CHECK (type IN ('blog', 'article')),
  published_at TEXT,
  author TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  parent_id TEXT REFERENCES comments(id),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL
);
