-- ==============================================
-- Moderare doar pentru admin (aplicat 12 nov 2026, din SQL Editor)
-- Înainte: ORICE cont logat (Google/Facebook) putea vedea „în așteptare”,
-- aproba, modifica sau șterge medici, recenzii, sugestii, feedback.
-- Și oricine (fără cont) putea șterge orice recomandare.
-- Adminul = app_metadata.role = 'admin' (vezi contact-messages-rls.sql).
-- Rămân neschimbate: inserarea publică (totul intră „pending”) și citirea celor aprobate.
-- ==============================================
begin;
create or replace function public.is_admin()
returns boolean language sql stable set search_path = ''
as $f$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false) $f$;

drop policy if exists "auth read all doctors" on public.doctors;
drop policy if exists "auth update doctors" on public.doctors;
drop policy if exists "auth delete doctors" on public.doctors;
create policy "admin read all doctors" on public.doctors for select to authenticated using (public.is_admin());
create policy "admin update doctors" on public.doctors for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete doctors" on public.doctors for delete to authenticated using (public.is_admin());

drop policy if exists "auth read all reviews" on public.reviews;
drop policy if exists "auth update reviews" on public.reviews;
drop policy if exists "auth delete reviews" on public.reviews;
create policy "admin read all reviews" on public.reviews for select to authenticated using (public.is_admin());
create policy "admin update reviews" on public.reviews for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete reviews" on public.reviews for delete to authenticated using (public.is_admin());
create policy "own delete reviews" on public.reviews for delete to authenticated using (user_id::text = auth.uid()::text);

drop policy if exists "auth read suggestions" on public.suggestions;
drop policy if exists "authenticated can update suggestions" on public.suggestions;
drop policy if exists "auth delete suggestions" on public.suggestions;
create policy "admin read suggestions" on public.suggestions for select to authenticated using (public.is_admin());
create policy "admin update suggestions" on public.suggestions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete suggestions" on public.suggestions for delete to authenticated using (public.is_admin());

drop policy if exists "auth read feedback" on public.site_feedback;
drop policy if exists "authenticated can update site_feedback" on public.site_feedback;
drop policy if exists "auth delete feedback" on public.site_feedback;
create policy "admin read feedback" on public.site_feedback for select to authenticated using (public.is_admin());
create policy "admin update feedback" on public.site_feedback for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete feedback" on public.site_feedback for delete to authenticated using (public.is_admin());

drop policy if exists "anon can delete recommendation by id" on public.recommendations;
create policy "own delete recommendations" on public.recommendations for delete to authenticated using (user_id::text = auth.uid()::text);
create policy "admin delete recommendations" on public.recommendations for delete to authenticated using (public.is_admin());
commit;
