import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { SIGN_BY_SLUG, ELEMENTS, SECTIONS, MOON_NEEDS, KID_PROFILE, monthLabel, g } from '@/lib/horoscop'
import { loadMonth } from '@/lib/horoscopData'
import { createClient } from '@/lib/supabase/server'
import Constellation from '@/components/horoscop/Constellation'
import Watchouts from '@/components/horoscop/Watchouts'
import Relation, { firstName, genderOf } from '@/components/horoscop/Relation'
import { Signs, GeneralLink, REL_LABEL } from '@/components/horoscop/Personal'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Horoscopul familiei — Moms4Moms', robots: { index: false } }

export default async function MembruPage({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/horoscop')
  const { data: profiles } = await supabase.from('horoscope_profiles').select('*').order('sort')
  const p = (profiles || []).find(x => x.id === id)
  if (!p) notFound()
  const me = profiles.find(x => x.relation === 'eu') || profiles[0]

  const preview = sp?.preview === '1'
  const luna = /^\d{4}-\d{2}$/.test(sp?.luna || '') ? sp.luna : null
  const { month, entries } = await loadMonth({ month: luna, preview })
  const qs = [luna && `luna=${luna}`, preview && 'preview=1'].filter(Boolean).join('&')
  const query = qs ? `?${qs}` : ''
  const by = Object.fromEntries(entries.map(e => [e.sign, e]))

  const s = SIGN_BY_SLUG[p.sun_sign]
  const el = ELEMENTS[s.element]
  const pg = genderOf(p, me)
  const kids = profiles.filter(x => x.relation === 'copil').map(x => ({ name: x.name, gender: genderOf(x, me) }))
  const G = (t) => g(t, pg, kids)
  const name = firstName(p.name)
  const e = by[p.sun_sign]
  const isKid = p.relation === 'copil'
  const ascE = p.asc_sign && p.asc_sign !== p.sun_sign ? by[p.asc_sign] : null
  const moon = p.moon_sign ? SIGN_BY_SLUG[p.moon_sign] : null

  return (
    <div className="hz-sign hzp" style={{ '--el': el.color, '--el-glow': el.glow }}>
      <div className="hz-crumbs"><Link href={`/horoscop${query}`}>← Horoscopul meu</Link></div>
      <section className="hz-sign-hero">
        <div className="hz-sign-art">
          <Constellation sign={s} size={260} />
          <span className="hz-sign-glyph">{s.glyph}</span>
        </div>
        <div className="hz-sign-intro">
          <span className="hz-eyebrow">{REL_LABEL[p.relation]?.[pg]} · {month ? `horoscop ${monthLabel(month.month, false)}` : 'horoscop'}</span>
          <h1 className="hz-h1">{p.name}</h1>
          <Signs p={p} />
          {e?.teaser && <p className="hz-hero-title">{G(e.teaser)}</p>}
          <GeneralLink sign={p.sun_sign} query={query} />
        </div>
      </section>

      <section className="hzp-family" style={{ paddingTop: 10 }}>
        <article className="hzp-fam" style={{ maxWidth: 820, margin: '0 auto' }}>
          <header><span className="hzp-fam-glyph">♡</span><div><h3>{genderOf(me) === 'f' && pg === 'f' ? 'Voi două' : 'Voi doi'} luna asta</h3><span className="hzp-fam-rel">tu ({SIGN_BY_SLUG[me.sun_sign].name}) și {name} ({s.name})</span></div></header>
          <Relation me={me} p={p} month={month} full />
        </article>
      </section>

      {!month || !e ? (
        <p className="hz-lead hz-center">Horoscopul lunii apare aici foarte curând. ✦</p>
      ) : isKid ? (
        <>
          <div className="hz-section-head"><span className="hz-eyebrow">ca {s.name}</span><h2 className="hz-h2">Luna asta, pentru {name}</h2></div>
          <div className="hz-sections">
            {e.kids && <article className="hz-panel"><h2><span className="hz-panel-icon">☺</span>Luna asta, pe scurt</h2><p>{G(e.kids)}</p></article>}
            {e.kids_more && <article className="hz-panel"><h2><span className="hz-panel-icon">☾</span>Luna asta, pe larg</h2><p>{G(e.kids_more)}</p></article>}
            {ascE?.kids && <article className="hz-panel is-asc"><h2><span className="hz-panel-icon">↑</span>Prin ascendentul în {SIGN_BY_SLUG[p.asc_sign].name}</h2><p>{G(ascE.kids)}</p></article>}
            {KID_PROFILE[p.sun_sign] && <article className="hz-panel"><h2><span className="hz-panel-icon">{s.glyph}</span>{name}, ca {s.name}</h2><p>{G(KID_PROFILE[p.sun_sign])}</p></article>}
            {moon && <article className="hz-panel is-moms"><h2><span className="hz-panel-icon">☽</span>Ce {pg === 'm' ? 'îl' : 'o'} liniștește · Luna în {moon.name}</h2><p>{G(MOON_NEEDS[p.moon_sign])}</p></article>}
          </div>
          <section className="hz-lucky">
            {e.lucky_days && <div><span>Zile bune</span><strong>{e.lucky_days}</strong></div>}
            {e.lucky_color && <div><span>Culoarea lunii</span><strong>{e.lucky_color}</strong></div>}
            {e.lucky_number && <div><span>Cifra norocoasă</span><strong>{e.lucky_number}</strong></div>}
          </section>
        </>
      ) : (
        <>
          <div className="hz-section-head"><span className="hz-eyebrow">ca {s.name}</span><h2 className="hz-h2">Luna asta, pentru {name}</h2></div>
          <div className="hz-sections">
            {SECTIONS.map(sec => e[sec.key] && (
              <article key={sec.key} className={`hz-panel ${sec.special ? 'is-moms' : ''}`}>
                <h2><span className="hz-panel-icon">{sec.icon}</span>{sec.key === 'moms' ? `Ca ${pg === 'm' ? 'tată' : 'mamă'}` : sec.label}</h2>
                <p>{G(e[sec.key])}</p>
              </article>
            ))}
            {e.family && <article className="hz-panel"><h2><span className="hz-panel-icon">⌂</span>În familie</h2><p>{G(e.family)}</p></article>}
            {ascE && <article className="hz-panel is-asc"><h2><span className="hz-panel-icon">↑</span>Prin ascendentul în {SIGN_BY_SLUG[p.asc_sign].name}</h2><p><em>{G(ascE.teaser)}</em> {G(ascE.general)}</p></article>}
          </div>
          <section className="hz-lucky">
            {e.lucky_days && <div><span>Zile bune</span><strong>{e.lucky_days}</strong></div>}
            {e.lucky_color && <div><span>Culoarea lunii</span><strong>{e.lucky_color}</strong></div>}
            {e.lucky_number && <div><span>Cifra norocoasă</span><strong>{e.lucky_number}</strong></div>}
          </section>
          {e.tip && <blockquote className="hz-tip"><span>Sfatul lunii</span>„{G(e.tip)}”</blockquote>}
        </>
      )}

      {month && (
        <Watchouts items={month.watchouts || []} month={month.month} id="perioade" timeline={false}
          family={[{ name, signs: [p.sun_sign, p.asc_sign].filter(Boolean) }]}
          eyebrow={pg === 'm' ? 'perioadele care îl ating' : 'perioadele care o ating'} title={`Atenție pentru ${name}`} />
      )}

      <div className="hzp-bottom">
        <Link href={`/horoscop${query}`} className="hz-btn hz-btn-ghost">← Horoscopul meu</Link>
        <Link href={`/horoscop/${p.sun_sign}${query}`} className="hz-btn hz-btn-ghost">Horoscopul general {s.name}</Link>
      </div>
    </div>
  )
}
