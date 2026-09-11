
-- 1. Arrival: secondary commercial CTA
UPDATE public.homepage_sections
SET translations = jsonb_set(
      jsonb_set(translations, '{en,cta_secondary}', '"Explore Voyages"'),
      '{vi,cta_secondary}', '"Khám phá hải trình"')
WHERE section_type = 'v2_arrival';

-- 2. Life on Chronos: experiences only + route to /experiences
UPDATE public.homepage_sections
SET configuration = jsonb_set(configuration, '{slots}', '[
      {"service":"dining"},
      {"service":"bars-lounges"},
      {"service":"pool"},
      {"service":"spa-wellness"}
    ]'::jsonb),
    translations = jsonb_set(
      jsonb_set(translations, '{en,cta_all}', '"View all experiences"'),
      '{vi,cta_all}', '"Xem tất cả trải nghiệm"'),
    position = 4
WHERE section_type = 'v2_life';

-- 3. Positions of the narrative
UPDATE public.homepage_sections SET position = 6 WHERE section_type = 'v2_signature';
UPDATE public.homepage_sections SET position = 7 WHERE section_type = 'v2_final';
UPDATE public.homepage_sections
SET translations = jsonb_set(jsonb_set(translations, '{en,chapter}', '"IV"'), '{vi,chapter}', '"IV"')
WHERE section_type = 'v2_signature';
UPDATE public.homepage_sections
SET translations = jsonb_set(jsonb_set(translations, '{en,chapter}', '"III"'), '{vi,chapter}', '"III"')
WHERE section_type = 'v2_life';

-- 4. Suites chapter
INSERT INTO public.homepage_sections (ship_id, section_type, position, status, enabled, published_at, configuration, translations)
SELECT s.id, 'v2_suites', 3, 'published', true, now(), '{}'::jsonb, jsonb_build_object(
  'en', jsonb_build_object(
    'chapter', 'II',
    'time_label', 'Suites',
    'title', 'Five ways',
    'title_accent', 'to stay',
    'body', 'Every category faces the water. The difference is space, layout and how much of the bay belongs to your room.',
    'cta', 'Explore all suites'),
  'vi', jsonb_build_object(
    'chapter', 'II',
    'time_label', 'Phòng nghỉ',
    'title', 'Năm cách',
    'title_accent', 'để ở lại',
    'body', 'Mọi hạng phòng đều hướng ra mặt nước. Khác nhau ở diện tích, bố cục và phần vịnh thuộc về khung cửa của bạn.',
    'cta', 'Khám phá hạng phòng'))
FROM public.ships s WHERE s.slug = 'chronos'
ON CONFLICT DO NOTHING;

-- 5. Offers chapter
INSERT INTO public.homepage_sections (ship_id, section_type, position, status, enabled, published_at, configuration, translations)
SELECT s.id, 'v2_offers', 5, 'published', true, now(), '{}'::jsonb, jsonb_build_object(
  'en', jsonb_build_object(
    'chapter', 'IV',
    'time_label', 'Offers',
    'title', 'Reasons',
    'title_accent', 'to come now',
    'body', 'A few arrangements currently open on board.',
    'cta', 'View all offers'),
  'vi', jsonb_build_object(
    'chapter', 'IV',
    'time_label', 'Ưu đãi',
    'title', 'Lý do',
    'title_accent', 'để đến lúc này',
    'body', 'Một vài ưu đãi đang mở trên tàu.',
    'cta', 'Xem tất cả ưu đãi'))
FROM public.ships s WHERE s.slug = 'chronos'
ON CONFLICT DO NOTHING;

-- 6. Retire legacy homepage blocks that no code path renders any more
UPDATE public.homepage_sections
SET enabled = false, status = 'draft'
WHERE section_type IN ('recruit_teaser', 'gallery', 'quote_form');
