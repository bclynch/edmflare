create function edm.confirm_account_deletion(token text) returns boolean as $$
declare
  v_user_secret edm_private.user_secrets;
  v_token_max_duration interval = interval '3 days';
begin
  if edm.current_user_id() is null then
    raise exception 'You must log in to delete your account' using errcode = 'LOGIN';
  end if;

  select * into v_user_secret
    from edm_private.user_secrets
    where user_secrets.user_id = edm.current_user_id();

  if v_user_secret is null then
    -- Success: they're already deleted
    return true;
  end if;

  -- Check the token
  if v_user_secret.delete_account_token = token then
    -- Token passes; delete their account :(
    delete from edm.users where id = edm.current_user_id();
    return true;
  end if;

  raise exception 'The supplied token was incorrect - perhaps you''re logged in to the wrong account, or the token has expired?' using errcode = 'DNIED';
end;
$$ language plpgsql strict volatile security definer set search_path from current;

comment on function edm.confirm_account_deletion(token text) is
  E'If you''re certain you want to delete your account, use `requestAccountDeletion` to request an account deletion token, and then supply the token through this mutation to complete account deletion.';
