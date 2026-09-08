-- Hàm tiện ích: người dùng là owner hoặc admin (so sánh dạng text để không phụ thuộc giá trị enum mới)
CREATE OR REPLACE FUNCTION public.is_platform_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('owner', 'admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ ships ============
CREATE TABLE public.ships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  display_name text,
  tagline text,
  status text NOT NULL DEFAULT 'draft',
  layout text NOT NULL DEFAULT 'heritage',
  default_language text NOT NULL DEFAULT 'en',
  currency text NOT NULL DEFAULT 'VND',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ships_status_check CHECK (status IN ('draft', 'staging', 'live', 'disabled')),
  CONSTRAINT ships_layout_check CHECK (layout IN ('heritage', 'editorial', 'panorama', 'grid')),
  CONSTRAINT ships_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*$')
);

GRANT SELECT ON public.ships TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ships TO authenticated;
GRANT ALL ON public.ships TO service_role;
ALTER TABLE public.ships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view live ships"
  ON public.ships FOR SELECT TO anon
  USING (status = 'live');

CREATE POLICY "Staff can view all ships"
  ON public.ships FOR SELECT TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can insert ships"
  ON public.ships FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can update ships"
  ON public.ships FOR UPDATE TO authenticated
  USING (public.is_platform_staff(auth.uid()))
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can delete ships"
  ON public.ships FOR DELETE TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE TRIGGER ships_set_updated_at BEFORE UPDATE ON public.ships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ship_domains ============
CREATE TABLE public.ship_domains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id uuid NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE,
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  redirect_to text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ship_domains_domain_lower CHECK (domain = lower(domain))
);

CREATE UNIQUE INDEX ship_domains_one_primary ON public.ship_domains (ship_id) WHERE is_primary;
CREATE INDEX ship_domains_ship_id_idx ON public.ship_domains (ship_id);

GRANT SELECT ON public.ship_domains TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ship_domains TO authenticated;
GRANT ALL ON public.ship_domains TO service_role;
ALTER TABLE public.ship_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can resolve active domains of live ships"
  ON public.ship_domains FOR SELECT TO anon
  USING (is_active AND EXISTS (SELECT 1 FROM public.ships s WHERE s.id = ship_id AND s.status = 'live'));

CREATE POLICY "Staff can view all domains"
  ON public.ship_domains FOR SELECT TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can insert domains"
  ON public.ship_domains FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can update domains"
  ON public.ship_domains FOR UPDATE TO authenticated
  USING (public.is_platform_staff(auth.uid()))
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can delete domains"
  ON public.ship_domains FOR DELETE TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE TRIGGER ship_domains_set_updated_at BEFORE UPDATE ON public.ship_domains
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ship_branding ============
CREATE TABLE public.ship_branding (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id uuid NOT NULL UNIQUE REFERENCES public.ships(id) ON DELETE CASCADE,
  logo_light text,
  logo_dark text,
  logo_mark text,
  favicon text,
  primary_color text,
  secondary_color text,
  accent_color text,
  background_color text,
  surface_color text,
  text_color text,
  heading_font text,
  body_font text,
  theme_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ship_branding TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ship_branding TO authenticated;
GRANT ALL ON public.ship_branding TO service_role;
ALTER TABLE public.ship_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view branding of live ships"
  ON public.ship_branding FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.ships s WHERE s.id = ship_id AND s.status = 'live'));

CREATE POLICY "Staff can view all branding"
  ON public.ship_branding FOR SELECT TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can insert branding"
  ON public.ship_branding FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can update branding"
  ON public.ship_branding FOR UPDATE TO authenticated
  USING (public.is_platform_staff(auth.uid()))
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can delete branding"
  ON public.ship_branding FOR DELETE TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE TRIGGER ship_branding_set_updated_at BEFORE UPDATE ON public.ship_branding
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ship_settings ============
CREATE TABLE public.ship_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id uuid NOT NULL UNIQUE REFERENCES public.ships(id) ON DELETE CASCADE,
  hotline text,
  hotline_display text,
  whatsapp text,
  zalo text,
  email text,
  recruit_email text,
  facebook text,
  instagram text,
  tiktok text,
  tripadvisor text,
  youtube text,
  google_maps text,
  booking_url text,
  checkin_point text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ship_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ship_settings TO authenticated;
GRANT ALL ON public.ship_settings TO service_role;
ALTER TABLE public.ship_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings of live ships"
  ON public.ship_settings FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.ships s WHERE s.id = ship_id AND s.status = 'live'));

