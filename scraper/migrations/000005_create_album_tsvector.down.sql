DROP INDEX public.album_tsv_idx;
DROP TRIGGER albumtsvectorupdate ON public.album;
DROP FUNCTION album_tsv_trigger;
