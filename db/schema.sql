-- Cloudflare D1 schema for portfolio, deploy using Wrangler migrations.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  service_slug TEXT NOT NULL,
  service_title TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK(amount > 0),
  currency TEXT NOT NULL DEFAULT 'PKR',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  company TEXT,
  notes TEXT,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','card')),
  status TEXT NOT NULL DEFAULT 'pending_bank_transfer',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  payfast_transaction_id TEXT UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  project TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status, created_at DESC);
