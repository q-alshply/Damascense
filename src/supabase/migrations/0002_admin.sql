-- Promote an existing auth user to admin.
-- 1. Create the user first: Supabase Dashboard → Authentication → Add user
--    (set a password, mark email confirmed).
-- 2. Replace the email below and run this file.

insert into admin_users (user_id, email)
select id, email from auth.users where email = 'liftx.sy@gmail.com'
on conflict (user_id) do nothing;
