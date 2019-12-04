create table edm.artist (
  name                text primary key,
  description         text,
  photo               text,
  twitter_username    text,
  twitter_url         text,
  facebook_username   text,
  facebook_url        text,
  instagram_username  text,
  instagram_url       text,
  soundcloud_username text,
  soundcloud_url      text,
  youtube_username    text,
  youtube_url         text,
  spotify_url         text,
  homepage            text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.artist TO :DATABASE_VISITOR;
CREATE POLICY select_artist ON edm.artist for SELECT USING (true);
CREATE POLICY insert_artist ON edm.artist for INSERT WITH CHECK (true);

alter table edm.artist enable row level security;

create trigger _100_timestamps
  before insert or update on edm.artist
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.artist is
  E'An artist in the application.';

comment on column edm.artist.name is
  E'Primary key and name of artist.';
comment on column edm.artist.description is
  E'Description of the artist.';
comment on column edm.artist.photo is
  E'Photo of the artist.';
comment on column edm.artist.twitter_username is
  E'Twitter username of the artist.';
comment on column edm.artist.twitter_url is
  E'Twitter url of the artist.';
comment on column edm.artist.facebook_username is
  E'Facebook username of the artist.';
comment on column edm.artist.facebook_url is
  E'Facebook url of the artist.';
comment on column edm.artist.instagram_username is
  E'Instagram username of the artist.';
comment on column edm.artist.instagram_url is
  E'Instagram url of the artist.';
comment on column edm.artist.soundcloud_username is
  E'Soundcloud username of the artist.';
comment on column edm.artist.soundcloud_url is
  E'Soundcloud url of the artist.';
comment on column edm.artist.youtube_username is
  E'Youtube username of the artist.';
comment on column edm.artist.youtube_url is
  E'Youtube url of the artist.';
comment on column edm.artist.spotify_url is
  E'Spotify url of the artist.';
comment on column edm.artist.homepage is
  E'Homepage url of the artist.';
