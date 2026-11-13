import Link from 'next/link'
import { SIGNS, ELEMENTS, monthLabel, signDates } from '@/lib/horoscop'
import { loadMonth, listPublishedMonths } from '@/lib/horoscopData'
import Constellation from '@/components/horoscop/Constellation'
import Watchouts from '@/components/horoscop/Watchouts'
import FindSign from '@/components/horoscop/FindSign'
import Personal from '@/components/horoscop/Personal'
import ProfileEditor from '@/components/horoscop/ProfileEditor'
import { createClient } from '@/lib/supabase/server'
import { HzLoginLink } from '@/components/horoscop/HzAuth'

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

  // Logată → varianta personalizată (dacă nu a cerut explicit toate zodiile)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user && sp?.toate !== '1') {
    const { data: profiles } = await supabase.from('horoscope_profiles').select('*').order('sort')
    const userName = (user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0]
    if (!profiles?.length || sp?.familia === '1') {
      return (
        <section className="hzp-onboard">
          <span className="hz-eyebrow">horoscopul tău personalizat</span>
          <h1 className="hz-h1">{profiles?.length ? 'Familia ta' : 'Hai să-ți citim stelele'}</h1>
          <p className="hz-lead">Spune-ne când și unde v-ați născut, tu și cei dragi. Calculăm zodia și ascendentul fiecăruia, iar în fiecare lună vezi horoscopul tău, al familiei și cum vă potriviți.</p>
          <ProfileEditor initial={profiles || []} userName={userName} />
          {profiles?.length > 0 && <p className="hz-center"><Link href="/horoscop" className="hz-btn hz-btn-ghost">← Înapoi la horoscopul meu</Link></p>}
        </section>
      )
    }
    const pq = qs ? `?${qs}` : ''
    return (
      <>
        {preview && month && month.status !== 'published' && (
          <div className="hz-preview-bar">Previzualizare — ciorna nu e încă publicată. <Link href="/horoscop/admin">Înapoi la admin</Link></div>
        )}
        <Personal month={month} entries={entries} profiles={profiles} query={pq} />
      </>
    )
  }

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
        {!user && <p className="hzp-cta">✨ <HzLoginLink>Intră în cont</HzLoginLink> și primești horoscopul personalizat pentru tine și familia ta, cu ascendent și compatibilități.</p>}
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
