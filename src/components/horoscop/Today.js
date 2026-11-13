import { KIND_ICON, LEVEL, MONTHS_RO, formatRange, todayISO } from '@/lib/horoscop'

// „Azi pe cer”: perioadele active azi (cele care încep sau se termină azi primele)
export default function Today({ items = [], family = null }) {
  const today = todayISO()
  const active = items.filter(w => w.start <= today && today <= (w.end || w.start))
  if (!active.length) return null
  const isEdge = (w) => w.start === today || (w.end || w.start) === today
  const sorted = [...active].sort((a, b) => Number(isEdge(b)) - Number(isEdge(a)) || (a.start || '').localeCompare(b.start || ''))
  const [, m, d] = today.split('-').map(Number)
  const who = (w) => family ? family.filter(f => f.signs.some(s => (w.signs || []).includes(s))).map(f => f.name) : []

  return (
    <section className="hz-today" aria-label="Azi pe cer">
      <div className="hz-today-head"><span className="hz-today-dot" />Azi, {d} {MONTHS_RO[m - 1]}</div>
      <ul>
        {sorted.slice(0, 3).map((w, i) => {
          const lvl = LEVEL[w.level] || LEVEL.info
          const names = who(w)
          const end = w.end || w.start
          return (
            <li key={i} style={{ '--lvl': lvl.color }}>
              <span className="hz-today-icon">{KIND_ICON[w.kind] || '✦'}</span>
              <div>
                <strong>{w.title}</strong>
                <span className="hz-today-when">
                  {w.start === end ? ' · azi' : end === today ? ' · ultima zi' : w.start === today ? ` · începe azi, până pe ${formatRange(end)}` : ` · ${formatRange(w.start, end)}`}
                </span>
                {isEdge(w) && <p>{w.text}</p>}
                {names.length > 0 && <small>Vă privește: {names.join(', ')}</small>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
