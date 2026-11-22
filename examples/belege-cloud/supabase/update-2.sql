-- Kuatia Update 2: Produkte pro Beleg und Geld pro Monat (Budget und Eingänge).
-- Im SQL Editor einfügen und "Run" klicken.

alter table public.receipts add column if not exists items jsonb not null default '[]'::jsonb;

create table if not exists public.money (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('budget', 'income')),
  month text not null,
  date date not null,
  amount numeric not null check (amount >= 0),
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists money_user_month on public.money (user_id, month);

alter table public.money enable row level security;
grant select, insert, update, delete on public.money to authenticated;
revoke all on public.money from anon;

drop policy if exists "eigenes Geld" on public.money;
create policy "eigenes Geld" on public.money
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
