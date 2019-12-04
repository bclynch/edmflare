drop table edm.user_emails;
drop function edm.tg_user_emails__forbid_if_verified();
drop trigger _900_send_verification_email on edm.user_emails;