CREATE POLICY "Staff can view all settings"
  ON public.ship_settings FOR SELECT TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can insert settings"
  ON public.ship_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can update settings"
  ON public.ship_settings FOR UPDATE TO authenticated
  USING (public.is_platform_staff(auth.uid()))
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can delete settings"
  ON public.ship_settings FOR DELETE TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE TRIGGER ship_settings_set_updated_at BEFORE UPDATE ON public.ship_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ship_seo ============
CREATE TABLE public.ship_seo (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id uuid NOT NULL UNIQUE REFERENCES public.ships(id) ON DELETE CASCADE,
  site_name text,
  title_template text,
  default_title text,
  default_description text,
  og_image text,
  schema_type text NOT NULL DEFAULT 'Organization',
  schema_name text,
  twitter_handle text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ship_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ship_seo TO authenticated;
GRANT ALL ON public.ship_seo TO service_role;
ALTER TABLE public.ship_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view seo of live ships"
  ON public.ship_seo FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.ships s WHERE s.id = ship_id AND s.status = 'live'));

CREATE POLICY "Staff can view all seo"
  ON public.ship_seo FOR SELECT TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can insert seo"
  ON public.ship_seo FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can update seo"
  ON public.ship_seo FOR UPDATE TO authenticated
  USING (public.is_platform_staff(auth.uid()))
  WITH CHECK (public.is_platform_staff(auth.uid()));

CREATE POLICY "Staff can delete seo"
  ON public.ship_seo FOR DELETE TO authenticated
  USING (public.is_platform_staff(auth.uid()));

CREATE TRIGGER ship_seo_set_updated_at BEFORE UPDATE ON public.ship_seo
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed: Chronos Cruise ============
INSERT INTO public.ships (slug, name, display_name, status, layout, default_language, currency, sort_order)
VALUES ('chronos', 'Chronos Cruise', 'Chronos Cruise', 'live', 'heritage', 'en', 'VND', 1);

INSERT INTO public.ship_domains (ship_id, domain, is_primary, is_active)
SELECT id, 'chronoscruise.com', true, true FROM public.ships WHERE slug = 'chronos';

INSERT INTO public.ship_domains (ship_id, domain, is_primary, is_active, redirect_to)
SELECT id, 'www.chronoscruise.com', false, true, 'chronoscruise.com' FROM public.ships WHERE slug = 'chronos';

INSERT INTO public.ship_branding (
  ship_id, logo_light, logo_dark, logo_mark, favicon,
  primary_color, secondary_color, accent_color, background_color, surface_color, text_color,
  heading_font, body_font, theme_config
)
SELECT id,
  'src/assets/logo/chronos-wordmark.svg',
  'src/assets/logo/chronos-wordmark.svg',
  'src/assets/logo/chronos-mark.svg',
  '/favicon.ico',
  'oklch(0.55 0.05 95)',
  'oklch(0.78 0.042 95)',
  'oklch(0.85 0.04 95)',
  'oklch(0.975 0.004 95)',
  'oklch(0.935 0.009 95)',
  'oklch(0.20 0.03 90)',
  'Libre Baskerville',
  'IBM Plex Sans',
  '{"borderRadius": "none", "heroOverlay": "warm", "buttonStyle": "square"}'::jsonb
FROM public.ships WHERE slug = 'chronos';

INSERT INTO public.ship_settings (
  ship_id, hotline, hotline_display, whatsapp, zalo, email, recruit_email,
  facebook, instagram, checkin_point, address
)
SELECT id,
  '+84902952356',
  '+84 902 952 356',
  'https://wa.me/84902952356',
  'https://zalo.me/84902952356',
  'info@chronoscruise.com',
  'vanpham@chornoscruise.com',
  'https://www.facebook.com/chronoscruise/',
  'https://www.instagram.com/chronos.cruise/',
  'Ha Long Bay · Lan Ha, Vietnam',
  'Ha Long Bay · Lan Ha, Vietnam'
FROM public.ships WHERE slug = 'chronos';

INSERT INTO public.ship_seo (
  ship_id, site_name, title_template, default_title, default_description, schema_type, schema_name
)
SELECT id,
  'Chronos Cruise',
  '%s | Chronos Cruise',
  'Chronos Cruise — Luxury Overnight Cruise in Ha Long Bay',
  'Chronos Cruise offers refined overnight journeys through Ha Long Bay and Lan Ha Bay, with elegant cabins, panoramic dining and curated experiences.',
  'Hotel',
  'Chronos Cruise'
FROM public.ships WHERE slug = 'chronos';