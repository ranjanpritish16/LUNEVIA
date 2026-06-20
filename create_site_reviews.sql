-- Create the table for website testimonials
CREATE TABLE IF NOT EXISTS public.site_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name text NOT NULL,
    location text,
    rating integer NOT NULL DEFAULT 5,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read website reviews
CREATE POLICY "Anyone can view site reviews" 
ON public.site_reviews FOR SELECT 
USING (true);

-- Allow anyone to insert a website review (so brides don't have to make an account just to leave feedback)
CREATE POLICY "Anyone can insert site reviews" 
ON public.site_reviews FOR INSERT 
WITH CHECK (true);
