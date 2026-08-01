-- FF Invitation System Database Schema
-- Run this in Supabase SQL Editor

-- Users table (admin/staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fanbases table
CREATE TABLE fanbases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donors table
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT,
  guest_type TEXT NOT NULL CHECK (guest_type IN ('fanbase', 'donor', 'member', 'guest', 'general')),
  fanbase_id UUID REFERENCES fanbases(id),
  donor_id UUID REFERENCES donors(id),
  qr_code_token TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance logs table
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  checked_in_by UUID REFERENCES users(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_qr_code_token ON guests(qr_code_token);
CREATE INDEX idx_attendance_logs_event_id ON attendance_logs(event_id);
CREATE INDEX idx_attendance_logs_guest_id ON attendance_logs(guest_id);

-- Insert a default admin user (password: admin123)
-- You should change this after first login!
INSERT INTO users (username, password_hash, display_name)
VALUES ('admin', '$2b$10$bIdLAMV530l405siUUswwOEcQ.Hq25OGciMBgYJr/jmKO.cBqXYn.', 'Administrator');
