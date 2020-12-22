-- Limiting choices for type field on event
-- Add others as required for affiliate programs
create type edm.event_type as enum (
  'eventbrite',
  'ticketfly',
  'ticketmaster',
  'seetickets',
  'etix',
  'other',
  'livestream'
);

create table edm.event (
  id                  text primary key,
  venue               text not null references edm.venue(name) on delete cascade,
  city                integer not null references edm.city(id) on delete cascade,
  region              text references edm.region(name) on delete cascade,
  country             text references edm.country(code) on delete cascade,
  name                text check (char_length(name) < 512),
  description         text,
  type                edm.event_type,
  start_date          bigint not null,
  end_date            bigint,
  ticketProviderId    text, -- might just be int, but probably depends so this is safe
  ticketProviderUrl   text,
  banner              text,
  approved            boolean default false,
  contributor         integer references edm.users(id) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

GRANT ALL ON TABLE edm.event TO :DATABASE_VISITOR;
CREATE POLICY select_event ON edm.event for SELECT USING (true);
CREATE POLICY insert_event ON edm.event for SELECT USING (true);
CREATE POLICY update_event ON edm.event for UPDATE USING (contributor = edm.current_user_id());

CREATE INDEX idx_event_venue ON edm.event (venue);
CREATE INDEX idx_event_city ON edm.event (city);
CREATE INDEX idx_event_region ON edm.event (region);
CREATE INDEX idx_event_country ON edm.event (country);
CREATE INDEX idx_event_contributor ON edm.event (contributor);
CREATE INDEX idx_event_name ON edm.event (name);
CREATE INDEX idx_event_start ON edm.event (start_date);
CREATE INDEX idx_event_created ON edm.event (created_at);

alter table edm.event enable row level security;

create trigger _100_timestamps
  before insert or update on edm.event
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.event is
  E'A genre in the application.';

comment on column edm.event.id is
  E'Primary key and id of event.';
comment on column edm.event.venue is
  E'Ref to venue where event takes place.';
comment on column edm.event.city is
  E'Ref to city where event takes place.';
comment on column edm.event.region is
  E'Ref to region where event takes place.';
comment on column edm.event.country is
  E'Ref to country where event takes place.';
comment on column edm.event.name is
  E'Name of event.';
comment on column edm.event.description is
  E'Description of event.';
comment on column edm.event.type is
  E'Type of event.';
comment on column edm.event.start_date is
  E'Start date of event.';
comment on column edm.event.end_date is
  E'End date of event.';
comment on column edm.event.ticketProviderId is
  E'Id by the ticket provider useful for affiliate links.';
comment on column edm.event.ticketProviderUrl is
  E'URL by the ticket provider useful for affiliate links.';
comment on column edm.event.banner is
  E'Banner of event page.';
comment on column edm.event.approved is
  E'Whether to display event if it has been approved.';
comment on column edm.event.contributor is
  E'Who submitted the event.';
