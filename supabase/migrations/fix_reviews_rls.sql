-- Make sure RLS is enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
