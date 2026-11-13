// Texte fixe despre copii (nu se schimbă lunar). {m|f} = genul copilului, ((m|f)) = pereche de frați (feminin doar dacă sunt două fete).
import { SIGNS, SIGN_BY_SLUG } from './horoscop'

export const KID_TALK = {
  berbec: 'Dă-i provocări, nu ordine: „Pariez că strângi jucăriile în 2 minute!”. Când e {furios|furioasă}, nu-i ține predici pe loc: lasă-{l|o} să se descarce și vorbiți după. Laudă curajul și efortul.',
  taur: 'Vorbește-i calm și anunță din timp schimbările: „În 10 minute plecăm”. Graba și presiunea {îl|o} blochează. Laudă răbdarea și grija pentru lucrurile {lui|ei}.',
  gemeni: 'Explică „de ce”, pentru că întrebările sunt felul {lui|ei} de a înțelege. Dă-i variante și lasă-{l|o} să negocieze puțin. Laudă ideile și poveștile.',
  rac: 'Începe cu o îmbrățișare, apoi vorbiți. Tonul contează mai mult decât cuvintele, iar criticile dure {îl|o} rănesc. Laudă grija pe care o arată celorlalți.',
  leu: 'Vorbește-i cu respect, ca unui lider: „Am nevoie de ajutorul tău”. Nu {îl|o} certa în fața altora. Laudă sincer, des și concret.',
  fecioara: 'Dă instrucțiuni clare, pas cu pas, și explică regulile. Când greșește, arată-i că greșeala se repară. Laudă atenția la detalii și ajutorul.',
  balanta: 'Întreabă-{l|o} ce simte și dă-i două variante, nu o alegere deschisă. Evită certurile pe ton ridicat în preajma {lui|ei}. Laudă bunătatea și simțul dreptății.',
  scorpion: 'Spune-i adevărul, pe înțelesul {lui|ei}: simte imediat când ceva nu e spus pe față. Respectă-i secretele și ține-ți promisiunile. Laudă loialitatea și curajul de a spune ce simte.',
  sagetator: 'Vorbește-i cu umor și lasă-i libertate în cadrul unor reguli clare. Regulile fără explicație {îl|o} revoltă. Laudă curiozitatea și optimismul.',
  capricorn: 'Vorbește-i ca unui „om mare” și dă-i responsabilități reale. Nu-i minimiza eforturile. Laudă perseverența și seriozitatea, dar amintește-i și să se joace.',
  varsator: 'Nu-i impune, propune-i: „Tu cum ai face?”. Comparațiile cu alți copii {îl|o} îndepărtează. Laudă originalitatea și ideile neobișnuite.',
  pesti: 'Vorbește-i blând, cu povești și imagini: „Hai să fim doi pisoi liniștiți”. Tonul aspru {îl|o} sperie. Laudă imaginația și sensibilitatea.',
}

