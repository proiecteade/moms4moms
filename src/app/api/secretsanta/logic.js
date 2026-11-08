// Secret Santa — logica (port din api.php). Funcții pure peste obiectul de date.
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto'

const TZ = 'Europe/Bucharest'

export class Fail extends Error {
  constructor(msg, code = 400) { super(msg); this.code = code }
}
const fail = (msg, code = 400) => { throw new Fail(msg, code) }

const h = t => createHash('sha256').update(String(t)).digest('hex')
const heq = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
const newToken = () => randomBytes(16).toString('hex')
const newId = () => randomBytes(6).toString('hex')
const now = () => new Date().toISOString()

function clean(s, max) {
  s = String(s ?? '').trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  return Array.from(s).slice(0, max).join('')
}
function norm(s) {
  s = String(s).trim().toLowerCase()
  const map = { 'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't' }
  s = s.replace(/[ăâîșşțţ]/g, c => map[c])
  return s.replace(/\s+/g, ' ')
}
function normPhone(p) {
  let d = String(p).replace(/\D/g, '')
  if (d.startsWith('40')) d = '0' + d.slice(2)
  return d
}

// ---------- timp (Europe/Bucharest, ca în PHP) ----------
function tzOffsetMs(ms) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ms)).map(p => [p.type, p.value]))
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second)
  return asUTC - Math.floor(ms / 1000) * 1000
}
function endOfDayLocal(date) {
  const guess = Date.parse(date + 'T23:59:59Z')
  if (Number.isNaN(guess)) return null
  return guess - tzOffsetMs(guess)
}
function currentYear() {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric' }).format(new Date())
}

// ---------- structură ----------
export const emptyData = () => ({ config: null, current: null, years: {} })
const emptyYear = () => ({
  status: 'open', budget: '', date: '', note: '',
  participants: [], pairs: {}, questions: [],
  drawnAt: null, revealedAt: null,
})
function yearRef(d) {
  const y = d.current
  if (!y || !d.years[y]) fail('Nu există încă o ediție.', 404)
  const yr = d.years[y]
  if (!yr.pairs || Array.isArray(yr.pairs)) yr.pairs = {}
  return yr
}
function isRevealed(y) {
  if (y.status === 'revealed') return true
  if (y.status === 'drawn' && y.date) {
    const t = endOfDayLocal(y.date)
    if (t && Date.now() > t) return true
  }
  return false
}
function findByToken(y, tok) {
  if (!tok) return -1
  const hh = h(tok)
  return y.participants.findIndex(p => heq(p.tokenHash, hh))
}
const pById = (y, id) => y.participants.find(p => p.id === id) || null
const anySeen = y => y.participants.some(p => p.seenPair)

function publicInfo(d) {
  const y = d.years[d.current] || null
  return {
    setup: d.config !== null,
    year: d.current,
    needCode: !!d.config?.joinCodeHash,
    status: y ? (isRevealed(y) ? 'revealed' : y.status) : null,
    budget: y?.budget ?? '',
    date: y?.date ?? '',
    note: y?.note ?? '',
    names: y ? y.participants.map(p => p.name) : [],
  }
}

// ---------- tragerea ----------
function identKeys(p) {
  const k = ['n:' + norm(p.name)]
  if (p.phone) k.push('p:' + normPhone(p.phone))
  return k
}
function prevPairs(d) {
  const prev = d.years[String(Number(d.current) - 1)]
  if (!prev || !prev.pairs || !Object.keys(prev.pairs).length) return null
  const set = new Set()
  for (const [g, r] of Object.entries(prev.pairs)) {
    const gp = pById(prev, g), rp = pById(prev, r)
    if (!gp || !rp) continue
    for (const a of identKeys(gp)) for (const b of identKeys(rp)) set.add(a + '>' + b)
  }
  return set.size ? set : null
}
function forbidden(giver, recv, prev) {
  for (const a of identKeys(giver)) for (const b of identKeys(recv)) if (prev.has(a + '>' + b)) return true
  return false
}
function draw(people, prev) {
  const n = people.length
  for (let attempt = 0; attempt < 5000; attempt++) {
    const idx = [...Array(n).keys()]
    for (let i = n - 1; i > 0; i--) { const j = randomInt(0, i + 1); [idx[i], idx[j]] = [idx[j], idx[i]] }
    // un singur cerc: fiecare dă următoarei → fără perechi închise și fără auto-tragere
    const pairs = {}; let ok = true
    for (let i = 0; i < n; i++) {
      const g = people[idx[i]], r = people[idx[(i + 1) % n]]
      if (prev && forbidden(g, r, prev)) { ok = false; break }
      pairs[g.id] = r.id
    }
    if (ok) return pairs
  }
  return null
}

