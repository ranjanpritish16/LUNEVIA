CREATE TABLE public.saved_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  package_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.saved_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own saved packages."
  ON public.saved_packages FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view their own saved packages."
  ON public.saved_packages FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete their own saved packages."
  ON public.saved_packages FOR DELETE
  USING (auth.uid() = customer_id);
