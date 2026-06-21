-- Add amount_paid to bookings to track partial/advance payments
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0;

-- Optional: Create a helper function if you want to enforce amount_paid <= total_amount
ALTER TABLE public.bookings
ADD CONSTRAINT check_amount_paid 
CHECK (amount_paid >= 0 AND (total_amount IS NULL OR amount_paid <= total_amount));
