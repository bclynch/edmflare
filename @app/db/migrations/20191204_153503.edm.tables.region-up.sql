create table edm.region (
  name                text primary key,
  description         text,
  photo               text,
  country             text references edm.country(code) on delete cascade,
  lat                 decimal,
  lon                 decimal,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.region TO :DATABASE_VISITOR;
CREATE POLICY select_region ON edm.region for SELECT USING (true);
CREATE POLICY insert_region ON edm.region for INSERT WITH CHECK (true);

CREATE INDEX idx_region_country ON edm.region (country);

alter table edm.region enable row level security;

create trigger _100_timestamps
  before insert or update on edm.region
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.region is
  E'A table with regions.';

comment on column edm.region.name is
  E'Name and primary key of region.';
comment on column edm.region.description is
  E'Description of the region.';
comment on column edm.region.photo is
  E'Photo of the region.';
comment on column edm.region.country is
  E'Country ref region belongs to.';
comment on column edm.region.lat is
  E'Latitude location of the region.';
comment on column edm.region.lon is
  E'Longitude location of the region.';

  insert into edm.region (name, description, photo, country, lat, lon) values
  ('Bay Area', null, null, 'US', 37.7749, -122.4194),
  ('Carolina', null, null, 'US', 35.7796, -78.6382),
  ('Los Angeles', null, null, 'US', 34.0522, -118.2437),
  ('San Diego', null, null, 'US', 32.7157, -117.1611),
  ('Oregon', null, null, 'US', 45.5122, -122.6587),
  ('Texas', null, null, 'US', 32.7767, -96.7970),
  ('Washington', null, null, 'US', 47.6062, -122.3321),
  ('British Columbia', null, null, 'CA', 49.2827, -123.1207),
  ('Twin Cities', null, null, 'US', 44.9778, -93.2650),
  ('Georgia', null, null, 'US', 33.7490, -84.3880),
  ('Michigan', null, null, 'US', 42.3314, -83.0458),
  ('DC', null, null, 'US', 38.9072, -77.0369),
  ('Sacramento', null, null, 'US', 38.5816, -121.4944),
  ('Nevada', null, null, 'US', 36.1699, -115.1398),
  ('Wisconsin', null, null, 'US', 43.0731, -89.4012),
  ('Chicago', null, null, 'US', 41.8781, -87.6298),
  ('New York', null, null, 'US', 40.7128, -74.0060),
  ('Ontario', null, null, 'CA', 51.2538, -85.3232),
  ('Utah', null, null, 'US', 40.7608, -111.8910),
  ('Florida', null, null, 'US', 25.7617, -80.1918),
  ('South', null, null, 'US', 29.9511, -90.0715),
  ('Quebec', null, null, 'CA', 52.9399, -73.5491),
  ('Tennessee', null, null, 'US', 36.1627, -86.7816),
  ('Southwest', null, null, 'US', 33.4484, -112.0740),
  ('Pennsylvania', null, null, 'US', 40.4406, -79.9959),
  ('New Jersey', null, null, 'US', 39.3643, -74.4229),
  ('Alberta', null, null, 'CA', 53.9333, -116.5765),
  ('Northeast', null, null, 'US', 42.3601, -71.0589),
  ('Rockies', null, null, 'US', 39.7392, -104.9903),
  ('Manitoba', null, null, 'CA', 53.7609, -98.8139),
  ('Nova Scotia', null, null, 'CA', 44.6820, -63.7443),
  ('New Brunswick', null, null, 'CA', 46.5653, -66.4619),
  ('Saskatchewan', null, null, 'CA', 52.1332, -106.6700),
  ('Heartland', null, null, 'US', 39.0997, -94.5786),
  ('Alaska', null, null, 'US', 61.2181, -149.9003),
  ('Hawaii', null, null, 'US', 19.8968, -155.5828),
  ('Rust Belt', null, null, 'US', 41.4993, -81.6944);
