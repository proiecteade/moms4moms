import Link from 'next/link'
import { SIGNS, ELEMENTS, PLANETS, RETRO_NOTE, monthLabel, signDates } from '@/lib/horoscop'
import { loadMonth, listPublishedMonths } from '@/lib/horoscopData'
import Constellation from '@/components/horoscop/Constellation'
import Watchouts from '@/components/horoscop/Watchouts'
import FindSign from '@/components/horoscop/FindSign'

export const dynamic = 'force-dynamic'

export default async function HoroscopPage({ searchParams }) {
  const sp = await searchParams
  const preview = sp?.preview === '1'
  const luna = /^\d{4}-\d{2}$/.test(sp?.luna || '') ? sp.luna : null
  const { month, entries } = await loadMonth({ month: luna, preview })
  const archive = await listPublishedMonths()
  const qs = [luna && `luna=${luna}`, preview && 'preview=1'].filter(Boolean).join('&')
  const query = qs ? `?${qs}` : ''
  const bySign = Object.fromEntries(entries.map(e => [e.sign, e]))

  if (!month) {
    return (
      <section className="hz-hero">
        <span className="hz-eyebrow">în curând</span>
        <h1 className="hz-h1">Stelele se aliniază…</h1>
        <p className="hz-lead">Horoscopul lunii apare aici foarte curând. Revino în câteva zile!</p>
        <div className="hz-hero-wheel"><Constellation sign={SIGNS[7]} size={220} /></div>
      </section>
    )
  }

  return (
    <>
      {preview && month.status !== 'published' && (
        <div className="hz-preview-bar">Previzualizare — ciorna nu e încă publicată. <Link href="/horoscop/admin">Înapoi la admin</Link></div>
      )}

      <section className="hz-hero">
        <span className="hz-eyebrow">horoscopul lunii</span>
        <h1 className="hz-h1">{monthLabel(month.month)}</h1>
        {month.title && <p className="hz-hero-title">{month.title}</p>}
        {month.intro && <p className="hz-lead">{month.intro}</p>}
        <div className="hz-hero-actions">
          <a href="#zodii" className="hz-btn">Alege-ți zodia ✦</a>
          <a href="#atentie" className="hz-btn hz-btn-ghost">Ce e valabil pentru toți</a>
        </div>
        <FindSign query={query} />
      </section>

      <section className="hz-signs" id="zodii">
        <div className="hz-section-head">
          <span className="hz-eyebrow">cele 12 zodii</span>
          <h2 className="hz-h2">Ce îți rezervă luna</h2>
        </div>
        <div className="hz-grid">
          {SIGNS.map((s, i) => {
            const e = bySign[s.slug]
            const el = ELEMENTS[s.element]
            return (
              <Link key={s.slug} href={`/horoscop/${s.slug}${query}`} className="hz-card"
                style={{ '--el': el.color, '--el-glow': el.glow, animationDelay: `${i * 0.05}s` }}>
                <Constellation sign={s} size={84} className="hz-card-const" />
                <span className="hz-card-glyph">{s.glyph}</span>
                <span className="hz-card-name">{s.name}</span>
                <span className="hz-card-dates">{signDates(s)}</span>
                {e?.teaser && <span className="hz-card-teaser">{e.teaser}</span>}
                <span className="hz-card-cta">Citește →</span>
              </Link>
            )
          })}
        </div>
      </section>

      <Watchouts items={month.watchouts || []} month={month.month} />

      <section className="hz-planets">
        <div className="hz-section-head">
          <span className="hz-eyebrow">dicționar ceresc</span>
          <h2 className="hz-h2">Ce înseamnă planetele</h2>
          <p className="hz-lead">{RETRO_NOTE}</p>
        </div>
        <div className="hz-planet-grid">
          {PLANETS.map(p => (
            <div key={p.name} className="hz-planet"><span className="hz-planet-glyph">{p.glyph}</span><div><strong>{p.name}</strong><span>{p.text}</span></div></div>
          ))}
        </div>
      </section>

      {archive.length > 1 && (
        <section className="hz-archive">
          <h2 className="hz-h3">Lunile trecute</h2>
          <div className="hz-archive-list">
            {archive.map(a => (
              <Link key={a.month} href={`/horoscop?luna=${a.month}`} className={`hz-chip ${a.month === month.month ? 'is-on' : ''}`}>{monthLabel(a.month)}</Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
