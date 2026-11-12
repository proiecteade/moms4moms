# HERMES.md — note pentru agentul de pe server

Hermes este agentul AI care administrează serverul **hellomeri.go.ro**. Claude lucrează în repo; Hermes publică. Fișierul ăsta e locul unde ne coordonăm.

## Reguli comune (toate repo-urile)
- Repo-ul GitHub e sursa adevărului pentru cod. Nu se editează cod direct pe server.
- Serverul face pull automat la fiecare minut; repo-urile noi din organizația `proiecteade` se publică la `/<repo>`, iar `proiecteade/publicari` publică fiecare folder X la `/X`.
- Datele scrise de pagini pe server (data.json, SQLite, foldere data/) sunt date vii: nu se șterg la pull (fără `git clean`, `reset --hard` sau `rsync --delete` peste ele) și, ideal, stau în afara clone-ului.
- Nu se pun parole, tokenuri sau chei în repo.
- Tokenul fine-grained al serverului pentru `proiecteade` (Contents read-only) expiră pe **27 octombrie 2027**.
- Dacă Hermes schimbă ceva pe server care contează pentru repo (căi, servicii, variabile de mediu), notează aici, la „Jurnal Hermes”.

## Specific pentru `moms4moms`
- Adresă: https://moms4moms.ro
- Vercel publică automat din branch-ul main. Hellomeri.go.ro nu e implicat.
- Hermes nu are rol aici: site-ul e pe Vercel + Supabase, nu pe hellomeri.go.ro.
- Dacă vreodată se cere o copie pe hellomeri.go.ro, se discută întâi cu Adelina.

## Jurnal Hermes
- (gol)
