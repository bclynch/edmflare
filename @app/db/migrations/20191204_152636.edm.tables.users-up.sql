create type edm.frequency as enum (
  'Every day',
  'Three times a week',
  'Two times a week',
  'Once a week',
  'Once every two weeks',
  'Never'
);

create table edm.users (
  id serial primary key,
  username citext not null unique check(length(username) >= 2 and length(username) <= 24 and username ~ '^[a-zA-Z]([a-zA-Z0-9][_]?)+$'),
  name text,
  profile_photo text check(profile_photo ~ '^https?://[^/]+'),
  is_admin boolean not null default false,
  notification_frequency edm.frequency not null default 'Never',
  push_notification      boolean default false,
  email_notification     boolean default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table edm.users enable row level security;

alter table edm_private.sessions add constraint sessions_user_id_fkey foreign key ("user_id") references edm.users on delete cascade;

create policy select_all on edm.users for select using (true);
create policy update_self on edm.users for update using (id = edm.current_user_id());
create policy delete_self on edm.users for delete using (id = edm.current_user_id());
grant select on edm.users to :DATABASE_VISITOR;
-- NOTE: `insert` is not granted, because we'll handle that separately
grant update(username, name, profile_photo, notification_frequency, push_notification, email_notification) on edm.users to :DATABASE_VISITOR;
-- NOTE: `delete` is not granted, because we require confirmation via request_account_deletion/confirm_account_deletion

comment on table edm.users is
  E'A user who can log in to the application.';

comment on column edm.users.id is
  E'Unique identifier for the user.';
comment on column edm.users.username is
  E'Public-facing username (or ''handle'') of the user.';
comment on column edm.users.name is
  E'Public-facing name (or pseudonym) of the user.';
comment on column edm.users.profile_photo is
  E'Optional avatar URL.';
comment on column edm.users.is_admin is
  E'If true, the user has elevated privileges.';
comment on column edm.users.notification_frequency is
  E'Designates notification frequency';
comment on column edm.users.push_notification is
  E'Boolean yes or no for push notifications';
comment on column edm.users.email_notification is
  E'Boolean yes or no for email notifications';

create trigger _100_timestamps
  before insert or update on edm.users
  for each row
  execute procedure edm_private.tg__timestamps();

create function edm_private.tg_users__make_first_user_admin() returns trigger as $$
begin
  NEW.is_admin = true;
  return NEW;
end;
$$ language plpgsql volatile set search_path from current;

create trigger _200_make_first_user_admin
  before insert on edm.users
  for each row
  when (NEW.id = 1)
  execute procedure edm_private.tg_users__make_first_user_admin();
