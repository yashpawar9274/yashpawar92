-- Table for admin-added OMVH creative uploads
CREATE TABLE public.omvh_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Case Study Creative',
  caption TEXT NOT NULL,
  alt TEXT NOT NULL,
  aspect TEXT NOT NULL DEFAULT '1 / 1',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.omvh_uploads TO anon, authenticated;
GRANT ALL ON public.omvh_uploads TO service_role;

ALTER TABLE public.omvh_uploads ENABLE ROW LEVEL SECURITY;

-- Everyone can read the gallery
CREATE POLICY "Public can read OMVH uploads"
  ON public.omvh_uploads FOR SELECT
  USING (true);

-- Writes go through server functions using the service role only.

-- Allow public read of files in the omvh-uploads bucket so the site can
-- render them without signed URLs. Writes still require service role.
CREATE POLICY "Public can read omvh-uploads files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'omvh-uploads');