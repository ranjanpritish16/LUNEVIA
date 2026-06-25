-- ==========================================
-- ULTIMATE MASTER DATABASE SETUP SCRIPT (V2)
-- ==========================================

-- 1. ADD ALL MISSING COLUMNS
-- Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;

-- Bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS salon_id uuid;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_id uuid;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_id uuid;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_date date;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_time text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_price numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone text;

-- Reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS salon_id uuid;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS customer_id uuid;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating integer;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author_name text;

-- ==========================================
-- 2. DROP ALL EXISTING POLICIES TO AVOID CONFLICTS
-- ==========================================
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
-- Salons
CREATE POLICY "Public can view published salons" ON public.salons FOR SELECT USING (is_published = true);
CREATE POLICY "Artists can view own salon" ON public.salons FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Artists can insert own salon" ON public.salons FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Artists can update own salon" ON public.salons FOR UPDATE USING (auth.uid() = owner_id);

-- Bookings
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Artists can view salon bookings" ON public.bookings FOR SELECT USING (auth.uid() IN (SELECT owner_id FROM public.salons WHERE id = salon_id));
CREATE POLICY "Artists can update salon bookings" ON public.bookings FOR UPDATE USING (auth.uid() IN (SELECT owner_id FROM public.salons WHERE id = salon_id));

-- Reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Storage
CREATE POLICY "Artists can upload cover images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'salon-covers');
CREATE POLICY "Artists can update cover images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'salon-covers');
CREATE POLICY "Public can view cover images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'salon-covers');

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 5. AUTOMATIC RATING TRIGGER (SECURITY DEFINER)
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_salon_rating()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  UPDATE public.salons
  SET 
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id)),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id))
  WHERE id = COALESCE(NEW.salon_id, OLD.salon_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_salon_rating ON public.reviews;
CREATE TRIGGER trigger_update_salon_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_salon_rating();
