-- =========================================================
-- Task 1e: migrate Chronos static content into the database
-- =========================================================

-- ---------- CABINS ----------
INSERT INTO public.cabins (ship_id, slug, name, category, size_sqm, max_guests, bed_config, view_type, deck, summary, status, published_at, sort_order)
SELECT s.id, v.slug, v.name, v.category, v.size_sqm, v.max_guests, v.bed_config, v.view_type, v.deck, v.summary, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('owners-suite','Owner''s Suite','vip-suite',80::numeric,4,'1 double bed or 2 twin beds','Panorama 180°','Aft – private wing','Combining an elegant bedroom and lounge with an expansive private aft terrace and outdoor whirlpool.',1),
  ('grand-suite','Grand Suite','vip-suite',62,4,'1 double bed or 2 twin beds','Bay view','Aft – bay facing','Featuring a refined bedroom and lounge, a private aft terrace, and an outdoor whirlpool.',2),
  ('grand-suite-corner','Grand Suite','vip-suite',58,4,'1 double bed or 2 twin beds','Bay view','Corner position – bay facing','A private corner retreat featuring a comfortable bedroom and lounge, an aft terrace, and an outdoor whirlpool.',3),
  ('junior-suite-a','Junior Suite (type A)','junior-suite',30,4,'1 double bed or 2 twin beds','Sea view','Sea facing','An open layout with a large sea-facing window, warm timber tones and soft lighting. Ideal for small families or groups of friends on two- to three-day voyages.',4),
  ('junior-suite-b','Junior Suite (type B)','junior-suite',30,3,'1 double bed or 2 twin beds','Sea view','Sea facing','A minimal design that makes the most of natural light, with the full set of Chronos standard amenities. The most common cabin aboard.',5)
) AS v(slug,name,category,size_sqm,max_guests,bed_config,view_type,deck,summary,sort_order)
WHERE s.slug = 'chronos';

