UPDATE public.media
SET show_in_gallery = true,
    gallery_category = 'ship',
    gallery_display_order = CASE storage_path
      WHEN 'chronos/exterior/chronos-exterior-07.webp' THEN 3
      WHEN 'chronos/exterior/chronos-exterior-01-v2.webp' THEN 4
      WHEN 'chronos/exterior/chronos-exterior-02-v2.webp' THEN 5
      WHEN 'chronos/exterior/chronos-exterior-05.webp' THEN 6
      WHEN 'chronos/exterior/chronos-exterior-06.webp' THEN 7
      WHEN 'chronos/exterior/chronos-exterior-03-v2.webp' THEN 8
      WHEN 'chronos/exterior/chronos-exterior-04-v2.webp' THEN 9
      ELSE gallery_display_order END
WHERE storage_path IN (
  'chronos/exterior/chronos-exterior-01-v2.webp',
  'chronos/exterior/chronos-exterior-02-v2.webp',
  'chronos/exterior/chronos-exterior-03-v2.webp',
  'chronos/exterior/chronos-exterior-04-v2.webp',
  'chronos/exterior/chronos-exterior-05.webp',
  'chronos/exterior/chronos-exterior-06.webp',
  'chronos/exterior/chronos-exterior-07.webp'
);

INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT m.ship_id, m.id, 'ship', m.ship_id, 'gallery', m.gallery_display_order
FROM public.media m
WHERE m.storage_path IN (
  'chronos/exterior/chronos-exterior-01-v2.webp',
  'chronos/exterior/chronos-exterior-02-v2.webp',
  'chronos/exterior/chronos-exterior-03-v2.webp',
  'chronos/exterior/chronos-exterior-04-v2.webp',
  'chronos/exterior/chronos-exterior-05.webp',
  'chronos/exterior/chronos-exterior-06.webp',
  'chronos/exterior/chronos-exterior-07.webp'
)
AND NOT EXISTS (
  SELECT 1 FROM public.entity_media em
  WHERE em.media_id = m.id AND em.entity_type = 'ship' AND em.entity_id = m.ship_id AND em.usage = 'gallery'
);