ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_phone TEXT;
