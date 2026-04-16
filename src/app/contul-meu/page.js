'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { specEmoji } from '@/lib/constants'

export default function ContulMeuPage() {
  const { user, loading, signOut } = useAuth() || {}
  const router = useRouter()
  const toast = useToast()

  const [favorites, setFavorites] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // null | 'account' | 'all'

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return

    supabase
      .from('favorites')
      .select('id, doctor_id, doctors(id, first_name, last_name, slug, specs, city)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setFavorites(data || []))

    supabase
      .from('recommendations')
      .select('id, doctor_id, doctors(id, first_name, last_name, slug, city)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRecommendations(data || []))

    supabase
      .from('reviews')
      .select('id, doctor_id, text, rating, date, doctors(id, first_name, last_name, slug)')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .order('date', { ascending: false })
      .then(({ data }) => setReviews(data || []))
  }, [user])

  async function removeFavorite(favId, doctorId) {
    const supabase = createClient()
    await supabase.from('favorites').delete().eq('id', favId)
    setFavorites(f => f.filter(x => x.id !== favId))
    toast('Scos din favorite', 'success')
  }

  async function withdrawRecommendation(recId) {
    const supabase = createClient()
    await supabase.from('recommendations').delete().eq('id', recId)
    setRecommendations(r => r.filter(x => x.id !== recId))
    toast('Recomandare retrasă', 'success')
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

      {/* Medici Favoriti */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Medici Favoriți</h2>
        {favorites === null ? (
          <p className="contul-meu-empty">Se încarcă…</p>
        ) : favorites.length === 0 ? (
          <p className="contul-meu-empty">Nu ai medici salvați la favorite. Apasă ♡ pe orice card de medic.</p>
        ) : (
          <ul className="contul-meu-list">
            {favorites.map(fav => (
              <li key={fav.id} className="contul-meu-item">
                <div className="contul-meu-item-info">
                  <Link href={doctorHref(fav.doctors)} className="contul-meu-doctor-link">
                    {doctorName(fav.doctors)}
                  </Link>
                  {fav.doctors?.city && (
                    <span className="contul-meu-meta">📍 {fav.doctors.city.split(',')[0].trim()}</span>
                  )}
                  {fav.doctors?.specs?.length > 0 && (
                    <span className="contul-meu-meta">{specEmoji(fav.doctors.specs[0])} {fav.doctors.specs[0]}</span>
                  )}
                </div>
                <button
                  className="contul-meu-action-btn contul-meu-action-btn--remove"
                  onClick={() => removeFavorite(fav.id, fav.doctor_id)}
                >
                  ♥ Scoate
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recomandarile Mele */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Recomandările Mele</h2>
        {recommendations === null ? (
          <p className="contul-meu-empty">Se încarcă…</p>
        ) : recommendations.length === 0 ? (
          <p className="contul-meu-empty">Nu ai recomandat niciun medic încă.</p>
        ) : (
          <ul className="contul-meu-list">
            {recommendations.map(rec => (
              <li key={rec.id} className="contul-meu-item">
                <div className="contul-meu-item-info">
                  <Link href={doctorHref(rec.doctors)} className="contul-meu-doctor-link">
                    {doctorName(rec.doctors)}
                  </Link>
                  {rec.doctors?.city && (
                    <span className="contul-meu-meta">📍 {rec.doctors.city.split(',')[0].trim()}</span>
                  )}
                </div>
                <button
                  className="contul-meu-action-btn contul-meu-action-btn--remove"
                  onClick={() => withdrawRecommendation(rec.id)}
                >
                  Retrage
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comentariile Mele */}
      <section className="contul-meu-section">
        <h2 className="contul-meu-section-title">Comentariile Mele</h2>
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

      {/* Zona Periculoasa */}
      <section className="contul-meu-section contul-meu-danger-zone">
        <h2 className="contul-meu-section-title contul-meu-danger-title">Zona periculoasă</h2>

        {deleteConfirm === null ? (
          <div className="contul-meu-danger-btns">
            <button
              className="contul-meu-danger-btn"
              onClick={() => setDeleteConfirm('account')}
            >
              Șterge contul
            </button>
            <p className="contul-meu-danger-desc">Contul este șters, dar recomandările și comentariile tale rămân pe platformă în formă anonimă.</p>
            <button
              className="contul-meu-danger-btn contul-meu-danger-btn--all"
              onClick={() => setDeleteConfirm('all')}
            >
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
              <button
                className="contul-meu-danger-btn contul-meu-danger-btn--confirm"
                onClick={() => deleteAccount(deleteConfirm === 'all')}
              >
                Da, șterge
              </button>
              <button
                className="contul-meu-action-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Anulează
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
