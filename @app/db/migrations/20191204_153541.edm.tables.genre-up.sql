create table edm.genre (
  name                text primary key check (char_length(name) < 80),
  description         text check (char_length(description) < 2400),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.genre TO :DATABASE_VISITOR;
CREATE POLICY select_genre ON edm.genre for SELECT USING (true);
CREATE POLICY insert_genre ON edm.genre for INSERT WITH CHECK (true);

alter table edm.genre enable row level security;

create trigger _100_timestamps
  before insert or update on edm.genre
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.genre is
  E'A genre in the application.';

comment on column edm.genre.name is
  E'Primary key and name of genre.';
comment on column edm.city.description is
  E'Description of the genre.';
