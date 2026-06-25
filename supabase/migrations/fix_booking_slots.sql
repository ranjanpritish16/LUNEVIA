DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (true);
