create table public.converter_pair_events (
  id uuid primary key default gen_random_uuid(),
  city_a text not null,
  city_b text not null,
  used_at timestamptz not null default now(),
  check (city_a ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  check (city_b ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  check (city_a < city_b)
);

create index converter_pair_events_pair_idx
on public.converter_pair_events (city_a, city_b, used_at desc);

alter table public.converter_pair_events enable row level security;

revoke all on public.converter_pair_events from anon, authenticated;
grant insert on public.converter_pair_events to anon, authenticated;
grant select on public.converter_pair_events to authenticated;

create policy "visitors can record valid converter pairs"
on public.converter_pair_events for insert
to anon, authenticated
with check (
  city_a ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  and city_b ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  and city_a < city_b
);

create policy "admins can read converter usage"
on public.converter_pair_events for select
to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = (select auth.uid()) and profiles.role = 'admin'
));
