/*
# EcoRoute Core Schema

1. New Tables
- profiles: extends auth.users with display name, phone, avatar, home/work/college locations, travel preferences
- saved_locations: user's saved places (home, work, college, favorites)
- emergency_contacts: user's trusted contacts for emergencies
- journeys: completed/planned trips with route info
- expenses: travel expenses with reimbursement workflow
- tickets: demo ticket bookings with QR code data
- community_reports: user-submitted road/infrastructure reports
- notifications: user notification feed

2. Security
- RLS enabled on all tables
- Owner-scoped policies (TO authenticated) for user-specific data
- Public read/write for community_reports (shared data, all authenticated users can see and contribute)
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  avatar_url text,
  home_location text,
  work_location text,
  college_location text,
  preferred_transport text DEFAULT 'metro',
  max_walking_m integer DEFAULT 1000,
  monthly_budget integer DEFAULT 5000,
  eco_preference text DEFAULT 'balanced',
  accessibility_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Saved locations
CREATE TABLE IF NOT EXISTS saved_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  address text NOT NULL,
  lat double precision,
  lng double precision,
  type text DEFAULT 'favorite',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_locations" ON saved_locations;
CREATE POLICY "select_own_saved_locations" ON saved_locations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_locations" ON saved_locations;
CREATE POLICY "insert_own_saved_locations" ON saved_locations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_locations" ON saved_locations;
CREATE POLICY "update_own_saved_locations" ON saved_locations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_locations" ON saved_locations;
CREATE POLICY "delete_own_saved_locations" ON saved_locations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  relation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "select_own_emergency_contacts" ON emergency_contacts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "insert_own_emergency_contacts" ON emergency_contacts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "update_own_emergency_contacts" ON emergency_contacts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "delete_own_emergency_contacts" ON emergency_contacts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Journeys
CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  from_name text NOT NULL,
  to_name text NOT NULL,
  transport_mode text NOT NULL,
  distance_km double precision,
  duration_min integer,
  fare integer,
  co2_kg double precision,
  walking_m integer,
  transfers integer,
  status text DEFAULT 'completed',
  started_at timestamptz,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_journeys" ON journeys;
CREATE POLICY "select_own_journeys" ON journeys FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_journeys" ON journeys;
CREATE POLICY "insert_own_journeys" ON journeys FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_journeys" ON journeys;
CREATE POLICY "update_own_journeys" ON journeys FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_journeys" ON journeys;
CREATE POLICY "delete_own_journeys" ON journeys FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount integer NOT NULL,
  description text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  journey_id uuid REFERENCES journeys(id) ON DELETE SET NULL,
  receipt_url text,
  ocr_extracted boolean DEFAULT false,
  reimbursement_status text DEFAULT 'logged',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_expenses" ON expenses;
CREATE POLICY "select_own_expenses" ON expenses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_expenses" ON expenses;
CREATE POLICY "insert_own_expenses" ON expenses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_expenses" ON expenses;
CREATE POLICY "update_own_expenses" ON expenses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_expenses" ON expenses;
CREATE POLICY "delete_own_expenses" ON expenses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Tickets (demo bookings)
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  from_name text NOT NULL,
  to_name text NOT NULL,
  transport_mode text NOT NULL,
  passenger_name text,
  fare integer NOT NULL,
  booking_id text NOT NULL,
  qr_data text,
  travel_date date NOT NULL,
  status text DEFAULT 'confirmed',
  is_demo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tickets" ON tickets;
CREATE POLICY "select_own_tickets" ON tickets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tickets" ON tickets;
CREATE POLICY "insert_own_tickets" ON tickets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tickets" ON tickets;
CREATE POLICY "update_own_tickets" ON tickets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tickets" ON tickets;
CREATE POLICY "delete_own_tickets" ON tickets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Community reports (shared, all authenticated users can view)
CREATE TABLE IF NOT EXISTS community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  location_name text,
  lat double precision,
  lng double precision,
  photo_url text,
  confirmations integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- All authenticated users can see community reports (shared safety data)
DROP POLICY IF EXISTS "select_all_community_reports" ON community_reports;
CREATE POLICY "select_all_community_reports" ON community_reports FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_community_reports" ON community_reports;
CREATE POLICY "insert_own_community_reports" ON community_reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_community_reports" ON community_reports;
CREATE POLICY "update_own_community_reports" ON community_reports FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
