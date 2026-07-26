-- Migration 2: fix delete-event/delete-guest failures, drop email, rename phone -> contact
-- Run this in the Supabase SQL Editor.

-- attendance_logs.guest_id / event_id had no ON DELETE action, so Postgres
-- rejected deleting any guest or event that had ever been checked in
-- (foreign key violation). Cascade the delete instead.
ALTER TABLE attendance_logs DROP CONSTRAINT IF EXISTS attendance_logs_guest_id_fkey;
ALTER TABLE attendance_logs ADD CONSTRAINT attendance_logs_guest_id_fkey
  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE;

ALTER TABLE attendance_logs DROP CONSTRAINT IF EXISTS attendance_logs_event_id_fkey;
ALTER TABLE attendance_logs ADD CONSTRAINT attendance_logs_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- Drop the unused email field and rename phone -> contact.
ALTER TABLE guests DROP COLUMN IF EXISTS email;
ALTER TABLE guests RENAME COLUMN phone TO contact;
