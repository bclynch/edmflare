-- when we migrated this table originally we had specific id integers already set
-- which doesn't jive with normal serialized processing. By creating our own we can set the key values ourself
-- OR default to next interval
CREATE SEQUENCE edm.city_sequence;
create table edm.city (
  id                  integer PRIMARY KEY default nextval('edm.city_sequence'),
  name                text,
  description         text,
  photo               text,
  region              text references edm.region(name) on delete cascade,
  country             text references edm.country(code) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.city TO :DATABASE_VISITOR;
CREATE POLICY select_city ON edm.city for SELECT USING (true);
CREATE POLICY insert_city ON edm.city for INSERT WITH CHECK (true);

CREATE INDEX idx_city_region ON edm.city (region);
CREATE INDEX idx_city_country ON edm.city (country);

alter table edm.city enable row level security;
alter sequence edm.city_sequence owned by edm.city.id;

create trigger _100_timestamps
  before insert or update on edm.city
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.city is
  E'A city in the application.';

comment on column edm.city.id is
  E'Primary key and id for city.';
comment on column edm.city.name is
  E'Name for city.';
comment on column edm.city.description is
  E'Description for city.';
comment on column edm.city.photo is
  E'Photo for city.';
comment on column edm.city.region is
  E'Region ref for city.';
comment on column edm.city.country is
  E'Region ref for country.';
