-- Cloudflare D1 / SQLite: immutable first schema for the Next.js platform
-- Intentionally NO seeded customer data and NO card/payment credentials.
PRAGMA foreign_keys = ON;

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY NOT NULL,
  request_key TEXT NOT NULL UNIQUE,
  client_email TEXT NOT NULL CHECK(length(client_email) BETWEEN 3 AND 254),
  client_name TEXT CHECK(client_name IS NULL OR length(client_name) <= 120),
  project_type TEXT NOT NULL CHECK(length(project_type) BETWEEN 1 AND 100),
  service_slug TEXT CHECK(service_slug IS NULL OR length(service_slug) <= 120),
  budget_band TEXT NOT NULL CHECK(length(budget_band) <= 100),
  goal TEXT NOT NULL CHECK(length(goal) BETWEEN 10 AND 180),
  details TEXT NOT NULL DEFAULT '' CHECK(length(details) <= 2400),
  source TEXT NOT NULL DEFAULT 'portfolio' CHECK(length(source) <= 120),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK(status IN ('new','qualified','contacted','proposal_sent','won','lost','archived')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX inquiries_status_created ON inquiries(status, created_at DESC);
CREATE INDEX inquiries_created ON inquiries(created_at DESC);

CREATE TABLE inquiry_events (
  id TEXT PRIMARY KEY NOT NULL,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL CHECK(event_type IN ('created','status_changed','note_added','notification_failed','notification_sent')),
  note TEXT CHECK(note IS NULL OR length(note) <= 2000),
  actor TEXT NOT NULL DEFAULT 'system',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX inquiry_events_inquiry ON inquiry_events(inquiry_id, created_at DESC);

CREATE TABLE content_entries (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('project','post','service','page')),
  slug TEXT NOT NULL CHECK(length(slug) BETWEEN 1 AND 120),
  title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 180),
  excerpt TEXT NOT NULL DEFAULT '' CHECK(length(excerpt) <= 600),
  body TEXT NOT NULL DEFAULT '',
  body_format TEXT NOT NULL DEFAULT 'markdown' CHECK(body_format IN ('markdown','plain')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  metadata_json TEXT NOT NULL DEFAULT '{}',
  published_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(kind, slug)
);
CREATE INDEX content_entries_public ON content_entries(kind, status, published_at DESC);
CREATE INDEX content_entries_recent ON content_entries(updated_at DESC);

CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  request_key TEXT NOT NULL UNIQUE,
  inquiry_id TEXT REFERENCES inquiries(id) ON DELETE SET NULL,
  service_slug TEXT NOT NULL CHECK(length(service_slug) <= 120),
  client_email TEXT NOT NULL CHECK(length(client_email) BETWEEN 3 AND 254),
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK(status IN ('requested','quoted','accepted','awaiting_payment','paid','in_progress','completed','cancelled','refunded')),
  amount_minor INTEGER CHECK(amount_minor IS NULL OR amount_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'PKR' CHECK(length(currency) = 3),
  quote_notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX orders_status_created ON orders(status, created_at DESC);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
  source_name TEXT NOT NULL CHECK(length(source_name) <= 120),
  source_url TEXT CHECK(source_url IS NULL OR length(source_url) <= 1000),
  author_display_name TEXT NOT NULL CHECK(length(author_display_name) BETWEEN 1 AND 120),
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 3000),
  permission_at INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  approved_at INTEGER,
  CHECK(status != 'approved' OR permission_at IS NOT NULL)
);
CREATE INDEX reviews_public ON reviews(status, approved_at DESC);

CREATE TABLE email_outbox (
  id TEXT PRIMARY KEY NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('inquiry','order','review','system')),
  entity_id TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK(length(purpose) <= 80),
  recipient TEXT NOT NULL CHECK(length(recipient) BETWEEN 3 AND 254),
  subject TEXT NOT NULL CHECK(length(subject) BETWEEN 1 AND 180),
  body_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK(status IN ('pending','sending','provider_accepted','delivered','bounced','failed','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  next_attempt_at INTEGER NOT NULL DEFAULT (unixepoch()),
  leased_until INTEGER,
  provider_message_id TEXT UNIQUE,
  last_error_code TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  accepted_at INTEGER
);
CREATE INDEX email_outbox_ready ON email_outbox(status, next_attempt_at, attempts);
CREATE INDEX email_outbox_entity ON email_outbox(entity_type, entity_id);

CREATE TABLE email_delivery_events (
  provider_event_id TEXT PRIMARY KEY NOT NULL,
  outbox_id TEXT REFERENCES email_outbox(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK(length(event_type) <= 80),
  event_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX email_delivery_events_outbox ON email_delivery_events(outbox_id, event_at);

CREATE TABLE admin_audit (
  id TEXT PRIMARY KEY NOT NULL,
  actor_id TEXT NOT NULL CHECK(length(actor_id) <= 200),
  action TEXT NOT NULL CHECK(length(action) <= 120),
  entity_type TEXT NOT NULL CHECK(length(entity_type) <= 80),
  entity_id TEXT NOT NULL,
  event_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX admin_audit_recent ON admin_audit(created_at DESC);

CREATE TABLE rate_limit_buckets (
  bucket_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 1 CHECK(hit_count >= 0),
  expires_at INTEGER NOT NULL,
  PRIMARY KEY(bucket_key, window_start)
);
CREATE INDEX rate_limit_expiry ON rate_limit_buckets(expires_at);
