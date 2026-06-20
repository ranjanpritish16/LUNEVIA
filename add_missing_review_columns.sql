-- Ensure all necessary columns exist on the reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS salon_id uuid;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS customer_id uuid;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating integer;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author_name text;
