-- 1. Stable machine keys in cabin_details.group_name (currently mirrors content_type)
UPDATE public.cabin_details SET group_name = CASE
  WHEN content_type = 'spec' AND label = 'Technical code' THEN 'code'
  WHEN content_type = 'spec' AND label IN ('Total private area', 'Area') THEN 'area'
  WHEN content_type = 'spec' AND label = 'Area note' THEN 'area_note'
  WHEN content_type = 'spec' AND label = 'View' THEN 'view'
  WHEN content_type = 'spec' AND label = 'Rooms of this type aboard' THEN 'room_count'
  WHEN content_type = 'spec' AND label = 'Capacity' THEN 'capacity'
  WHEN content_type = 'spec' AND label = 'Bed configuration' THEN 'bed'
  WHEN content_type = 'spec' AND label = 'Deck' THEN 'deck'
  ELSE content_type
END;

-- 2. Cabins index page copy (brand content; UI labels stay in translation files)
INSERT INTO public.ship_pages (ship_id, slug, title, intro, seo_title, seo_description, status, published_at, sort_order, translations)
SELECT s.id, 'cabins', 'Cabins',
  '{total} sea-facing cabins, each category offering its own way of experiencing Ha Long.',
  'Cabins aboard Chronos Cruise | Bay-view suites and cabins',
  '44 sea-facing cabins aboard Chronos Cruise: Owner''s Suite, Grand Suite and Junior Suite - bay-facing design and six-star comfort on Ha Long Bay.',
  'published', now(), 3,
  jsonb_build_object(
    'en', jsonb_build_object(
      'hero_title', 'Sleep in the heart of the bay',
      'hero_subtitle', '{total} sea-facing cabins, each category offering its own way of experiencing Ha Long.',
      'hero_alt', 'Cabins aboard Chronos Cruise',
      'list_title', 'Cabin categories, {total} cabins',
      'list_subtitle', 'Every cabin faces the sea and can be arranged with one double bed or two twin beds on request.',
      'junior_note', 'Junior Suite type A and type B have different maximum occupancies. The exact figure is confirmed per individual cabin at the time of selection rather than applied to the Junior Suite group as a whole.',
      'cta_title', 'Find the cabin that fits you',
      'cta_subtitle', 'Leave your details and our team will advise on cabins and pricing within 24 hours.',
      'detail_cta_title', 'Interested in this cabin?',
      'detail_cta_subtitle', 'Leave your details and our team will advise and quote within 24 hours.',
      'plan_hint', 'The plan illustrates the relative proportions of each area; the actual layout may vary depending on the cabin''s position aboard.'
    ),
    'vi', jsonb_build_object(
      'title', 'Phòng nghỉ',
      'intro', '{total} phòng nghỉ hướng biển, mỗi hạng phòng là một cách cảm nhận khác nhau về Hạ Long.',
      'seo_title', 'Phòng nghỉ Chronos Cruise | Suite & cabin hướng vịnh',
      'seo_description', '44 phòng nghỉ hướng biển trên Chronos Cruise: Owner''s Suite, Grand Suite và Junior Suite - thiết kế hướng vịnh, tiện nghi 6 sao trên vịnh Hạ Long.',
      'hero_title', 'Giấc ngủ giữa lòng vịnh',
      'hero_subtitle', '{total} phòng nghỉ hướng biển, mỗi hạng phòng là một cách cảm nhận khác nhau về Hạ Long.',
      'hero_alt', 'Phòng nghỉ trên Chronos Cruise',
      'list_title', 'Các hạng phòng, {total} lựa chọn',
      'list_subtitle', 'Tất cả các phòng đều hướng biển, sử dụng 1 giường đôi hoặc 2 giường đơn tuỳ yêu cầu của khách.',
      'junior_note', 'Junior Suite loại A và loại B có sức chứa khác nhau. Số khách tối đa của từng phòng cụ thể sẽ được xác nhận khi bạn chọn phòng, không áp dụng chung một con số cho cả nhóm Junior Suite.',
      'cta_title', 'Chọn phòng phù hợp với bạn',
      'cta_subtitle', 'Để lại thông tin, đội ngũ Chronos sẽ tư vấn hạng phòng và báo giá trong 24 giờ.',
      'detail_cta_title', 'Quan tâm hạng phòng này?',
      'detail_cta_subtitle', 'Để lại thông tin, đội ngũ Chronos sẽ tư vấn và báo giá trong 24 giờ.',
      'plan_hint', 'Sơ đồ mang tính minh hoạ tỷ lệ tương đối giữa các khu vực trong phòng; bố trí thực tế có thể thay đổi theo vị trí phòng trên tàu.'
    )
  )
FROM public.ships s
WHERE s.slug = 'chronos'
ON CONFLICT (ship_id, slug) DO NOTHING;
