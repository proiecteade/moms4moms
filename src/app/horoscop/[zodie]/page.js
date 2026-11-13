import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SIGNS, SIGN_BY_SLUG, ELEMENTS, SECTIONS, monthLabel, signDates, compatibles, g } from '@/lib/horoscop'
import { loadMonth } from '@/lib/horoscopData'
import Constellation from '@/components/horoscop/Constellation'
import Watchouts from '@/components/horoscop/Watchouts'
import ShareButton from '@/components/horoscop/ShareButton'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { zodie } = await params
  const s = SIGN_BY_SLUG[zodie]
  if (!s) return {}
  const t = `Horoscop ${s.name} — luna aceasta | Moms4Moms`
  return { title: t, description: `Horoscopul lunar pentru ${s.name}: dragoste, carieră, sănătate și sfaturi pentru mămici.`, openGraph: { title: t, url: `https://moms4moms.ro/horoscop/${s.slug}` } }
}

export default async function ZodiePage({ params, searchParams }) {
  const { zodie } = await params
  const sp = await searchParams
  const s = SIGN_BY_SLUG[zodie]
  if (!s) notFound()
  const preview = sp?.preview === '1'
  const luna = /^\d{4}-\d{2}$/.test(sp?.luna || '') ? sp.luna : null
  const { month, entries } = await loadMonth({ month: luna, preview })
  const qs = [luna && `luna=${luna}`, preview && 'preview=1'].filter(Boolean).join('&')
  const query = qs ? `?${qs}` : ''
  const e = entries.find(x => x.sign === s.slug)
  const el = ELEMENTS[s.element]
  const idx = SIGNS.indexOf(s)
  const prev = SIGNS[(idx + 11) % 12], next = SIGNS[(idx + 1) % 12]

  return (
    <div className="hz-sign" style={{ '--el': el.color, '--el-glow': el.glow }}>
      {preview && month && month.status !== 'published' && (
        <div className="hz-preview-bar">Previzualizare — ciorna nu e încă publicată. <Link href="/horoscop/admin">Înapoi la admin</Link></div>
      )}
      <div className="hz-crumbs">
        <Link href={`/horoscop${query}`}>← Toate zodiile</Link>
      </div>

      <section className="hz-sign-hero">
        <div className="hz-sign-art">
          <Constellation sign={s} size={260} />
          <span className="hz-sign-glyph">{s.glyph}</span>
        </div>
        <div className="hz-sign-intro">
          <span className="hz-eyebrow">{month ? `horoscop ${monthLabel(month.month, false)}` : 'horoscop lunar'}</span>
          <h1 className="hz-h1">{s.name}</h1>
          <div className="hz-sign-meta">
            <span>{signDates(s)}</span><span>·</span><span>Element: {el.name}</span><span>·</span><span>Planetă: {s.ruler}</span>
          </div>
          {e?.teaser && <p className="hz-hero-title">{g(e.teaser)}</p>}
        </div>
      </section>

      {!e ? (
        <p className="hz-lead hz-center">Horoscopul pentru {s.name} apare aici în curând. ✦</p>
      ) : (
        <>
          <div className="hz-sections">
            {SECTIONS.map(sec => e[sec.key] && (
              <article key={sec.key} className={`hz-panel ${sec.special ? 'is-moms' : ''}`}>
                <h2><span className="hz-panel-icon">{sec.icon}</span>{sec.label}</h2>
                <p>{g(e[sec.key])}</p>
              </article>
            ))}
            {e.family && <article className="hz-panel"><h2><span className="hz-panel-icon">⌂</span>În familie</h2><p>{g(e.family)}</p></article>}
            {e.kids && <article className="hz-panel"><h2><span className="hz-panel-icon">☺</span>Copilul {s.name}</h2><p>{g(e.kids, 'm')}</p></article>}
          </div>

          <section className="hz-lucky">
            {e.lucky_days && <div><span>Zile bune</span><strong>{e.lucky_days}</strong></div>}
            {e.lucky_color && <div><span>Culoarea lunii</span><strong>{e.lucky_color}</strong></div>}
            {e.lucky_number && <div><span>Cifra norocoasă</span><strong>{e.lucky_number}</strong></div>}
          </section>

          {e.tip && (
            <blockquote className="hz-tip"><span>Sfatul lunii</span>„{g(e.tip)}”</blockquote>
          )}

          <div className="hz-share">
            <ShareButton title={`Horoscop ${s.name}`} text={g(e.teaser) || `Horoscopul lunii pentru ${s.name}`} />
          </div>
        </>
      )}

      {month && <Watchouts items={month.watchouts || []} month={month.month} />}

      <section className="hz-compat">
        <h2 className="hz-h3">Zodii compatibile</h2>
        <div className="hz-archive-list">
          {compatibles(s.slug).map(c => <Link key={c.slug} href={`/horoscop/${c.slug}${query}`} className="hz-chip">{c.glyph} {c.name}</Link>)}
        </div>
      </section>

      <div className="hz-prevnext">
        <Link href={`/horoscop/${prev.slug}${query}`}>← {prev.glyph} {prev.name}</Link>
        <Link href={`/horoscop/${next.slug}${query}`}>{next.name} {next.glyph} →</Link>
      </div>
    </div>
  )
}
