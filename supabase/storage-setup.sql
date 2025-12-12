-- Supabase Storage Setup for Photos and Voice Notes
-- Run this in Supabase SQL Editor

-- Enable storage (if not already enabled)
-- This is usually enabled by default, but just in case

-- Create storage buckets via SQL is not recommended
-- Instead, use the Supabase Dashboard:
-- 1. Go to Storage in the left sidebar
-- 2. Click "Create a new bucket"
-- 3. Create two buckets:
--    - Name: "photos" (Public bucket)
--    - Name: "voice-notes" (Public bucket)

-- After creating buckets via Dashboard, run these policies:

-- Photos bucket policies
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'photos' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);

-- Voice notes bucket policies
CREATE POLICY "Users can upload their own voice notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-notes' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own voice notes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'voice-notes' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own voice notes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-notes' AND
  auth.jwt()->>'sub' = (storage.foldername(name))[1]
);
