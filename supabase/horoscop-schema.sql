-- Horoscop lunar (/horoscop) — luni, texte pe zodii, admini
-- Publicul vede doar lunile publicate; adminii (is_admin() sau email în horoscope_admins) văd și editează tot.

create table if not exists public.horoscope_admins (
  email text primary key,
  added_at timestamptz not null default now()
);
alter table public.horoscope_admins enable row level security;

create or replace function public.is_horoscope_admin()
returns boolean language sql stable security definer set search_path = ''
as $f$
  select public.is_admin() or exists (
    select 1 from public.horoscope_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$f$;

drop policy if exists "horoscope admins read" on public.horoscope_admins;
create policy "horoscope admins read" on public.horoscope_admins for select to authenticated using (public.is_horoscope_admin());
drop policy if exists "site admin manage horoscope admins" on public.horoscope_admins;
create policy "site admin manage horoscope admins" on public.horoscope_admins for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.horoscope_months (
  month text primary key check (month ~ '^\d{4}-\d{2}$'),     -- ex. 2026-11
  status text not null default 'draft' check (status in ('draft','published')),
  title text,                     -- ex. „Luna în care se limpezesc apele”
  intro text,                     -- energia generală a lunii
  watchouts jsonb not null default '[]'::jsonb,  -- [{start,end,title,text,kind,level}]
  sources jsonb not null default '[]'::jsonb,    -- [{name,url}]
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.horoscope_months enable row level security;

create table if not exists public.horoscope_entries (
  month text not null references public.horoscope_months(month) on delete cascade,
  sign text not null check (sign in ('berbec','taur','gemeni','rac','leu','fecioara','balanta','scorpion','sagetator','capricorn','varsator','pesti')),
  status text not null default 'draft' check (status in ('draft','approved')),
  teaser text,
  general text,
  love text,
  career text,
  health text,
  moms text,
  lucky_days text,
  lucky_color text,
  lucky_number text,
  tip text,
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (month, sign)
);
alter table public.horoscope_entries enable row level security;

drop policy if exists "public read published months" on public.horoscope_months;
create policy "public read published months" on public.horoscope_months for select to anon, authenticated
  using (status = 'published' or public.is_horoscope_admin());
drop policy if exists "horoscope admin write months" on public.horoscope_months;
create policy "horoscope admin write months" on public.horoscope_months for all to authenticated
  using (public.is_horoscope_admin()) with check (public.is_horoscope_admin());

drop policy if exists "public read published entries" on public.horoscope_entries;
create policy "public read published entries" on public.horoscope_entries for select to anon, authenticated
  using (public.is_horoscope_admin() or exists (
    select 1 from public.horoscope_months m where m.month = horoscope_entries.month and m.status = 'published'));
drop policy if exists "horoscope admin write entries" on public.horoscope_entries;
create policy "horoscope admin write entries" on public.horoscope_entries for all to authenticated
  using (public.is_horoscope_admin()) with check (public.is_horoscope_admin());

grant select on public.horoscope_months, public.horoscope_entries to anon, authenticated;
grant insert, update, delete on public.horoscope_months, public.horoscope_entries to authenticated;
grant select, insert, update, delete on public.horoscope_admins to authenticated;

-- Funcție pentru admin: „sunt admin de horoscop?”
grant execute on function public.is_horoscope_admin() to anon, authenticated;

-- 2026-11-13: profiluri de familie (relation: eu / copil / partener / altcineva)
-- vezi tabelul horoscope_profiles (RLS: doar proprietarul); constrângere relation extinsă cu 'altcineva'
