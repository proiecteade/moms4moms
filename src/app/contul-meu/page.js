'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'
import { avatarColor, initials } from '@/lib/helpers'
import { specEmoji } from '@/lib/constants'

const TABS = [
  { id: 'favorite', label: 'Medici favoriți' },
  { id: 'recomandari', label: 'Recomandările mele' },
  { id: 'comentarii', label: 'Comentariile mele' },
  { id: 'sterge', label: 'Șterge informațiile mele' },
]

export default function ContulMeuPage() {
  const { user, loading, signOut } = useAuth() || {}
  const router = useRouter()
  const toast = useToast()
  const [tab, setTab] = useState('favorite')

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

  async function removeFavorite(doctorId) {
    const supabase = createClient()
    await supabase.from('favorites').delete().eq('doctor_id', doctorId).eq('user_id', user.id)
    setFavDoctors(f => f.filter(d => d.id !== doctorId))
    toast('Scos din favorite', 'success')
  }

  async function withdrawRecommendation(doctorId) {
    const supabase = createClient()
    await supabase.from('recommendations').delete().eq('doctor_id', doctorId).eq('user_id', user.id)
    setRecDoctors(r => r.filter(d => d.id !== doctorId))
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

  return (
    <div className="admin-layout">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>Contul meu</div>
        <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 2 }}>{user.email}</div>
      </div>
      <div className="admin-shell">
        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {tab === 'favorite' && (
            <DoctorList
              doctors={favDoctors}
              reviewCountMap={reviewCountMap}
              emptyText="Nu ai medici salvați la favorite. Apasă ♡ pe orice card de medic."
              actionLabel="♥ Scoate"
              onAction={d => removeFavorite(d.id)}
            />
          )}
          {tab === 'recomandari' && (
            <DoctorList
              doctors={recDoctors}
              reviewCountMap={reviewCountMap}
              emptyText="Nu ai recomandat niciun medic încă."
              actionLabel="Retrage"
              onAction={d => withdrawRecommendation(d.id)}
            />
          )}
          {tab === 'comentarii' && (
            <ReviewList reviews={reviews} onDelete={deleteReview} />
          )}
          {tab === 'sterge' && (
            <DeleteSection
              deleteConfirm={deleteConfirm}
              setDeleteConfirm={setDeleteConfirm}
              onDelete={deleteAccount}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function DoctorList({ doctors, reviewCountMap, emptyText, actionLabel, onAction }) {
  if (doctors === null) return <p className="contul-meu-empty">Se încarcă…</p>
  if (doctors.length === 0) return <p className="contul-meu-empty">{emptyText}</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {doctors.map(d => (
        <DoctorRow key={d.id} doctor={d} reviewCount={reviewCountMap[d.id] || 0} actionLabel={actionLabel} onAction={() => onAction(d)} />
      ))}
    </div>
  )
}

function DoctorRow({ doctor: d, reviewCount, actionLabel, onAction }) {
  const bg = avatarColor(d.first_name + (d.last_name || ''))
  const init = initials(d.first_name, d.last_name)
  return (
    <div className="contul-meu-doctor-row">
      <div className="contul-meu-row-info">
        <Link href={`/medici/${d.slug || d.id}`} className="contul-meu-row-name-link">
          {d.photo_url
            ? <img src={d.photo_url} className="contul-meu-row-avatar" alt={`Dr. ${d.first_name}`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
            : <div className="contul-meu-row-avatar" style={{ background: bg }}>{init}</div>
          }
          <span className="contul-meu-row-name">Dr. {d.first_name}{d.last_name ? ' ' + d.last_name : ''}</span>
        </Link>
        {d.specs?.length > 0 && (
          <div className="doctor-specs">
            {d.specs.map(s => (
              <Link key={s} href={`/medici?spec=${encodeURIComponent(s)}`} className="spec-badge">
                {specEmoji(s)} {s}
              </Link>
            ))}
          </div>
        )}
        {d.city && (
          <div className="doctor-meta">
            {d.city.split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <Link key={c} href={`/medici?city=${encodeURIComponent(c)}`} className="meta-pill">📍 {c}</Link>
            ))}
          </div>
        )}
        {d.clinics?.length > 0 && (
          <div className="tags-row">
            {d.clinics.map(c => {
              const url = d.clinic_urls?.[c]
              return url
                ? <a key={c} href={url} target="_blank" rel="noopener noreferrer" className="clinic-tag clinic-tag-link">🏥 {c}</a>
                : <span key={c} className="clinic-tag">🏥 {c}</span>
            })}
          </div>
        )}
        <div className="contul-meu-row-counts">
          <span>👍 {d.recommendations_count || 0}</span>
          <span>💬 {reviewCount}</span>
        </div>
      </div>
      <button className="contul-meu-action-btn contul-meu-action-btn--remove" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

function ReviewList({ reviews, onDelete }) {
  if (reviews === null) return <p className="contul-meu-empty">Se încarcă…</p>
  if (reviews.length === 0) return <p className="contul-meu-empty">Nu ai comentarii aprobate încă.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {reviews.map(rev => {
        const d = rev.doctors
        return (
          <div key={rev.id} className="contul-meu-review-row">
            <div style={{ flex: 1, minWidth: 0 }}>
              {d && (
                <Link href={`/medici/${d.slug || d.id}`} className="contul-meu-row-name" style={{ display: 'block', marginBottom: 4 }}>
                  Dr. {d.first_name}{d.last_name ? ' ' + d.last_name : ''}
                </Link>
              )}
              <div className="contul-meu-row-meta">{rev.rating >= 4 ? '😊 Pozitivă' : '😔 Negativă'} · {rev.date}</div>
              {rev.text && <p className="contul-meu-review-text">{rev.text}</p>}
            </div>
            <button className="contul-meu-action-btn contul-meu-action-btn--remove" onClick={() => onDelete(rev.id)}>
              Șterge
            </button>
          </div>
        )
      })}
    </div>
  )
}

function DeleteSection({ deleteConfirm, setDeleteConfirm, onDelete }) {
  return (
    <div className="contul-meu-danger-btns">
      {deleteConfirm === null ? (
        <>
          <button className="contul-meu-danger-btn" onClick={() => setDeleteConfirm('account')}>
            Șterge contul
          </button>
          <p className="contul-meu-danger-desc">Contul este șters, dar recomandările și comentariile tale rămân pe platformă în formă anonimă.</p>
          <button className="contul-meu-danger-btn contul-meu-danger-btn--all" onClick={() => setDeleteConfirm('all')}>
            Șterge contul și contribuțiile
          </button>
          <p className="contul-meu-danger-desc">Contul, recomandările, comentariile și favoritele tale sunt șterse permanent.</p>
        </>
      ) : (
        <div className="contul-meu-confirm">
          <p className="contul-meu-confirm-text">
            {deleteConfirm === 'all'
              ? 'Ești sigură? Această acțiune șterge contul, toate recomandările, comentariile și favoritele tale. Nu poate fi anulată.'
              : 'Ești sigură? Contul tău va fi șters. Recomandările și comentariile rămân anonime pe platformă.'}
          </p>
          <div className="contul-meu-confirm-btns">
            <button className="contul-meu-danger-btn contul-meu-danger-btn--confirm" onClick={() => onDelete(deleteConfirm === 'all')}>
              Da, șterge
            </button>
            <button className="contul-meu-action-btn" onClick={() => setDeleteConfirm(null)}>
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
