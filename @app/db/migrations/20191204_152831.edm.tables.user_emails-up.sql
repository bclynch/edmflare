create table edm.user_emails (
  id serial primary key,
  user_id int not null default edm.current_user_id() references edm.users on delete cascade,
  email citext not null check (email ~ '[^@]+@[^@]+\.[^@]+'),
  is_verified boolean not null default false,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_emails_user_id_email_key unique(user_id, email),
  constraint user_emails_must_be_verified_to_be_primary check(is_primary is false or is_verified is true)
);
alter table edm.user_emails enable row level security;

-- Once an email is verified, it may only be used by one user
create unique index uniq_user_emails_verified_email on edm.user_emails(email) where (is_verified is true);
-- Only one primary email per user
create unique index uniq_user_emails_primary_email on edm.user_emails (user_id) where (is_primary is true);
create index idx_user_emails_primary on edm.user_emails (is_primary, user_id);

create trigger _100_timestamps
  before insert or update on edm.user_emails
  for each row
  execute procedure edm_private.tg__timestamps();

create function edm.tg_user_emails__forbid_if_verified() returns trigger as $$
begin
  if exists(select 1 from edm.user_emails where email = NEW.email and is_verified is true) then
    raise exception 'An account using that email address has already been created.' using errcode='EMTKN';
  end if;
  return NEW;
end;
$$ language plpgsql volatile security definer set search_path from current;
create trigger _200_forbid_existing_email before insert on edm.user_emails for each row execute procedure edm.tg_user_emails__forbid_if_verified();

create trigger _900_send_verification_email
  after insert on edm.user_emails
  for each row
  when (NEW.is_verified is false)
  execute procedure edm_private.tg__add_job('user_emails__send_verification');

comment on table edm.user_emails is
  E'Information about a user''s email address.';
comment on column edm.user_emails.email is
  E'The users email address, in `a@b.c` format.';
comment on column edm.user_emails.is_verified is
  E'True if the user has is_verified their email address (by clicking the link in the email we sent them, or logging in with a social login provider), false otherwise.';
create policy select_own on edm.user_emails for select using (user_id = edm.current_user_id());
create policy insert_own on edm.user_emails for insert with check (user_id = edm.current_user_id());
-- No update
create policy delete_own on edm.user_emails for delete using (user_id = edm.current_user_id()); -- TODO check this isn't the last one!
grant select on edm.user_emails to :DATABASE_VISITOR;
grant insert (email) on edm.user_emails to :DATABASE_VISITOR;
-- No update
grant delete on edm.user_emails to :DATABASE_VISITOR;
