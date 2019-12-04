create table edm.venue (
  name                text primary key check (char_length(name) < 256),
  description         text check (char_length(description) < 2400),
  lat                 decimal,
  lon                 decimal,
  city                integer not null references edm.city(id) on delete cascade,
  address             text check (char_length(address) < 512),
  photo               text,
  logo                text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.venue TO :DATABASE_VISITOR;
CREATE POLICY select_venue ON edm.venue for SELECT USING (true);
CREATE POLICY insert_venue ON edm.venue for INSERT WITH CHECK (true);

CREATE INDEX idx_venue_city ON edm.venue (city);

alter table edm.venue enable row level security;

create trigger _100_timestamps
  before insert or update on edm.venue
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.venue is
  E'A venue in the application.';

comment on column edm.venue.name is
  E'Primary key and name of venue.';
comment on column edm.venue.description is
  E'Description of venue.';
comment on column edm.venue.lat is
  E'Latitude of venue.';
comment on column edm.venue.lon is
  E'Longitude of venue.';
comment on column edm.venue.city is
  E'Ref to city of venue.';
comment on column edm.venue.address is
  E'Address of venue.';
comment on column edm.venue.photo is
  E'Photo of venue.';
comment on column edm.venue.logo is
  E'Logo of venue.';
