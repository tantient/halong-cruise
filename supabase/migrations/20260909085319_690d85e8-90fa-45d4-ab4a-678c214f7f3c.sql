DO $$
DECLARE
  v_ship uuid;
  v_id uuid;
  r record;
  i int;
BEGIN
  SELECT id INTO v_ship FROM public.ships WHERE slug = 'chronos';

  DELETE FROM public.homepage_sections WHERE ship_id = v_ship AND section_type LIKE 'exp_%';

  FOR r IN
    SELECT * FROM (VALUES
      ('exp_opening', 10, '{"en":{"tagline":"A JOURNEY THROUGH TIME","title":"CHRONOS","title_accent":"CRUISE","subtitle":"One day on Ha Long Bay, measured in light.","cta":"Begin"},"vi":{"tagline":"HÀNH TRÌNH CỦA THỜI GIAN","title":"CHRONOS","title_accent":"CRUISE","subtitle":"Một ngày trên vịnh Hạ Long, đo bằng ánh sáng.","cta":"Bắt đầu"}}'::jsonb, ARRAY[]::text[]),
      ('exp_dawn', 20, '{"en":{"time_label":"DAWN","chapter":"01","title":"The Journey","title_accent":"Begins","body":"The bay wakes slowly. The water is still, the limestone stays grey, and Chronos moves out into a morning that belongs only to those on board.","note":"Ha Long Bay – Lan Ha Bay"},"vi":{"time_label":"BÌNH MINH","chapter":"01","title":"Hành trình","title_accent":"bắt đầu","body":"Vịnh thức giấc rất chậm. Mặt nước lặng, những khối đá vôi còn xám, và Chronos rời bến vào một buổi sáng chỉ thuộc về những người trên tàu.","note":"Vịnh Hạ Long – Lan Hạ"}}'::jsonb, ARRAY['chronos/hero/chronos-slide-2.webp','chronos/exterior/chronos-exterior-01-v2.webp','chronos/activity/chronos-deck-terrace.webp']),
      ('exp_ship', 30, '{"en":{"time_label":"MORNING","chapter":"02","title":"Architecture","title_accent":"on Water","body":"Chronos reads as one continuous space: light, warm stone tones and open horizons carried from the lobby to the highest deck.","note":"On board"},"vi":{"time_label":"BUỔI SÁNG","chapter":"02","title":"Kiến trúc","title_accent":"trên mặt nước","body":"Chronos là một không gian liền mạch: ánh sáng, sắc đá ấm và những đường chân trời mở, kéo từ khu tiền sảnh lên tới boong cao nhất.","note":"Trên tàu"}}'::jsonb, ARRAY['chronos/exterior/chronos-exterior-03-v2.webp','chronos/exterior/chronos-exterior-05.webp','chronos/general/chronos-public-stair.webp','chronos/general/chronos-public-lobby-01.webp']),
      ('exp_suites', 40, '{"en":{"time_label":"DAY","chapter":"03","title":"Suites","title_accent":"for Slow Hours","body":"Every suite is turned toward the water. Choose the space that fits the pace of your day.","cta":"View suite"},"vi":{"time_label":"BAN NGÀY","chapter":"03","title":"Phòng nghỉ","title_accent":"cho những giờ chậm","body":"Mỗi phòng đều hướng ra mặt nước. Chọn không gian phù hợp với nhịp ngày của bạn.","cta":"Xem phòng"}}'::jsonb, ARRAY['chronos/cabin/chronos-gallery-suite.webp']),
      ('exp_voyage', 50, '{"en":{"time_label":"AFTERNOON","chapter":"04","title":"The Voyage","title_accent":"Unfolds","body":"The bay arrives in chapters: departure, open water, quiet anchorage.","cta":"View voyage"},"vi":{"time_label":"BUỔI CHIỀU","chapter":"04","title":"Hành trình","title_accent":"mở ra","body":"Vịnh hiện dần theo từng chương: rời bến, ra vùng nước rộng, rồi neo lại trong tĩnh lặng.","cta":"Xem hải trình"}}'::jsonb, ARRAY['chronos/exterior/chronos-exterior-06.webp']),
      ('exp_golden', 60, '{"en":{"time_label":"GOLDEN HOUR","chapter":"05","title":"Experiences","title_accent":"in Warm Light","body":"As the light turns, the ship turns with it — the table, the water, the open deck.","cta":"Discover"},"vi":{"time_label":"GIỜ VÀNG","chapter":"05","title":"Trải nghiệm","title_accent":"trong ánh sáng ấm","body":"Khi ánh sáng chuyển màu, con tàu chuyển cùng nó — bàn ăn, mặt nước, boong mở.","cta":"Khám phá"}}'::jsonb, ARRAY['chronos/activity/chronos-deck-sunset-02.webp']),
      ('exp_night', 70, '{"en":{"time_label":"NIGHT","chapter":"06","title":"After","title_accent":"Dark","body":"The bay goes quiet. Low light in the lounge, the last hour of the day held on deck.","cta":"Enter the gallery"},"vi":{"time_label":"ĐÊM","chapter":"06","title":"Khi màn đêm","title_accent":"xuống","body":"Vịnh trở nên tĩnh. Ánh sáng dịu trong lounge, giờ cuối của một ngày được giữ lại trên boong.","cta":"Vào thư viện ảnh"}}'::jsonb, ARRAY['chronos/activity/chronos-deck-sunset-01.webp','chronos/activity/chronos-ent-lounge.webp','chronos/activity/chronos-ent-cigar-01.webp','chronos/restaurant/chronos-dining-panorama-02.webp']),
      ('exp_final', 80, '{"en":{"time_label":"","title":"YOUR TIME","title_accent":"BEGINS HERE","body":"Ha Long Bay – Lan Ha Bay.","cta":"Explore Voyages","cta_secondary":"Request Your Journey"},"vi":{"time_label":"","title":"THỜI GIAN CỦA BẠN","title_accent":"BẮT ĐẦU TỪ ĐÂY","body":"Vịnh Hạ Long – Lan Hạ.","cta":"Khám phá hải trình","cta_secondary":"Nhận tư vấn hành trình"}}'::jsonb, ARRAY['chronos/hero/chronos-hero-real.webp','chronos/exterior/chronos-exterior-07.webp'])
    ) AS t(section_type, position, translations, paths)
  LOOP
    INSERT INTO public.homepage_sections (ship_id, section_type, position, enabled, configuration, status, published_at, translations)
    VALUES (v_ship, r.section_type, r.position, true, '{}'::jsonb, 'published', now(), r.translations)
    RETURNING id INTO v_id;

    FOR i IN 1 .. coalesce(array_length(r.paths, 1), 0) LOOP
      INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
      SELECT v_ship, m.id, 'homepage_section', v_id, CASE WHEN i = 1 THEN 'cover' ELSE 'gallery' END, i
      FROM public.media m
      WHERE m.ship_id = v_ship AND m.storage_path = r.paths[i];
    END LOOP;
  END LOOP;
END $$;