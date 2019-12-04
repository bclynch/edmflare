drop table edm_private.user_email_secrets;
drop function edm_private.tg_user_email_secrets__insert_with_user_email();
drop trigger _500_insert_secrets on edm.user_emails;
