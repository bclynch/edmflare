create function edm.resend_email_verification_code(email_id int) returns boolean as $$
begin
  if exists(
    select 1
    from edm.user_emails
    where user_emails.id = email_id
    and user_id = edm.current_user_id()
    and is_verified is false
  ) then
    perform graphile_worker.add_job('user_emails__send_verification', json_build_object('id', email_id));
    return true;
  end if;
  return false;
end;
$$ language plpgsql volatile security definer;
comment on function edm.resend_email_verification_code(email_id int) is
  E'If you didn''t receive the verification code for this email, we can resend it. We silently cap the rate of resends on the backend, so calls to this function may not result in another email being sent if it has been called recently.';
