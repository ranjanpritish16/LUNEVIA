-- Create a function to update salon rating and review count
CREATE OR REPLACE FUNCTION public.update_salon_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the salon with the new average rating and count
  UPDATE public.salons
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1) 
      FROM public.reviews 
      WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id)
    )
  WHERE id = COALESCE(NEW.salon_id, OLD.salon_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to prevent duplicates
DROP TRIGGER IF EXISTS trigger_update_salon_rating ON public.reviews;

-- Create the trigger that runs after every insert, update, or delete on reviews
CREATE TRIGGER trigger_update_salon_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_salon_rating();
