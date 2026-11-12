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

## Cum lucrăm
- Proiectul Claude: **💜 Moms4Moms** — chatul 🛠 Features pentru cod/design, chatul 📝 Conținut doar pentru date.
- Claude face tot git-ul (commit, push) și verifică pagina live după publicare. Adelina nu urcă nimic manual.
- La finalul fiecărei sesiuni, Claude adaugă o linie în „Jurnal” mai jos.
- Reguli de publicare pe server: vezi HERMES.md.

## Jurnal
- 2026-11-12: creat CONTEXT.md și HERMES.md (organizarea pe proiecte Claude cu chat Features + chat Conținut).