-- ---------- CABIN DETAILS ----------
INSERT INTO public.cabin_details (ship_id, cabin_id, group_name, label, value, content_type, sort_order)
SELECT c.ship_id, c.id, v.group_name, v.label, v.value, v.content_type, v.sort_order
FROM public.cabins c
JOIN public.ships s ON s.id = c.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  -- owner's suite
  ('owners-suite','spec','Technical code','Type 1.1A/1.1B','spec',1),
  ('owners-suite','spec','Total private area','80 m²','spec',2),
  ('owners-suite','spec','Area note','Area shown is the total private area, including indoor accommodation and private outdoor space.','spec',3),
  ('owners-suite','spec','View','Panorama 180°','spec',4),
  ('owners-suite','spec','Rooms of this type aboard','2','spec',5),
  ('owners-suite','spec','Capacity','Up to 4 guests','spec',6),
  ('owners-suite','spec','Bed configuration','1 double bed or 2 twin beds','spec',7),
  ('owners-suite','spec','Deck','Aft – private wing','spec',8),
  ('owners-suite','highlight','A bedroom and lounge set apart, suited to both resting and hosting.',NULL,'highlight',1),
  ('owners-suite','highlight','An expansive private aft terrace with an outdoor whirlpool.',NULL,'highlight',2),
  ('owners-suite','highlight','Panoramic bay views throughout the day.',NULL,'highlight',3),
  ('owners-suite','amenity','King bed',NULL,'amenity',1),
  ('owners-suite','amenity','Bedroom and lounge',NULL,'amenity',2),
  ('owners-suite','amenity','Expansive private aft terrace',NULL,'amenity',3),
  ('owners-suite','amenity','Outdoor whirlpool',NULL,'amenity',4),
  ('owners-suite','amenity','Panoramic bay views',NULL,'amenity',5),
  ('owners-suite','layout','Layout zones','[{"label":"Private aft terrace & whirlpool","x":2,"y":2,"w":96,"h":22},{"label":"Lounge","x":2,"y":26,"w":54,"h":38},{"label":"Bedroom","x":58,"y":26,"w":40,"h":38},{"label":"Bathroom","x":2,"y":68,"w":40,"h":30},{"label":"Wardrobe & entry","x":44,"y":68,"w":54,"h":30}]','layout',1),
  -- grand suite
  ('grand-suite','spec','Technical code','Type 1A/1B','spec',1),
  ('grand-suite','spec','Total private area','62 m²','spec',2),
  ('grand-suite','spec','Area note','Area shown is the total private area, including indoor accommodation and private outdoor space.','spec',3),
  ('grand-suite','spec','View','Bay view','spec',4),
  ('grand-suite','spec','Rooms of this type aboard','2','spec',5),
  ('grand-suite','spec','Capacity','Up to 4 guests','spec',6),
  ('grand-suite','spec','Bed configuration','1 double bed or 2 twin beds','spec',7),
  ('grand-suite','spec','Deck','Aft – bay facing','spec',8),
  ('grand-suite','highlight','A bedroom and seating area flowing straight onto the private terrace.',NULL,'highlight',1),
  ('grand-suite','highlight','Private aft terrace with an outdoor whirlpool.',NULL,'highlight',2),
  ('grand-suite','highlight','Panoramic bay views from both indoors and the terrace.',NULL,'highlight',3),
  ('grand-suite','amenity','King bed',NULL,'amenity',1),
  ('grand-suite','amenity','Bedroom and seating area',NULL,'amenity',2),
  ('grand-suite','amenity','Private aft terrace',NULL,'amenity',3),
  ('grand-suite','amenity','Outdoor whirlpool',NULL,'amenity',4),
  ('grand-suite','amenity','Panoramic bay views',NULL,'amenity',5),
  ('grand-suite','layout','Layout zones','[{"label":"Private terrace & whirlpool","x":2,"y":2,"w":96,"h":24},{"label":"Sleeping area","x":2,"y":30,"w":60,"h":38},{"label":"Seating area","x":64,"y":30,"w":34,"h":38},{"label":"Bathroom","x":2,"y":72,"w":46,"h":26},{"label":"Entry","x":50,"y":72,"w":48,"h":26}]','layout',1),
  -- grand suite corner
  ('grand-suite-corner','spec','Technical code','Type 1.2A/1.2B','spec',1),
  ('grand-suite-corner','spec','Total private area','58 m²','spec',2),
  ('grand-suite-corner','spec','Area note','Area shown is the total private area, including indoor accommodation and private outdoor space.','spec',3),
  ('grand-suite-corner','spec','View','Bay view','spec',4),
  ('grand-suite-corner','spec','Rooms of this type aboard','2','spec',5),
  ('grand-suite-corner','spec','Capacity','Up to 4 guests','spec',6),
  ('grand-suite-corner','spec','Bed configuration','1 double bed or 2 twin beds','spec',7),
  ('grand-suite-corner','spec','Deck','Corner position – bay facing','spec',8),
  ('grand-suite-corner','highlight','A corner position offering privacy and dual-aspect views.',NULL,'highlight',1),
  ('grand-suite-corner','highlight','Private terrace with an outdoor whirlpool.',NULL,'highlight',2),
  ('grand-suite-corner','highlight','Bedroom adjoining a seating area in an open, intimate layout.',NULL,'highlight',3),
  ('grand-suite-corner','amenity','King bed',NULL,'amenity',1),
  ('grand-suite-corner','amenity','Bedroom and seating area',NULL,'amenity',2),
  ('grand-suite-corner','amenity','Private corner terrace',NULL,'amenity',3),
  ('grand-suite-corner','amenity','Outdoor whirlpool',NULL,'amenity',4),
  ('grand-suite-corner','amenity','Panoramic bay views',NULL,'amenity',5),
  ('grand-suite-corner','layout','Layout zones','[{"label":"Private terrace & whirlpool","x":2,"y":2,"w":96,"h":22},{"label":"Sleeping area","x":2,"y":28,"w":58,"h":40},{"label":"Seating area","x":62,"y":28,"w":36,"h":40},{"label":"Bathroom","x":2,"y":72,"w":46,"h":26},{"label":"Entry","x":50,"y":72,"w":48,"h":26}]','layout',1),
  -- junior suite A
  ('junior-suite-a','spec','Area','30 – 33 m²','spec',1),
  ('junior-suite-a','spec','View','Sea view','spec',2),
  ('junior-suite-a','spec','Rooms of this type aboard','13','spec',3),
  ('junior-suite-a','spec','Capacity','Up to 4 guests','spec',4),
  ('junior-suite-a','spec','Bed configuration','1 double bed or 2 twin beds','spec',5),
  ('junior-suite-a','spec','Deck','Sea facing','spec',6),
  ('junior-suite-a','highlight','A large sea-facing window right beside the sleeping area.',NULL,'highlight',1),
  ('junior-suite-a','highlight','A dedicated work nook by the window, quiet enough for a long morning.',NULL,'highlight',2),
  ('junior-suite-a','highlight','An open layout that makes the most of the space for small families.',NULL,'highlight',3),
  ('junior-suite-a','amenity','Large sea-facing window',NULL,'amenity',1),
  ('junior-suite-a','amenity','Dedicated work nook',NULL,'amenity',2),
  ('junior-suite-a','amenity','Rain shower',NULL,'amenity',3),
  ('junior-suite-a','amenity','Smart TV & bluetooth speaker',NULL,'amenity',4),
  ('junior-suite-a','layout','Layout zones','[{"label":"Sea-view window","x":2,"y":2,"w":96,"h":12},{"label":"Sleeping area","x":2,"y":18,"w":62,"h":48},{"label":"Work nook","x":66,"y":18,"w":32,"h":48},{"label":"Bathroom","x":2,"y":70,"w":44,"h":28},{"label":"Wardrobe & entry","x":48,"y":70,"w":50,"h":28}]','layout',1),
  -- junior suite B
  ('junior-suite-b','spec','Area','30 – 35 m²','spec',1),
  ('junior-suite-b','spec','View','Sea view','spec',2),
  ('junior-suite-b','spec','Rooms of this type aboard','25','spec',3),
  ('junior-suite-b','spec','Capacity','Up to 3 guests','spec',4),
  ('junior-suite-b','spec','Bed configuration','1 double bed or 2 twin beds','spec',5),
  ('junior-suite-b','spec','Deck','Sea facing','spec',6),
  ('junior-suite-b','highlight','A minimal design that maximises natural light all day long.',NULL,'highlight',1),
  ('junior-suite-b','highlight','A large sea-facing window right beside the bed.',NULL,'highlight',2),
  ('junior-suite-b','highlight','Fully equipped for solo travellers and groups of friends.',NULL,'highlight',3),
  ('junior-suite-b','amenity','Sea-facing window',NULL,'amenity',1),
  ('junior-suite-b','amenity','Smart TV & bluetooth speaker',NULL,'amenity',2),
  ('junior-suite-b','amenity','Rain shower',NULL,'amenity',3),
  ('junior-suite-b','amenity','Electronic safe',NULL,'amenity',4),
  ('junior-suite-b','layout','Layout zones','[{"label":"Sea-view window","x":2,"y":2,"w":96,"h":12},{"label":"Sleeping area","x":2,"y":18,"w":96,"h":48},{"label":"Bathroom","x":2,"y":70,"w":44,"h":28},{"label":"Wardrobe & entry","x":48,"y":70,"w":50,"h":28}]','layout',1)
) AS v(cabin_slug,group_name,label,value,content_type,sort_order) ON v.cabin_slug = c.slug;

