create table edm.push_subscription (
  id                 serial primary key,
  user_id            integer not null references edm.users(id) on delete cascade,
  endpoint           text not null,
  expiration_time    timestamp,
  p256dh             text not null,
  auth               text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

CREATE INDEX idx_pushsubscription_account ON edm.push_subscription (user_id);

alter table edm.push_subscription enable row level security;

GRANT ALL ON TABLE edm.push_subscription TO :DATABASE_VISITOR;
CREATE POLICY select_push_subscription ON edm.push_subscription for SELECT USING (true);
CREATE POLICY insert_push_subscription ON edm.push_subscription for INSERT WITH CHECK (user_id = edm.current_user_id());
CREATE POLICY update_push_subscription ON edm.push_subscription for UPDATE USING (user_id = edm.current_user_id());
CREATE POLICY delete_push_subscription ON edm.push_subscription for DELETE USING (user_id = edm.current_user_id());

create trigger _100_timestamps
  before insert or update on edm.push_subscription
  for each row
  execute procedure edm_private.tg__timestamps();

comment on table edm.push_subscription is
  E'A table with push subscription info.';

comment on column edm.push_subscription.id is
  E'Unique identifier for the push subscription.';
comment on column edm.push_subscription.user_id is
  E'Reference to the account this belongs to.';
comment on column edm.push_subscription.endpoint is
  E'This contains a unique URL to a Firebase Cloud Messaging endpoint. This url is a public but unguessable endpoint to the Browser Push Service used by the application server to send push notifications to this subscription.';
comment on column edm.push_subscription.expiration_time is
  E'This is useful in certain cases, for example, if a message might contain an authentication code that expires after 1 minute.';
comment on column edm.push_subscription.p256dh is
  E'An encryption key that our server will use to encrypt the message.';
comment on column edm.push_subscription.auth is
  E'An authentication secret, which is one of the inputs of the message content encryption process.';
