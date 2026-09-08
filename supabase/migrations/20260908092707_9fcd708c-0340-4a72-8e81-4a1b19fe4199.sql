-- 1. Tenant consistency for existing child tables
ALTER TABLE public.cabins ADD CONSTRAINT cabins_id_ship_id_key UNIQUE (id, ship_id);
ALTER TABLE public.itineraries ADD CONSTRAINT itineraries_id_ship_id_key UNIQUE (id, ship_id);

ALTER TABLE public.cabin_details DROP CONSTRAINT IF EXISTS cabin_details_cabin_id_fkey;
ALTER TABLE public.cabin_details
  ADD CONSTRAINT cabin_details_cabin_ship_fkey
  FOREIGN KEY (cabin_id, ship_id) REFERENCES public.cabins (id, ship_id) ON DELETE CASCADE;

ALTER TABLE public.itinerary_days DROP CONSTRAINT IF EXISTS itinerary_days_itinerary_id_fkey;
ALTER TABLE public.itinerary_days
  ADD CONSTRAINT itinerary_days_itinerary_ship_fkey
  FOREIGN KEY (itinerary_id, ship_id) REFERENCES public.itineraries (id, ship_id) ON DELETE CASCADE;

-- 2. media
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  alt text,
  caption text,
  width integer,
  height integer,
  mime_type text,
  category text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_storage_path_key UNIQUE (storage_path),
  CONSTRAINT media_id_ship_id_key UNIQUE (id, ship_id)
);
CREATE INDEX media_ship_category_idx ON public.media (ship_id, category, sort_order);

GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_public_read_live_ships" ON public.media
  FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.ships s WHERE s.id = media.ship_id AND s.status = 'live'));
CREATE POLICY "media_admin_select" ON public.media
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "media_admin_insert" ON public.media
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "media_admin_update" ON public.media
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "media_admin_delete" ON public.media
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER media_set_updated_at BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. entity_media
CREATE TABLE public.entity_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL,
  media_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  usage text NOT NULL DEFAULT 'gallery',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_media_ship_fkey FOREIGN KEY (ship_id) REFERENCES public.ships (id) ON DELETE CASCADE,
  CONSTRAINT entity_media_media_ship_fkey FOREIGN KEY (media_id, ship_id) REFERENCES public.media (id, ship_id) ON DELETE CASCADE,
  CONSTRAINT entity_media_entity_type_check CHECK (entity_type IN ('cabin','itinerary','service','offer','ship_page','job_position','ship','homepage_section')),
  CONSTRAINT entity_media_unique UNIQUE (ship_id, entity_type, entity_id, media_id, usage)
);
CREATE INDEX entity_media_entity_idx ON public.entity_media (ship_id, entity_type, entity_id, usage, sort_order);
CREATE INDEX entity_media_media_idx ON public.entity_media (media_id);

-- entity ownership validation (polymorphic entity_id cannot use an FK)
CREATE OR REPLACE FUNCTION public.entity_media_check_owner()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

CREATE TRIGGER entity_media_check_owner_trg
  BEFORE INSERT OR UPDATE ON public.entity_media
  FOR EACH ROW EXECUTE FUNCTION public.entity_media_check_owner();

CREATE TRIGGER entity_media_set_updated_at BEFORE UPDATE ON public.entity_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT ON public.entity_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entity_media TO authenticated;
GRANT ALL ON public.entity_media TO service_role;
ALTER TABLE public.entity_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_media_public_read_live_ships" ON public.entity_media
  FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.ships s WHERE s.id = entity_media.ship_id AND s.status = 'live'));
CREATE POLICY "entity_media_admin_select" ON public.entity_media
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "entity_media_admin_insert" ON public.entity_media
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "entity_media_admin_update" ON public.entity_media
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "entity_media_admin_delete" ON public.entity_media
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships (id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  phone text,
  email text,
  nationality text,
  message text,
  source text,
  utm_source text,
  utm_campaign text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_type_check CHECK (type IN ('quote','contact','booking_request','agent','group')),
  CONSTRAINT leads_status_check CHECK (status IN ('new','contacted','won','lost','spam')),
  CONSTRAINT leads_contact_present CHECK (phone IS NOT NULL OR email IS NOT NULL)
);
CREATE INDEX leads_ship_created_idx ON public.leads (ship_id, created_at DESC);
CREATE INDEX leads_ship_status_idx ON public.leads (ship_id, status);

GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_admin_select" ON public.leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "leads_admin_update" ON public.leads
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "leads_admin_delete" ON public.leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER leads_set_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. job_applications: add ship_id (nullable for now, backfilled during migration step)
ALTER TABLE public.job_applications
  ADD COLUMN ship_id uuid REFERENCES public.ships (id) ON DELETE CASCADE,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX job_applications_ship_created_idx ON public.job_applications (ship_id, created_at DESC);
CREATE TRIGGER job_applications_set_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. storage.objects policies for ship-media (private bucket)
CREATE POLICY "ship_media_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'ship-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "ship_media_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ship-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "ship_media_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'ship-media' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'ship-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "ship_media_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'ship-media' AND public.has_role(auth.uid(), 'admin'::app_role));