-- ---------- ITINERARIES ----------
INSERT INTO public.itineraries (ship_id, slug, name, days, nights, summary, description, highlights, status, published_at, sort_order)
SELECT s.id, v.slug, v.name, v.days, v.nights, v.summary, v.summary, v.highlights::jsonb, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('2d1n-ha-long','Ha Long 2-Day / 1-Night',2,1,
   'A complete introduction to Chronos: take in Ha Long Bay from the decks, explore a cave and enjoy dinner by candlelight on the water.',
   '{"duration":"2 days / 1 night","highlights":["Sunset viewing on the sundeck","Visit Sung Sot or Thien Cung cave","Fine-dining dinner","Morning kayaking"],"includes":["1 night in a bay-view cabin","All main meals aboard","Cave excursion by tender","Kayaking activity","Afternoon tea & welcome drink"],"excludes":["Alcoholic beverages","Spa & treatments","Flights / transfers","Gratuities"]}',1),
  ('3d2n-ha-long-lan-ha','Ha Long - Lan Ha 3-Day / 2-Night',3,2,
   'A deeper journey combining Ha Long Bay with the quieter Lan Ha Bay, including beach swimming, light cycling on a small island and sunset bathing.',
   '{"duration":"3 days / 2 nights","highlights":["Explore less-visited Lan Ha Bay","Swim at a private beach","Cycle on Cat Ba island","Herbal foot massage"],"includes":["2 nights in a bay-view cabin","All main meals","Tender to caves & islands","Island cycling","30-minute spa foot ritual"],"excludes":["Alcoholic beverages","Extended spa treatments","Flights / transfers","Gratuities"]}',2),
  ('sunset-cruise','Sunset Cruise',1,0,
   'A short evening escape to watch the sunset, sip cocktails and enjoy light bites in the heart of Ha Long Bay.',
   '{"duration":"4 hours","highlights":["Panoramic sunset from the sundeck","Welcome cocktail","Acoustic music","Perfect for friends & couples"],"includes":["Welcome drink & sunset cocktail","Light bites","Acoustic music on the sundeck","Scenic tender ride"],"excludes":["Overnight cabin","Main meals","Transfers"]}',3)
) AS v(slug,name,days,nights,summary,highlights,sort_order)
WHERE s.slug = 'chronos';

