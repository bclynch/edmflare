create table edm.genre_to_artist ( --one to many
  id                 serial primary key,
  genre_id           text not null references edm.genre(name) on delete cascade,
  artist_id          text not null references edm.artist(name) on delete cascade
);

CREATE INDEX idx_genretoartist_genre ON edm.genre_to_artist (genre_id);
CREATE INDEX idx_genretoartist_artist ON edm.genre_to_artist (artist_id);

GRANT ALL ON TABLE edm.genre_to_artist TO :DATABASE_VISITOR;

comment on table edm.genre_to_artist is
  E'A join table between genres and artists.';

comment on column edm.genre_to_artist.id is
  E'Id of the row.';
comment on column edm.genre_to_artist.genre_id is
  E'Ref to the genre.';
comment on column edm.genre_to_artist.artist_id is
  E'Ref to the artist.';
