CREATE TABLE public.portfolio_assets (
  asset_key text PRIMARY KEY CHECK (asset_key IN ('profile_image', 'resume')),
  storage_path text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_assets TO anon, authenticated;
GRANT ALL ON public.portfolio_assets TO service_role;

ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read portfolio assets"
  ON public.portfolio_assets FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.touch_portfolio_assets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_portfolio_assets_updated_at
BEFORE UPDATE ON public.portfolio_assets
FOR EACH ROW EXECUTE FUNCTION public.touch_portfolio_assets_updated_at();