-- ---------- ITINERARY DAYS ----------
INSERT INTO public.itinerary_days (ship_id, itinerary_id, day_number, title, timeline, sort_order)
SELECT i.ship_id, i.id, v.day_number, v.title, v.timeline::jsonb, v.day_number
FROM public.itineraries i
JOIN public.ships s ON s.id = i.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('2d1n-ha-long',1,'Day 1','[{"time":"12:00","label":"Embarkation, welcome drink & cabin check-in"},{"time":"13:00","label":"Lunch while cruising into the bay"},{"time":"15:30","label":"Cave visit and kayaking"},{"time":"18:00","label":"Sundeck sunset & drinks"},{"time":"19:30","label":"Fine-dining dinner"}]'),
  ('2d1n-ha-long',2,'Day 2','[{"time":"06:30","label":"Yoga & breakfast aboard"},{"time":"09:30","label":"Disembarkation and return to port"}]'),
  ('3d2n-ha-long-lan-ha',1,'Day 1','[{"time":"12:00","label":"Check-in, lunch, cave visit & sunset"}]'),
  ('3d2n-ha-long-lan-ha',2,'Day 2','[{"time":"06:30","label":"Yoga, breakfast, cruise to Lan Ha Bay"},{"time":"10:00","label":"Swimming & kayaking in clear water"},{"time":"14:00","label":"Island cycling & fishing village visit"},{"time":"18:00","label":"Deck sunset & BBQ dinner"}]'),
  ('3d2n-ha-long-lan-ha',3,'Day 3','[{"time":"08:30","label":"Spa foot ritual, brunch, disembarkation"}]'),
  ('sunset-cruise',1,'Sunset Cruise','[{"time":"16:30","label":"Boarding, welcome drink & music"},{"time":"17:30","label":"Cruise among limestone islands"},{"time":"18:15","label":"Sunset, cocktail & light bites"},{"time":"19:00","label":"Acoustic music, return to port"}]')
) AS v(itin_slug,day_number,title,timeline) ON v.itin_slug = i.slug;

