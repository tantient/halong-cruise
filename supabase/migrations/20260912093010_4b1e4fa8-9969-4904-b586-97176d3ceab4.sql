UPDATE public.ship_settings
SET google_maps = 'https://www.google.com/maps/search/?api=1&query=Lots%2030-31%2C%20Tuan%20Chau%20International%20Passenger%20Port%2C%20Ha%20Long%2C%20Quang%20Ninh%2C%20Vietnam';

UPDATE public.ship_pages
SET translations = jsonb_set(
  jsonb_set(
    (translations - 'en') || jsonb_build_object('en',
      ((translations->'en') - 'hours_value' - 'form_title' - 'form_subtitle')
      || jsonb_build_object('map_embed', 'https://www.google.com/maps?q=Lots%2030-31%2C%20Tuan%20Chau%20International%20Passenger%20Port%2C%20Ha%20Long%2C%20Quang%20Ninh%2C%20Vietnam&output=embed')
    ),
    '{vi}',
    ((translations->'vi') - 'hours_value' - 'form_title' - 'form_subtitle')
    || jsonb_build_object(
      'map_embed', 'https://www.google.com/maps?q=Lots%2030-31%2C%20Tuan%20Chau%20International%20Passenger%20Port%2C%20Ha%20Long%2C%20Quang%20Ninh%2C%20Vietnam&output=embed',
      'content', E'Đội ngũ tư vấn sẵn sàng hỗ trợ bạn 24/7 qua điện thoại, Zalo, WhatsApp hoặc email.\n\nĐiểm đón tiếp khách: Lô 30–31, Cảng tàu khách quốc tế Tuần Châu, Hạ Long, Quảng Ninh, Việt Nam.',
      'seo_description', 'Liên hệ Chronos Cruise: hotline, Zalo, WhatsApp, email và bản đồ điểm đón tiếp khách tại Cảng tàu khách quốc tế Tuần Châu, Hạ Long.'
    )
  ),
  '{en,seo_description}',
  '"Contact Chronos Cruise by hotline, Zalo, WhatsApp or email, and find our guest reception at Tuan Chau International Passenger Port, Ha Long."'::jsonb
)
WHERE slug = 'contact';