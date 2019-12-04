create table edm_private.sessions (
  uuid uuid not null default gen_random_uuid() primary key,
  user_id int not null,
  -- You could add access restriction columns here if you want, e.g. for OAuth scopes.
  created_at timestamptz not null default now(),
  last_active timestamptz not null default now()
);
alter table edm_private.sessions enable row level security;
