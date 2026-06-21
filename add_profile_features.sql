-- Add new columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wedding_date date,
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS saved_salons text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Add total_amount to bookings if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS total_amount numeric;
