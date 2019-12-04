create table edm.user_authentications (
  id serial primary key,
  user_id int not null references edm.users on delete cascade,
  service text not null,
  identifier text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uniq_user_authentications unique(service, identifier)
);

alter table edm.user_authentications enable row level security;
create index on edm.user_authentications(user_id);
create trigger _100_timestamps
  before insert or update on edm.user_authentications
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.user_authentications is
  E'Contains information about the login providers this user has used, so that they may disconnect them should they wish.';
comment on column edm.user_authentications.service is
  E'The login service used, e.g. `twitter` or `github`.';
comment on column edm.user_authentications.identifier is
  E'A unique identifier for the user within the login service.';
comment on column edm.user_authentications.details is
  E'Additional profile details extracted from this login method';

create policy select_own on edm.user_authentications for select using (user_id = edm.current_user_id());
create policy delete_own on edm.user_authentications for delete using (user_id = edm.current_user_id()); -- TODO check this isn't the last one, or that they have a verified email address

grant select on edm.user_authentications to :DATABASE_VISITOR;
grant delete on edm.user_authentications to :DATABASE_VISITOR;
