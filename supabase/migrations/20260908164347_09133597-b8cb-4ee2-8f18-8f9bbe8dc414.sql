UPDATE public.itineraries
SET translations = jsonb_set(
      translations,
      '{vi,highlights}',
      (translations #> '{vi,highlights}') - 'items'
    )
WHERE translations #> '{vi,highlights,items}' IS NOT NULL;