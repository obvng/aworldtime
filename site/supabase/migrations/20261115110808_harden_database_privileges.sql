-- RLS does not protect TRUNCATE, REFERENCES, or TRIGGER privileges. Keep only
-- the operations the public API needs instead of inheriting broad defaults.
revoke all privileges on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

revoke all privileges on table public.posts from anon, authenticated;
grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;

-- Trigger functions run through their triggers and do not need to be callable
-- through PostgREST's RPC endpoint.
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
