// Date fixe pentru /horoscop: zodii, secțiuni, luni, utilitare.

const VS = '︎' // forțează simbolul ca text, nu ca emoji

export const ELEMENTS = {
  foc: { name: 'Foc', color: '#ff9a6b', glow: 'rgba(255,140,90,0.35)' },
  pamant: { name: 'Pământ', color: '#c9d48a', glow: 'rgba(190,205,120,0.30)' },
  aer: { name: 'Aer', color: '#cfd8ff', glow: 'rgba(190,205,255,0.32)' },
  apa: { name: 'Apă', color: '#7fe0d8', glow: 'rgba(110,220,210,0.30)' },
}

// stars: coordonate 0-100 pentru constelația stilizată; lines: perechi de indici
export const SIGNS = [
  { slug: 'berbec', name: 'Berbec', glyph: '♈' + VS, from: [3, 21], to: [4, 19], element: 'foc', ruler: 'Marte',
    stars: [[12, 40], [38, 30], [66, 36], [84, 58]], lines: [[0, 1], [1, 2], [2, 3]] },
  { slug: 'taur', name: 'Taur', glyph: '♉' + VS, from: [4, 20], to: [5, 20], element: 'pamant', ruler: 'Venus',
    stars: [[10, 20], [30, 40], [48, 50], [62, 44], [86, 26], [56, 66], [40, 84]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6]] },
  { slug: 'gemeni', name: 'Gemeni', glyph: '♊' + VS, from: [5, 21], to: [6, 20], element: 'aer', ruler: 'Mercur',
    stars: [[28, 12], [30, 40], [26, 70], [18, 90], [62, 14], [64, 42], [70, 72], [80, 90]], lines: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 5]] },
  { slug: 'rac', name: 'Rac', glyph: '♋' + VS, from: [6, 21], to: [7, 22], element: 'apa', ruler: 'Luna',
    stars: [[50, 14], [48, 46], [22, 76], [78, 82]], lines: [[0, 1], [1, 2], [1, 3]] },
  { slug: 'leu', name: 'Leu', glyph: '♌' + VS, from: [7, 23], to: [8, 22], element: 'foc', ruler: 'Soarele',
    stars: [[70, 18], [58, 14], [48, 26], [52, 42], [66, 48], [40, 60], [16, 66], [24, 82], [56, 78]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 7], [5, 8], [4, 8]] },
  { slug: 'fecioara', name: 'Fecioară', glyph: '♍' + VS, from: [8, 23], to: [9, 22], element: 'pamant', ruler: 'Mercur',
    stars: [[12, 20], [28, 34], [44, 40], [60, 36], [80, 22], [50, 60], [36, 82], [70, 78]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [5, 7]] },
  { slug: 'balanta', name: 'Balanță', glyph: '♎' + VS, from: [9, 23], to: [10, 22], element: 'aer', ruler: 'Venus',
    stars: [[50, 16], [22, 42], [78, 40], [30, 76], [72, 80]], lines: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4]] },
  { slug: 'scorpion', name: 'Scorpion', glyph: '♏' + VS, from: [10, 23], to: [11, 21], element: 'apa', ruler: 'Marte și Pluto',
    stars: [[10, 22], [22, 30], [34, 40], [44, 54], [50, 70], [62, 82], [78, 84], [88, 72], [84, 60]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]] },
  { slug: 'sagetator', name: 'Săgetător', glyph: '♐' + VS, from: [11, 22], to: [12, 21], element: 'foc', ruler: 'Jupiter',
    stars: [[20, 80], [36, 62], [50, 50], [64, 36], [84, 16], [40, 34], [70, 66], [26, 48]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6], [5, 7], [7, 1]] },
  { slug: 'capricorn', name: 'Capricorn', glyph: '♑' + VS, from: [12, 22], to: [1, 19], element: 'pamant', ruler: 'Saturn',
    stars: [[14, 28], [36, 40], [56, 46], [80, 32], [86, 54], [62, 72], [38, 70]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]] },
  { slug: 'varsator', name: 'Vărsător', glyph: '♒' + VS, from: [1, 20], to: [2, 18], element: 'aer', ruler: 'Saturn și Uranus',
    stars: [[12, 30], [30, 22], [48, 34], [64, 26], [84, 38], [44, 58], [30, 80], [62, 76]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [5, 7]] },
  { slug: 'pesti', name: 'Pești', glyph: '♓' + VS, from: [2, 19], to: [3, 20], element: 'apa', ruler: 'Jupiter și Neptun',
    stars: [[14, 18], [22, 36], [30, 56], [44, 74], [62, 70], [78, 62], [88, 48], [80, 34]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 5]] },
]

