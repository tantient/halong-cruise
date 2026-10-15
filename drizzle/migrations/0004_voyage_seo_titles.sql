-- Per-voyage Vietnamese SEO titles for the two itinerary detail pages.
-- Complete titles (no title_template suffix): keyword-optimized like the
-- itineraries index, targeting "du thuyền Hạ Long" + voyage length.

update itineraries
set translations = jsonb_set(
  coalesce(translations, '{}'::jsonb),
  '{vi,seo_title}',
  '"Du thuyền Hạ Long – Lan Hạ 2 ngày 1 đêm | Chronos Cruise"'::jsonb
)
where slug = '2d1n-ha-long';

update itineraries
set translations = jsonb_set(
  coalesce(translations, '{}'::jsonb),
  '{vi,seo_title}',
  '"Du thuyền Hạ Long – Lan Hạ 3 ngày 2 đêm | Chronos Cruise"'::jsonb
)
where slug = '3d2n-ha-long-lan-ha';