-- ---------- SERVICES ----------
INSERT INTO public.services (ship_id, slug, name, category, summary, description, highlights, status, published_at, sort_order)
SELECT s.id, v.slug, v.name, v.category, v.summary, v.description, v.highlights::jsonb, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('dining','Panorama Restaurant','dining','Panorama Restaurant, fine dining with 270° views',
   'Panorama Restaurant runs along a full wall of glass, so every meal moves with the light on the bay. The chef designs a daily Asian–European fusion menu built on fresh seafood and local produce. Guests can choose the indoor dining room, the open-air terrace, or a private table for special occasions.',
   '{"group":"service","menuName":"Dining","eyebrow":"DINING","tagline":"Fine dining on the bay with 270° views","items":[{"title":"Daily tasting menu","desc":"The chef rewrites the menu each voyage around the day''s freshest catch."},{"title":"Open-air terrace","desc":"Waterside tables for sunset dinners and private celebrations."},{"title":"Private dining","desc":"Secluded settings for families, anniversaries or corporate dinners."},{"title":"24/7 in-cabin service","desc":"A curated menu served on your cabin balcony at any hour."}]}',1),
  ('entertainment','Sky Lounge & Entertainment','entertainment','Sky Lounge, karaoke, cigar room and kids’ club',
   'Evenings aboard Chronos start at the Sky Lounge with cocktails and live music, then spread into a set of private rooms: a sound-proof karaoke suite, a cigar room, a games salon and a dedicated kids'' room. Each space sits apart so every group keeps its own rhythm.',
   '{"group":"service","menuName":"Entertainment","eyebrow":"ENTERTAINMENT","tagline":"From live-music lounge to private family spaces","items":[{"title":"Sky Lounge & bar","desc":"Signature cocktails, nightly live music and full bay views."},{"title":"Sound-proof karaoke","desc":"Two private rooms with premium audio and in-room drinks service."},{"title":"Cigar & games room","desc":"A separately ventilated cigar lounge plus card and board-game tables."},{"title":"Kids'' club","desc":"A safe playroom with supervised sessions through the day."},{"title":"Meeting room","desc":"Presentation-ready for small seminars and corporate events."}]}',2),
  ('spa','Serenity Spa & Wellness','wellness','Treatments, massage and a quiet relaxation lounge',
   'Serenity Spa occupies the quietest part of the ship, with single and couple treatment rooms, a foot-therapy area and a post-treatment relaxation space. Therapists blend traditional Vietnamese techniques with contemporary bodywork, using natural essential oils.',
   '{"group":"service","menuName":"Spa & Wellness","eyebrow":"WELLNESS","tagline":"Treatments paced to the quiet of the bay","items":[{"title":"Couple treatment room","desc":"Side-by-side treatments in one private suite."},{"title":"Herbal foot ritual","desc":"A local-herb foot soak opens every treatment."},{"title":"Therapeutic massage","desc":"From hot-stone work to neck and shoulder relief after long travel."},{"title":"Relaxation lounge","desc":"Herbal tea and bay-facing loungers to close each session."}]}',3),
  ('public-spaces','Grand Lobby & Public Spaces','public','Double-height lobby, reception and indoor pool',
   'A double-height lobby with a sculptural central staircase welcomes guests aboard Chronos. Reception, the waiting lounge, the indoor pool and the jacuzzi area flow from it, forming the social spine of the ship.',
   '{"group":"space","menuName":"Lobby & Lounge","eyebrow":"PUBLIC SPACES","tagline":"The heart of the ship, where every voyage begins","items":[{"title":"Double-height lobby","desc":"A central staircase under natural light through the day."},{"title":"Reception & butler desk","desc":"Bookings, itineraries and personal requests, around the clock."},{"title":"Pool & jacuzzi","desc":"A sheltered pool that stays usable when the weather turns."},{"title":"Guest lounge","desc":"Reading, afternoon tea and easy meeting space between excursions."}]}',4),
  ('sundeck','Sundeck & Infinity Pool','deck','Top deck with infinity pool and open-air bar',
   'The sundeck spans the top of the ship with an infinity pool, sun loungers and an open-air bar. It offers the best sunset on board and doubles as the venue for deck parties and early-morning yoga.',
   '{"group":"space","menuName":"Sundeck & Pool","eyebrow":"DECKS","tagline":"The highest deck, the widest horizon","items":[{"title":"Infinity pool","desc":"A pool edge that dissolves into the bay horizon."},{"title":"Open-air bar","desc":"Sunset cocktails served straight to your lounger."},{"title":"Deck events","desc":"Open space for BBQ nights, birthdays and private events."},{"title":"Morning yoga","desc":"Sunrise yoga sessions on the forward deck."}]}',5),
  ('exterior','Yacht Exterior','exterior','Hull design, stepped decks, 44 sea-facing cabins',
   'Chronos is drawn in a contemporary yacht language: a slender hull, continuous glazing and stepped decks that give the profile its rhythm. All 44 cabins face the sea, and every deck keeps its own outdoor terrace.',
   '{"group":"space","menuName":"Ship Exterior","eyebrow":"DESIGN","tagline":"A modern yacht silhouette on a heritage bay","items":[{"title":"44 sea-facing cabins","desc":"Every cabin looks onto the bay, most with a private balcony."},{"title":"Stepped decks","desc":"Stepped levels give each deck its own outdoor area."},{"title":"Night lighting","desc":"Hull lighting that draws the silhouette at anchor."}]}',6)
) AS v(slug,name,category,summary,description,highlights,sort_order)
WHERE s.slug = 'chronos';

