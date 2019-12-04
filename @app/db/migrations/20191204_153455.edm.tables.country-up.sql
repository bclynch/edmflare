create table edm.country (
  code                text primary key,
  name                text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.country TO :DATABASE_VISITOR;
CREATE POLICY select_country ON edm.country for SELECT USING (true);
CREATE POLICY insert_country ON edm.country for INSERT WITH CHECK (true);

alter table edm.country enable row level security;

create trigger _100_timestamps
  before insert or update on edm.country
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.country is
  E'A country in the application.';

comment on column edm.country.code is
  E'Primary key and code for country.';
comment on column edm.country.name is
  E'Name for country.';

insert into edm.country (code, name) values
  ('US', 'United States'),
  ('CA', 'Canada');
