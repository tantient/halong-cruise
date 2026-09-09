-- 1. presentation grouping + composition keys for existing services
with s as (select id from public.ships where slug = 'chronos')
update public.services v
set highlights = jsonb_set(jsonb_set(coalesce(v.highlights,'{}'::jsonb), '{group}', to_jsonb(m.grp)), '{composition}', to_jsonb(m.comp)),
    translations = case when v.translations ? 'vi'
      then jsonb_set(jsonb_set(v.translations, '{vi,highlights,group}', to_jsonb(m.grp)), '{vi,highlights,composition}', to_jsonb(m.comp))
      else v.translations end,
    sort_order = m.ord,
    updated_at = now()
from (values
  ('dining','experience','editorial',1),
  ('sundeck','experience','panorama',2),
  ('spa','experience','intimate',3),
  ('entertainment','experience','nocturne',4),
  ('public-spaces','ship','spaces',5),
  ('exterior','ship','architecture',6)
) as m(slug,grp,comp,ord)
where v.slug = m.slug and v.ship_id = (select id from s);

-- 2. new editorial pages
insert into public.ship_pages (ship_id, slug, title, intro, seo_title, seo_description, status, published_at, sort_order, translations)
select s.id, 'experiences',
  'Life aboard Chronos',
  'A day aboard Chronos moves with the water and the light — from breakfast beside the glass to the last cocktail under the bay''s night sky.',
  'Experiences aboard Chronos Cruise',
  'Dining, sundeck and infinity pool, spa and evening life aboard Chronos Cruise in Lan Ha Bay.',
  'published', now(), 8,
  jsonb_build_object(
    'en', jsonb_build_object(
      'heroEyebrow','LIFE ABOARD',
      'closingTitle','Your time aboard begins with a voyage',
      'closingBody','Choose the rhythm of your journey, and our team will shape the days around it.'
    ),
    'vi', jsonb_build_object(
      'title','Đời sống trên Chronos',
      'intro','Một ngày trên Chronos trôi theo mặt nước và ánh sáng — từ bữa sáng bên vách kính đến ly cocktail cuối cùng dưới trời đêm của vịnh.',
      'seo_title','Trải nghiệm trên Chronos Cruise',
      'seo_description','Ẩm thực, sundeck và hồ bơi vô cực, spa và đời sống về đêm trên Chronos Cruise giữa vịnh Lan Hạ.',
      'heroEyebrow','ĐỜI SỐNG TRÊN TÀU',
      'closingTitle','Thời gian của bạn bắt đầu từ một hành trình',
      'closingBody','Chọn nhịp hành trình bạn muốn, đội ngũ của chúng tôi sẽ sắp đặt từng ngày quanh nhịp đó.'
    )
  )
from public.ships s where s.slug = 'chronos'
on conflict (ship_id, slug) do nothing;

insert into public.ship_pages (ship_id, slug, title, intro, seo_title, seo_description, status, published_at, sort_order, translations)
select s.id, 'the-ship',
  'Meet Chronos',
  'A modern yacht silhouette on a heritage bay, built around glass, open decks and the horizon.',
  'The Ship — Chronos Cruise',
  'Discover Chronos Cruise: yacht exterior, grand lobby and public spaces, open decks and {total} sea-facing cabins.',
  'published', now(), 9,
  jsonb_build_object(
    'en', jsonb_build_object(
      'heroEyebrow','THE SHIP',
      'meetTitle','Meet Chronos',
      'meetBody','Chronos was designed as a yacht rather than a floating hotel: glass along the waterline, terraced decks and interiors that keep the bay in view from every space on board.',
      'cabinsTitle','{total} cabins',
      'cabinsBody','Every cabin faces the sea, and each category offers its own way of experiencing the bay.',
      'closingTitle','Explore Chronos',
      'closingBody','See how the ship is lived in, then choose the voyage that suits your time.'
    ),
    'vi', jsonb_build_object(
      'title','Khám phá Chronos',
      'intro','Dáng du thuyền hiện đại trên một vịnh di sản, được dựng quanh vách kính, boong mở và đường chân trời.',
      'seo_title','Du thuyền — Chronos Cruise',
      'seo_description','Khám phá Chronos Cruise: ngoại thất du thuyền, sảnh chính và không gian chung, boong mở và {total} phòng hướng biển.',
      'heroEyebrow','DU THUYỀN',
      'meetTitle','Khám phá Chronos',
      'meetBody','Chronos được thiết kế như một du thuyền chứ không phải khách sạn nổi: vách kính chạy dọc thân tàu, các tầng boong lùi dần và nội thất luôn giữ vịnh trong tầm mắt.',
      'cabinsTitle','{total} phòng nghỉ',
      'cabinsBody','Mọi phòng đều hướng biển, mỗi hạng phòng mang một cách cảm nhận vịnh riêng.',
      'closingTitle','Khám phá Chronos',
      'closingBody','Xem đời sống trên tàu, rồi chọn hành trình phù hợp với thời gian của bạn.'
    )
  )
from public.ships s where s.slug = 'chronos'
on conflict (ship_id, slug) do nothing;