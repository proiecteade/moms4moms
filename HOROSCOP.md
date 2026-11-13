# HOROSCOP.md — cum se face horoscopul lunar (/horoscop)

## Pe scurt
- Pagina publică: https://moms4moms.ro/horoscop (+ /horoscop/<zodie>)
- Adminul: https://moms4moms.ro/horoscop/admin (Adelina + cine e în tabelul `horoscope_admins`)
- Date: Supabase, tabelele `horoscope_months` (luna, intro, „Atenție pentru toți”, surse) și `horoscope_entries` (12 zodii).
- Publicul vede doar lunile cu `status = 'published'`. Ciornele se văd doar de admin, cu `?preview=1`.

## Fluxul lunar
1. În jurul datei de 20 a lunii, Claude citește sursele pentru luna următoare și scrie ciorna (`scripts/horoscop/AAAA-LL.json` → import în Supabase ca `draft`).
2. Adminii citesc, editează și aprobă fiecare zodie în /horoscop/admin.
3. Adminii apasă „Publică luna”. Până atunci, pe site rămâne luna precedentă.
4. Claude nu publică niciodată singur și nu suprascrie o zodie aprobată (importul atinge doar rândurile `draft`).

## Surse (alese de Adelina)
- https://www.astrocafe.ro/horoscop/lunar: temele lunii pe zodii
- https://astro-urseanu.ro/fazele-lunii/: datele și orele Lunii Noi și ale Lunii Pline. Coloana lor arată constelația astronomică, iar zodia astrologică se ia din calendarul astrologic.
- https://astro-urseanu.ro/saptamana-astronomica/: ce fac planetele pe cer, ca să interpretăm impactul
- Pentru verificarea datelor (retrograde, intrări în zodii, conjuncții): un calendar astrologic, de exemplu CHANI.

## Reguli de scris
- Rezumat în cuvintele noastre. Nu copiem fraze din surse.
- Sursele NU apar pe pagina publică, ci doar în admin.
- Ton: cald, practic, de la mamă la mamă. Secțiunea „Pentru mămici” e obligatorie la fiecare zodie, cu un sfat concret pentru viața cu copiii.
- Secțiuni: teaser, energia lunii, dragoste, carieră și bani, sănătate și energie, „Tu ca mamă”, „În familie” (`family`), „Copilul din zodia asta” (`kids`, scurt) și `kids_more` (textul „Luna asta” de pe pagina copilului: 5 fraze, compilate din horoscopul general al zodiei, aplicate pe copil: stare, energie, relațiile cu ceilalți, somn, ce îl ajută, cu date), zile bune, culoare, cifră, sfatul lunii.
- La fiecare perioadă din „Atenție pentru toți” se trec zodiile cele mai atinse (`signs`), pentru că din ele se face „Atenție în familia ta” pe pagina personalizată. Perioadele se scriu în ordinea datelor.
- Dicționarul planetelor de mai jos e doar pentru scrierea textelor și nu apare pe site.
- „Atenție pentru toți” = perioadele valabile pentru toate zodiile (retrograde, Lună Nouă/Plină cu ora, eclipse, conjuncții importante, intrări în zodii).
- Masculin/feminin: orice cuvânt care depinde de gen se scrie `{masculin|feminin}` (ex. `{puternic|puternică}`, `{Micul|Micuța}`, `Laudă-{l|o}`, `{tată|mamă}`). Textele pentru tine sunt implicit la feminin, iar „Copilul din zodia asta” implicit la masculin. Pe pagina personalizată se alege forma după genul fiecărei persoane.
- `pair_notes` (pe lună): 7 texte scurte, câte unul pentru fiecare distanță între zodii (0 = aceeași zodie, 1 = vecini, 2 = sextil, 3 = pătrat, 4 = trigon, 5 = quincunx, 6 = opoziție): la ce să fie atent părintele luna asta în relația cu celălalt, legat de evenimentele lunii. `[[nume]]` = prenumele celuilalt, `[[masculin|feminin]]` = genul celuilalt, `{m|f}` = genul cititorului, `((voi doi|voi două))` = forma pentru pereche (feminină doar dacă sunt amândouă femei/fete).
- Pagina personală arată în cardurile familiei doar relația (potrivire + `pair_notes` + zilele comune); horoscopul complet al fiecăruia e la /horoscop/familie/<id>.
- Un copil / mai mulți copii (în „Tu ca mamă”): `<<forma pentru un singur copil|forma pentru mai mulți>>`. În forma de singular, `[[nume]]` = prenumele copilului și `[[masculin|feminin]]` = genul lui (ex. `<<Implică-[[l|o]] pe [[nume]]|Implică-i>>`). Pe paginile publice apare forma de plural.
- Copiii (și partenerul) cu aceeași zodie se diferențiază prin ascendent (se arată și textul lunar al zodiei ascendentului). La copii mai apare și ce îi liniștește, după zodia Lunii (texte fixe în `MOON_NEEDS`).
- „Idee de activitate luna asta” (`kids_activity`): 2 fraze, o activitate concretă pentru copilul din zodia respectivă, potrivită lunii și sezonului, cu data cea mai bună (pagina copilului).
- Fără sfaturi medicale. Fără predicții sigure. Totul are scop de divertisment.

