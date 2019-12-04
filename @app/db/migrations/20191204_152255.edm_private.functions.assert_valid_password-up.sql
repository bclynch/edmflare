create function edm_private.assert_valid_password(new_password text) returns void as $$
begin
  -- TODO: add better assertions!
  if length(new_password) < 8 then
    raise exception 'Password is too weak' using errcode = 'WEAKP';
  end if;
end;
$$ language plpgsql volatile;
