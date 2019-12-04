create function edm.tg_user_emails__verify_account_on_verified() returns trigger as $$
begin
  update edm.users set is_verified = true where id = new.user_id and is_verified is false;
  return new;
end;
$$ language plpgsql volatile security definer;

create trigger _500_verify_account_on_verified
  after insert or update of is_verified
  on edm.user_emails
  for each row
  when (new.is_verified is true)
  execute procedure edm.tg_user_emails__verify_account_on_verified();
