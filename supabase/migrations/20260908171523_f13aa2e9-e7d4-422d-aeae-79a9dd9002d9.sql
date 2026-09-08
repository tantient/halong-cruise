-- 1. Contact / recruitment settings
UPDATE public.ship_settings s
SET recruit_email = 'vanpham@chronoscruise.com',
    google_maps = COALESCE(google_maps, 'https://www.openstreetmap.org/?mlat=20.9490&mlon=107.0670#map=15/20.9490/107.0670')
FROM public.ships sh
WHERE sh.id = s.ship_id AND sh.slug = 'chronos';

-- 2. Gallery grouping lives in media.category so the gallery page is data-driven
UPDATE public.media SET category = 'exterior' WHERE storage_path ILIKE '%/chronos-exterior-%';
UPDATE public.media SET category = 'public' WHERE storage_path ILIKE '%/chronos-public-%';
UPDATE public.media SET category = 'dining' WHERE storage_path ILIKE '%/chronos-dining-%';
UPDATE public.media SET category = 'entertainment' WHERE storage_path ILIKE '%/chronos-ent-%';
UPDATE public.media SET category = 'wellness' WHERE storage_path ILIKE '%/chronos-spa-%';
UPDATE public.media SET category = 'deck' WHERE storage_path ILIKE '%/chronos-deck-%';
UPDATE public.media SET category = 'cabin'
WHERE storage_path ILIKE '%/chronos-bath-%'
   OR storage_path ILIKE '%/chronos-corridor%'
   OR storage_path ILIKE '%/chronos-deluxe-%'
   OR storage_path ILIKE '%/chronos-standard-%'
   OR storage_path ILIKE '%/chronos-suite-%';

