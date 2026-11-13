import { KIND_ICON, LEVEL, SIGN_BY_SLUG, formatRange, todayISO } from '@/lib/horoscop'

// „Atenție pentru toți”: bandă cu zilele lunii + carduri pe perioade
export default function Watchouts({ items = [], month, compact = false, family = null, eyebrow = 'valabil pentru toate zodiile', title = 'Atenție pentru toți', id = 'atentie', timeline = true }) {
  // family: [{ name, signs: [...] }] → arată doar perioadele care îi privesc și pe cine
  const who = (w) => family ? family.filter(f => f.signs.some(s => (w.signs || []).includes(s))).map(f => f.name) : []
  if (family) items = items.filter(w => who(w).length)
  if (!items.length) return null
  const today = todayISO()
  const [y, m] = month.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  const first = `${month}-01`, last = `${month}-${String(days).padStart(2, '0')}`
  const sorted = [...items].sort((a, b) => (a.start || '').localeCompare(b.start || '') || (a.end || a.start || '').localeCompare(b.end || b.start || ''))
  const pos = (iso) => {
    const c = iso < first ? first : iso > last ? last : iso
    return ((Number(c.slice(8, 10)) - 1) / days) * 100
  }
  const todayIn = today >= first && today <= last

  return (
    <section className={`hz-watch ${compact ? 'is-compact' : ''}`} id={id}>
      <div className="hz-section-head">
        <span className="hz-eyebrow">{eyebrow}</span>
        <h2 className="hz-h2">{title}</h2>
      </div>

      {!compact && timeline && (
        <div className="hz-timeline" role="img" aria-label="Perioadele importante ale lunii">
          <div className="hz-timeline-track">
            {sorted.map((w, i) => {
              const a = pos(w.start), b = pos(w.end || w.start)
              const lvl = LEVEL[w.level] || LEVEL.info
              return (
                <span key={i} className="hz-timeline-bar" title={w.title}
                  style={{ left: `${a}%`, width: `max(10px, ${b - a + 100 / days}%)`, top: `${(i % 4) * 9 + 6}px`, background: lvl.color }} />
              )
            })}
            {todayIn && <span className="hz-timeline-today" style={{ left: `${pos(today) + 50 / days}%` }}><em>azi</em></span>}
          </div>
          <div className="hz-timeline-days">
            {[1, 8, 15, 22, days].map(d => <span key={d} style={{ left: `${((d - 0.5) / days) * 100}%` }}>{d}</span>)}
          </div>
        </div>
      )}

      <div className="hz-watch-grid">
        {sorted.map((w, i) => {
          const lvl = LEVEL[w.level] || LEVEL.info
          const active = today >= w.start && today <= (w.end || w.start)
          const past = today > (w.end || w.start)
          return (
            <article key={i} className={`hz-watch-card ${active ? 'is-active' : ''} ${past ? 'is-past' : ''}`} style={{ '--lvl': lvl.color }}>
              <div className="hz-watch-top">
                <span className="hz-watch-icon">{KIND_ICON[w.kind] || '✦'}</span>
                <span className="hz-watch-date">{formatRange(w.start, w.end)}</span>
                <span className="hz-watch-lvl">{active ? 'acum' : lvl.label}</span>
              </div>
              <h3>{w.title}</h3>
              {!compact && <p>{w.text}</p>}
              {family ? (
                <div className="hz-watch-who">Vă privește: <b>{who(w).join(', ')}</b></div>
              ) : (w.signs?.length > 0 && (
                <div className="hz-watch-signs" title="Zodiile cele mai atinse">{w.signs.map(s => SIGN_BY_SLUG[s] && <span key={s}>{SIGN_BY_SLUG[s].glyph} {SIGN_BY_SLUG[s].name}</span>)}</div>
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}
