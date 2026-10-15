UPDATE public.ship_seo SET
  default_title = 'Halong Bay Cruise – Luxury Overnight Cruise | Chronos Cruise',
  default_description = 'Luxury Halong Bay cruise aboard Chronos: 2 days 1 night and 3 days 2 nights through Ha Long Bay and Lan Ha Bay, 44 bay-view suites, spa, pool and panoramic dining.',
  translations = jsonb_set(jsonb_set(translations, '{vi,default_title}', '"Du thuyền 5 sao Hạ Long – Lan Hạ nghỉ đêm | Chronos Cruise"'), '{vi,default_description}', '"Du thuyền Hạ Long 5 sao Chronos Cruise: hải trình 2 ngày 1 đêm và 3 ngày 2 đêm qua vịnh Hạ Long – Lan Hạ, 44 suite hướng vịnh, spa, hồ bơi và nhà hàng panorama."'),
  updated_at = now()
WHERE id = '43931a80-3eef-4cb7-8e97-ee08eac2bdf8';

UPDATE public.ship_pages SET
  title = 'Ha Long Bay Cruise Travel Guide',
  intro = 'Everything you need to plan a Halong Bay cruise through Ha Long Bay and Lan Ha Bay: when to go, how to get to the port, how long to stay and what to pack.',
  seo_title = 'Halong Bay Cruise Guide: When to Go & Travel Tips | Chronos Cruise',
  seo_description = 'Plan your Halong Bay cruise: best time to visit, getting from Hanoi to Tuan Chau port, 2D1N vs 3D2N cruises through Lan Ha Bay, choosing a luxury cruise and what to pack.',
  translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(translations,
    '{vi,seo_title}', '"Kinh nghiệm du lịch vịnh Hạ Long bằng du thuyền | Chronos Cruise"'),
    '{vi,seo_description}', '"Kinh nghiệm du lịch vịnh Hạ Long: mùa đẹp nhất, cách đi từ Hà Nội đến cảng Tuần Châu, chọn du thuyền Hạ Long 5 sao, đi 2 ngày 1 đêm hay 3 ngày 2 đêm và cần mang gì."'),
    '{vi,intro}', '"Cẩm nang du lịch vịnh Hạ Long cho chuyến nghỉ đêm trên du thuyền Hạ Long: nên đi mùa nào, di chuyển đến cảng ra sao, chọn du thuyền 5 sao thế nào, đi bao lâu và cần chuẩn bị những gì."'),
    '{vi,sections}', (translations->'vi'->'sections') - 5 || '[{"title":"Chọn du thuyền Hạ Long 5 sao như thế nào?","body":"Khi chọn du thuyền Hạ Long 5 sao, hãy xem hải trình có đi vào vịnh Lan Hạ yên tĩnh hay không, số lượng và diện tích phòng, tầm nhìn ra vịnh và các tiện ích trên tàu. Chronos Cruise có 44 suite hướng vịnh thuộc 5 hạng phòng, cùng spa, hồ bơi trên boong và nhà hàng panorama."}]'::jsonb || jsonb_build_array((translations->'vi'->'sections')->5)),
    '{en,sections}', (translations->'en'->'sections') - 5 || '[{"title":"Choosing a luxury Halong Bay cruise","body":"When choosing a Halong Bay cruise, check whether the itinerary reaches quieter Lan Ha Bay, how many cabins the ship has and how large they are, the bay views and the facilities on board. Chronos Cruise offers 44 bay-view suites across 5 suite classes, with a spa, deck pool and panoramic dining."}]'::jsonb || jsonb_build_array((translations->'en'->'sections')->5)),
  updated_at = now()
WHERE id = '283d6c02-6921-493b-8468-0f313f467614';

DELETE FROM public.content_cache;