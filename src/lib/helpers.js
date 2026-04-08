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

const STATE_HOSPITALS = new Set([
  'Spitalul Clinic de Urgență „Prof. Dr. Agrippa Ionescu"',
  'Spitalul Clinic de Urgenta "Bagdasar-Arseni"',
  'Spitalul Clinic de Urgențe Oftalmologice București',
  'Spitalul Clinic Colentina',
  'Spitalul Universitar de Urgență Elias',
  'Spitalul Clinic de Obstetrica si Ginecologie Filantropia',
  'Institutul Clinic Fundeni',
  'Spitalul Clinic de Obstetrică-Ginecologie „Prof. Dr. Panait Sârbu" (Maternitatea Giulești)',
  'Spitalul Clinic de Urgență pentru Copii Grigore Alexandrescu',
  'Spitalul Clinic Malaxa',
  'Spitalul Clinic de Urgență pentru Copii „Maria Skłodowska Curie"',
  'Institutul de Pneumoftiziologie Marius Nasta',
  'Spitalul Universitar de Urgenţă Militar Central "Dr. Carol Davila"',
  'Spitalul Municipal Câmpina',
  'Spitalul Nord',
  'Spitalul Clinic de Psihiatrie "Prof. Dr. Alexandru Obregia"',
  'Spitalul Clinic Polizu (Maternitatea Polizu)',
  'Spitalul Clinic Prof. Dr. Th. Burghele',
  'Spitalul Sf. Constantin Brașov',
  'Spitalul Universitar de Urgență București',
  'Spitalului Clinic de Copii "Dr. Victor Gomoiu"',
  'Spitalul Clinic de Urgență pentru Copii Brașov',
  'Institutul Național pentru Sănătatea Mamei și Copilului "Alessandrescu-Rusescu" București',
  'Institutul Național de Endocrinologie C. I. Parhon',
])

const PRIORITY_PRIVATE = ['Regina Maria', 'Medicover', 'MedLife', 'Sanador']

function clinicOrder(name) {
  if (STATE_HOSPITALS.has(name)) return 0
  const i = PRIORITY_PRIVATE.indexOf(name)
  return i !== -1 ? i + 1 : PRIORITY_PRIVATE.length + 1
}

export function sortClinics(clinics) {
  return [...(clinics || [])].sort((a, b) => clinicOrder(a) - clinicOrder(b))
}
