-- ==============================================
-- Schema: splitbill_outings (Bon împărțit — /splitbill)
-- Rulează manual în Supabase SQL Editor
-- ==============================================

create table if not exists splitbill_outings (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  poza        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists splitbill_outings_created_at_idx
  on splitbill_outings (created_at desc);

-- RLS: ieșirile sunt comune pentru toată lumea (fără cont)
alter table splitbill_outings enable row level security;

create policy "public read splitbill"
  on splitbill_outings for select
  using (true);

create policy "public insert splitbill"
  on splitbill_outings for insert
  with check (true);

create policy "public update splitbill"
  on splitbill_outings for update
  using (true);

create policy "public delete splitbill"
  on splitbill_outings for delete
  using (true);
