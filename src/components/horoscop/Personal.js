import Link from 'next/link'
import { SIGN_BY_SLUG, ELEMENTS, SECTIONS, monthLabel, g } from '@/lib/horoscop'
import Constellation from './Constellation'
import Watchouts from './Watchouts'
import Relation, { firstName, genderOf } from './Relation'

export const REL_LABEL = { copil: { m: 'băiat', f: 'fată' }, partener: { m: 'partener', f: 'parteneră' }, altcineva: { m: 'din familie', f: 'din familie' }, eu: { m: 'din familie', f: 'din familie' } }

export function Signs({ p }) {
  const s = SIGN_BY_SLUG[p.sun_sign], a = p.asc_sign && SIGN_BY_SLUG[p.asc_sign], m = p.moon_sign && SIGN_BY_SLUG[p.moon_sign]
  return (
    <div className="hzp-chips">
      {s && <span title="Zodia (Soarele)">☉ {s.glyph} {s.name}</span>}
      {a && <span title="Ascendentul">↑ {a.glyph} {a.name}</span>}
      {m && <span title="Zodia Lunii">☽ {m.glyph} {m.name}</span>}
    </div>
  )
}

export function GeneralLink({ sign, query }) {
  const s = SIGN_BY_SLUG[sign]
  return <Link href={`/horoscop/${sign}${query || ''}`} className="hzp-general-link">Horoscopul general pentru {s.name}, fără personalizare →</Link>
}

export default function Personal({ month, entries, profiles, query }) {
  const me = profiles.find(p => p.relation === 'eu') || profiles[0]
  const family = profiles.filter(p => p.id !== me.id && SIGN_BY_SLUG[p.sun_sign])
  const by = Object.fromEntries(entries.map(e => [e.sign, e]))
  const mine = by[me.sun_sign]
  const asc = me.asc_sign && me.asc_sign !== me.sun_sign ? by[me.asc_sign] : null
  const sign = SIGN_BY_SLUG[me.sun_sign]
  const el = ELEMENTS[sign.element]
  const first = firstName(me.name)
  const mg = genderOf(me)
  const kids = family.filter(p => p.relation === 'copil').map(p => ({ name: p.name, gender: genderOf(p, me) }))
  const G = (t) => g(t, mg, kids)
  const famSigns = profiles.map(p => ({ name: p.id === me.id ? 'tu' : firstName(p.name), signs: [p.sun_sign, p.asc_sign].filter(Boolean) }))

  return (
    <div className="hz-sign hzp" style={{ '--el': el.color, '--el-glow': el.glow }}>
      {profiles.some(p => !p.gender) && (
        <div className="hz-preview-bar">Alege genul pentru fiecare membru al familiei ca să ne adresăm corect. <Link href="/horoscop?familia=1">Completează acum</Link></div>
      )}
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
          <GeneralLink sign={me.sun_sign} query={query} />
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
                <h2><span className="hz-panel-icon">{sec.icon}</span>{sec.key === 'moms' && mg === 'm' ? 'Tu ca tată' : sec.label}</h2>
                <p>{G(mine[sec.key])}</p>
              </article>
            ))}
            {mine.family && (
              <article className="hz-panel">
                <h2><span className="hz-panel-icon">⌂</span>Tu în familie</h2>
                <p>{G(mine.family)}</p>
              </article>
            )}
            {asc && (
              <article className="hz-panel is-asc">
                <h2><span className="hz-panel-icon">↑</span>Prin ascendentul tău în {SIGN_BY_SLUG[me.asc_sign].name}</h2>
                <p><em>{G(asc.teaser)}</em> {G(asc.general)}</p>
              </article>
            )}
          </div>

          <section className="hz-lucky">
            {mine.lucky_days && <div><span>Zilele tale bune</span><strong>{mine.lucky_days}</strong></div>}
            {mine.lucky_color && <div><span>Culoarea ta</span><strong>{mine.lucky_color}</strong></div>}
            {mine.lucky_number && <div><span>Cifra ta</span><strong>{mine.lucky_number}</strong></div>}
          </section>
          {mine.tip && <blockquote className="hz-tip"><span>Sfatul tău pentru luna asta</span>„{G(mine.tip)}”</blockquote>}
        </>
      )}

      {family.length > 0 && (
        <section className="hzp-family">
          <div className="hz-section-head"><span className="hz-eyebrow">relațiile tale luna asta</span><h2 className="hz-h2">Tu și familia ta</h2></div>
          <div className="hzp-fam-grid">
            {family.map(p => {
              const s = SIGN_BY_SLUG[p.sun_sign]
              const pe = ELEMENTS[s.element]
              const pg = genderOf(p, me)
              return (
                <article key={p.id} className="hzp-fam" style={{ '--el': pe.color, '--el-glow': pe.glow }}>
                  <header>
                    <span className="hzp-fam-glyph">{s.glyph}</span>
                    <div>
                      <h3>{p.name}</h3>
                      <span className="hzp-fam-rel">{REL_LABEL[p.relation]?.[pg] || 'din familie'} · {s.name}{p.asc_sign ? ` · ascendent ${SIGN_BY_SLUG[p.asc_sign].name}` : ''}</span>
                    </div>
                  </header>
                  <Relation me={me} p={p} month={month} />
                  <Link href={`/horoscop/familie/${p.id}${query}`} className="hzp-more">Horoscopul complet: {firstName(p.name)} →</Link>
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
        <Link href={`/horoscop/${me.sun_sign}${query}`} className="hz-btn hz-btn-ghost">Horoscopul general {sign.name}</Link>
        <Link href={`/horoscop?toate=1${query ? '&' + query.slice(1) : ''}`} className="hz-btn hz-btn-ghost">Toate zodiile</Link>
      </div>
    </div>
  )
}
