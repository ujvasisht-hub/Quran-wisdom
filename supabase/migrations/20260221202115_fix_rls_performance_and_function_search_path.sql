/*
  # Fix RLS Performance and Function Security Issues

  ## Changes Made

  ### 1. RLS Policy Performance (profiles table)
  - Updated all three RLS policies to wrap `auth.uid()` in a subselect: `(select auth.uid())`
  - This causes the auth function to be evaluated once per query instead of once per row,
    significantly improving performance at scale

  ### 2. Function Search Path Security (handle_new_user)
  - Added `SET search_path = public` to the `handle_new_user` function
  - Prevents search_path injection attacks by fixing the search path at function creation time

  ### Policies Updated
  - "Users can read own profile" — SELECT
  - "Users can insert own profile" — INSERT
  - "Users can update own profile" — UPDATE
*/

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, join_date)
  VALUES (new.id, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
