create function edm.current_user() returns edm.users as $$
  select users.* from edm.users where id = edm.current_user_id();
$$ language sql stable;
comment on function edm.current_user() is
  E'The currently logged in user (or null if not logged in).';
