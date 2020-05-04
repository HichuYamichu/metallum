DROP INDEX public.band_tsv_idx;
DROP TRIGGER bandtsvectorupdate ON public.band;
DROP FUNCTION band_tsv_trigger;
