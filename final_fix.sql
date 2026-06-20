-- 1. Add the missing comment column to reviews (This fixes the review crash!)
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating integer;

-- 2. Add the missing customer_phone column to bookings (This fixes the booking crash!)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone text;

-- 3. Run the Reputation Auto-Update Trigger
CREATE OR REPLACE FUNCTION public.update_salon_rating()
RETURNS TRIGGER AS $$
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
