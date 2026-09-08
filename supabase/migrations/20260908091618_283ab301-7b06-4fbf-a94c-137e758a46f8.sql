-- 1) Chỉ dùng vai trò admin cho quản trị
CREATE OR REPLACE FUNCTION public.is_platform_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'::app_role
  )
$$;

DROP POLICY IF EXISTS "Staff can delete ships" ON public.ships;
DROP POLICY IF EXISTS "Staff can insert ships" ON public.ships;
DROP POLICY IF EXISTS "Staff can update ships" ON public.ships;
DROP POLICY IF EXISTS "Staff can view all ships" ON public.ships;
CREATE POLICY "Admins can view all ships" ON public.ships FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert ships" ON public.ships FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update ships" ON public.ships FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete ships" ON public.ships FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Staff can delete domains" ON public.ship_domains;
DROP POLICY IF EXISTS "Staff can insert domains" ON public.ship_domains;
DROP POLICY IF EXISTS "Staff can update domains" ON public.ship_domains;
DROP POLICY IF EXISTS "Staff can view all domains" ON public.ship_domains;
CREATE POLICY "Admins can view all domains" ON public.ship_domains FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert domains" ON public.ship_domains FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update domains" ON public.ship_domains FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete domains" ON public.ship_domains FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Staff can delete branding" ON public.ship_branding;
DROP POLICY IF EXISTS "Staff can insert branding" ON public.ship_branding;
DROP POLICY IF EXISTS "Staff can update branding" ON public.ship_branding;
DROP POLICY IF EXISTS "Staff can view all branding" ON public.ship_branding;
CREATE POLICY "Admins can view all branding" ON public.ship_branding FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert branding" ON public.ship_branding FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update branding" ON public.ship_branding FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete branding" ON public.ship_branding FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Staff can delete settings" ON public.ship_settings;
DROP POLICY IF EXISTS "Staff can insert settings" ON public.ship_settings;
DROP POLICY IF EXISTS "Staff can update settings" ON public.ship_settings;
DROP POLICY IF EXISTS "Staff can view all settings" ON public.ship_settings;
CREATE POLICY "Admins can view all settings" ON public.ship_settings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert settings" ON public.ship_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.ship_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete settings" ON public.ship_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Staff can delete seo" ON public.ship_seo;
DROP POLICY IF EXISTS "Staff can insert seo" ON public.ship_seo;
DROP POLICY IF EXISTS "Staff can update seo" ON public.ship_seo;
DROP POLICY IF EXISTS "Staff can view all seo" ON public.ship_seo;
CREATE POLICY "Admins can view all seo" ON public.ship_seo FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert seo" ON public.ship_seo FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update seo" ON public.ship_seo FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete seo" ON public.ship_seo FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Bảng nội dung
CREATE TABLE public.cabins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  category text,
  size_sqm numeric,
  max_guests integer,
  bed_config text,
  view_type text,
  deck text,
  summary text,
  description text,
  price_from numeric,
  currency text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.cabins TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cabins TO authenticated;
GRANT ALL ON public.cabins TO service_role;
ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published cabins of live ships" ON public.cabins FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = cabins.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all cabins" ON public.cabins FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert cabins" ON public.cabins FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update cabins" ON public.cabins FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete cabins" ON public.cabins FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX cabins_ship_sort_idx ON public.cabins (ship_id, sort_order);
CREATE INDEX cabins_ship_status_idx ON public.cabins (ship_id, status);
CREATE TRIGGER cabins_set_updated_at BEFORE UPDATE ON public.cabins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cabin_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  cabin_id uuid NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  group_name text,
  label text NOT NULL,
  value text,
  content_type text NOT NULL DEFAULT 'text',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cabin_details TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cabin_details TO authenticated;
GRANT ALL ON public.cabin_details TO service_role;
ALTER TABLE public.cabin_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view details of published cabins" ON public.cabin_details FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.cabins c JOIN public.ships s ON s.id = c.ship_id WHERE c.id = cabin_details.cabin_id AND c.status = 'published' AND s.status = 'live'));
CREATE POLICY "Admins can view all cabin details" ON public.cabin_details FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert cabin details" ON public.cabin_details FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update cabin details" ON public.cabin_details FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete cabin details" ON public.cabin_details FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX cabin_details_cabin_sort_idx ON public.cabin_details (cabin_id, sort_order);
CREATE INDEX cabin_details_ship_idx ON public.cabin_details (ship_id);
CREATE TRIGGER cabin_details_set_updated_at BEFORE UPDATE ON public.cabin_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  days integer,
  nights integer,
  departure_point text,
  summary text,
  description text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  price_from numeric,
  currency text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.itineraries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itineraries TO authenticated;
