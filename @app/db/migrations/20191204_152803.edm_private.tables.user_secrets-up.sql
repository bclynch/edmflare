create table edm_private.user_secrets (
  user_id int not null primary key references edm.users on delete cascade,
  password_hash text,
  last_login_at timestamptz not null default now(),
  failed_password_attempts int not null default 0,
  first_failed_password_attempt timestamptz,
  reset_password_token text,
  reset_password_token_generated timestamptz,
  failed_reset_password_attempts int not null default 0,
  first_failed_reset_password_attempt timestamptz,
  delete_account_token text,
  delete_account_token_generated timestamptz
);
alter table edm_private.user_secrets enable row level security;
comment on table edm_private.user_secrets is
  E'The contents of this table should never be visible to the user. Contains data mostly related to authentication.';

create function edm_private.tg_user_secrets__insert_with_user() returns trigger as $$
begin
  insert into edm_private.user_secrets(user_id) values(NEW.id);
  return NEW;
end;
$$ language plpgsql volatile set search_path from current;
create trigger _500_insert_secrets
  after insert on edm.users
  for each row
  execute procedure edm_private.tg_user_secrets__insert_with_user();
comment on function edm_private.tg_user_secrets__insert_with_user() is
  E'Ensures that every user record has an associated user_secret record.';

create function edm.users_has_password(u edm.users) returns boolean as $$
  select (password_hash is not null) from edm_private.user_secrets where user_secrets.user_id = u.id and u.id = edm.current_user_id();
$$ language sql stable security definer;
