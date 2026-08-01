-- Migration 4: friendly public invitation URLs
-- Run this in the Supabase SQL Editor.
--
-- Adds a human-readable `slug` column to guests (e.g. "sparkle-army",
-- "jane-doe") derived from the fanbase/donor name (or the guest's own name
-- for member/guest types), used for the public /invite/[slug] link.
-- qr_code_token is untouched and still powers the check-in QR code.

ALTER TABLE guests ADD COLUMN IF NOT EXISTS slug TEXT;

WITH base AS (
  SELECT
    g.id,
    COALESCE(
      NULLIF(
        trim(both '-' from regexp_replace(lower(coalesce(f.name, d.name, g.name)), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'guest'
    ) AS base_slug
  FROM guests g
  LEFT JOIN fanbases f ON g.guest_type = 'fanbase' AND f.id = g.fanbase_id
  LEFT JOIN donors d ON g.guest_type = 'donor' AND d.id = g.donor_id
),
numbered AS (
  SELECT
    id,
    base_slug,
    row_number() OVER (PARTITION BY base_slug ORDER BY id) AS rn
  FROM base
)
UPDATE guests
SET slug = CASE WHEN numbered.rn = 1 THEN numbered.base_slug ELSE numbered.base_slug || '-' || numbered.rn END
FROM numbered
WHERE guests.id = numbered.id;

ALTER TABLE guests ALTER COLUMN slug SET NOT NULL;
ALTER TABLE guests ADD CONSTRAINT guests_slug_unique UNIQUE (slug);
CREATE INDEX idx_guests_slug ON guests(slug);
