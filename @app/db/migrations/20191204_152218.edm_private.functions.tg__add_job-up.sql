create function edm_private.tg__add_job() returns trigger as $$
begin
  perform graphile_worker.add_job(tg_argv[0], json_build_object('id', NEW.id), coalesce(tg_argv[1], public.gen_random_uuid()::text));
  return NEW;
end;
$$ language plpgsql volatile security definer set search_path from current;
comment on function edm_private.tg__add_job() is
  E'Useful shortcut to create a job on insert/update. Pass the task name as the first trigger argument, and optionally the queue name as the second argument. The record id will automatically be available on the JSON payload.';
