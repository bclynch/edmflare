create function edm.verify_email(user_email_id int, token text) returns boolean as $$
begin
  update edm.user_emails
  set
    is_verified = true,
    is_primary = is_primary or not exists(
      select 1 from edm.user_emails other_email where other_email.user_id = user_emails.user_id and other_email.is_primary is true
    )
  where id = user_email_id
  and exists(
    select 1 from edm_private.user_email_secrets where user_email_secrets.user_email_id = user_emails.id and verification_token = token
  );
  return found;
end;
$$ language plpgsql volatile strict security definer;
comment on function edm.verify_email(user_email_id int, token text) is
  E'Once you have received a verification token for your email, you may call this mutation with that token to make your email verified.';
