import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DetailActions from '@/components/DetailActions'
import DetailFooterChips from '@/components/DetailFooterChips'
import ReviewsSectionClient from '@/components/ReviewsSectionClient'
import SuggestLink from '@/components/SuggestLink'
import { avatarColor, initials, formatDate, sortClinics } from '@/lib/helpers'
import { specEmoji } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: doc } = await supabase.from('doctors').select('*').eq('id', id).single()
  if (!doc) return { title: 'Medic — Moms4Moms' }
  return {
    title: `Dr. ${doc.first_name} ${doc.last_name || ''} — Moms4Moms`,
    description: `Recenzii și informații despre Dr. ${doc.first_name} ${doc.last_name || ''}, ${(doc.specs || []).join(', ')}, ${doc.city}`,
  }
}

export default async function DoctorDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: doc }, { data: reviews }, { count: recCount }] = await Promise.all([
    supabase.from('doctors').select('*').eq('id', id).single(),
    supabase.from('reviews').select('*').eq('doctor_id', id).eq('status', 'approved'),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }).eq('doctor_id', id),
  ])

  if (!doc) notFound()

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
            <div className="detail-name">
              Dr. {doc.first_name}{doc.last_name ? ' ' + doc.last_name : ''}
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