export const SIGN_BY_SLUG = Object.fromEntries(SIGNS.map(s => [s.slug, s]))

export const MONTHS_RO = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']

export function monthLabel(month, cap = true) {
  const [y, m] = month.split('-').map(Number)
  const n = MONTHS_RO[m - 1]
  return `${cap ? n[0].toUpperCase() + n.slice(1) : n} ${y}`
}

export function signDates(s) {
  const f = (d) => `${d[1]} ${MONTHS_RO[d[0] - 1].slice(0, 3)}`
  return `${f(s.from)} – ${f(s.to)}`
}

export function signForDate(month, day) {
  const v = month * 100 + day
  for (const s of SIGNS) {
    const a = s.from[0] * 100 + s.from[1], b = s.to[0] * 100 + s.to[1]
    if (a <= b ? v >= a && v <= b : v >= a || v <= b) return s
  }
  return null
}

export const SECTIONS = [
  { key: 'general', label: 'Energia lunii', icon: '☾' },
  { key: 'love', label: 'Dragoste și cuplu', icon: '♡' },
  { key: 'career', label: 'Carieră și bani', icon: '✦' },
  { key: 'health', label: 'Sănătate și energie', icon: '❀' },
  { key: 'moms', label: 'Pentru mămici', icon: '✧', special: true },
]

export const KIND_ICON = { retro: '℞', moon: '☾', aspect: '✦', ingress: '→', shadow: '◌', eclipse: '◐' }
export const LEVEL = {
  atentie: { label: 'Atenție', color: '#ffb38a' },
  bine: { label: 'Favorabil', color: '#9fe7c8' },
  energie: { label: 'Energie', color: '#f6d77a' },
  info: { label: 'De știut', color: '#c7c3ff' },
}

// Compatibilitate simplă pe elemente (foc–aer, pământ–apă, același element)
export function compatibles(slug) {
  const s = SIGN_BY_SLUG[slug]
  const friend = { foc: 'aer', aer: 'foc', pamant: 'apa', apa: 'pamant' }[s.element]
  return SIGNS.filter(x => x.slug !== slug && (x.element === s.element || x.element === friend)).slice(0, 4)
}

export function formatRange(start, end) {
  const d = (iso) => { const [y, m, dd] = iso.split('-').map(Number); return { y, m, d: dd } }
  const a = d(start), b = d(end || start)
  const mm = (x) => MONTHS_RO[x.m - 1].slice(0, 3)
  if (start === (end || start)) return `${a.d} ${mm(a)}`
  if (a.m === b.m) return `${a.d}–${b.d} ${mm(b)}`
  return `${a.d} ${mm(a)} – ${b.d} ${mm(b)}`
}

export function todayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Bucharest' })
}

// Dicționarul planetelor (pe baza notelor Adelinei) — folosit pe pagină și ca regulă la scrierea textelor
export const PLANETS = [
  { name: 'Soarele', glyph: '☉', text: 'Esența ta, eul, voința și vitalitatea.' },
  { name: 'Luna', glyph: '☽', text: 'Emoțiile, instinctele, subconștientul și nevoile.' },
  { name: 'Mercur', glyph: '☿', text: 'Comunicarea, gândirea, rațiunea și învățarea.' },
  { name: 'Venus', glyph: '♀', text: 'Dragostea, frumusețea, armonia, relațiile și valorile.' },
  { name: 'Marte', glyph: '♂', text: 'Energia, acțiunea, dorința, impulsivitatea.' },
  { name: 'Jupiter', glyph: '♃', text: 'Expansiunea, norocul, optimismul și încrederea.' },
  { name: 'Saturn', glyph: '♄', text: 'Responsabilitatea, structura, limitele și lecțiile.' },
  { name: 'Uranus', glyph: '♅', text: 'Schimbarea, inovația, originalitatea și independența.' },
  { name: 'Neptun', glyph: '♆', text: 'Visarea, imaginația, spiritualitatea, dar și iluziile.' },
  { name: 'Pluton', glyph: '♇', text: 'Transformarea, puterea, sfârșitul și renașterea.' },
  { name: 'Lilith', glyph: '⚸', text: 'Umbrele, atracțiile interzise și instinctele ascunse.' },
  { name: 'Chiron', glyph: '⚷', text: 'Rana interioară, vindecarea și lecțiile din experiență.' },
]

export const RETRO_NOTE = 'Retrograd = planeta pare că merge înapoi pe cer. Temele ei se reiau, se recitesc, se repară.'
export const ASCENDANT_URL = 'https://www.astrosofa.com/horoscope/ascendant'
