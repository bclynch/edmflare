create table edm_private.connect_pg_simple_sessions (
  sid varchar not null,
	sess json not null,
	expire timestamp not null
);
alter table edm_private.connect_pg_simple_sessions
  enable row level security;
alter table edm_private.connect_pg_simple_sessions
  add constraint session_pkey primary key (sid) not deferrable initially immediate;
