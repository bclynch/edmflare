create function edm.current_session_id() returns uuid as $$
  select nullif(pg_catalog.current_setting('jwt.claims.session_id', true), '')::uuid;
$$ language sql stable;
comment on function edm.current_session_id() is
  E'Handy method to get the current session ID.';
-- We've put this in public, but omitted it, because it's often useful for debugging auth issues.

/*
 * A less secure but more performant version of this function would be just:
 *
 *  select nullif(pg_catalog.current_setting('jwt.claims.user_id', true), '')::int;
 *
 * The increased security of this implementation is because even if someone gets
 * the ability to run SQL within this transaction they cannot impersonate
 * another user without knowing their session_id (which should be closely
 * guarded).
 */
create function edm.current_user_id() returns int as $$
  select user_id from edm_private.sessions where uuid = edm.current_session_id();
$$ language sql stable security definer set search_path from current;
comment on function edm.current_user_id() is
  E'Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead.';
-- We've put this in public, but omitted it, because it's often useful for debugging auth issues.
