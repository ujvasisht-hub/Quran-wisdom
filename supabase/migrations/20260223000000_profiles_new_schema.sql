--
-- Run this in the Supabase SQL Editor for your project.
-- Creates the profiles table for the app (Play Store / App Store).
--

-- Create a table for user profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Optional: used by the app for daily reminder time (Settings screen)
  notification_time text default '08:00'
);

-- Set up Row Level Security (RLS) so users can only see their own data
alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Required so the app can create a profile row after signUp (no trigger = app creates it)
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- If you already created profiles without notification_time, uncomment and run:
-- alter table profiles add column if not exists notification_time text default '08:00';
