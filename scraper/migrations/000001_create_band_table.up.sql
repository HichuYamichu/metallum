CREATE TABLE public.band (
  id text COLLATE pg_catalog."default" NOT NULL,
  name text COLLATE pg_catalog."default",
  description text COLLATE pg_catalog."default",
  country text COLLATE pg_catalog."default",
  location text COLLATE pg_catalog."default",
  formed_in text COLLATE pg_catalog."default",
  status text COLLATE pg_catalog."default",
  genre text COLLATE pg_catalog."default",
  themes text COLLATE pg_catalog."default",
  active text COLLATE pg_catalog."default",
  CONSTRAINT band_pkey PRIMARY KEY (id)
) 

TABLESPACE pg_default;

ALTER TABLE
  public.band OWNER to postgres;