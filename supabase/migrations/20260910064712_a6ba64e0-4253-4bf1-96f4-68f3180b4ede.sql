CREATE TABLE public.venues (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  stable_key text NOT NULL,
  category text NOT NULL,
  parent_key text,
  functional_name text NOT NULL,
  commercial_name text,
  location text,
  area_sqm numeric,
  capacity integer,
  capacity_unit text NOT NULL DEFAULT 'guests',
  spec_note text,
  function_text text,
  access_type text,
  summary text,
  description text,
  show_public boolean NOT NULL DEFAULT true,
  show_area boolean NOT NULL DEFAULT false,
  show_capacity boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  published_at timestamp with time zone,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (ship_id, stable_key),
  UNIQUE (ship_id, id)
);

CREATE INDEX venues_ship_category_idx ON public.venues (ship_id, category, sort_order);
CREATE INDEX venues_ship_status_idx ON public.venues (ship_id, status);

GRANT SELECT ON public.venues TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO authenticated;
GRANT ALL ON public.venues TO service_role;

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published venues of live ships"
ON public.venues FOR SELECT TO anon
USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = venues.ship_id AND s.status = 'live'));

CREATE POLICY "Admins can view all venues"
ON public.venues FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert venues"
ON public.venues FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update venues"
ON public.venues FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete venues"
ON public.venues FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER venues_set_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.entity_media_check_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  ok boolean;
BEGIN
  IF NEW.entity_type = 'ship' THEN
    SELECT EXISTS (SELECT 1 FROM public.ships WHERE id = NEW.entity_id AND id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'cabin' THEN
    SELECT EXISTS (SELECT 1 FROM public.cabins WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'itinerary' THEN
    SELECT EXISTS (SELECT 1 FROM public.itineraries WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'service' THEN
    SELECT EXISTS (SELECT 1 FROM public.services WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'venue' THEN
    SELECT EXISTS (SELECT 1 FROM public.venues WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'offer' THEN
    SELECT EXISTS (SELECT 1 FROM public.offers WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'ship_page' THEN
    SELECT EXISTS (SELECT 1 FROM public.ship_pages WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'job_position' THEN
    SELECT EXISTS (SELECT 1 FROM public.job_positions WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSIF NEW.entity_type = 'homepage_section' THEN
    SELECT EXISTS (SELECT 1 FROM public.homepage_sections WHERE id = NEW.entity_id AND ship_id = NEW.ship_id) INTO ok;
  ELSE
    ok := false;
  END IF;

  IF NOT ok THEN
    RAISE EXCEPTION 'entity_media: % % does not belong to ship %', NEW.entity_type, NEW.entity_id, NEW.ship_id;
  END IF;
  RETURN NEW;
END;
$function$;