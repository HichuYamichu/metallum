ALTER TABLE album ADD COLUMN tsv tsvector;
UPDATE album SET tsv = to_tsvector('english', title);

CREATE INDEX album_tsv_idx ON album USING GIN (tsv);

CREATE FUNCTION album_tsv_trigger() RETURNS trigger AS $$
begin
  new.tsv := to_tsvector('english', new.title);
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER albumtsvectorupdate BEFORE INSERT OR UPDATE
  ON album FOR EACH ROW EXECUTE PROCEDURE album_tsv_trigger();
