/*
  # Create user profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `join_date` (timestamptz, default now()) - used to calculate trial period
      - `is_premium` (boolean, default false) - tracks lifetime subscription status
      - `notification_time` (text, default '08:00') - preferred daily notification time
      - `stripe_customer_id` (text, nullable) - Stripe customer reference
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to manage their own data

  3. Automation
    - Trigger to auto-create profile on new user signup
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  join_date timestamptz NOT NULL DEFAULT now(),
  is_premium boolean NOT NULL DEFAULT false,
  notification_time text NOT NULL DEFAULT '08:00',
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, join_date)
  VALUES (new.id, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
