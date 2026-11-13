// Compatibilitate între două zodii, după distanța dintre ele pe roata zodiacului
// și după tipul relației (mamă–copil sau cuplu). Texte fixe, valabile în fiecare lună.
import { SIGNS, SIGN_BY_SLUG, ELEMENTS } from './horoscop'

const ASPECTS = {
  0: { name: 'Aceeași zodie', score: 4,
    partener: 'Vă înțelegeți din priviri, pentru că aveți aceleași nevoi și același ritm. Capcana e că vă amplificați și defectele, așa că e bine ca unul să tragă de frână când celălalt accelerează.',
    copil: 'Copilul tău e oglinda ta: îl înțelegi intuitiv, dar te vezi și pe tine în reacțiile lui. Răbdarea cu el e, de fapt, răbdare cu tine.' },
  1: { name: 'Vecini pe roată', score: 2,
    partener: 'Sunteți foarte diferiți, deși stați unul lângă altul pe roata zodiacului. Fiecare are ce învăța de la celălalt, dacă renunțați la ideea că felul vostru e singurul corect.',
    copil: 'Vă mișcați în ritmuri diferite: ce pentru tine e evident, pentru el e nou. Explică-i „de ce”, iar el îți va arăta lucrurile dintr-un unghi neașteptat.' },
  2: { name: 'Prieteni buni', score: 4,
    partener: 'O relație ușoară, prietenoasă, cu multă conversație și haz. Funcționați excelent ca echipă, mai ales când aveți un proiect comun.',
    copil: 'Comunicați ușor și vă distrați împreună. Folosește jocul ca să-i transmiți lucrurile importante, pentru că așa ascultă cel mai bine.' },
  3: { name: 'Provocare care vă crește', score: 2,
    partener: 'Scântei, dar și fricțiuni: aveți priorități diferite și amândoi vreți să aveți dreptate. Când vă respectați stilurile, deveniți o echipă foarte puternică.',
    copil: 'Copilul îți testează limitele exact acolo unde ești mai sensibilă. Rămâi calmă și consecventă: conflictele de acum construiesc încrederea de mai târziu.' },
  4: { name: 'Armonie naturală', score: 5,
    partener: 'Cea mai fluidă combinație: aceleași valori de bază, același element, aceeași „limbă”. Aveți grijă doar să nu vă luați unul pe altul ca pe ceva de la sine înțeles.',
    copil: 'Vă potriviți natural, iar copilul se simte înțeles fără multe cuvinte. E relația în care poți fi blândă fără să-ți pierzi autoritatea.' },
  5: { name: 'Ajustări fine', score: 2,
    partener: 'Nu vă înțelegeți mereu din prima, pentru că aveți nevoi diferite care cer mici compromisuri zilnice. Cu umor și flexibilitate, relația devine surprinzător de bogată.',
    copil: 'Uneori nu ghicești ce are nevoie, și e normal. Întreabă-l direct și adaptează-te pas cu pas, iar copilul va simți efortul tău.' },
  6: { name: 'Opuși care se atrag', score: 3,
    partener: 'Fiecare are ce îi lipsește celuilalt, de aici atracția puternică. Tensiunile apar când trageți în direcții opuse, iar echilibrul vine din a vă lăsa spațiu.',
    copil: 'Copilul are temperamentul opus ție și te scoate din zona de confort. Acceptă-i felul de a fi: te învață exact ce aveai nevoie să înveți.' },
}

export function compat(aSlug, bSlug, relation = 'partener') {
  const a = SIGNS.indexOf(SIGN_BY_SLUG[aSlug]), b = SIGNS.indexOf(SIGN_BY_SLUG[bSlug])
  if (a < 0 || b < 0) return null
  let dist = Math.abs(a - b); if (dist > 6) dist = 12 - dist
  const asp = ASPECTS[dist]
  const ea = ELEMENTS[SIGNS[a].element].name, eb = ELEMENTS[SIGNS[b].element].name
  return {
    name: asp.name,
    score: asp.score,
    text: relation === 'copil' ? asp.copil : asp.partener,
    elements: ea === eb ? `Amândoi sunteți semne de ${ea.toLowerCase()}.` : `Semn de ${ea.toLowerCase()} cu semn de ${eb.toLowerCase()}.`,
  }
}
