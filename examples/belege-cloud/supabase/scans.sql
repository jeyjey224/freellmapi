-- Zählt Scans pro Konto für das Tageslimit der Belegerkennung.
-- Im SQL Editor einfügen und "Run" klicken.

create table if not exists public.scans (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists scans_user_time on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;
grant select, insert on public.scans to authenticated;
revoke all on public.scans from anon;

drop policy if exists "eigene Scans" on public.scans;
create policy "eigene Scans" on public.scans
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
