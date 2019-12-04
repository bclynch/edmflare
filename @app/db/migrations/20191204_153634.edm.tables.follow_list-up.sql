create table edm.follow_list ( --one to many
  id                 serial primary key,
  user_id            integer not null references edm.users(id) on delete cascade,
  artist_id          text references edm.artist(name) on delete cascade,
  venue_id           text references edm.venue(name) on delete cascade
);

GRANT ALL ON TABLE edm.follow_list TO :DATABASE_VISITOR;
CREATE POLICY select_follow_list ON edm.follow_list for SELECT USING (true);
CREATE POLICY insert_follow_list ON edm.follow_list for INSERT WITH CHECK (user_id = edm.current_user_id());
CREATE POLICY update_follow_list ON edm.follow_list for UPDATE USING (user_id = edm.current_user_id());
CREATE POLICY delete_follow_list ON edm.follow_list for DELETE USING (user_id = edm.current_user_id());

CREATE INDEX idx_followlist_account ON edm.follow_list (user_id);
CREATE INDEX idx_followlist_artist ON edm.follow_list (artist_id);
CREATE INDEX idx_followlist_venue ON edm.follow_list (venue_id);

alter table edm.follow_list enable row level security;

comment on table edm.follow_list is
  E'Join table for followed artists or venues by a user.';

comment on column edm.follow_list.id is
  E'Primary key and id of row.';
comment on column edm.follow_list.user_id is
  E'Ref to user.';
comment on column edm.follow_list.artist_id is
  E'Ref to artist.';
comment on column edm.follow_list.venue_id is
  E'Ref to venue.';
