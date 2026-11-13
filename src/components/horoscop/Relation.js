import { SIGN_BY_SLUG, formatRange, g } from '@/lib/horoscop'
import { compat, forOther, forPair, signDistance } from '@/lib/horoscopCompat'

export const firstName = (n) => (n || '').trim().split(' ')[0]
export const genderOf = (p, me) => p.gender || (p.relation === 'partener' ? ((me?.gender || 'f') === 'f' ? 'm' : 'f') : (p.relation === 'eu' ? 'f' : 'm'))

export function Hearts({ n }) {
  return <span className="hzp-hearts" aria-label={`${n} din 5`}>{'♥'.repeat(n)}<i>{'♥'.repeat(5 - n)}</i></span>
}

// „Voi doi luna asta”: potrivirea, la ce să fii atentă luna asta, datele care vă ating pe amândoi
export default function Relation({ me, p, month, full = false }) {
  const mg = genderOf(me), pg = genderOf(p, me)
  const name = firstName(p.name)
  const c = compat(me.sun_sign, p.sun_sign, p.relation === 'copil' ? 'copil' : 'partener')
  if (!c) return null
  const dist = signDistance(me.sun_sign, p.sun_sign)
  const note = month?.pair_notes?.[String(dist)]
  const both = mg === 'f' && pg === 'f'
  const T = (t) => g(forOther(forPair(t, both), pg, name), mg)
  const mine = [me.sun_sign, me.asc_sign].filter(Boolean)
  const theirs = [p.sun_sign, p.asc_sign].filter(Boolean)
  const shared = (month?.watchouts || [])
    .filter(w => (w.signs || []).some(s => mine.includes(s)) && (w.signs || []).some(s => theirs.includes(s)))
    .sort((a, b) => (a.start || '').localeCompare(b.start || ''))
  const me1 = SIGN_BY_SLUG[me.sun_sign]

  return (
    <div className="hzr">
      <div className="hzr-head">
        <span>Tu și {name}: <b>{c.name}</b></span>
        <Hearts n={c.score} />
      </div>
      {note && (
        <div className="hzr-block">
          <span className="hzr-label">La ce să fii {mg === 'm' ? 'atent' : 'atentă'} luna asta, ca {me1.name}</span>
          <p>{T(note)}</p>
        </div>
      )}
      {shared.length > 0 && (
        <div className="hzr-block">
          <span className="hzr-label">Zile care vă ating pe {both ? 'amândouă' : 'amândoi'}</span>
          <ul className="hzr-dates">
            {shared.map((w, i) => <li key={i}><b>{formatRange(w.start, w.end)}</b> {w.title}</li>)}
          </ul>
        </div>
      )}
      {full && (
        <div className="hzr-block">
          <span className="hzr-label">Cum vă potriviți, în general</span>
          <p>{T(c.text)}</p>
          <small>{c.elements}</small>
        </div>
      )}
    </div>
  )
}
