export const TABLE = 'splitbill_outings'

const MAX_DATA_LENGTH = 200_000
const MAX_POZA_LENGTH = 2_000_000

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
