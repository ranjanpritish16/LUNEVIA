-- Ensure RLS is enabled on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow customers to view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id);

-- Allow customers to insert their own bookings
CREATE POLICY "Customers can insert own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Allow salon owners to view bookings for their salon
CREATE POLICY "Salon owners can view bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons
      WHERE salons.id = bookings.salon_id
      AND salons.owner_id = auth.uid()
    )
  );

-- Allow salon owners to update bookings for their salon
CREATE POLICY "Salon owners can update bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons
      WHERE salons.id = bookings.salon_id
      AND salons.owner_id = auth.uid()
    )
  );
