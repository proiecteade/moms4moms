# CONTEXT — 💜 Moms4Moms — moms4moms.ro

> Citește-l la începutul fiecărui chat despre acest repo; actualizează-l la final.

## Ce e
Platforma de recomandări de medici (Next.js 16 + Supabase), plus /unde-iesim, /splitbill și /secretsanta.

- **Adresă:** https://moms4moms.ro
- **Repo:** proiecteade/moms4moms (branch main)

## Structură
`.claude`, `CLAUDE.md`, `archive`, `header.png`, `jsconfig.json`, `middleware.js`, `next.config.mjs`, `package-lock.json`, `package.json`, `public`, `scripts`, `src`, `supabase`

## Unde stau datele
Toate datele sunt în Supabase (medici, recenzii, restaurante, splitbill_*, secretsanta_*). CLAUDE.md e parțial depășit (scris în aprilie 2026).

## Cum se publică
Vercel publică automat din branch-ul main. Hellomeri.go.ro nu e implicat.

## Stare
- Ultimul commit înainte de reorganizare: 2026-11-11 — Secret Santa: listele de dorințe ale tuturor în panoul organizatoarei

## Unde sunt cheile (fără valori)
- Cheile Supabase (URL, anon, service role): în Vercel → proiectul moms4moms → Settings → Environment Variables (și local în `.env.local`, care nu e în git).
- Parola bazei de date Supabase: în Supabase → proiectul moms4moms → Settings → Database (se poate reseta fără să strice site-ul).
- Contul de admin al site-ului: Supabase Auth (contul email/parolă, marcat `app_metadata.role = 'admin'`).
- Tokenul serverului (Hermes, read-only pe proiecteade, expiră 27 oct 2027): pe server, `~/.config/proiecteade/token`.
- Recomandare: toate cheile de mai sus și parolele conturilor (GitHub, Vercel, Supabase) într-un manager de parole.

## Backup
- Baza de date Supabase: săptămânal, în repo-ul privat `proiecteade/backup` (`supabase/moms4moms/`).

## Cum lucrăm
- Proiectul Claude: **💜 Moms4Moms** — chatul 🛠 Features pentru cod/design, chatul 📝 Conținut doar pentru date.
- Claude face tot git-ul (commit, push) și verifică pagina live după publicare. Adelina nu urcă nimic manual.
- La finalul fiecărei sesiuni, Claude adaugă o linie în „Jurnal” mai jos.
- Reguli de publicare pe server: vezi HERMES.md.

## Jurnal
- 2026-11-12: creat CONTEXT.md și HERMES.md (organizarea pe proiecte Claude cu chat Features + chat Conținut).
- 2026-11-12: adăugat „Unde sunt cheile” și „Backup”.
- 2026-11-12: securitate — activat RLS pe `contact_messages` (alertă critică Supabase). Vizitatorii doar trimit mesaje; citire/marcare/ștergere doar adminul (`app_metadata.role='admin'`). Șterse 3 politici vechi prin care orice cont logat citea mesajele. SQL: `supabase/contact-messages-rls.sql`. De discutat: `doctors`, `reviews`, `suggestions`, `site_feedback` încă permit aprobare/ștergere oricărui cont logat (nu doar adminului).
