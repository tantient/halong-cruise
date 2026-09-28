ALTER TABLE public.cabins
  ADD COLUMN IF NOT EXISTS quantity integer,
  ADD COLUMN IF NOT EXISTS double_quantity integer,
  ADD COLUMN IF NOT EXISTS twin_quantity integer,
  ADD COLUMN IF NOT EXISTS deck_distribution jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS extra_bed_allowed boolean,
  ADD COLUMN IF NOT EXISTS connecting_room_available boolean;

ALTER TABLE public.cabins
  ADD CONSTRAINT cabins_quantities_nonneg CHECK (
    (quantity IS NULL OR quantity >= 0) AND (double_quantity IS NULL OR double_quantity >= 0) AND (twin_quantity IS NULL OR twin_quantity >= 0)
  ),
  ADD CONSTRAINT cabins_bed_split_matches_quantity CHECK (
    quantity IS NULL OR double_quantity IS NULL OR twin_quantity IS NULL OR double_quantity + twin_quantity = quantity
  ),
  ADD CONSTRAINT cabins_deck_distribution_array CHECK (jsonb_typeof(deck_distribution) = 'array');

COMMENT ON COLUMN public.cabins.quantity IS 'Physical cabins of this category aboard.';
COMMENT ON COLUMN public.cabins.deck_distribution IS 'Known deck split: [{"deck":"2","double":1,"twin":9}].';
COMMENT ON COLUMN public.cabins.extra_bed_allowed IS 'true/false = confirmed, null = not confirmed.';
COMMENT ON COLUMN public.cabins.connecting_room_available IS 'true = confirmed available, false = confirmed unavailable, null = not yet confirmed.';