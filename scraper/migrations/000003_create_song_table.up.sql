CREATE TABLE public.song (
  id text COLLATE pg_catalog."default" NOT NULL,
  title text COLLATE pg_catalog."default",
  length text COLLATE pg_catalog."default",
  lyrics text COLLATE pg_catalog."default",
  album_id text COLLATE pg_catalog."default",
  CONSTRAINT song_pkey PRIMARY KEY (id),
  FOREIGN KEY (album_id) REFERENCES album (id) ON DELETE CASCADE
) 

TABLESPACE pg_default;

ALTER TABLE
  public.song OWNER to postgres;