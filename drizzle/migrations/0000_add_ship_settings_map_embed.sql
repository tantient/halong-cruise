ALTER TABLE public.ship_settings
  ADD COLUMN IF NOT EXISTS map_embed text;

COMMENT ON COLUMN public.ship_settings.map_embed IS 'Embeddable map URL for the guest reception address; single source of truth together with address and google_maps.';