-- ---------- OFFERS ----------
INSERT INTO public.offers (ship_id, slug, name, value_text, badge, description, terms, status, published_at, sort_order)
SELECT s.id, v.slug, v.name, v.badge, v.badge, v.description, v.terms, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('early-bird','Early Bird Offer','15% off',
   E'Book 45 days in advance for the best rate and a complimentary room upgrade when available.\n\nHighlights:\n- 15% off room rate\n- Free upgrade\n- Flexible cancellation up to 30 days',
   E'Valid for 2D1N and 3D2N voyages\nBook at least 45 days ahead\nNot valid during Tet and public holidays\nUpgrade subject to availability',1),
  ('family','Family Package','Kids stay free',
   E'A family-friendly package: kids under 12 stay free, deck BBQ dinner and dedicated kids'' activities.\n\nHighlights:\n- Kids under 12 stay free\n- Deck BBQ dinner\n- Kids'' club & supervised play',
   E'Minimum 2 adults + 1 child\nKids under 12 stay free in same cabin\nDeck BBQ valid for 3D2N voyages\nBook at least 14 days ahead',2),
  ('honeymoon','Honeymoon Package','Perks included',
   E'Designed for couples: cabin decoration, private dinner, couple''s massage and welcome champagne.\n\nHighlights:\n- Rose petal cabin decoration\n- Private balcony dinner\n- 60-minute couple''s massage\n- Welcome champagne',
   E'Valid for Owner''s Suite or Grand Suite\nMinimum 2 days / 1 night\nBook at least 7 days ahead\nMarriage certificate within 12 months',3)
) AS v(slug,name,badge,description,terms,sort_order)
WHERE s.slug = 'chronos';

-- ---------- JOB POSITIONS ----------
INSERT INTO public.job_positions (ship_id, slug, title_en, title_vi, department, employment_type, description, status, published_at, sort_order)
SELECT s.id, v.slug, v.title_en, v.title_vi, v.department, v.employment_type, v.description, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('housekeeping','Housekeeping Steward','Nhân viên buồng phòng','Housekeeping','Full-time','Maintain cleanliness, order, and preparation of suites to Chronos''s six-star standards.',1),
  ('fb-server','F&B Server','Nhân viên nhà hàng','Food & Beverage','Full-time','Serve fine-dining meals, beverages, and private events with a professional manner.',2),
  ('receptionist','Receptionist','Lễ tân','Front Office','Full-time','Greet guests, assist check-in/out, and answer inquiries throughout the voyage.',3),
  ('cruise-guide','Cruise Guide','Hướng dẫn viên du lịch','Guest Experience','Full-time','Lead excursions, introduce local culture, and ensure guest safety during activities.',4)
) AS v(slug,title_en,title_vi,department,employment_type,description,sort_order)
WHERE s.slug = 'chronos';

-- ---------- SHIP PAGES ----------
INSERT INTO public.ship_pages (ship_id, slug, title, intro, content, seo_title, seo_description, status, published_at, sort_order)
SELECT s.id, v.slug, v.title, v.intro, v.content, v.seo_title, v.seo_description, 'published', now(), v.sort_order
FROM public.ships s,
(VALUES
  ('about','The essence of bay-side luxury','ABOUT CHRONOS',
   E'Chronos Cruise offers private spaces, personalized service and curated voyages across Ha Long Bay and Lan Ha Bay in true six-star style. Every moment aboard is designed to help you rediscover balance and adventure on your own terms.\n\n## Highlights\n- 44 ocean-view suites — Private balcony, 270° vistas\n- Five-star dining — Daily fusion menus\n- Spa & wellness — Holistic treatments\n- 24/7 service — Dedicated onboard butler\n\n## Core values — Centered on our guests\n- Quiet — Spaces and rhythms designed for genuine relaxation.\n- Attentive — Every small request is noticed and handled promptly.\n- Local — Dining, therapies and experiences rooted in bay culture.\n- Sustainable — Operations that respect the sea-and-island ecosystem.\n\n## Vision — Where every voyage becomes a work of art\nChronos is more than a sightseeing trip. We blend refined architecture, thoughtful service and a spectacular landscape to create unforgettable memories in the heart of a UNESCO natural wonder.',
   'Giới thiệu Chronos Cruise | Du thuyền 6 sao Hạ Long - Lan Hạ',
   'Tìm hiểu về Chronos Cruise: tinh thần phục vụ, giá trị cốt lõi và trải nghiệm nghỉ dưỡng 6 sao giữa vịnh Hạ Long - Lan Hạ.',1),
  ('contact','Contact Chronos Cruise','CONTACT',
   E'Reach the Chronos Cruise team by hotline, Zalo or WhatsApp on +84 902 952 356, or email info@chronoscruise.com. Check-in point: Ha Long International Cruise Port.\n\nSend us a message and our concierge will reply within 24 hours.',
   'Liên hệ Chronos Cruise | Hotline, Zalo & bản đồ bến tàu Hạ Long',
   'Liên hệ Chronos Cruise: hotline, Zalo, email đặt phòng và bản đồ vị trí bến tàu tại Cảng tàu khách quốc tế Hạ Long. Gửi tin nhắn để được tư vấn trong 24 giờ.',2)
) AS v(slug,title,intro,content,seo_title,seo_description,sort_order)
WHERE s.slug = 'chronos';

