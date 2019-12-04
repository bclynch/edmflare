create table edm_private.unregistered_email_password_resets (
  email citext constraint unregistered_email_pkey primary key,
  attempts int not null default 1,
  latest_attempt timestamptz not null
);
comment on table edm_private.unregistered_email_password_resets is
  E'If someone tries to recover the password for an email that is not registered in our system, this table enables us to rate-limit outgoing emails to avoid spamming.';
comment on column edm_private.unregistered_email_password_resets.attempts is
  E'We store the number of attempts to help us detect accounts being attacked.';
comment on column edm_private.unregistered_email_password_resets.latest_attempt is
  E'We store the time the last password reset was sent to this email to prevent the email getting flooded.';