// ---------- acțiuni ----------
// Returnează { res, save } ; aruncă Fail la erori. `d` e modificat pe loc.
export function handle(a, inp, tok, d) {
  const out = (res, save = false) => ({ res: { ok: true, ...res }, save })

  switch (a) {
    case 'info':
      return out(publicInfo(d))

    case 'setup': {
      if (d.config !== null) fail('Configurarea a fost deja făcută.', 403)
      const admin = newToken()
      const code = clean(inp.joinCode, 40)
      d.config = { adminHash: h(admin), joinCodeHash: code !== '' ? h(norm(code)) : null, createdAt: now() }
      const year = currentYear()
      d.current = year
      d.years[year] = emptyYear()
      return out({ admin }, true)
    }

    case 'join': {
      const y = yearRef(d)
      if (y.status !== 'open') fail('Înscrierile sunt închise.', 403)
      if (d.config?.joinCodeHash && !heq(d.config.joinCodeHash, h(norm(String(inp.code ?? ''))))) fail('Cuvântul-cheie nu e corect.', 403)
      const name = clean(inp.name, 60)
      if (Array.from(name).length < 2) fail('Scrie-ți numele.')
      if (y.participants.some(p => norm(p.name) === norm(name))) fail('Există deja o înscriere cu numele ăsta. Dacă ți-ai pierdut linkul, cere-i organizatoarei unul nou.')
      if (y.participants.length >= 200) fail('Prea multe înscrieri.')
      const t = newToken()
      y.participants.push({
        id: newId(), name, phone: clean(inp.phone, 30),
        tokenHash: h(t), joinedAt: now(), lastSeen: now(), seenPair: null,
        wishes: [], about: '', gift: { status: 'idee', note: '' },
      })
      return out({ token: t }, true)
    }

    case 'me': {
      const y = yearRef(d)
      const i = findByToken(y, tok)
      if (i < 0) fail('Linkul nu e valid (poate a fost înlocuit). Cere-i organizatoarei unul nou.', 404)
      const me = y.participants[i]
      me.lastSeen = now()
      const res = {
        info: publicInfo(d),
        me: { id: me.id, name: me.name, phone: me.phone, wishes: me.wishes, about: me.about, easybox: me.easybox || '', email: me.email || '', gift: me.gift },
      }
      const revealed = isRevealed(y)
      if (y.status !== 'open' && y.pairs[me.id]) {
        if (!me.seenPair) me.seenPair = now()
        const r = pById(y, y.pairs[me.id])
        if (r) res.target = { name: r.name, wishes: r.wishes, about: r.about, easybox: r.easybox || '', phone: r.easybox ? (r.phone || '') : '', email: r.easybox ? (r.email || '') : '' }
        const pick = q => ({ id: q.id, q: q.q, a: q.a, ts: q.ts })
        res.asked = y.questions.filter(q => q.from === me.id).map(pick)
        res.received = y.questions.filter(q => q.to === me.id).map(pick)
      }
      if (revealed) {
        res.reveal = []
        for (const [g, r] of Object.entries(y.pairs)) {
          const gp = pById(y, g), rp = pById(y, r)
          if (gp && rp) res.reveal.push({ from: gp.name, to: rp.name })
        }
        const mine = Object.keys(y.pairs).find(g => y.pairs[g] === me.id)
        const sp = mine && pById(y, mine)
        if (sp) res.mySanta = sp.name
      }
      return out(res, true)
    }

    case 'saveMe': {
      const y = yearRef(d)
      const i = findByToken(y, tok)
      if (i < 0) fail('Link invalid.', 404)
      const me = y.participants[i]
      if (Array.isArray(inp.wishes)) {
        const w = []
        for (const x of inp.wishes.slice(0, 30)) {
          const text = clean(x?.text, 200); let link = clean(x?.link, 500)
          if (link !== '' && !/^https?:\/\//i.test(link)) link = 'https://' + link
          if (text !== '' || link !== '') w.push({ text, link })
        }
        me.wishes = w
      }
      if ('about' in inp) me.about = clean(inp.about, 1000)
      if ('easybox' in inp) me.easybox = clean(inp.easybox, 300)
      if ('email' in inp) me.email = clean(inp.email, 120)
      if ('phone' in inp) me.phone = clean(inp.phone, 30)
      if (inp.gift && typeof inp.gift === 'object') {
        const st = ['idee', 'comandat', 'cumparat', 'impachetat', 'predat'].includes(inp.gift.status) ? inp.gift.status : 'idee'
        me.gift = { status: st, note: clean(inp.gift.note, 500) }
      }
      me.lastSeen = now()
      return out({}, true)
    }

    case 'ask': {
      const y = yearRef(d)
      const i = findByToken(y, tok)
      if (i < 0) fail('Link invalid.', 404)
      const me = y.participants[i]
      if (!y.pairs[me.id]) fail('Tragerea nu a avut loc încă.')
      const q = clean(inp.q, 400)
      if (q === '') fail('Scrie întrebarea.')
      y.questions.push({ id: newId(), from: me.id, to: y.pairs[me.id], q, a: '', ts: now() })
      return out({}, true)
    }

    case 'answer': {
      const y = yearRef(d)
      const i = findByToken(y, tok)
      if (i < 0) fail('Link invalid.', 404)
      const me = y.participants[i]
      const q = y.questions.find(q => q.id === (inp.id ?? '') && q.to === me.id)
      if (!q) fail('Întrebarea nu există.', 404)
      q.a = clean(inp.a, 600)
      return out({}, true)
    }
  }

  // ---------- organizatoare ----------
  if (!a.startsWith('admin')) fail('Acțiune necunoscută.', 404)
  if (!d.config || !heq(d.config.adminHash, h(tok))) fail('Link de organizatoare invalid.', 403)
  const y = yearRef(d)

  switch (a) {
    case 'admin': {
      const list = y.participants.map(p => ({
        id: p.id, name: p.name, phone: p.phone, joinedAt: p.joinedAt, lastSeen: p.lastSeen,
        seenPair: !!p.seenPair, wishCount: p.wishes.length + (p.about !== '' ? 1 : 0),
        giftStatus: p.gift.status,
      }))
      return out({
        info: publicInfo(d), participants: list,
        canRedraw: y.status === 'drawn' && !anySeen(y),
        hasCode: !!d.config.joinCodeHash, years: Object.keys(d.years).sort(),
        prevYearRule: !!prevPairs(d),
      })
    }
    case 'adminSettings': {
      for (const [k, max] of [['budget', 60], ['date', 10], ['note', 600]]) if (k in inp) y[k] = clean(inp[k], max)
      if (y.date !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(y.date)) fail('Data nu e validă.')
      if ('joinCode' in inp) {
        const c = clean(inp.joinCode, 40)
        d.config.joinCodeHash = c !== '' ? h(norm(c)) : null
      }
      return out({}, true)
    }
    case 'adminStatus': {
      const to = inp.status ?? ''
      if (to === 'open') {
        if (y.status === 'drawn' && anySeen(y)) fail('Cineva și-a văzut deja perechea — redeschiderea ar anula tragerea. Nu se mai poate.')
        y.status = 'open'; y.pairs = {}; y.questions = []; y.drawnAt = null
      } else if (to === 'closed') {
        if (y.status !== 'open') fail('Se pot închide doar înscrierile deschise.')
        y.status = 'closed'
      } else if (to === 'revealed') {
        if (y.status !== 'drawn') fail('Întâi trebuie făcută tragerea.')
        y.status = 'revealed'; y.revealedAt = now()
      } else fail('Stare necunoscută.')
      return out({}, true)
    }
    case 'adminDraw': {
      if (!['open', 'closed', 'drawn'].includes(y.status)) fail('Tragerea nu se mai poate face acum.')
      if (y.status === 'drawn' && anySeen(y)) fail('Cineva și-a văzut deja perechea — tragerea nu se mai poate reface.')
      if (y.participants.length < 3) fail('Sunt necesare minimum 3 participante.')
      const prev = prevPairs(d)
      let pairs = draw(y.participants, prev)
      let relaxed = false
      if (pairs === null) { pairs = draw(y.participants, null); relaxed = true }
      if (pairs === null) fail('Tragerea a eșuat, încearcă din nou.', 500)
      y.pairs = pairs; y.questions = []; y.status = 'drawn'; y.drawnAt = now()
      return out({ relaxed, usedPrev: !!prev }, true)
    }
    case 'adminRelink': {
      const p = y.participants.find(p => p.id === (inp.id ?? ''))
      if (!p) fail('Participanta nu există.', 404)
      const t = newToken(); p.tokenHash = h(t)
      return out({ token: t, name: p.name }, true)
    }
    case 'adminRemove': {
      if (y.status !== 'open' && y.status !== 'closed') fail('După tragere nu se mai pot șterge participante (redeschide înscrierile dacă se mai poate).')
      y.participants = y.participants.filter(p => p.id !== (inp.id ?? ''))
      return out({}, true)
    }
    case 'adminNewYear': {
      const year = clean(inp.year, 4)
      if (!/^\d{4}$/.test(year)) fail('An invalid.')
      if (d.years[year]) fail('Ediția ' + year + ' există deja.')
      d.years[year] = emptyYear()
      d.current = year
      return out({}, true)
    }
  }
  fail('Acțiune necunoscută.', 404)
}

