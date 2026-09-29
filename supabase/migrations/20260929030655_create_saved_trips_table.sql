/*
# Create saved_trips table

1. New Tables
- `saved_trips`
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to authenticated user)
- `name` (text, not null — user-given label for the saved trip)
- `from_location` (text, not null — origin name)
- `to_location` (text, not null — destination name)
- `from_id` (text — short location id matching eco-data)
- `to_id` (text — short location id matching eco-data)
- `preferred_mode` (text — preferred transport mode)
- `notes` (text — optional user notes)
- `created_at` (timestamp, defaults to now)

2. Security
- Enable RLS on `saved_trips`.
- Owner-scoped CRUD: each authenticated user can only access their own saved trips.
- user_id defaults to auth.uid() so inserts that omit it still succeed.
*/

CREATE TABLE IF NOT EXISTS saved_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  from_location text NOT NULL,
  to_location text NOT NULL,
  from_id text,
  to_id text,
  preferred_mode text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_trips" ON saved_trips;
CREATE POLICY "select_own_saved_trips" ON saved_trips FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_trips" ON saved_trips;
CREATE POLICY "insert_own_saved_trips" ON saved_trips FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_trips" ON saved_trips;
CREATE POLICY "update_own_saved_trips" ON saved_trips FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_trips" ON saved_trips;
CREATE POLICY "delete_own_saved_trips" ON saved_trips FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
