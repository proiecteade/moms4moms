-- Schema Moms4Moms
-- Rulează asta în Supabase SQL Editor

create table if not exists doctors (
  id text primary key,
  first_name text not null,
  last_name text default '',
  specs text[] default '{}',
  city text not null,
  clinics text[] default '{}',
  obs text default '',
  note text default '',
  status text default 'pending',
  submitted_at bigint
);

create table if not exists reviews (
  id text primary key,
  doctor_id text references doctors(id) on delete cascade,
  rating integer check (rating between 1 and 5),
  reviewer text default 'Anonim',
  text text not null,
  date text,
  status text default 'pending'
);

create table if not exists suggestions (
  id text primary key,
  doctor_id text,
  doctor_name text,
  text text not null,
  date text
);

create table if not exists site_feedback (
  id text primary key,
  rating integer,
  text text,
  date text
);

-- Row Level Security
alter table doctors enable row level security;
alter table reviews enable row level security;
alter table suggestions enable row level security;
alter table site_feedback enable row level security;

-- Doctors: public can read approved, authenticated can read all
create policy "public read approved doctors" on doctors for select using (status = 'approved');
create policy "auth read all doctors" on doctors for select to authenticated using (true);
create policy "public insert pending doctors" on doctors for insert with check (status = 'pending');
create policy "auth update doctors" on doctors for update to authenticated using (true);
create policy "auth delete doctors" on doctors for delete to authenticated using (true);

-- Reviews: public can read approved, authenticated can read all
create policy "public read approved reviews" on reviews for select using (status = 'approved');
create policy "auth read all reviews" on reviews for select to authenticated using (true);
create policy "public insert pending reviews" on reviews for insert with check (status = 'pending');
create policy "auth update reviews" on reviews for update to authenticated using (true);
create policy "auth delete reviews" on reviews for delete to authenticated using (true);

-- Suggestions: public insert, auth read/delete
create policy "public insert suggestions" on suggestions for insert with check (true);
create policy "auth read suggestions" on suggestions for select to authenticated using (true);
create policy "auth delete suggestions" on suggestions for delete to authenticated using (true);

-- Site feedback: public insert, auth read/delete
create policy "public insert feedback" on site_feedback for insert with check (true);
create policy "auth read feedback" on site_feedback for select to authenticated using (true);
create policy "auth delete feedback" on site_feedback for delete to authenticated using (true);
