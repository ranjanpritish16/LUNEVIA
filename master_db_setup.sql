-- ==========================================
-- 1. ADD MISSING COLUMNS
-- ==========================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author_name text;

-- ==========================================
-- 2. DROP ALL EXISTING POLICIES
-- ==========================================
-- (This prevents the "policy already exists" error)
DROP POLICY IF EXISTS "Public can view published salons" ON public.salons;
DROP POLICY IF EXISTS "Artists can view own salon" ON public.salons;
DROP POLICY IF EXISTS "Artists can insert own salon" ON public.salons;
DROP POLICY IF EXISTS "Artists can update own salon" ON public.salons;

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Artists can view salon bookings" ON public.bookings;
DROP POLICY IF EXISTS "Artists can update salon bookings" ON public.bookings;

DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Customers can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;

DROP POLICY IF EXISTS "Artists can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update cover images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view cover images" ON storage.objects;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. CREATE FRESH POLICIES
-- ==========================================

-- Salons policies
CREATE POLICY "Public can view published salons" ON public.salons FOR SELECT USING (is_published = true);
CREATE POLICY "Artists can view own salon" ON public.salons FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Artists can insert own salon" ON public.salons FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Artists can update own salon" ON public.salons FOR UPDATE USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Artists can view salon bookings" ON public.bookings FOR SELECT USING (auth.uid() IN (SELECT owner_id FROM public.salons WHERE id = salon_id));
CREATE POLICY "Artists can update salon bookings" ON public.bookings FOR UPDATE USING (auth.uid() IN (SELECT owner_id FROM public.salons WHERE id = salon_id));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Storage policies
CREATE POLICY "Artists can upload cover images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'salon-covers');
CREATE POLICY "Artists can update cover images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'salon-covers');
CREATE POLICY "Public can view cover images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'salon-covers');

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
