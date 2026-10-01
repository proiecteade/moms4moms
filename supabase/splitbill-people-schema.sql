-- ==============================================
-- Schema: splitbill_people (baza de oameni pentru /splitbill)
-- Rulează manual în Supabase SQL Editor
-- ==============================================

create table if not exists splitbill_people (
  name        text primary key,
  created_at  timestamptz not null default now()
);

alter table splitbill_people enable row level security;

create policy "public read splitbill people"
  on splitbill_people for select
  using (true);

create policy "public insert splitbill people"
  on splitbill_people for insert
  with check (true);

notify pgrst, 'reload schema';
