ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS show_in_gallery boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gallery_category text,
  ADD COLUMN IF NOT EXISTS gallery_display_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS media_gallery_idx
  ON public.media (ship_id, show_in_gallery, gallery_category, gallery_display_order);

-- Chronos curation: map existing library categories onto the public gallery groups.
UPDATE public.media m SET
  show_in_gallery = true,
  gallery_display_order = m.sort_order,
  gallery_category = CASE
    WHEN m.category = 'cabin' THEN 'suites'
    WHEN m.category IN ('dining','restaurant') THEN 'dining'
    WHEN m.category IN ('entertainment','wellness') THEN 'experiences'
    WHEN m.storage_path LIKE '%pool%' OR m.storage_path LIKE '%jacuzzi%' OR m.storage_path LIKE '%spa%' THEN 'experiences'
    WHEN m.storage_path LIKE '%deck-sunset%' THEN 'life_on_board'
    ELSE 'ship'
  END
WHERE m.ship_id = (SELECT id FROM public.ships WHERE slug = 'chronos')
  AND m.category IN ('exterior','deck','public','dining','restaurant','entertainment','wellness','cabin');

UPDATE public.media
SET show_in_gallery = true, gallery_category = 'life_on_board', gallery_display_order = sort_order
WHERE ship_id = (SELECT id FROM public.ships WHERE slug = 'chronos')
  AND storage_path = 'chronos/general/chronos-gallery-sundeck.webp';
