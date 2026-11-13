# CONTEXT — 💜 Moms4Moms — moms4moms.ro

> Citește-l la începutul fiecărui chat despre acest repo; actualizează-l la final.

## Ce e
Platforma de recomandări de medici (Next.js 16 + Supabase), plus /unde-iesim, /splitbill, /secretsanta și /horoscop (vezi HOROSCOP.md).

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
- 2026-11-12: securitate — activat RLS pe `contact_messages` (alertă critică Supabase). Vizitatorii doar trimit mesaje; citire/marcare/ștergere doar adminul (`app_metadata.role='admin'`). Șterse 3 politici vechi prin care orice cont logat citea mesajele. SQL: `supabase/contact-messages-rls.sql`.
- 2026-11-12: securitate — moderarea doar pentru admin: la `doctors`, `reviews`, `suggestions`, `site_feedback` doar adminul (`public.is_admin()`) vede ce e în așteptare, aprobă, modifică, șterge. Fiecare își poate șterge doar recenziile și recomandările proprii (înainte oricine, fără cont, ștergea orice recomandare). SQL: `supabase/admin-only-moderation.sql`. De verificat: tabelul `restaurants` nu există în baza de date, deși „Unde ieșim” îl folosește.
- 2026-11-13: /horoscop: pagină publică cu design mistic (12 zodii, pagină pe zodie cu secțiunea „Pentru mămici”, „Atenție pentru toți” cu perioade, dicționarul planetelor) + admin la /horoscop/admin (editare, aprobare pe zodie, publicare pe lună, acces pentru încă un admin prin `horoscope_admins`). Tabele: `horoscope_months`, `horoscope_entries`, `horoscope_admins` (SQL: `supabase/horoscop-schema.sql`). Noiembrie 2026 importat ca ciornă. Nav/Footer ascunse pe /horoscop (SiteShell). Reguli: HOROSCOP.md.
- 2026-11-13: /horoscop personalizat: logat → horoscopul tău + familia (zodie, ascendent, Luna calculate din data, ora și localitatea nașterii), compatibilități, „Atenție în familia ta”. Tabel nou `horoscope_profiles` (RLS doar proprietarul), coloane noi `family` și `kids` în `horoscope_entries`, `signs` pe fiecare perioadă. Pagina zodiei: „Tu ca mamă” lângă „Sănătate”, Atenție complet. Fără dicționar pe site. CSP: adăugat geocoding-api.open-meteo.com. Privacy: secțiunea 6b.
- 2026-11-13: horoscop — gen (f/m) pe fiecare profil și texte cu `{masculin|feminin}` (funcția `g()` din `src/lib/horoscop.js`); copiii cu aceeași zodie se diferențiază prin ascendent (textul lunar al ascendentului) și Lună (`MOON_NEEDS`); login pornit de pe /horoscop întoarce la /horoscop; ciorna lunară programată pe 20 ale lunii.
- 2026-11-13: noiembrie 2026 aprobat și publicat (la cererea Adelinei).
- 2026-11-13: horoscop — cardurile familiei arată doar relația pe luna asta (`pair_notes` pe lună + zile comune); pagină nouă /horoscop/familie/<id> cu horoscopul complet al fiecărui membru; linkuri spre horoscopul general pe toate paginile personale.
- 2026-11-13: horoscop — pagina copilului: „pe larg” (câmp lunar `kids_more`) + portretul fix al copilului pe zodie (`KID_PROFILE`); forme pentru pereche „voi două / amândouă” (`((m|f))`).
- 2026-11-13: horoscop — pe pagina copilului, caseta „Idee de activitate luna asta” (câmp lunar `kids_activity`).
- 2026-11-13: login din /horoscop → întoarcere garantată pe /horoscop (localStorage `post_login`, citit în AuthProvider), chiar dacă Supabase trimite pe pagina principală; mesaj de login specific pe /horoscop.
- 2026-11-13: Supabase → Auth → URL Configuration: adăugate redirect URLs `https://www.moms4moms.ro/**` și `https://moms4moms.ro/**` (înainte doar /auth/callback fără www, deci logarea cădea pe Site URL).
- 2026-11-13: horoscop — lista de localități reparată pentru Safari/iPhone (z-index peste cardurile cu backdrop-filter, închidere la atingere în afară, buton „Închide lista”, Enter alege prima variantă, mesaj dacă nu alegi din listă).
- 2026-11-13: eroare „This page couldn't load” pe /horoscop pentru 5 conturi care puseseră două persoane „Eu”: am mutat al doilea „Eu” pe relația nouă `altcineva` („Alt membru”), formularul nu mai permite două „Eu”, inserările întorc id (fără dubluri la reîncercare), pagină de eroare prietenoasă `src/app/horoscop/error.js`.
- 2026-11-13: dubla salvare în formularul de familie (butonul se reactiva înainte de redirect) → persoane dublate; blocat cu `lock` + insert care întoarce id.
- 2026-11-13: șterse 10 profiluri dublate (5 conturi, inclusiv Lorena), păstrat originalul cel mai vechi; 0 dubluri rămase.
- 2026-11-13: horoscop — „Azi pe cer”, zile de naștere (mesaj + idee de petrecere/cadou), „Cum să-i vorbești” pe pagina copilului, compatibilitatea dintre frați (pe pagina ta și pe pagina fiecărui copil).
- 2026-11-13: horoscop — pe pagina fiecărui membru, secțiunea „<nume> și ceilalți”: compatibilitatea cu fiecare alt membru (frați, părinte–copil la persoana a III-a, adulți), `familyPair()` în horoscopKids.js.
