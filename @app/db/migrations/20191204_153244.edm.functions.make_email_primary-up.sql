-- User may only have one primary email (and it must be verified)
create function edm.make_email_primary(email_id int) returns edm.user_emails as $$
declare
  v_user_email edm.user_emails;
begin
  select * into v_user_email from edm.user_emails where id = email_id and user_id = edm.current_user_id();
  if v_user_email is null then
    raise exception 'That''s not your email' using errcode = 'DNIED';
    return null;
  end if;
  if v_user_email.is_verified is false then
    raise exception 'You may not make an unverified email primary' using errcode = 'VRIFY';
  end if;
  update edm.user_emails set is_primary = false where user_id = edm.current_user_id() and is_primary is true and id <> email_id;
  update edm.user_emails set is_primary = true where user_id = edm.current_user_id() and is_primary is not true and id = email_id returning * into v_user_email;
  return v_user_email;
end;
$$ language plpgsql volatile security definer;
comment on function edm.make_email_primary(email_id int) is
  E'Your primary email is where we''ll notify of account events; other emails may be used for discovery or login. Use this when you''re changing your email address.';