-- 3. New editorial pages: offers, careers, gallery
INSERT INTO public.ship_pages (ship_id, slug, title, intro, seo_title, seo_description, status, published_at, sort_order, translations)
SELECT sh.id, v.slug, v.title, v.intro, v.seo_title, v.seo_description, 'published', now(), v.sort_order, v.translations
FROM public.ships sh
CROSS JOIN (VALUES
  ('offers',
   'Special packages now open',
   'Seasonal offers updated regularly so you can experience the cruise at the best value.',
   'Chronos Cruise offers | Seasonal packages on Ha Long - Lan Ha Bay',
   'Early bird, family and honeymoon packages aboard Chronos Cruise. Seasonal offers on Ha Long Bay and Lan Ha Bay voyages.',
   60,
   '{"en":{"eyebrow":"OFFERS","hero_alt":"Chronos Cruise offers","cta_title":"Need help choosing an offer?","cta_body":"Tell us your dates and party size and our team will recommend the package with the best value."},
     "vi":{"eyebrow":"ƯU ĐÃI","title":"Các gói đặc biệt đang mở","intro":"Những ưu đãi được cập nhật theo mùa, giúp bạn tận hưởng Chronos với giá trị tốt nhất.","hero_alt":"Ưu đãi Chronos Cruise","cta_title":"Cần tư vấn ưu đãi phù hợp?","cta_body":"Cho chúng tôi biết ngày đi và số khách, đội ngũ Chronos sẽ tư vấn gói ưu đãi có giá trị tốt nhất.","seo_title":"Ưu đãi Chronos Cruise | Các gói đặc biệt vịnh Hạ Long - Lan Hạ","seo_description":"Ưu đãi đặt sớm, gói gia đình và gói trăng mật trên Chronos Cruise. Các gói theo mùa cho hải trình vịnh Hạ Long - Lan Hạ."}}'::jsonb),
  ('careers',
   'Join Chronos',
   'Career opportunities aboard a six-star cruise in Ha Long Bay and Lan Ha Bay. Contact us directly via Zalo or email.',
   'Careers at Chronos Cruise | Onboard jobs in Ha Long Bay',
   'Open positions aboard Chronos Cruise: housekeeping, F&B, front office and guest experience roles in Ha Long Bay.',
   70,
   '{"en":{"eyebrow":"CAREERS","hero_alt":"Join the Chronos Cruise crew","openings_label":"OPEN POSITIONS","openings_title":"Now hiring","openings_subtitle":"Review the open roles and contact our HR team via Zalo or email below.","cta_label":"GET IN TOUCH","cta_title":"Can''t find the right role?","cta_subtitle":"Send your CV or message us on Zalo — our team will reply within 24 hours.","process_text":"Contact via Zalo/Email → Submit CV → Interview → Receive offer.","location_text":"Ha Long International Cruise Port, Ha Long City, Quang Ninh."},
     "vi":{"eyebrow":"TUYỂN DỤNG","title":"Gia nhập Chronos","intro":"Cơ hội làm việc trên du thuyền 6 sao tại vịnh Hạ Long – Lan Hạ. Liên hệ trực tiếp qua Zalo hoặc email.","hero_alt":"Gia nhập đội ngũ Chronos Cruise","openings_label":"VỊ TRÍ MỞ","openings_title":"Đang tuyển dụng","openings_subtitle":"Xem các vị trí đang tuyển và liên hệ bộ phận nhân sự qua Zalo hoặc email bên dưới.","cta_label":"LIÊN HỆ","cta_title":"Bạn chưa tìm thấy vị trí phù hợp?","cta_subtitle":"Gửi hồ sơ hoặc nhắn tin Zalo, đội ngũ Chronos sẽ phản hồi trong 24 giờ.","process_text":"Liên hệ qua Zalo/Email → Gửi CV → Phỏng vấn → Nhận offer.","location_text":"Cảng tàu khách quốc tế Hạ Long, TP. Hạ Long, Quảng Ninh.","seo_title":"Tuyển dụng Chronos Cruise | Việc làm trên du thuyền vịnh Hạ Long","seo_description":"Các vị trí đang tuyển trên Chronos Cruise: buồng phòng, nhà hàng, lễ tân và trải nghiệm khách tại vịnh Hạ Long."}}'::jsonb),
  ('gallery',
   'Chronos in every view',
   'Every detail is prepared for a perfect stay.',
   'Chronos Cruise gallery | Suites, dining and decks in photos',
   'Photo gallery of Chronos Cruise: exterior, public spaces, dining, entertainment, spa, decks and cabins.',
   80,
   '{"en":{"eyebrow":"SPACES","categories":[{"id":"exterior","label":"Cruise exterior"},{"id":"public","label":"Public spaces"},{"id":"dining","label":"Dining"},{"id":"entertainment","label":"Entertainment"},{"id":"wellness","label":"Spa & wellness"},{"id":"deck","label":"Decks & sundeck"},{"id":"cabin","label":"Cabins"}]},
     "vi":{"eyebrow":"KHÔNG GIAN","title":"Chronos qua từng góc nhìn","intro":"Từng chi tiết được chuẩn bị cho kỳ nghỉ hoàn hảo.","seo_title":"Thư viện ảnh Chronos Cruise | Phòng nghỉ, nhà hàng và boong tàu","seo_description":"Thư viện ảnh Chronos Cruise: ngoại thất, không gian chung, nhà hàng, giải trí, spa, boong tàu và phòng nghỉ.","categories":[{"id":"exterior","label":"Ngoại thất du thuyền"},{"id":"public","label":"Không gian chung"},{"id":"dining","label":"Nhà hàng & ẩm thực"},{"id":"entertainment","label":"Giải trí"},{"id":"wellness","label":"Spa & wellness"},{"id":"deck","label":"Boong & sundeck"},{"id":"cabin","label":"Phòng nghỉ"}]}}'::jsonb)
) AS v(slug, title, intro, seo_title, seo_description, sort_order, translations)
WHERE sh.slug = 'chronos'
ON CONFLICT (ship_id, slug) DO NOTHING;

