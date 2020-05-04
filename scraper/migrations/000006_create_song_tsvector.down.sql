DROP INDEX public.song_tsv_idx;
DROP TRIGGER songtsvectorupdate ON public.song;
DROP FUNCTION song_tsv_trigger;