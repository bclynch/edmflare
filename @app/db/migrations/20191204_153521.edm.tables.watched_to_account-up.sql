create table edm.watched_to_account ( --one to many
  id                 serial primary key,
  user_id            integer not null references edm.users(id) on delete cascade,
  region             text references edm.region(name) on delete cascade,
  city_id            integer references edm.city(id) on delete cascade
);

GRANT ALL ON TABLE edm.watched_to_account TO :DATABASE_VISITOR;
CREATE POLICY select_watched_to_account ON edm.watched_to_account for SELECT USING (true);
CREATE POLICY insert_watched_to_account ON edm.watched_to_account for INSERT WITH CHECK (user_id = edm.current_user_id());
CREATE POLICY update_watched_to_account ON edm.watched_to_account for UPDATE USING (user_id = edm.current_user_id());
CREATE POLICY delete_watched_to_account ON edm.watched_to_account for DELETE USING (user_id = edm.current_user_id());

CREATE INDEX idx_watchedtoaccount_account ON edm.watched_to_account (user_id);
CREATE INDEX idx_watchedtoaccount_region ON edm.watched_to_account (region);
CREATE INDEX idx_watchedtoaccount_city ON edm.watched_to_account (city_id);

alter table edm.watched_to_account enable row level security;

comment on table edm.watched_to_account is
  E'A join table for watched location to an account.';

comment on column edm.watched_to_account.id is
  E'Id of the row.';
comment on column edm.watched_to_account.user_id is
  E'Ref to user account.';
comment on column edm.watched_to_account.region is
  E'Ref to region.';
comment on column edm.watched_to_account.city_id is
  E'Ref to city.';