-- 4. About page: features + core values in both languages
UPDATE public.ship_pages p
SET translations = COALESCE(p.translations, '{}'::jsonb)
  || jsonb_build_object(
      'en', COALESCE(p.translations->'en', '{}'::jsonb) ||
        '{"eyebrow":"ABOUT CHRONOS","hero_alt":"Chronos Cruise exterior",
          "features":[{"title":"{total} ocean-view suites","desc":"Private balcony, 270° vistas"},{"title":"Five-star dining","desc":"Daily fusion menus"},{"title":"Spa & wellness","desc":"Holistic treatments"},{"title":"24/7 service","desc":"Dedicated onboard butler"}],
          "values_label":"CORE VALUES","values_title":"Centered on our guests",
          "values":[{"title":"Quiet","desc":"Spaces and rhythms designed for genuine relaxation."},{"title":"Attentive","desc":"Every small request is noticed and handled promptly."},{"title":"Local","desc":"Dining, therapies and experiences rooted in bay culture."},{"title":"Sustainable","desc":"Operations that respect the sea-and-island ecosystem."}]}'::jsonb,
      'vi', COALESCE(p.translations->'vi', '{}'::jsonb) ||
        '{"eyebrow":"VỀ CHRONOS","hero_alt":"Ngoại thất Chronos Cruise",
          "features":[{"title":"{total} suite hướng biển","desc":"Ban công riêng, tầm nhìn 270°"},{"title":"Ẩm thực 5 sao","desc":"Thực đơn fusion theo ngày"},{"title":"Spa & wellness","desc":"Liệu trình chăm sóc toàn diện"},{"title":"Dịch vụ 24/7","desc":"Quản gia riêng trên tàu"}],
          "values_label":"GIÁ TRỊ CỐT LÕI","values_title":"Lấy khách làm trung tâm",
          "values":[{"title":"Yên tĩnh","desc":"Không gian và nhịp điệu được thiết kế để bạn thực sự thư giãn."},{"title":"Chu đáo","desc":"Mỗi yêu cầu nhỏ đều được ghi nhận và đáp ứng kịp thời."},{"title":"Bản địa","desc":"Ẩm thực, trị liệu và trải nghiệm gắn liền với văn hóa vịnh."},{"title":"Bền vững","desc":"Vận hành thân thiện với hệ sinh thái biển đảo."}]}'::jsonb)
FROM public.ships sh
WHERE sh.id = p.ship_id AND sh.slug = 'chronos' AND p.slug = 'about';

-- 5. Contact page: operational copy that belongs to page content
UPDATE public.ship_pages p
SET translations = COALESCE(p.translations, '{}'::jsonb)
  || jsonb_build_object(
      'en', COALESCE(p.translations->'en', '{}'::jsonb) ||
        '{"eyebrow":"CONTACT","subtitle":"Our concierge team is available 24/7 by phone, Zalo, WhatsApp or email.","hours_value":"Daily · 08:00 – 21:00","form_title":"Send us a message","form_subtitle":"Fill in the form below and our team will reply within 24 hours.","hero_alt":"Chronos Cruise exterior","map_embed":"https://www.openstreetmap.org/export/embed.html?bbox=107.0470%2C20.9390%2C107.0870%2C20.9590&layer=mapnik&marker=20.9490%2C107.0670"}'::jsonb,
      'vi', COALESCE(p.translations->'vi', '{}'::jsonb) ||
        '{"eyebrow":"LIÊN HỆ","subtitle":"Đội ngũ tư vấn sẵn sàng hỗ trợ bạn 24/7 qua điện thoại, Zalo, WhatsApp hoặc email.","hours_value":"Hàng ngày · 08:00 – 21:00","form_title":"Gửi tin nhắn cho chúng tôi","form_subtitle":"Điền thông tin bên dưới, Chronos sẽ phản hồi trong vòng 24 giờ.","hero_alt":"Ngoại thất Chronos Cruise"}'::jsonb)
FROM public.ships sh
WHERE sh.id = p.ship_id AND sh.slug = 'chronos' AND p.slug = 'contact';

-- 6. Cover images for the new pages
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT p.ship_id, m.id, 'ship_page', p.id, 'cover', 0
FROM (VALUES
  ('offers', '%/chronos-public-pool.webp'),
  ('careers', '%/chronos-exterior-01-v2.webp'),
  ('gallery', '%/chronos-exterior-02-v2.webp')
) AS v(slug, file)
JOIN public.ship_pages p ON p.slug = v.slug
JOIN public.ships sh ON sh.id = p.ship_id AND sh.slug = 'chronos'
JOIN public.media m ON m.ship_id = p.ship_id AND m.storage_path ILIKE v.file
WHERE TRUE
  AND NOT EXISTS (
    SELECT 1 FROM public.entity_media em
    WHERE em.entity_type = 'ship_page' AND em.entity_id = p.id AND em.usage = 'cover'
  );

-- 7. Public forms are server-only writes: no anonymous INSERT on job_applications
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.job_applications;
REVOKE INSERT ON public.job_applications FROM anon;
REVOKE INSERT ON public.job_applications FROM authenticated;
GRANT ALL ON public.job_applications TO service_role;
GRANT ALL ON public.leads TO service_role;