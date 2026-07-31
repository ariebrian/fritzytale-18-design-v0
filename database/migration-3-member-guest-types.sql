-- Migration 3: add "member" and "guest" guest types
-- Run this in the Supabase SQL Editor.

ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_guest_type_check;
ALTER TABLE guests ADD CONSTRAINT guests_guest_type_check
  CHECK (guest_type IN ('fanbase', 'donor', 'member', 'guest'));