GRANT ALL ON public.itineraries TO service_role;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published itineraries of live ships" ON public.itineraries FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = itineraries.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all itineraries" ON public.itineraries FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert itineraries" ON public.itineraries FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update itineraries" ON public.itineraries FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete itineraries" ON public.itineraries FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX itineraries_ship_sort_idx ON public.itineraries (ship_id, sort_order);
CREATE INDEX itineraries_ship_status_idx ON public.itineraries (ship_id, status);
CREATE TRIGGER itineraries_set_updated_at BEFORE UPDATE ON public.itineraries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  itinerary_id uuid NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text,
  description text,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  meals text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (itinerary_id, day_number)
);
GRANT SELECT ON public.itinerary_days TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_days TO authenticated;
GRANT ALL ON public.itinerary_days TO service_role;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view days of published itineraries" ON public.itinerary_days FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.itineraries i JOIN public.ships s ON s.id = i.ship_id WHERE i.id = itinerary_days.itinerary_id AND i.status = 'published' AND s.status = 'live'));
CREATE POLICY "Admins can view all itinerary days" ON public.itinerary_days FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert itinerary days" ON public.itinerary_days FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update itinerary days" ON public.itinerary_days FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete itinerary days" ON public.itinerary_days FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX itinerary_days_itinerary_idx ON public.itinerary_days (itinerary_id, day_number);
CREATE INDEX itinerary_days_ship_idx ON public.itinerary_days (ship_id);
CREATE TRIGGER itinerary_days_set_updated_at BEFORE UPDATE ON public.itinerary_days FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  category text,
  summary text,
  description text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  opening_hours text,
  price_note text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published services of live ships" ON public.services FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = services.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all services" ON public.services FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX services_ship_sort_idx ON public.services (ship_id, sort_order);
CREATE INDEX services_ship_status_idx ON public.services (ship_id, status);
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  offer_type text,
  value_text text,
  description text,
  terms text,
  badge text,
  starts_at date,
  ends_at date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published offers of live ships" ON public.offers FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = offers.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all offers" ON public.offers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert offers" ON public.offers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update offers" ON public.offers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete offers" ON public.offers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX offers_ship_sort_idx ON public.offers (ship_id, sort_order);
CREATE INDEX offers_ship_status_idx ON public.offers (ship_id, status);
CREATE TRIGGER offers_set_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.job_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title_en text NOT NULL,
  title_vi text,
  department text,
  employment_type text,
  description text,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  headcount integer,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.job_positions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_positions TO authenticated;
GRANT ALL ON public.job_positions TO service_role;
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published positions of live ships" ON public.job_positions FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = job_positions.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all positions" ON public.job_positions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert positions" ON public.job_positions FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update positions" ON public.job_positions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete positions" ON public.job_positions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX job_positions_ship_sort_idx ON public.job_positions (ship_id, sort_order);
CREATE INDEX job_positions_ship_status_idx ON public.job_positions (ship_id, status);
CREATE TRIGGER job_positions_set_updated_at BEFORE UPDATE ON public.job_positions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ship_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  intro text,
  content text,
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ship_id, slug)
);
GRANT SELECT ON public.ship_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ship_pages TO authenticated;
GRANT ALL ON public.ship_pages TO service_role;
ALTER TABLE public.ship_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published pages of live ships" ON public.ship_pages FOR SELECT TO anon USING (status = 'published' AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = ship_pages.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all pages" ON public.ship_pages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert pages" ON public.ship_pages FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update pages" ON public.ship_pages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete pages" ON public.ship_pages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX ship_pages_ship_sort_idx ON public.ship_pages (ship_id, sort_order);
CREATE INDEX ship_pages_ship_status_idx ON public.ship_pages (ship_id, status);
CREATE TRIGGER ship_pages_set_updated_at BEFORE UPDATE ON public.ship_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published sections of live ships" ON public.homepage_sections FOR SELECT TO anon USING (status = 'published' AND enabled AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = homepage_sections.ship_id AND s.status = 'live'));
CREATE POLICY "Admins can view all sections" ON public.homepage_sections FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert sections" ON public.homepage_sections FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update sections" ON public.homepage_sections FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete sections" ON public.homepage_sections FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX homepage_sections_ship_position_idx ON public.homepage_sections (ship_id, position);
CREATE TRIGGER homepage_sections_set_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();