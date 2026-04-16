-- ==============================================
-- Schema: restaurants + extensii reviews/recommendations
-- Rulează manual în Supabase SQL Editor
-- ==============================================

create table if not exists restaurants (
  id              text primary key,
  name            text not null,
  slug            text unique,
  tip             text not null,
  bucatarie       text[] default '{}',
  city            text not null,
  zona            text default '',
  adresa          text default '',
  website         text default '',
  phone           text default '',
  google_place_id text default '',
  photo_url       text default '',
  obs             text default '',
  status          text default 'pending',
  submitted_at    bigint
);

-- Adaugă restaurant_id la reviews (nullable, alături de doctor_id existent)
alter table reviews
  add column if not exists restaurant_id text references restaurants(id) on delete cascade;

-- Adaugă restaurant_id la recommendations
alter table recommendations
  add column if not exists restaurant_id text references restaurants(id) on delete cascade;

-- RLS pentru restaurants
alter table restaurants enable row level security;

create policy "public read approved restaurants"
  on restaurants for select
  using (status = 'approved');

create policy "auth read all restaurants"
  on restaurants for select
  to authenticated
  using (true);

create policy "public insert pending restaurants"
  on restaurants for insert
  with check (status = 'pending');

create policy "auth update restaurants"
  on restaurants for update
  to authenticated
  using (true);

create policy "auth delete restaurants"
  on restaurants for delete
  to authenticated
  using (true);
