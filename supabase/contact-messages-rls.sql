-- ==============================================
-- RLS pentru contact_messages (/contact → /admin)
-- Aplicat pe 12 nov 2026 (alertă critică Supabase: RLS dezactivat).
-- Vizitatorii pot doar trimite mesaje; citire/marcare/ștergere doar adminul.
-- Adminul = contul cu app_metadata.role = 'admin' (contul email/parolă din Supabase Auth).
-- Ceilalți utilizatori logați (Google/Facebook) NU văd mesajele.
-- ==============================================

update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"admin"}'::jsonb
 where raw_app_meta_data->>'provider' = 'email';

alter table public.contact_messages enable row level security;

-- politici vechi, prea largi (orice utilizator logat citea/modifica)
drop policy if exists "anon can insert" on public.contact_messages;
drop policy if exists "auth can read" on public.contact_messages;
drop policy if exists "auth can update" on public.contact_messages;

create policy "public insert contact messages"
  on public.contact_messages for insert to anon, authenticated
  with check (coalesce(status,'new') = 'new');

create policy "admin read contact messages"
  on public.contact_messages for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin update contact messages"
  on public.contact_messages for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin delete contact messages"
  on public.contact_messages for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
