create function edm.change_password(old_password text, new_password text) returns boolean as $$
declare
  v_user edm.users;
  v_user_secret edm_private.user_secrets;
begin
  select users.* into v_user
  from edm.users
  where id = edm.current_user_id();

  if not (v_user is null) then
    -- Load their secrets
    select * into v_user_secret from edm_private.user_secrets
    where user_secrets.user_id = v_user.id;

    if v_user_secret.password_hash = crypt(old_password, v_user_secret.password_hash) then
      perform edm_private.assert_valid_password(new_password);
      -- Reset the password as requested
      update edm_private.user_secrets
      set
        password_hash = crypt(new_password, gen_salt('bf'))
      where user_secrets.user_id = v_user.id;
      return true;
    else
      raise exception 'Incorrect password' using errcode = 'CREDS';
    end if;
  else
    raise exception 'You must log in to change your password' using errcode = 'LOGIN';
  end if;
end;
$$ language plpgsql strict volatile security definer;

comment on function edm.change_password(old_password text, new_password text) is
  E'Enter your old password and a new password to change your password.';

grant execute on function edm.change_password(text, text) to :DATABASE_VISITOR;
