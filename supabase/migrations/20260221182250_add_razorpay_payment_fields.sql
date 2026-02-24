/*
  # Add Razorpay Payment Fields

  1. Changes
    - Add `razorpay_order_id` column to store Razorpay order reference
    - Add `razorpay_payment_id` column to store successful payment reference
    - Add `payment_date` column to track when premium was purchased
    - Remove `stripe_customer_id` column (no longer needed)
  
  2. Security
    - No changes to RLS policies needed
    - Existing policies already protect user data appropriately
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles DROP COLUMN stripe_customer_id;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'razorpay_order_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN razorpay_order_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN razorpay_payment_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'payment_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN payment_date timestamptz;
  END IF;
END $$;
