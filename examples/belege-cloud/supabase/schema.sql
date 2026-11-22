-- Belege Scanner: Tabelle, Sicherheitsregeln und Foto-Speicher.
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und "Run" klicken.

create table if not exists public.receipts (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  merchant text not null default 'Unbekannt',
  amount numeric not null check (amount >= 0),
  currency text not null default 'PYG',
  rate numeric not null default 1,
  date date not null,
  category text not null default 'Sonstiges',
  type text not null default 'Quittung',
  ruc text not null default '',
  note text not null default '',
  photo_path text,
  created_at timestamptz not null default now()
);

create index if not exists receipts_user_date on public.receipts (user_id, date desc);

alter table public.receipts enable row level security;

drop policy if exists "eigene Belege" on public.receipts;
create policy "eigene Belege" on public.receipts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

drop policy if exists "eigene Fotos lesen" on storage.objects;
create policy "eigene Fotos lesen" on storage.objects for select to authenticated
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "eigene Fotos hochladen" on storage.objects;
create policy "eigene Fotos hochladen" on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "eigene Fotos ersetzen" on storage.objects;
create policy "eigene Fotos ersetzen" on storage.objects for update to authenticated
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
