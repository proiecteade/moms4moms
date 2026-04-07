import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Stars from '@/components/Stars'
import DetailActions from '@/components/DetailActions'
import { avatarColor, initials, avgRating, formatDate } from '@/lib/helpers'
import { notFound } from 'next/navigation'

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

  const [{ data: doc }, { data: reviews }] = await Promise.all([
    supabase.from('doctors').select('*').eq('id', id).single(),
    supabase.from('reviews').select('*').eq('doctor_id', id).eq('status', 'approved'),
  ])

  if (!doc) notFound()

  const revs = reviews || []
  const rating = avgRating(revs)
  const count = revs.length
  const bg = avatarColor(doc.first_name + (doc.last_name || ''))
  const init = initials(doc.first_name, doc.last_name)

  return (
    <div className="doctor-detail">
      <Link href="/medici" className="back-btn">← Înapoi la lista de medici</Link>

      <div className="detail-hero">
        <div className="detail-avatar" style={{ background: bg }}>{init}</div>
        <div style={{ flex: 1 }}>
          <div className="detail-name">
            Dr. {doc.first_name}{doc.last_name ? ' ' + doc.last_name : ''}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {(doc.specs || []).map(s => (
              <Link key={s} href={`/medici?spec=${encodeURIComponent(s)}`} className="spec-badge">
                {s}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Stars rating={rating} size="16px" align="left" />
            <span style={{ fontSize: 22, fontWeight: 700 }}>{rating ? rating.toFixed(1) : '—'}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>({count} recenz{count === 1 ? 'ie' : 'ii'})</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 8 }}>📍 {doc.city}</div>
          {doc.clinics?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {doc.clinics.map(c => (
                <Link key={c} href={`/medici?q=${encodeURIComponent(c)}`} className="clinic-tag">
                  🏥 {c}
                </Link>
              ))}
            </div>
          )}
          {doc.obs && (
            <div style={{ marginBottom: 8 }}>
              <span className="obs-tag" style={{ fontSize: 13 }}>ℹ️ {doc.obs}</span>
            </div>
          )}
          {doc.note && (
            <div style={{ marginTop: 10, padding: 12, background: 'var(--teal-light)', borderRadius: 10, fontSize: 14, color: 'var(--teal)', fontStyle: 'italic' }}>
              &ldquo;{doc.note}&rdquo;
            </div>
          )}
          <DetailActions doctor={doc} />
        </div>
      </div>

      <div className="reviews-section">
        <div className="section-title">
          Recenzii
          <DetailActions doctor={doc} reviewOnly />
        </div>
        {revs.length > 0
          ? revs.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <div>
                  <Stars rating={r.rating} size="13px" align="left" />
                  <div className="reviewer-name">{r.reviewer || 'Anonim'}</div>
                </div>
                <div className="review-date">{formatDate(r.date)}</div>
              </div>
              <div className="review-text">{r.text}</div>
            </div>
          ))
          : <div className="no-reviews">Nicio recenzie încă. Fii prima care lasă un feedback! 💗</div>
        }
      </div>
    </div>
  )
}
