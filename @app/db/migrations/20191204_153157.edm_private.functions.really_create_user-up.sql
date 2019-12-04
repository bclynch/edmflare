create function edm_private.really_create_user(
  username citext,
  email text,
  email_is_verified bool,
  name text,
  profile_photo text,
  password text default null
) returns edm.users as $$
declare
  v_user edm.users;
  v_username citext = username;
begin
  if password is not null then
    perform edm_private.assert_valid_password(password);
  end if;
  if email is null then
    raise exception 'Email is required' using errcode = 'MODAT';
  end if;

  -- Insert the new user
  insert into edm.users (username, name, profile_photo) values
    (v_username, name, profile_photo)
    returning * into v_user;

	-- Add the user's email
  insert into edm.user_emails (user_id, email, is_verified, is_primary)
  values (v_user.id, email, email_is_verified, email_is_verified);

  -- Store the password
  if password is not null then
    update edm_private.user_secrets
    set password_hash = crypt(password, gen_salt('bf'))
    where user_id = v_user.id;
  end if;

  -- Refresh the user
  select * into v_user from edm.users where id = v_user.id;

  return v_user;
end;
$$ language plpgsql volatile set search_path from current;

comment on function edm_private.really_create_user(username citext, email text, email_is_verified bool, name text, profile_photo text, password text) is
  E'Creates a user account. All arguments are optional, it trusts the calling method to perform sanitisation.';