-- ---------- HOMEPAGE SECTIONS ----------
INSERT INTO public.homepage_sections (ship_id, section_type, position, enabled, configuration, status, published_at)
SELECT s.id, v.section_type, v.position, true, v.configuration::jsonb, 'published', now()
FROM public.ships s,
(VALUES
  ('hero',1,'{"component":"Hero","slides":["chronos-slide-1.webp","chronos-slide-2.webp","chronos-slide-3-v2.webp","chronos-slide-4.webp","chronos-exterior-01-v2.webp","chronos-exterior-02-v2.webp","chronos-exterior-07.webp","chronos-exterior-05.webp"]}'),
  ('recruit_teaser',2,'{"component":"RecruitTeaser"}'),
  ('gallery',3,'{"component":"Gallery"}'),
  ('quote_form',4,'{"component":"QuoteForm"}')
) AS v(section_type,position,configuration)
WHERE s.slug = 'chronos';

-- ---------- ENTITY MEDIA: cabins ----------
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT c.ship_id, m.id, 'cabin', c.id, v.usage, v.sort_order
FROM public.cabins c
JOIN public.ships s ON s.id = c.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('owners-suite','chronos-suite-01.webp','cover',1),
  ('owners-suite','chronos-suite-02.webp','gallery',1),
  ('owners-suite','chronos-bath-02.webp','gallery',2),
  ('grand-suite','chronos-suite-03.webp','cover',1),
  ('grand-suite','chronos-suite-02.webp','gallery',1),
  ('grand-suite','chronos-bath-02.webp','gallery',2),
  ('grand-suite-corner','chronos-suite-02.webp','cover',1),
  ('grand-suite-corner','chronos-suite-03.webp','gallery',1),
  ('grand-suite-corner','chronos-bath-02.webp','gallery',2),
  ('junior-suite-a','chronos-deluxe-01.webp','cover',1),
  ('junior-suite-a','chronos-deluxe-02.webp','gallery',1),
  ('junior-suite-a','chronos-bath-01.webp','gallery',2),
  ('junior-suite-b','chronos-standard-01.webp','cover',1),
  ('junior-suite-b','chronos-standard-02.webp','gallery',1),
  ('junior-suite-b','chronos-standard-03.webp','gallery',2),
  ('junior-suite-b','chronos-standard-04.webp','gallery',3),
  ('junior-suite-b','chronos-corridor.webp','gallery',4)
) AS v(cabin_slug,file,usage,sort_order) ON v.cabin_slug = c.slug
JOIN public.media m ON m.ship_id = c.ship_id AND m.storage_path LIKE '%/' || v.file;

-- ---------- ENTITY MEDIA: itineraries ----------
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT i.ship_id, m.id, 'itinerary', i.id, v.usage, v.sort_order
FROM public.itineraries i
JOIN public.ships s ON s.id = i.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('2d1n-ha-long','chronos-exterior-01-v2.webp','cover',1),
  ('2d1n-ha-long','chronos-dining-panorama-01.webp','gallery',1),
  ('2d1n-ha-long','chronos-suite-01.webp','gallery',2),
  ('2d1n-ha-long','chronos-deck-sunset-01.webp','gallery',3),
  ('3d2n-ha-long-lan-ha','chronos-exterior-02-v2.webp','cover',1),
  ('3d2n-ha-long-lan-ha','chronos-deck-sunset-01.webp','gallery',1),
  ('3d2n-ha-long-lan-ha','chronos-spa-room-01.webp','gallery',2),
  ('3d2n-ha-long-lan-ha','chronos-suite-01.webp','gallery',3),
  ('sunset-cruise','chronos-deck-sunset-01.webp','cover',1),
  ('sunset-cruise','chronos-exterior-01-v2.webp','gallery',1),
  ('sunset-cruise','chronos-dining-panorama-01.webp','gallery',2)
) AS v(itin_slug,file,usage,sort_order) ON v.itin_slug = i.slug
JOIN public.media m ON m.ship_id = i.ship_id AND m.storage_path LIKE '%/' || v.file;

