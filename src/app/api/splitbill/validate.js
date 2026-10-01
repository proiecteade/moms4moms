export const TABLE = 'splitbill_outings'

const MAX_DATA_LENGTH = 200_000
const MAX_POZA_LENGTH = 2_000_000
const MAX_OPS = 200

export function validId(id) {
  return typeof id === 'string' && /^[a-z0-9]{6,32}$/.test(id)
}

export function validData(data) {
  return data && typeof data === 'object' && !Array.isArray(data)
    && JSON.stringify(data).length <= MAX_DATA_LENGTH
}

export function validPoza(poza) {
  return poza === null
    || (typeof poza === 'string' && poza.startsWith('data:image/') && poza.length <= MAX_POZA_LENGTH)
}

const str = (v, max = 120) => typeof v === 'string' && v.length <= max
const num = v => v === null || (typeof v === 'number' && Number.isFinite(v))
const SET_KEYS = ['name', 'date', 'platitor', 'totalBon']
const ITEM_KEYS = ['produs', 'qty', 'pret', 'tip', 'autoSplit']

function cleanItem(v, requireId) {
  if (!v || typeof v !== 'object') return null
  const out = {}
  if (requireId) {
    if (!str(v.id, 40)) return null
    out.id = v.id
  }
  for (const k of ITEM_KEYS) {
    if (!(k in v)) continue
    if (k === 'produs' && !str(v[k])) return null
    if ((k === 'qty' || k === 'pret') && !num(v[k])) return null
    if ((k === 'tip' || k === 'autoSplit') && typeof v[k] !== 'boolean') return null
    out[k] = v[k]
  }
  return out
}

// Validează o listă de operații trimise de pagină; întoarce null dacă ceva nu e în regulă
export function cleanOps(ops) {
  if (!Array.isArray(ops) || !ops.length || ops.length > MAX_OPS) return null
  const out = []
  for (const op of ops) {
    if (!op || typeof op !== 'object') return null
    switch (op.t) {
      case 'set':
        if (!SET_KEYS.includes(op.k)) return null
        if (op.k === 'totalBon' ? !num(op.v) : !str(op.v)) return null
        out.push({ t: 'set', k: op.k, v: op.v })
        break
      case 'addPerson':
      case 'rmPerson':
        if (!str(op.v, 60) || !op.v.trim()) return null
        out.push({ t: op.t, v: op.v })
        break
      case 'addItem': {
        const v = cleanItem(op.v, true)
        if (!v) return null
        out.push({ t: 'addItem', v })
        break
      }
      case 'updItem': {
        const v = cleanItem(op.v, false)
        if (!str(op.id, 40) || !v) return null
        out.push({ t: 'updItem', id: op.id, v })
        break
      }
      case 'delItem':
        if (!str(op.id, 40)) return null
        out.push({ t: 'delItem', id: op.id })
        break
      case 'alloc':
        if (!str(op.item, 40) || !str(op.p, 60) || !num(op.v)) return null
        out.push({ t: 'alloc', item: op.item, p: op.p, v: op.v })
        break
      case 'allocAll': {
        if (!str(op.item, 40) || !op.v || typeof op.v !== 'object') return null
        const v = {}
        for (const [p, q] of Object.entries(op.v)) {
          if (!str(p, 60) || !num(q)) return null
          v[p] = q
        }
        out.push({ t: 'allocAll', item: op.item, v })
        break
      }
      case 'transfer':
        if (!str(op.p, 60) || !num(op.v)) return null
        out.push({ t: 'transfer', p: op.p, v: op.v })
        break
      default:
        return null
    }
  }
  return out
}

// Aceeași logică rulează și în pagină (public/splitbill/index.html → applyOp)
export function applyOp(d, op) {
  switch (op.t) {
    case 'set':
      d[op.k] = op.v
      break
    case 'addPerson':
      d.persoane = d.persoane || []
      if (!d.persoane.some(p => p.toLowerCase() === op.v.toLowerCase())) d.persoane.push(op.v)
      break
    case 'rmPerson':
      d.persoane = (d.persoane || []).filter(p => p !== op.v)
      break
    case 'addItem':
      d.items = d.items || []
      if (!d.items.some(i => i.id === op.v.id)) d.items.push(op.v)
      break
    case 'updItem': {
      const it = (d.items || []).find(i => i.id === op.id)
      if (it) Object.assign(it, op.v)
      break
    }
    case 'delItem':
      d.items = (d.items || []).filter(i => i.id !== op.id)
      if (d.alloc) delete d.alloc[op.id]
      break
    case 'alloc': {
      d.alloc = d.alloc || {}
      const m = (d.alloc[op.item] = d.alloc[op.item] || {})
      if (op.v) m[op.p] = op.v
      else delete m[op.p]
      break
    }
    case 'allocAll':
      d.alloc = d.alloc || {}
      d.alloc[op.item] = { ...op.v }
      break
    case 'transfer':
      d.transfers = d.transfers || {}
      d.transfers[op.p] = op.v
      break
  }
}
