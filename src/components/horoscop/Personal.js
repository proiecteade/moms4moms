import Link from 'next/link'
import { SIGN_BY_SLUG, ELEMENTS, SECTIONS, monthLabel } from '@/lib/horoscop'
import { compat } from '@/lib/horoscopCompat'
import Constellation from './Constellation'
import Watchouts from './Watchouts'

const REL_LABEL = { copil: 'copil', partener: 'partener' }

function Signs({ p }) {
  const s = SIGN_BY_SLUG[p.sun_sign], a = p.asc_sign && SIGN_BY_SLUG[p.asc_sign], m = p.moon_sign && SIGN_BY_SLUG[p.moon_sign]
  return (
    <div className="hzp-chips">
      {s && <span title="Zodia (Soarele)">☉ {s.glyph} {s.name}</span>}
      {a && <span title="Ascendentul">↑ {a.glyph} {a.name}</span>}
      {m && <span title="Zodia Lunii">☽ {m.glyph} {m.name}</span>}
    </div>
  )
}

function Hearts({ n }) {
  return <span className="hzp-hearts" aria-label={`${n} din 5`}>{'♥'.repeat(n)}<i>{'♥'.repeat(5 - n)}</i></span>
}

export default function Personal({ month, entries, profiles, query }) {
  const me = profiles.find(p => p.relation === 'eu') || profiles[0]
  const family = profiles.filter(p => p.id !== me.id)
  const by = Object.fromEntries(entries.map(e => [e.sign, e]))
  const mine = by[me.sun_sign]
  const asc = me.asc_sign && me.asc_sign !== me.sun_sign ? by[me.asc_sign] : null
  const sign = SIGN_BY_SLUG[me.sun_sign]
  const el = ELEMENTS[sign.element]
  const first = me.name.split(' ')[0]
  const famSigns = profiles.map(p => ({ name: p.id === me.id ? 'tu' : p.name.split(' ')[0], signs: [p.sun_sign, p.asc_sign].filter(Boolean) }))

  return (
    <div className="hz-sign hzp" style={{ '--el': el.color, '--el-glow': el.glow }}>
      <section className="hz-sign-hero">
        <div className="hz-sign-art">
          <Constellation sign={sign} size={260} />
          <span className="hz-sign-glyph">{sign.glyph}</span>
        </div>
        <div className="hz-sign-intro">
          <span className="hz-eyebrow">{month ? `horoscopul tău · ${monthLabel(month.month, false)}` : 'horoscopul tău'}</span>
          <h1 className="hz-h1">Bună, {first}</h1>
          <Signs p={me} />
          {month?.title && <p className="hz-hero-title">{month.title}</p>}
          {month?.intro && <p className="hzp-intro">{month.intro}</p>}
        </div>
      </section>

      {!month || !mine ? (
        <p className="hz-lead hz-center">Horoscopul lunii apare aici foarte curând. ✦</p>
      ) : (
        <>
          <div className="hz-section-head"><span className="hz-eyebrow">ca {sign.name}</span><h2 className="hz-h2">Luna ta, {first}</h2></div>
          <div className="hz-sections">
            {SECTIONS.map(sec => mine[sec.key] && (
              <article key={sec.key} className={`hz-panel ${sec.special ? 'is-moms' : ''}`}>
                <h2><span className="hz-panel-icon">{sec.icon}</span>{sec.label}</h2>
                <p>{mine[sec.key]}</p>
              </article>
            ))}
            {mine.family && (
              <article className="hz-panel">
                <h2><span className="hz-panel-icon">⌂</span>Tu în familie</h2>
                <p>{mine.family}</p>
              </article>
            )}
            {asc && (
              <article className="hz-panel is-asc">
                <h2><span className="hz-panel-icon">↑</span>Prin ascendentul tău în {SIGN_BY_SLUG[me.asc_sign].name}</h2>
                <p><em>{asc.teaser}</em> {asc.general}</p>
                <Link href={`/horoscop/${me.asc_sign}${query}`} className="hzp-more">Citește tot pentru {SIGN_BY_SLUG[me.asc_sign].name} →</Link>
              </article>
            )}
          </div>

          <section className="hz-lucky">
            {mine.lucky_days && <div><span>Zilele tale bune</span><strong>{mine.lucky_days}</strong></div>}
            {mine.lucky_color && <div><span>Culoarea ta</span><strong>{mine.lucky_color}</strong></div>}
            {mine.lucky_number && <div><span>Cifra ta</span><strong>{mine.lucky_number}</strong></div>}
          </section>
          {mine.tip && <blockquote className="hz-tip"><span>Sfatul tău pentru luna asta</span>„{mine.tip}”</blockquote>}
        </>
      )}

      {family.length > 0 && (
        <section className="hzp-family">
          <div className="hz-section-head"><span className="hz-eyebrow">cei dragi</span><h2 className="hz-h2">Familia ta luna asta</h2></div>
          <div className="hzp-fam-grid">
            {family.map(p => {
              const s = SIGN_BY_SLUG[p.sun_sign]
              const e = by[p.sun_sign]
              const c = compat(me.sun_sign, p.sun_sign, p.relation === 'copil' ? 'copil' : 'partener')
              const pe = ELEMENTS[s.element]
              return (
                <article key={p.id} className="hzp-fam" style={{ '--el': pe.color, '--el-glow': pe.glow }}>
                  <header>
                    <span className="hzp-fam-glyph">{s.glyph}</span>
                    <div>
                      <h3>{p.name}</h3>
                      <span className="hzp-fam-rel">{REL_LABEL[p.relation]} · {s.name}{p.asc_sign ? ` · ascendent ${SIGN_BY_SLUG[p.asc_sign].name}` : ''}</span>
                    </div>
                  </header>
                  {e && <p className="hzp-fam-text">{p.relation === 'copil' ? (e.kids || e.teaser) : (e.family || e.teaser)}</p>}
                  {c && (
                    <div className="hzp-compat">
                      <div className="hzp-compat-head"><span>Tu și {p.name.split(' ')[0]}: <b>{c.name}</b></span><Hearts n={c.score} /></div>
                      <p>{c.text}</p>
                      <small>{c.elements}</small>
                    </div>
                  )}
                  <Link href={`/horoscop/${p.sun_sign}${query}`} className="hzp-more">Horoscopul complet {s.name} →</Link>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {month && family.length > 0 && (
        <Watchouts items={month.watchouts || []} month={month.month} family={famSigns}
          id="familie" eyebrow="perioadele care vă ating direct" title="Atenție în familia ta" timeline={false} />
      )}
      {month && <Watchouts items={month.watchouts || []} month={month.month} />}

      <div className="hzp-bottom">
        <Link href="/horoscop?familia=1" className="hz-btn hz-btn-ghost">✎ Editează datele familiei</Link>
        <Link href={`/horoscop?toate=1${query ? '&' + query.slice(1) : ''}`} className="hz-btn hz-btn-ghost">Vezi toate zodiile</Link>
      </div>
    </div>
  )
}
