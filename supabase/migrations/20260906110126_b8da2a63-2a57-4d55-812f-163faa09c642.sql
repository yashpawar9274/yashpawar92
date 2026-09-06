CREATE TABLE public.work_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL DEFAULT 'post_creative',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  media_type text NOT NULL DEFAULT 'image',
  storage_path text,
  external_url text,
  alt text NOT NULL DEFAULT '',
  aspect text NOT NULL DEFAULT '1 / 1',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.work_items TO anon;
GRANT SELECT ON public.work_items TO authenticated;
GRANT ALL ON public.work_items TO service_role;

ALTER TABLE public.work_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read work items"
  ON public.work_items FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.touch_work_items_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_work_items_updated_at
BEFORE UPDATE ON public.work_items
FOR EACH ROW EXECUTE FUNCTION public.touch_work_items_updated_at();

CREATE INDEX work_items_category_sort_idx ON public.work_items (category, sort_order, created_at DESC);