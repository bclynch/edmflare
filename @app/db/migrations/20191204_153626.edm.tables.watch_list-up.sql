create table edm.watch_list ( --one to many
  id                 serial primary key,
  user_id            integer not null references edm.users(id) on delete cascade,
  event_id           text not null references edm.event(id) on delete cascade
);

GRANT ALL ON TABLE edm.watch_list TO :DATABASE_VISITOR;
CREATE POLICY select_watch_list ON edm.watch_list for SELECT USING (true);
CREATE POLICY insert_watch_list ON edm.watch_list for INSERT WITH CHECK (user_id = edm.current_user_id());
CREATE POLICY update_watch_list ON edm.watch_list for UPDATE USING (user_id = edm.current_user_id());
CREATE POLICY delete_watch_list ON edm.watch_list for DELETE USING (user_id = edm.current_user_id());

CREATE INDEX idx_watchlist_account ON edm.watch_list (user_id);
CREATE INDEX idx_watchlist_event ON edm.watch_list (event_id);

alter table edm.watch_list enable row level security;

comment on table edm.watch_list is
  E'Join table for events watched by a user.';

comment on column edm.watch_list.id is
  E'Primary key and id of row.';
comment on column edm.watch_list.user_id is
  E'Ref to user.';
comment on column edm.watch_list.event_id is
  E'Ref to event.';
