drop trigger _200_make_first_user_admin on edm.users;
drop function edm_private.tg_users__make_first_user_admin();
drop table edm.users;
