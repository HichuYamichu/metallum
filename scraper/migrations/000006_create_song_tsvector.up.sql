ALTER TABLE song ADD COLUMN tsv tsvector;
UPDATE song SET tsv = setweight(to_tsvector('english', title), 'A') 
  || setweight(to_tsvector('english', coalesce(lyrics, '')), 'C');

CREATE INDEX song_tsv_idx ON song USING GIN (tsv);

CREATE FUNCTION song_tsv_trigger() RETURNS trigger AS $$
begin
  new.tsv := setweight(to_tsvector('english', new.title), 'A') 
    || setweight(to_tsvector('english', coalesce(new.lyrics, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER songtsvectorupdate BEFORE INSERT OR UPDATE
  ON song FOR EACH ROW EXECUTE PROCEDURE song_tsv_trigger();
