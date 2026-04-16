const SPEC_EMOJI_MAP = {
  'cardiologie':       '❤️',
  'chirurgie':         '✂️',
  'neurochirurgie':    '🧠',
  'dermatologie':      '🫧',
  'diabetologie':      '🩸',
  'ecografie':         '🔊',
  'endocrinologie':    '🦋',
  'gastroenterologie': '💊',
  'obstetrică':        '🤰',
  'hematologie':       '🩸',
  'imagistică':        '🩻',
  'radiologie':        '🩻',
  'medicină de familie':'🏠',
  'medicină internă':  '🩺',
  'nutriție':          '🥗',
  'nefrologie':        '🫘',
  'neonatologie':      '🍼',
  'neurologie':        '🧠',
  'oftalmologie':      '👁️',
  'oncologie':         '🎗️',
  'orl':               '👂',
  'ortopedie':         '🦴',
  'pediatrie':         '👶',
  'pneumologie':       '🫁',
  'psihiatrie':        '🧩',
  'psihologie':        '💭',
  'recuperare':        '💪',
  'reumatologie':      '🔴',
  'infertilitate':     '🌱',
  'stomatologie':      '🦷',
  'urologie':          '💧',
  'alergologie':       '🌸',
  'anestezie':         '💉',
  'altele':            '🔹',
}

export function specEmoji(spec) {
  const lower = (spec || '').toLowerCase()
  for (const [key, emoji] of Object.entries(SPEC_EMOJI_MAP)) {
    if (lower.includes(key)) return emoji
  }
  return '🔹'
}

export const AVATAR_COLORS = [
  '#3D8B7A','#C07B2A','#5B73C4','#C44B4B',
  '#7B5BC4','#2A9D8F','#B05A9A','#5A8A3A','#8A5A3A'
]

// ── Restaurante / Locuri ──────────────────────────

const TIP_EMOJI_MAP = {
  'restaurant':  '🍽️',
  'cafenea':     '☕',
  'patiserie':   '🥐',
  'cofetarie':   '🍰',
  'fast-food':   '🍔',
  'pizzerie':    '🍕',
  'sushi':       '🍣',
  'shaorma':     '🌯',
  'bar-terasa':  '🍹',
  'altele':      '🍴',
}

export function tipEmoji(tip) {
  return TIP_EMOJI_MAP[(tip || '').toLowerCase()] || '🍴'
}

export const TIPURI_RESTAURANT = [
  'Restaurant', 'Cafenea', 'Patiserie', 'Cofetărie',
  'Fast-food', 'Pizzerie', 'Sushi', 'Shaorma',
  'Bar / Terasă', 'Altele',
]

export const TIP_VALUE_MAP = {
  'Restaurant': 'restaurant',
  'Cafenea': 'cafenea',
  'Patiserie': 'patiserie',
  'Cofetărie': 'cofetarie',
  'Fast-food': 'fast-food',
  'Pizzerie': 'pizzerie',
  'Sushi': 'sushi',
  'Shaorma': 'shaorma',
  'Bar / Terasă': 'bar-terasa',
  'Altele': 'altele',
}

export const TIP_LABEL_MAP = Object.fromEntries(
  Object.entries(TIP_VALUE_MAP).map(([label, value]) => [value, label])
)

export const BUCATARII = [
  'Românească', 'Italiană', 'Asiatică', 'Chinezească',
  'Japoneză', 'Indiană', 'Mexicană', 'Grecească',
  'Turcă', 'Libaneză', 'Americană', 'Internațională',
]

export const TIPURI_CU_BUCATARIE = new Set([
  'restaurant', 'pizzerie', 'sushi', 'altele'
])

// ── Medici ────────────────────────────────────────

export const SPECIALTIES = [
  'Alergologie adulți','Alergologie pediatrică',
  'Altele',
  'Anestezie',
  'Cardiologie adulți','Cardiologie pediatrică',
  'Chirurgie generală adulți','Chirurgie pediatrică',
  'Dermatologie adulți','Dermatologie pediatrică',
  'Diabetologie',
  'Ecografie generală','Ecografie mamară','Ecografie pediatrică',
  'Endocrinologie adulți','Endocrinologie pediatrică',
  'Gastroenterologie adulți','Gastroenterologie pediatrică',
  'Hematologie adulți','Hematologie pediatrică',
  'Imagistică / radiologie','Imagistică pediatrică',
  'Infertilitate / Embriologie',
  'Medicină de familie','Medicină internă',
  'Nefrologie adulți','Nefrologie pediatrică',
  'Neonatologie',
  'Neurochirurgie',
  'Neurologie adulți','Neurologie pediatrică',
  'Nutriție / dietetică',
  'Obstetrică-ginecologie','Obstetrică-ginecologie pediatrică / adolescenți',
  'Oftalmologie adulți','Oftalmologie pediatrică',
  'Oncologie adulți','Oncologie pediatrică',
  'ORL adulți','ORL pediatric',
  'Ortopedie adulți','Ortopedie pediatrică',
  'Pediatrie',
  'Pneumologie adulți','Pneumologie pediatrică',
  'Psihiatrie adulți','Psihiatrie pediatrică',
  'Psihologie adulți','Psihologie copii / adolescenți',
  'Recuperare medicală',
  'Reumatologie adulți','Reumatologie pediatrică',
  'Stomatologie adulți','Stomatologie pediatrică',
  'Urologie adulți','Urologie pediatrică',
]
