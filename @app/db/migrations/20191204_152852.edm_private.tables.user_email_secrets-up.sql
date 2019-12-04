create table edm_private.user_email_secrets (
  user_email_id int primary key references edm.user_emails on delete cascade,
  verification_token text,
  verification_email_sent_at timestamptz,
  password_reset_email_sent_at timestamptz
);
alter table edm_private.user_email_secrets enable row level security;
comment on table edm_private.user_email_secrets is
  E'The contents of this table should never be visible to the user. Contains data mostly related to email verification and avoiding spamming users.';
comment on column edm_private.user_email_secrets.password_reset_email_sent_at is
  E'We store the time the last password reset was sent to this email to prevent the email getting flooded.';

create function edm_private.tg_user_email_secrets__insert_with_user_email() returns trigger as $$
declare
  v_verification_token text;
begin
  if NEW.is_verified is false then
    v_verification_token = encode(gen_random_bytes(7), 'hex');
  end if;
  insert into edm_private.user_email_secrets(user_email_id, verification_token) values(NEW.id, v_verification_token);
  return NEW;
end;
$$ language plpgsql volatile security definer set search_path from current;

create trigger _500_insert_secrets
  after insert on edm.user_emails
  for each row
  execute procedure edm_private.tg_user_email_secrets__insert_with_user_email();
comment on function edm_private.tg_user_email_secrets__insert_with_user_email() is
  E'Ensures that every user_email record has an associated user_email_secret record.';
