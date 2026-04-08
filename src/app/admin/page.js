'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SPECIALTIES } from '@/lib/constants'
import { doctorFullName } from '@/lib/helpers'
import { useToast } from '@/components/Toast'

export default function AdminPage() {
  const toast = useToast()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending-docs')

  const [pendingDocs, setPendingDocs] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])
  const [approvedReviews, setApprovedReviews] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showArchivedSuggestions, setShowArchivedSuggestions] = useState(false)
  const [feedback, setFeedback] = useState([])
  const [allDocs, setAllDocs] = useState([])
  const [docSearch, setDocSearch] = useState('')

  const [editDoc, setEditDoc] = useState(null)
  const [editSpecs, setEditSpecs] = useState([])
  const [editClinics, setEditClinics] = useState([''])
  const [editReview, setEditReview] = useState(null) // { id, text }

  const supabase = createClient()

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const loadData = useCallback(async () => {
    const [a, b, c, d, e, f] = await Promise.all([
      supabase.from('doctors').select('*').eq('status', 'pending'),
      supabase.from('reviews').select('*, doctors(first_name,last_name,specs)').eq('status', 'pending'),
      supabase.from('reviews').select('*, doctors(first_name,last_name)').eq('status', 'approved').order('date', { ascending: false }),
      supabase.from('suggestions').select('*, doctors(*)').order('date', { ascending: false }),
      supabase.from('site_feedback').select('*').order('date', { ascending: false }),
      supabase.from('doctors').select('*').order('last_name').order('first_name'),
    ])
    setPendingDocs(a.data || [])
    setPendingReviews(b.data || [])
    setApprovedReviews(c.data || [])
    setSuggestions(d.data || [])
    setFeedback(e.data || [])
    setAllDocs(f.data || [])
  }, [])

  useEffect(() => { if (session) loadData() }, [session, loadData])

  async function login(e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast('Email sau parolă incorectă.', 'error')
  }

  async function logout() { await supabase.auth.signOut() }

  async function approveDoc(id) {
    await supabase.from('doctors').update({ status: 'approved' }).eq('id', id)
    loadData()
  }
  async function rejectDoc(id) {
    await supabase.from('doctors').delete().eq('id', id)
    loadData()
  }
  async function approveReview(id) {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', id)
    loadData()
  }
  async function rejectReview(id) {
    await supabase.from('reviews').delete().eq('id', id)
    loadData()
  }
  async function archiveSuggestion(id) {
    await supabase.from('suggestions').update({ archived: true }).eq('id', id)
    loadData()
  }
  async function unarchiveSuggestion(id) {
    await supabase.from('suggestions').update({ archived: false }).eq('id', id)
    loadData()
  }
  async function setFeedbackStatus(id, status) {
    await supabase.from('site_feedback').update({ status }).eq('id', id)
    loadData()
  }
  async function deleteApprovedReview(id) {
    if (!confirm('Ștergi această recenzie?')) return
    await supabase.from('reviews').delete().eq('id', id)
    loadData()
  }
  async function saveReviewEdit() {
    if (!editReview) return
    await supabase.from('reviews').update({ text: editReview.text }).eq('id', editReview.id)
    setEditReview(null)
    loadData()
  }
  async function removeDoc(id) {
    if (!confirm('Elimini acest medic?')) return
    await supabase.from('doctors').delete().eq('id', id)
    loadData()
  }

  function openEdit(doc) {
    setEditDoc({ ...doc })
    setEditSpecs([...(doc.specs || [])])
    setEditClinics(doc.clinics?.length ? [...doc.clinics] : [''])
  }

  async function saveEdit() {
    if (!editDoc) return
    await supabase.from('doctors').update({
      first_name: editDoc.first_name,
      last_name: editDoc.last_name,
      city: editDoc.city,
      specs: editSpecs,
      clinics: editClinics.filter(Boolean),
      obs: editDoc.obs,
      note: editDoc.note,
      photo_url: editDoc.photo_url || '',
    }).eq('id', editDoc.id)
    setEditDoc(null)
    loadData()
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--ink-faint)' }}>Se încarcă…</div>

  if (!session) {
    return (
      <div className="admin-login">
        <div className="admin-login-title">Panou Administrator</div>
        <div className="admin-login-sub">Introdu email și parola pentru a accesa panoul.</div>
        <form onSubmit={login}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="admin@moms4moms.ro" required />
          </div>
          <div className="form-group">
            <label className="form-label">Parolă</label>
            <input className="form-input" name="password" type="password" placeholder="••••••••" required />
          </div>
          <button className="submit-btn" type="submit">Intră în panou</button>
        </form>
      </div>
    )
  }

  const filteredAllDocs = allDocs.filter(d =>
    !docSearch ||
    (d.first_name + ' ' + d.last_name).toLowerCase().includes(docSearch.toLowerCase()) ||
    (d.specs || []).some(s => s.toLowerCase().includes(docSearch.toLowerCase()))
  )

  const activeSuggestions = suggestions.filter(s => !s.archived)
  const archivedSuggestions = suggestions.filter(s => s.archived)
  const newFeedback = feedback.filter(f => !f.status)

  const TABS = [
    { id: 'pending-docs', label: 'Medici în așteptare', count: pendingDocs.length },
    { id: 'pending-reviews', label: 'Recenzii în așteptare', count: pendingReviews.length },
    { id: 'approved-reviews', label: 'Recenzii publicate', count: null },
    { id: 'suggestions', label: 'Sugestii modificare', count: activeSuggestions.length },
    { id: 'site-feedback', label: 'Feedback site', count: newFeedback.length },
    { id: 'all-docs', label: 'Toți medicii', count: null },
  ]

  return (
    <div className="admin-layout">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: 24 }}>Panou Administrator</h1>
        <button className="nav-btn nav-btn-ghost" onClick={logout}>Deconectare</button>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label} {t.count > 0 ? `(${t.count})` : ''}
          </button>
        ))}
      </div>

      {tab === 'pending-docs' && (
        <div>
          {pendingDocs.length === 0
            ? <EmptyState icon="✅" label="Nu există medici în așteptare" />
            : pendingDocs.map(d => (
              <div key={d.id} className="admin-card">
                <div className="admin-card-info">
                  <div className="admin-card-name">{doctorFullName(d)}</div>
                  <div className="admin-card-sub">{(d.specs || []).join(', ')} • {d.city}{d.clinics?.length ? ' • ' + d.clinics.join(', ') : ''}</div>
                  {d.obs && <div style={{ fontSize: 12, color: 'var(--amber)', marginTop: 3 }}>ℹ️ {d.obs}</div>}
                </div>
                <div className="admin-card-actions">
                  <button className="btn-approve" onClick={() => approveDoc(d.id)}>✓ Aprobă</button>
                  <button className="btn-edit" onClick={() => openEdit(d)}>✎ Editează</button>
                  <button className="btn-reject" onClick={() => rejectDoc(d.id)}>✕ Respinge</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'pending-reviews' && (
        <div>
          {pendingReviews.length === 0
            ? <EmptyState icon="✅" label="Nu există recenzii în așteptare" />
            : pendingReviews.map(r => {
              const doc = r.doctors
              return (
                <div key={r.id} className="admin-card">
                  <div className="admin-card-info">
                    <div className="admin-card-name">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} — {r.reviewer}</div>
                    <div className="admin-card-sub">{doc ? `Dr. ${doc.first_name} ${doc.last_name || ''} (${(doc.specs||[]).join(', ')})` : ''}</div>
                    <div style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 7 }}>{r.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 3 }}>{r.date}</div>
                  </div>
                  <div className="admin-card-actions">
                    <button className="btn-approve" onClick={() => approveReview(r.id)}>✓ Aprobă</button>
                    <button className="btn-reject" onClick={() => rejectReview(r.id)}>✕ Respinge</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      )}

      {tab === 'approved-reviews' && (
        <div>
          {approvedReviews.length === 0
            ? <EmptyState icon="💬" label="Nu există recenzii publicate" />
            : approvedReviews.map(r => {
              const doc = r.doctors
              const isEditing = editReview?.id === r.id
              return (
                <div key={r.id} className="admin-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div className="admin-card-info">
                      <div className="admin-card-name">{doc ? `Dr. ${doc.first_name} ${doc.last_name || ''}` : '—'}</div>
                      <div className="admin-card-sub">{r.reviewer || 'Anonim'} • {r.date} • {r.rating >= 4 ? '😊' : '😔'}</div>
                      {!isEditing && <div style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 6 }}>{r.text || <em>fără text</em>}</div>}
                    </div>
                    <div className="admin-card-actions">
                      <button className="btn-edit" onClick={() => setEditReview(isEditing ? null : { id: r.id, text: r.text || '' })}>
                        {isEditing ? '✕ Anulează' : '✎ Editează'}
                      </button>
                      <button className="btn-reject" onClick={() => deleteApprovedReview(r.id)}>✕ Șterge</button>
                    </div>
                  </div>
                  {isEditing && (
                    <div>
                      <textarea
                        className="form-textarea"
                        value={editReview.text}
                        onChange={e => setEditReview(r => ({ ...r, text: e.target.value }))}
                        style={{ marginBottom: 8 }}
                      />
                      <button className="btn-approve" onClick={saveReviewEdit}>✓ Salvează</button>
                    </div>
                  )}
                </div>
              )
            })
          }
        </div>
      )}

      {tab === 'suggestions' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
            <button
              className={`admin-tab${!showArchivedSuggestions ? ' active' : ''}`}
              onClick={() => setShowArchivedSuggestions(false)}
            >
              Active ({activeSuggestions.length})
            </button>
            <button
              className={`admin-tab${showArchivedSuggestions ? ' active' : ''}`}
              onClick={() => setShowArchivedSuggestions(true)}
            >
              Arhivă ({archivedSuggestions.length})
            </button>
          </div>
          {(showArchivedSuggestions ? archivedSuggestions : activeSuggestions).length === 0
            ? <EmptyState icon="✅" label={showArchivedSuggestions ? 'Arhiva e goală' : 'Nu există sugestii active'} />
            : (showArchivedSuggestions ? archivedSuggestions : activeSuggestions).map(s => (
              <div key={s.id} className="admin-card">
                <div className="admin-card-info">
                  <div className="admin-card-name">{s.doctor_name}</div>
                  <div className="admin-card-sub">{s.date}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 7 }}>{s.text}</div>
                </div>
                <div className="admin-card-actions">
                  {s.doctors && (
                    <button className="btn-edit" onClick={() => openEdit(s.doctors)}>✎ Editează medic</button>
                  )}
                  {!showArchivedSuggestions
                    ? <button className="btn-reject" onClick={() => archiveSuggestion(s.id)}>↓ Arhivează</button>
                    : <button className="btn-approve" onClick={() => unarchiveSuggestion(s.id)}>↑ Dezarhivează</button>
                  }
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'site-feedback' && (
        <div>
          {feedback.length === 0
            ? <EmptyState icon="💬" label="Nu există feedback pentru site" />
            : feedback.map(f => {
              const statusBadge = f.status === 'implemented'
                ? <span style={{ background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>✓ Implementat</span>
                : f.status === 'not_implemented'
                  ? <span style={{ background: 'var(--rose-light)', color: 'var(--rose)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>✗ Neimplementat</span>
                  : <span style={{ background: 'var(--amber-light)', color: 'var(--amber)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>Nou</span>
              return (
                <div key={f.id} className="admin-card">
                  <div className="admin-card-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div className="admin-card-name">{f.rating ? '★'.repeat(f.rating)+'☆'.repeat(5-f.rating) : 'Fără rating'}</div>
                      {statusBadge}
                    </div>
                    <div className="admin-card-sub">{f.date}</div>
                    <div style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 7 }}>{f.text || '—'}</div>
                  </div>
                  <div className="admin-card-actions">
                    {f.status !== 'implemented' && (
                      <button className="btn-approve" onClick={() => setFeedbackStatus(f.id, 'implemented')}>✓ Implementat</button>
                    )}
                    {f.status !== 'not_implemented' && (
                      <button className="btn-reject" onClick={() => setFeedbackStatus(f.id, 'not_implemented')}>✗ Neimplementat</button>
                    )}
                  </div>
                </div>
              )
            })
          }
        </div>
      )}

      {tab === 'all-docs' && (
        <div>
          <div className="admin-search-bar">
            <input
              type="text"
              placeholder="Caută medic…"
              value={docSearch}
              onChange={e => setDocSearch(e.target.value)}
            />
          </div>
          {filteredAllDocs.map(d => (
            <div key={d.id} className="admin-card">
              <div className="admin-card-info">
                <div className="admin-card-name">{doctorFullName(d)}</div>
                <div className="admin-card-sub">{(d.specs||[]).join(', ')} • {d.city}{d.clinics?.length ? ' • '+d.clinics.join(', ') : ''}</div>
                <div style={{ marginTop: 4 }}>
                  {d.status === 'approved'
                    ? <span style={{ background:'#EAF5F2',color:'#3D8B7A',fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:12 }}>✓ Aprobat</span>
                    : <span className="pending-badge">⏳ În așteptare</span>
                  }
                </div>
              </div>
              <div className="admin-card-actions">
                <button className="btn-edit" onClick={() => openEdit(d)}>✎ Editează</button>
                {d.status !== 'approved' && <button className="btn-approve" onClick={() => approveDoc(d.id)}>✓ Aprobă</button>}
                <button className="btn-reject" onClick={() => removeDoc(d.id)}>✕ Elimină</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editDoc && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setEditDoc(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Editează medic</div>
              <button className="modal-close" onClick={() => setEditDoc(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prenume</label>
                  <input className="form-input" value={editDoc.first_name} onChange={e => setEditDoc(d => ({ ...d, first_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nume</label>
                  <input className="form-input" value={editDoc.last_name || ''} onChange={e => setEditDoc(d => ({ ...d, last_name: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Specialități</label>
                <div className="edit-specs-list">
                  {editSpecs.map(s => (
                    <span key={s} className="edit-spec-tag">
                      {s}
                      <button onClick={() => setEditSpecs(sp => sp.filter(x => x !== s))}>×</button>
                    </span>
                  ))}
                </div>
                <select className="form-select" onChange={e => { if (e.target.value && !editSpecs.includes(e.target.value)) setEditSpecs(s => [...s, e.target.value]); e.target.value = '' }}>
                  <option value="">+ Adaugă specialitate…</option>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Localitate</label>
                <input className="form-input" value={editDoc.city} onChange={e => setEditDoc(d => ({ ...d, city: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Clinici</label>
                <div className="clinics-editor">
                  {editClinics.map((c, i) => (
                    <div key={i} className="clinic-row">
                      <input className="form-input" value={c} onChange={e => setEditClinics(cl => cl.map((x, j) => j === i ? e.target.value : x))} />
                      {i > 0 && <button className="btn-remove-clinic" onClick={() => setEditClinics(cl => cl.filter((_, j) => j !== i))}>×</button>}
                    </div>
                  ))}
                </div>
                <button className="btn-add-clinic" onClick={() => setEditClinics(c => [...c, ''])} style={{ marginTop: 8 }}>+ Adaugă clinică</button>
              </div>
              <div className="form-group">
                <label className="form-label">Observații</label>
                <input className="form-input" value={editDoc.obs || ''} onChange={e => setEditDoc(d => ({ ...d, obs: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Notă</label>
                <textarea className="form-textarea" value={editDoc.note || ''} onChange={e => setEditDoc(d => ({ ...d, note: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Poză (URL)</label>
                <input className="form-input" placeholder="https://..." value={editDoc.photo_url || ''} onChange={e => setEditDoc(d => ({ ...d, photo_url: e.target.value }))} />
                {editDoc.photo_url && (
                  <img src={editDoc.photo_url} alt="preview" style={{ marginTop: 8, width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '2px solid var(--border)' }} />
                )}
              </div>
              <button className="submit-btn" onClick={saveEdit}>Salvează modificările</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, label }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <div className="empty-label">{label}</div>
    </div>
  )
}
