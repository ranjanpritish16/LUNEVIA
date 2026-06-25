-- Create a public bucket for salon covers if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('salon-covers', 'salon-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;
