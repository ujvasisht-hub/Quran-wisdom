-- Run this in Supabase SQL Editor ONLY if the profiles table does NOT have a column named "notification_time".
-- (If you already ran the full migration 20260223000000_profiles_new_schema.sql, you don't need this.)

alter table profiles add column if not exists notification_time text default '08:00';
