ALTER TABLE public.entity_media DROP CONSTRAINT IF EXISTS entity_media_entity_type_check;
ALTER TABLE public.entity_media ADD CONSTRAINT entity_media_entity_type_check
  CHECK (entity_type IN ('ship','cabin','itinerary','service','venue','offer','ship_page','job_position','homepage_section'));