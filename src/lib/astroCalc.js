// Calcule astrologice simple (precizie bună pentru zodie, ascendent, zodia Lunii).
// Folosit în browser și pe server. Fără servicii externe.
import { SIGNS } from './horoscop'

const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI
const norm = (d) => ((d % 360) + 360) % 360

// Diferența (ms) dintre ora locală din fusul `tz` și UTC, la momentul `ts`
function tzOffsetMs(ts, tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ts))
  const g = (t) => Number(parts.find(p => p.type === t)?.value)
  const asUTC = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour') % 24, g('minute'), g('second'))
  return asUTC - Math.floor(ts / 1000) * 1000
}

// „1990-05-12” + „14:30” în fusul `tz` → timestamp UTC
export function localToUTC(dateStr, timeStr, tz = 'Europe/Bucharest') {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [h, mi] = (timeStr || '12:00').split(':').map(Number)
  const guess = Date.UTC(y, m - 1, d, h, mi)
  let ts = guess - tzOffsetMs(guess, tz)
  ts = guess - tzOffsetMs(ts, tz)
  return ts
}

const jd = (ts) => ts / 86400000 + 2440587.5

export function sunLongitude(ts) {
  const n = jd(ts) - 2451545
  const L = 280.46 + 0.9856474 * n
  const g = rad(357.528 + 0.9856003 * n)
  return norm(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g))
}

export function moonLongitude(ts) {
  const n = jd(ts) - 2451545
  const L = 218.316 + 13.176396 * n
  const Mm = rad(134.963 + 13.064993 * n)
  const D = rad(297.85 + 12.190749 * n)
  const M = rad(357.529 + 0.98560028 * n)
  const F = rad(93.272 + 13.22935 * n)
  return norm(L + 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * D - Mm) + 0.658 * Math.sin(2 * D)
    + 0.214 * Math.sin(2 * Mm) - 0.186 * Math.sin(M) - 0.114 * Math.sin(2 * F))
}

export function ascendant(ts, lat, lon) {
  const n = jd(ts) - 2451545
  const lst = rad(norm(280.46061837 + 360.98564736629 * n + lon))
  const eps = rad(23.4393 - 0.0000004 * n)
  const asc = Math.atan2(Math.cos(lst), -(Math.sin(lst) * Math.cos(eps) + Math.tan(rad(lat)) * Math.sin(eps)))
  return norm(deg(asc))
}

export const signOf = (lon) => SIGNS[Math.floor(norm(lon) / 30)]

// Rezultatul pentru un profil: zodia, ascendentul (dacă știm ora și locul), zodia Lunii (dacă știm ora)
export function computeChart({ birth_date, birth_time, lat, lon, tz }) {
  if (!birth_date) return {}
  const ts = localToUTC(birth_date, birth_time || '12:00', tz || 'Europe/Bucharest')
  const out = { sun_sign: signOf(sunLongitude(ts)).slug, asc_sign: null, moon_sign: null }
  if (birth_time) {
    out.moon_sign = signOf(moonLongitude(ts)).slug
    if (lat != null && lon != null) out.asc_sign = signOf(ascendant(ts, lat, lon)).slug
  } else {
    // fără oră: Luna e sigură doar dacă stă în aceeași zodie toată ziua
    const a = signOf(moonLongitude(localToUTC(birth_date, '00:00', tz || 'Europe/Bucharest'))).slug
    const b = signOf(moonLongitude(localToUTC(birth_date, '23:59', tz || 'Europe/Bucharest'))).slug
    if (a === b) out.moon_sign = a
  }
  return out
}
