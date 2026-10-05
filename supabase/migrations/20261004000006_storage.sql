-- Migration 006: Storage configuration

-- Create storage bucket for review photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects
-- Note: 'storage.objects' policies define who can access/upload files

-- Anyone can read from 'review-photos' bucket
DROP POLICY IF EXISTS "Public can view review photos" ON storage.objects;
CREATE POLICY "Public can view review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Authenticated users can upload to 'review-photos' bucket
DROP POLICY IF EXISTS "Users can upload review photos" ON storage.objects;
CREATE POLICY "Users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'review-photos' 
    AND auth.uid() IS NOT NULL
);

-- Users can delete their own uploaded photos or Admins can delete any
DROP POLICY IF EXISTS "Users can delete own review photos" ON storage.objects;
CREATE POLICY "Users can delete own review photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'review-photos' 
    AND (auth.uid() = owner OR public.is_admin())
);
