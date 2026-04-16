'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'
import DoctorCard from '@/components/DoctorCard'

export default function ContulMeuPage() {
  const { user, loading, signOut } = useAuth() || {}
  const router = useRouter()
  const toast = useToast()

  const [favDoctors, setFavDoctors] = useState(null)
  const [recDoctors, setRecDoctors] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [reviewCountMap, setReviewCountMap] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return

    // Favorites
    supabase
      .from('favorites')
      .select('id, doctor_id, doctors(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        if (!data) return setFavDoctors([])
        const doctors = data.map(f => f.doctors).filter(Boolean)
        const enriched = await enrichDoctors(supabase, doctors)
        setFavDoctors(enriched)
      })

    // Recommendations
    supabase
      .from('recommendations')
      .select('id, doctor_id, doctors(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        if (!data) return setRecDoctors([])
        const doctors = data.map(r => r.doctors).filter(Boolean)
        const enriched = await enrichDoctors(supabase, doctors)
        setRecDoctors(enriched)
      })

    // Reviews
    supabase
      .from('reviews')
      .select('id, doctor_id, text, rating, date, doctors(id, first_name, last_name, slug)')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .order('date', { ascending: false })
      .then(({ data }) => setReviews(data || []))
  }, [user])

  async function enrichDoctors(supabase, doctors) {
    if (!doctors.length) return []
    const ids = doctors.map(d => d.id)

    const [{ data: recs }, { data: revs }] = await Promise.all([
      supabase.from('recommendations').select('doctor_id').in('doctor_id', ids),
      supabase.from('reviews').select('doctor_id').eq('status', 'approved').in('doctor_id', ids),
    ])

    const recMap = {}
    ;(recs || []).forEach(r => { recMap[r.doctor_id] = (recMap[r.doctor_id] || 0) + 1 })

    const revMap = {}
    ;(revs || []).forEach(r => { revMap[r.doctor_id] = (revMap[r.doctor_id] || 0) + 1 })

    setReviewCountMap(prev => ({ ...prev, ...revMap }))

    return doctors.map(d => ({
      ...d,
      recommendations_count: recMap[d.id] || 0,
      clinic_urls: Object.fromEntries((d.clinics || []).map(c => [c, KNOWN_CLINIC_URLS[c] || null])),
    }))
  }

  async function deleteReview(reviewId) {
    const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
    if (res.ok) {
      setReviews(r => r.filter(x => x.id !== reviewId))
      toast('Comentariu șters', 'success')
    } else {
      toast('Eroare la ștergere', 'error')
    }
  }

  async function deleteAccount(withContributions) {
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withContributions }),
    })
    if (res.ok) {
      signOut?.()
      router.replace('/')
      toast('Contul a fost șters', 'success')
    } else {
      toast('Eroare la ștergerea contului', 'error')
    }
    setDeleteConfirm(null)
  }

  if (loading || !user) return null

  const doctorName = (d) => d ? `Dr. ${d.first_name}${d.last_name ? ' ' + d.last_name : ''}` : '—'
  const doctorHref = (d) => d ? `/medici/${d.slug || d.id}` : '#'

  return (
    <div className="contul-meu-page">
      <h1 className="contul-meu-title">Contul meu</h1>
      <p className="contul-meu-email">{user.email}</p>

      {/* Medici Favoriți */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Medici favoriți</h2>
        {favDoctors === null ? (
          <p className="contul-meu-empty">Se încarcă…</p>
        ) : favDoctors.length === 0 ? (
          <p className="contul-meu-empty">Nu ai medici salvați la favorite. Apasă ♡ pe orice card de medic.</p>
        ) : (
          <div className="doctors-grid-home">
            {favDoctors.map(d => (
              <DoctorCard key={d.id} doctor={d} reviewCount={reviewCountMap[d.id] || 0} />
            ))}
          </div>
        )}
      </section>

      {/* Recomandările Mele */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Recomandările mele</h2>
        {recDoctors === null ? (
          <p className="contul-meu-empty">Se încarcă…</p>
        ) : recDoctors.length === 0 ? (
          <p className="contul-meu-empty">Nu ai recomandat niciun medic încă.</p>
        ) : (
          <div className="doctors-grid-home">
            {recDoctors.map(d => (
              <DoctorCard key={d.id} doctor={d} reviewCount={reviewCountMap[d.id] || 0} />
            ))}
          </div>
        )}
      </section>

      {/* Comentariile Mele */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Comentariile mele</h2>
        {reviews === null ? (
          <p className="contul-meu-empty">Se încarcă…</p>
        ) : reviews.length === 0 ? (
          <p className="contul-meu-empty">Nu ai comentarii aprobate încă.</p>
        ) : (
          <ul className="contul-meu-list contul-meu-list--reviews">
            {reviews.map(rev => (
              <li key={rev.id} className="contul-meu-item contul-meu-item--review">
                <div className="contul-meu-item-info">
                  <Link href={doctorHref(rev.doctors)} className="contul-meu-doctor-link">
                    {doctorName(rev.doctors)}
                  </Link>
                  <span className="contul-meu-meta">
                    {rev.rating >= 4 ? '😊 Pozitivă' : '😔 Negativă'} · {rev.date}
                  </span>
                  {rev.text && <p className="contul-meu-review-text">{rev.text}</p>}
                </div>
                <button
                  className="contul-meu-action-btn contul-meu-action-btn--remove"
                  onClick={() => deleteReview(rev.id)}
                >
                  Șterge
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Șterge informațiile mele */}
      <section className="contul-meu-section contul-meu-danger-zone">
        <h2 className="contul-meu-section-title contul-meu-danger-title">Șterge informațiile mele</h2>

        {deleteConfirm === null ? (
          <div className="contul-meu-danger-btns">
            <button className="contul-meu-danger-btn" onClick={() => setDeleteConfirm('account')}>
              Șterge contul
            </button>
            <p className="contul-meu-danger-desc">Contul este șters, dar recomandările și comentariile tale rămân pe platformă în formă anonimă.</p>
            <button className="contul-meu-danger-btn contul-meu-danger-btn--all" onClick={() => setDeleteConfirm('all')}>
              Șterge contul și contribuțiile
            </button>
            <p className="contul-meu-danger-desc">Contul, recomandările, comentariile și favoritele tale sunt șterse permanent.</p>
          </div>
        ) : (
          <div className="contul-meu-confirm">
            <p className="contul-meu-confirm-text">
              {deleteConfirm === 'all'
                ? 'Ești sigură? Această acțiune șterge contul, toate recomandările, comentariile și favoritele tale. Nu poate fi anulată.'
                : 'Ești sigură? Contul tău va fi șters. Recomandările și comentariile rămân anonime pe platformă.'}
            </p>
            <div className="contul-meu-confirm-btns">
              <button className="contul-meu-danger-btn contul-meu-danger-btn--confirm" onClick={() => deleteAccount(deleteConfirm === 'all')}>
                Da, șterge
              </button>
              <button className="contul-meu-action-btn" onClick={() => setDeleteConfirm(null)}>
                Anulează
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
