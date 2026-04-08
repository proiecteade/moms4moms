import { AVATAR_COLORS } from './constants'

export function avatarColor(name) {
  let h = 0
  for (let c of (name || '')) h = c.charCodeAt(0) + h * 31
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export function initials(firstName, lastName) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase()
}

export function doctorFullName(doc) {
  return `Dr. ${doc.first_name}${doc.last_name ? ' ' + doc.last_name : ''}`
}

export function avgRating(reviews) {
  if (!reviews?.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function normalize(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
