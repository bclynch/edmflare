create function edm.request_account_deletion() returns boolean as $$
declare
  v_user_email edm.user_emails;
  v_token text;
  v_token_max_duration interval = interval '3 days';
begin
  if edm.current_user_id() is null then
    raise exception 'You must log in to delete your account' using errcode = 'LOGIN';
  end if;

  -- Get the email to send account deletion token to
  select * into v_user_email
    from edm.user_emails
    where user_id = edm.current_user_id()
    and is_primary is true;

  -- Fetch or generate token
  update edm_private.user_secrets
  set
    delete_account_token = (
      case
      when delete_account_token is null or delete_account_token_generated < NOW() - v_token_max_duration
      then encode(gen_random_bytes(7), 'hex')
      else delete_account_token
      end
    ),
    delete_account_token_generated = (
      case
      when delete_account_token is null or delete_account_token_generated < NOW() - v_token_max_duration
      then now()
      else delete_account_token_generated
      end
    )
  where user_id = edm.current_user_id()
  returning delete_account_token into v_token;

  -- Trigger email send
  perform graphile_worker.add_job('user__send_delete_account_email', json_build_object('email', v_user_email.email::text, 'token', v_token));
  return true;
end;
$$ language plpgsql strict security definer volatile set search_path from current;

comment on function edm.request_account_deletion() is
  E'Begin the account deletion flow by requesting the confirmation email';