-- ---------- ENTITY MEDIA: offers ----------
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT o.ship_id, m.id, 'offer', o.id, 'cover', 1
FROM public.offers o
JOIN public.ships s ON s.id = o.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('early-bird','chronos-suite-01.webp'),
  ('family','chronos-dining-panorama-01.webp'),
  ('honeymoon','chronos-deck-sunset-02.webp')
) AS v(offer_slug,file) ON v.offer_slug = o.slug
JOIN public.media m ON m.ship_id = o.ship_id AND m.storage_path LIKE '%/' || v.file;

-- ---------- ENTITY MEDIA: pages ----------
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT p.ship_id, m.id, 'ship_page', p.id, v.usage, v.sort_order
FROM public.ship_pages p
JOIN public.ships s ON s.id = p.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('about','chronos-exterior-01-v2.webp','cover',1),
  ('about','chronos-public-lobby-01.webp','gallery',1),
  ('about','chronos-dining-panorama-01.webp','gallery',2),
  ('contact','chronos-exterior-01-v2.webp','cover',1)
) AS v(page_slug,file,usage,sort_order) ON v.page_slug = p.slug
JOIN public.media m ON m.ship_id = p.ship_id AND m.storage_path LIKE '%/' || v.file;

-- ---------- ENTITY MEDIA: services (gallery category membership from source) ----------
INSERT INTO public.entity_media (ship_id, media_id, entity_type, entity_id, usage, sort_order)
SELECT sv.ship_id, m.id, 'service', sv.id, 'gallery', v.sort_order
FROM public.services sv
JOIN public.ships s ON s.id = sv.ship_id AND s.slug = 'chronos'
JOIN (VALUES
  ('dining','chronos-dining-main-01.webp',1),
  ('dining','chronos-dining-main-02.webp',2),
  ('dining','chronos-dining-outdoor-01.webp',3),
  ('dining','chronos-dining-outdoor-02.webp',4),
  ('dining','chronos-dining-panorama-01.webp',5),
  ('dining','chronos-dining-panorama-02.webp',6),
  ('entertainment','chronos-ent-business.webp',1),
  ('entertainment','chronos-ent-cigar-01.webp',2),
  ('entertainment','chronos-ent-cigar-02.webp',3),
  ('entertainment','chronos-ent-family-01.webp',4),
  ('entertainment','chronos-ent-family-02.webp',5),
  ('entertainment','chronos-ent-karaoke-01.webp',6),
  ('entertainment','chronos-ent-karaoke-02.webp',7),
  ('entertainment','chronos-ent-kids-01.webp',8),
  ('entertainment','chronos-ent-kids-02.webp',9),
  ('entertainment','chronos-ent-lounge.webp',10),
  ('entertainment','chronos-ent-poker-01.webp',11),
  ('spa','chronos-spa-foot.webp',1),
  ('spa','chronos-spa-room-01.webp',2),
  ('spa','chronos-spa-room-02.webp',3),
  ('public-spaces','chronos-public-jacuzzi.webp',1),
  ('public-spaces','chronos-public-lobby-01.webp',2),
  ('public-spaces','chronos-public-lobby-02.webp',3),
  ('public-spaces','chronos-public-lounge.webp',4),
  ('public-spaces','chronos-public-pool.webp',5),
  ('public-spaces','chronos-public-reception.webp',6),
  ('public-spaces','chronos-public-spa-reception.webp',7),
  ('public-spaces','chronos-public-stair.webp',8),
  ('sundeck','chronos-deck-sunset-01.webp',1),
  ('sundeck','chronos-deck-sunset-02.webp',2),
  ('sundeck','chronos-deck-terrace.webp',3),
  ('exterior','chronos-exterior-01-v2.webp',1),
  ('exterior','chronos-exterior-02-v2.webp',2),
  ('exterior','chronos-exterior-03-v2.webp',3),
  ('exterior','chronos-exterior-04-v2.webp',4),
  ('exterior','chronos-exterior-05.webp',5),
  ('exterior','chronos-exterior-06.webp',6),
  ('exterior','chronos-exterior-07.webp',7)
) AS v(service_slug,file,sort_order) ON v.service_slug = sv.slug
JOIN public.media m ON m.ship_id = sv.ship_id AND m.storage_path LIKE '%/' || v.file;