## Dicționarul planetelor (cum interpretăm)
- Soarele: esența, eul, voința, vitalitatea
- Luna: emoțiile, instinctele, subconștientul, nevoile
- Mercur: comunicarea, gândirea, rațiunea, învățarea
- Venus: dragostea, frumusețea, armonia, relațiile, valorile
- Marte: energia, acțiunea, dorința, impulsivitatea, agresivitatea
- Jupiter: expansiunea, norocul, optimismul, creșterea, încrederea
- Saturn: responsabilitatea, structura, limitele, lecțiile, maturitatea
- Uranus: schimbarea, inovația, revoluția, originalitatea, independența
- Neptun: visarea, imaginația, spiritualitatea, iluziile, confuzia
- Pluton: transformarea, puterea, moartea și renașterea
- Lilith (Luna Neagră): umbrele, atracțiile interzise, instinctele refulate
- Chiron: rana interioară, vindecarea, învățarea prin experiență
- Punctele calculate (ascendent, descendent, mijlocul cerului): se calculează din harta natală

## Varianta personalizată
- Logat → /horoscop arată horoscopul personal (zodie, ascendent, Luna), familia, compatibilitățile și „Atenție în familia ta”. Delogat → varianta pe zodii.
- Date: `horoscope_profiles` (fiecare își vede doar rândurile proprii). Calculele se fac în `src/lib/astroCalc.js`, iar localitatea se caută prin Open-Meteo.
- Compatibilitățile: texte fixe în `src/lib/horoscopCompat.js`, după distanța dintre zodii și tipul relației (cuplu / mamă–copil).
- `/horoscop?toate=1` = varianta pe zodii chiar dacă ești logată; `/horoscop?familia=1` = editezi datele.

## Fișiere
- `src/app/horoscop/`: paginile publice, adminul și designul (`horoscop.css`)
- `src/lib/horoscop.js`: zodiile, constelațiile, planetele
- `scripts/horoscop/AAAA-LL.json` + `to-sql.js`: ciorna lunii și importul ei
- `supabase/horoscop-schema.sql`: tabelele și regulile de acces

## Funcții fixe (nu se scriu lunar)
- „Azi pe cer” (`src/components/horoscop/Today.js`): arată perioadele active azi, din `watchouts`. Pe pagina personală spune și pe cine din familie privește.
- Zile de naștere: dacă cineva din familie are ziua în luna afișată, apare mesajul (cu vârsta), iar la copii și o idee de petrecere/cadou pe zodie (`BIRTHDAY_IDEAS`).
- „Cum să-i vorbești” pe pagina copilului (`KID_TALK`), compatibilitatea dintre frați (`siblings()`): toate în `src/lib/horoscopKids.js`.
