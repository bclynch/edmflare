create table edm.artist_to_event ( --one to many
  id                 serial primary key,
  artist_id          text not null references edm.artist(name) on delete cascade,
  event_id           text not null references edm.event(id) on delete cascade
);

CREATE INDEX idx_artisttoevent_artist ON edm.artist_to_event (artist_id);
CREATE INDEX idx_artisttoevent_event ON edm.artist_to_event (event_id);

GRANT ALL ON TABLE edm.artist_to_event TO :DATABASE_VISITOR;

comment on table edm.artist_to_event is
  E'A join table for artists at an event.';

comment on column edm.artist_to_event.id is
  E'Primary key and id of row.';
comment on column edm.artist_to_event.artist_id is
  E'Ref to artist.';
comment on column edm.artist_to_event.event_id is
  E'Ref to event.';
