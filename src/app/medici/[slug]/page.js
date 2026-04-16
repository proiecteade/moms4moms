import { createClient } from '@/lib/supabase/server'
import { createClient as createDirectClient } from '@supabase/supabase-js'
import Link from 'next/link'
import DetailActions from '@/components/DetailActions'
import DetailFooterChips from '@/components/DetailFooterChips'
import FavButton from '@/components/FavButton'
import ReviewsSectionClient from '@/components/ReviewsSectionClient'
import SuggestLink from '@/components/SuggestLink'
import { avatarColor, initials, formatDate, sortClinics } from '@/lib/helpers'
import { specEmoji } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

// Re-renderează paginile de doctor în fundal la fiecare oră
export const revalidate = 3600

// Pre-renderează toți doctorii aprobați la build time
export async function generateStaticParams() {
  try {
    const supabase = createDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data: doctors } = await supabase
      .from('doctors')
      .select('slug, id')
      .eq('status', 'approved')
    return (doctors || []).map(d => ({ slug: d.slug || d.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: doc } = await supabase.from('doctors').select('*').or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
  if (!doc) return { title: 'Medic — Moms4Moms' }
  return {
    title: `Dr. ${doc.first_name} ${doc.last_name || ''} — Moms4Moms`,
    description: `Recenzii și informații despre Dr. ${doc.first_name} ${doc.last_name || ''}, ${(doc.specs || []).join(', ')}, ${doc.city}`,
    openGraph: {
      title: `Dr. ${doc.first_name} ${doc.last_name || ''} — Moms4Moms`,
      description: `Recenzii și informații despre Dr. ${doc.first_name} ${doc.last_name || ''}, ${(doc.specs || []).join(', ')}, ${doc.city}`,
      images: doc.photo_url ? [{ url: doc.photo_url }] : [{ url: '/og-image.png' }],
    },
  }
}

export default async function DoctorDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: doc } = await supabase.from('doctors').select('*').or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
  if (!doc) notFound()

  const [{ data: reviews }, { count: recCount }] = await Promise.all([
    supabase.from('reviews').select('*').eq('doctor_id', doc.id).eq('status', 'approved'),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }).eq('doctor_id', doc.id),
  ])

  const docWithUrls = {
    ...doc,
    recommendations_count: recCount || 0,
    clinic_urls: Object.fromEntries((doc.clinics || []).map(c => [c, KNOWN_CLINIC_URLS[c] || null]))
  }
  const revs = reviews || []
  const topLevel = revs.filter(r => !r.parent_id)
  const repliesByParentId = {}
  revs.filter(r => r.parent_id).forEach(r => {
    if (!repliesByParentId[r.parent_id]) repliesByParentId[r.parent_id] = []
    repliesByParentId[r.parent_id].push(r)
  })
  const count = revs.length
  const bg = avatarColor(doc.first_name + (doc.last_name || ''))
  const init = initials(doc.first_name, doc.last_name)

  return (
    <div className="doctor-detail">
      <Link href="/medici" className="back-btn">← Înapoi la lista de medici</Link>

      <div className="doctor-card-wrap">
        {/* HERO: avatar + nume + specialitate */}
        <div className="detail-hero">
          {doc.photo_url
            ? <img src={doc.photo_url} className="detail-avatar" alt={`Dr. ${doc.first_name}`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
            : <div className="detail-avatar" style={{ background: bg }}>{init}</div>
          }
          <div className="detail-hero-info">
            <div className="detail-hero-name-row">
              <div className="detail-name">
                Dr. {doc.first_name}{doc.last_name ? ' ' + doc.last_name : ''}
              </div>
              <FavButton doctor={doc} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {(doc.specs || []).map(s => (
                <Link key={s} href={`/medici?spec=${encodeURIComponent(s)}`} className="spec-badge">
                  {specEmoji(s)} {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BODY: info medic */}
        <div className="detail-body">
          {doc.obs && (
            <div style={{ padding: '0.5rem 1.75rem', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {doc.obs.split(',').map(o => o.trim()).filter(Boolean).map((o, i) => (
                <span key={i} className="obs-tag" style={{ fontSize: 13 }}>ℹ️ {o}</span>
              ))}
            </div>
          )}

          {doc.note && (
            <div style={{ margin: '0 1.75rem 0.5rem', padding: 12, background: 'var(--teal-light)', borderRadius: 10, fontSize: 14, color: 'var(--teal)', fontStyle: 'italic' }}>
              &ldquo;{doc.note}&rdquo;
            </div>
          )}

          <div className="detail-location">
            {(doc.city || '').split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <span key={c}>📍 {c}</span>
            ))}
          </div>

          {docWithUrls.clinics?.length > 0 && (
            <div className="detail-clinics">
              {sortClinics(docWithUrls.clinics).map(c => (
                docWithUrls.clinic_urls?.[c]
                  ? <a key={c} href={docWithUrls.clinic_urls[c]} target="_blank" rel="noopener noreferrer" className="clinic-tag clinic-tag-link">🏥 {c}</a>
                  : <span key={c} className="clinic-tag">🏥 {c}</span>
              ))}
            </div>
          )}
          {/* CHIPS: Recomandă + Comentează */}
          <DetailFooterChips doctor={docWithUrls} reviewCount={count} />
        </div>

        {/* ACTIONS: Share — pe bej, jos */}
        <DetailActions doctor={doc} />
      </div>
      <SuggestLink doctor={doc} />

      <ReviewsSectionClient
        topLevel={topLevel}
        repliesByParentId={repliesByParentId}
        doctorId={doc.id}
        doctor={doc}
      />
    </div>
  )
}
