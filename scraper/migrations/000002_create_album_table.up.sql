CREATE TABLE public.album (
  id text COLLATE pg_catalog."default" NOT NULL,
  title text COLLATE pg_catalog."default",
  type text COLLATE pg_catalog."default",
  release text COLLATE pg_catalog."default",
  catalog text COLLATE pg_catalog."default",
  band_id text COLLATE pg_catalog."default",
  CONSTRAINT album_pkey PRIMARY KEY (id),
  FOREIGN KEY (band_id) REFERENCES band (id) ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE
  public.album OWNER to postgres;