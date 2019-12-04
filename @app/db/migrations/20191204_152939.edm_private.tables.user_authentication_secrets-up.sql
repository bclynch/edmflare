create table edm_private.user_authentication_secrets (
  user_authentication_id int not null primary key references edm.user_authentications on delete cascade,
  details jsonb not null default '{}'::jsonb
);
alter table edm_private.user_authentication_secrets enable row level security;

-- NOTE: user_authentication_secrets doesn't need an auto-inserter as we handle
-- that everywhere that can create a user_authentication row.