export const BIRTHDAY_IDEAS = {
  berbec: 'Petrecere cu întreceri, baloane și medalii pentru toți. Cadou: ceva de mișcare, ca o trotinetă, o minge sau un set de sport.',
  taur: 'Petrecere mică, acasă, cu tort făcut împreună și mâncarea preferată. Cadou: ceva plăcut la atins, ca o pătură moale, o jucărie de pluș sau un set de plastilină.',
  gemeni: 'Petrecere cu ghicitori, jocuri de cuvinte și mulți prieteni. Cadou: cărți, un walkie-talkie sau un joc de societate.',
  rac: 'Petrecere în familie, cu bunicii și un album cu poze de când era {mic|mică}. Cadou: o căsuță, o bucătărie de jucărie sau un ursuleț special.',
  leu: 'Petrecere cu temă și costume, cu {el|ea} în rolul principal. Cadou: un costum, o coroană, un microfon sau un teatru de păpuși.',
  fecioara: 'Petrecere bine organizată, cu activități clare: atelier de pictură sau de gătit. Cadou: un set de construcție, un puzzle sau o trusă de doctor.',
  balanta: 'Petrecere cu prietenii cei mai buni, decor frumos și muzică. Cadou: un set de artă, bijuterii de jucărie sau un instrument muzical.',
  scorpion: 'Petrecere-mister: vânătoare de comori sau detectivi. Cadou: o cutie cu lacăt pentru secrete, o lanternă sau un set de magie.',
  sagetator: 'Petrecere în aer liber sau o excursie: parc de aventură, grădina zoologică, munte. Cadou: un rucsac de explorator, un binoclu sau o carte despre lume.',
  capricorn: 'Petrecere cu câțiva prieteni și un proiect comun, cum ar fi o construcție Lego mare. Cadou: un set de construcție, un ceas sau o unealtă „de om mare”.',
  varsator: 'Petrecere originală: un laborator de știință sau o temă inventată de {el|ea}. Cadou: un kit de experimente, un robot sau ceva cu totul neobișnuit.',
  pesti: 'Petrecere liniștită, cu un teatru de păpuși sau un atelier de pictură. Cadou: acuarele, o lampă cu stele sau o carte cu povești frumoase.',
}

const SIBLINGS = {
  0: { name: 'Aceeași zodie', score: 4, text: 'Seamănă mult, așa că se înțeleg din priviri, dar se și ciocnesc pe aceleași lucruri. Dă-le roluri diferite în casă, ca fiecare să simtă că are locul său.' },
  1: { name: 'Vecini pe roată', score: 2, text: 'Au ritmuri și nevoi diferite: când ((unul|una)) vrea liniște, ((celălalt|cealaltă)) vrea joacă. Timpul petrecut separat cu fiecare contează mult, iar jocurile pe rând îi învață să se aștepte.' },
  2: { name: 'Prieteni buni', score: 4, text: 'Sunt ((prieteni|prietene)) de joacă naturali: comunică ușor și inventează împreună. Lasă-i să construiască proiecte comune: o cabană din pături, un spectacol, o colecție.' },
  3: { name: 'Scântei care îi cresc', score: 2, text: 'Scântei garantate: ((amândoi|amândouă)) vor primul loc și ultimul cuvânt. Certurile îi învață să negocieze, dar evită comparațiile între ((ei|ele)) și pune reguli clare pentru jucăriile comune.' },
  4: { name: 'Armonie naturală', score: 5, text: 'Se simt în siguranță ((unul lângă altul|una lângă alta)) și au același fel de a se bucura. Sunt echipa perfectă pentru jocuri lungi și aventuri, așa că profită de asta.' },
  5: { name: 'Ajustări fine', score: 2, text: 'Nu se înțeleg mereu din prima, pentru că se distrează în feluri diferite. Ajută-i să găsească o activitate care le place amândurora și laudă-i când reușesc împreună.' },
  6: { name: 'Opuși care se completează', score: 3, text: 'Ce îi lipsește ((unuia|uneia)) are ((celălalt|cealaltă)), de aici și atracția, și tensiunile. Dă-le spațiu fiecăruia și sărbătorește diferențele dintre ((ei|ele)).' },
}

function dist(a, b) {
  const i = SIGNS.indexOf(SIGN_BY_SLUG[a]), j = SIGNS.indexOf(SIGN_BY_SLUG[b])
  if (i < 0 || j < 0) return null
  const d = Math.abs(i - j); return d > 6 ? 12 - d : d
}

export function siblings(aSign, bSign) {
  const d = dist(aSign, bSign)
  return d == null ? null : SIBLINGS[d]
}

// Ziua de naștere în luna afișată: { day, age } sau null
export function birthdayIn(p, month) {
  if (!p?.birth_date || !month) return null
  const [y, m] = month.split('-').map(Number)
  const [by, bm, bd] = p.birth_date.split('-').map(Number)
  if (bm !== m) return null
  return { day: bd, age: y - by }
}
