create function edm.logout() returns void as $$
begin
  -- Delete the session
  delete from edm_private.sessions where uuid = edm.current_session_id();
  -- Clear the identifier from the transaction
  perform set_config('jwt.claims.session_id', '', true);
end;
$$ language plpgsql security definer volatile set search_path from current;
