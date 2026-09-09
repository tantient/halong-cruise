ALTER TABLE public.ship_settings
ADD COLUMN recruit_zalo text;

COMMENT ON COLUMN public.ship_settings.recruit_zalo IS 'Recruitment-specific Zalo URL, separate from the general contact Zalo URL.';