-- 1. Vietnamese highlight list was stored under a different key than the
--    default-language column ("items" vs "highlights"); unify it so the
--    localization resolver merges it like every other field.
UPDATE public.itineraries
SET translations = jsonb_set(
      translations,
      '{vi,highlights}',
      (translations #> '{vi,highlights}')
        || jsonb_build_object('highlights', translations #> '{vi,highlights,items}')
        - 'items'
    )
WHERE translations #> '{vi,highlights,items}' IS NOT NULL;

-- 2. Editorial copy of the itineraries index page (brand content -> database).
INSERT INTO public.ship_pages (ship_id, slug, title, intro, seo_title, seo_description, status, published_at, sort_order, translations)
SELECT
  s.id,
  'itineraries',
  'Choose your voyage',
  'From a short escape to a deeper exploration of Ha Long Bay and Lan Ha Bay.',
  'Chronos Cruise itineraries | 2D1N & 3D2N Ha Long - Lan Ha',
  'Chronos six-star cruise itineraries: two days one night, three days two nights and a short sunset voyage across Ha Long - Lan Ha Bay.',
  'published',
  now(),
  40,
  jsonb_build_object(
    'en', jsonb_build_object(
      'eyebrow', 'ITINERARIES',
      'heroAlt', 'Chronos Cruise itineraries',
      'ctaTitle', 'Need a private itinerary?',
      'ctaBody', 'The Chronos team will design a voyage around your schedule, destinations, dining and service preferences.',
      'ctaLabel', 'Tailor an itinerary'
    ),
    'vi', jsonb_build_object(
      'title', 'Chọn hành trình của bạn',
      'intro', 'Từ chuyến đi ngắn ngày đến hành trình khám phá sâu hơn giữa vịnh Hạ Long – Lan Hạ.',
      'seo_title', 'Hải trình Chronos Cruise | 2N1Đ & 3N2Đ Hạ Long - Lan Hạ',
      'seo_description', 'Các hải trình du thuyền 6 sao Chronos: 2 ngày 1 đêm, 3 ngày 2 đêm và chuyến đi ngắn ngắm hoàng hôn giữa vịnh Hạ Long - Lan Hạ.',
      'eyebrow', 'HẢI TRÌNH',
      'heroAlt', 'Hải trình Chronos Cruise',
      'ctaTitle', 'Cần hải trình riêng?',
      'ctaBody', 'Đội ngũ Chronos sẽ thiết kế hành trình theo yêu cầu của bạn: thời gian, điểm đến, ẩm thực và dịch vụ đi kèm.',
      'ctaLabel', 'Tư vấn hải trình'
    )
  )
FROM public.ships s
WHERE s.slug = 'chronos'
ON CONFLICT (ship_id, slug) DO NOTHING;