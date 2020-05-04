ALTER TABLE band ADD COLUMN tsv tsvector;
UPDATE band SET tsv = setweight(to_tsvector('english', name), 'A') 
  || setweight(to_tsvector('english', coalesce(genre, '')), 'B') 
  || setweight(to_tsvector('english', coalesce(themes, '')), 'C');

CREATE INDEX band_tsv_idx ON band USING GIN (tsv);

CREATE FUNCTION band_tsv_trigger() RETURNS trigger AS $$
begin
  new.tsv := setweight(to_tsvector('english', new.name), 'A') 
    || setweight(to_tsvector('english', coalesce(new.genre, '')), 'B') 
    || setweight(to_tsvector('english', coalesce(new.themes, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER bandtsvectorupdate BEFORE INSERT OR UPDATE
  ON band FOR EACH ROW EXECUTE PROCEDURE band_tsv_trigger();
