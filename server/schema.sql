-- Idempotent: safe to run on every deploy. Apply with `npm run db:migrate`.

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS profiles (
  user_id      UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sex          TEXT NOT NULL,
  age          INTEGER NOT NULL,
  height_cm    DOUBLE PRECISION NOT NULL,
  weight_kg    DOUBLE PRECISION NOT NULL,
  activity     TEXT NOT NULL,
  goal         TEXT NOT NULL,
  calorie_goal INTEGER NOT NULL,
  protein_goal INTEGER NOT NULL,
  carbs_goal   INTEGER NOT NULL,
  fat_goal     INTEGER NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  meal_type      TEXT NOT NULL,
  calories       DOUBLE PRECISION NOT NULL,
  protein        DOUBLE PRECISION NOT NULL,
  carbs          DOUBLE PRECISION NOT NULL,
  fat            DOUBLE PRECISION NOT NULL,
  photo_data_url TEXT,
  logged_at      TIMESTAMPTZ NOT NULL,
  source         TEXT NOT NULL,
  items          JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meals_user_logged_at_idx ON meals (user_id, logged_at);

CREATE TABLE IF NOT EXISTS weight_logs (
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  kg       DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (user_id, log_date)
);

-- Photos moved to Vercel Blob. photo_key points at the private blob; photo_data_url is legacy,
-- read as a fallback for rows written before the move.
ALTER TABLE meals ADD COLUMN IF NOT EXISTS photo_key TEXT;

-- Fixed-window counters for sign-in rate limiting. One row per counted key (email or IP).
CREATE TABLE IF NOT EXISTS login_attempts (
  attempt_key  TEXT PRIMARY KEY,
  attempts     INTEGER NOT NULL,
  window_start TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS login_attempts_window_start_idx ON login_attempts (window_start);
