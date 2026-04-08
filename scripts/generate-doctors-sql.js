// Generates an upsert SQL to run in the Supabase SQL editor
const doctors = [
  { id: 'hem1', name: 'Roxana Uncheșelu', city: 'București', specs: ['Hematologie adulți'], clinics: ['Regina Maria'] },
  { id: 'o5', name: 'Cătălin Udroiu', city: 'București', specs: ['ORL pediatric'], clinics: ['Regina Maria', 'Spitalul Marie Curie'] },
  { id: 'o4', name: 'Andrei Borangiu', city: 'București', specs: ['ORL pediatric'], clinics: ['MedLife', 'Spitalul Marie Curie', 'Medicum'] },
  { id: 'g17', name: 'Al Akkad Mohamad', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria', 'MedLife'] },
  { id: 'hem2', name: 'Mihaela Andreescu', city: 'București', specs: ['Hematologie adulți'], clinics: ['Clinica Smart', 'Spitalul Colentina'] },
  { id: 'g18', name: 'Adriana Andrei', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Sanador', 'Oestrogene Clinique'] },
  { id: 'ch2', name: 'Mircea Andriescu', city: 'București', specs: ['Chirurgie pediatrică'], clinics: ['Spitalul Grigore Alexandrescu', 'MedLife', 'KidMed'] },
  { id: 'o8', name: 'Ana Maria Apostol', city: 'București', specs: ['ORL pediatric'], clinics: ['MedLife'] },
  { id: 'c3', name: 'Iulia Bădulescu', city: 'București', specs: ['Cardiologie adulți'], clinics: ['MedIF Otopeni', 'Affidea'], obs: 'Acceptă bilet de trimitere' },
  { id: 'o2', name: 'Andreea Bajan', city: 'București', specs: ['ORL pediatric', 'ORL adulți'], clinics: ['Regina Maria'] },
  { id: 'p17', name: 'Iuliana-Mădălina Baluță', city: 'București', specs: ['Pediatrie'], clinics: ['Sanador'] },
  { id: 'of6', name: 'Irina Barca', city: 'București', specs: ['Oftalmologie adulți'], clinics: ['Regina Maria'] },
  { id: 'c2', name: 'Ioana Bejan', city: 'București', specs: ['Cardiologie pediatrică'], clinics: ['Spitalul Grigore Alexandrescu', 'Regina Maria'] },
  { id: 'al6', name: 'Camelia Elena Berghea', city: 'București', specs: ['Alergologie adulți'], clinics: ['Wellborn', 'Spitalul Marie Curie'] },
  { id: 'e7', name: 'Cristina Blaga', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Regina Maria', 'Enayati'] },
  { id: 'g15', name: 'Roxana Bohîlțea', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['MedLife', 'Sanador', 'Femme Boutique Medical', 'Spitalul Filantropia'] },
  { id: 'p8', name: 'Cristina Burlac', city: 'București', specs: ['Pediatrie'], clinics: ['MedLife'] },
  { id: 'e3', name: 'Alina Burlacu', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Regina Maria', 'Romgermed'] },
  { id: 'of4', name: 'Adrian Burloiu', city: 'București', specs: ['Oftalmologie adulți'], clinics: ['Cabinet personal', 'Spitalul Malaxa'] },
  { id: 'o9', name: 'Andrei Mihai Buruiană', city: 'București', specs: ['ORL pediatric'], clinics: ['Sanador', 'Spitalul Marie Curie'] },
  { id: 'g6', name: 'Silviu Butuc', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria'] },
  { id: 'pn3', name: 'Lavinia Butum', city: 'București', specs: ['Pneumologie pediatrică'], clinics: ['Sanador', 'MedLife', 'Konkret Medical'] },
  { id: 'ort8', name: 'Călin Calancea', city: 'Brașov', specs: ['Ortopedie pediatrică', 'Chirurgie pediatrică'], clinics: ['Calmedo', 'Spitalul clinic de urgență pentru copii Brașov'] },
  { id: 'c7', name: 'Iuliana-Cristina Câlmâc', city: 'București', specs: ['Cardiologie pediatrică'], clinics: ['Medicover', 'Yuno Clinic'] },
  { id: 'st2', name: 'Cristina Capetti', city: 'București', specs: ['Stomatologie pediatrică', 'Stomatologie adulți'], clinics: ['EDA DENT', 'Dent Park'], obs: 'Cristina este și parte din comunitatea Moms4Moms' },
  { id: 'al2', name: 'Lucia Cărbune', city: 'București', specs: ['Alergologie pediatrică'], clinics: ['Cabinet personal', 'Regina Maria', 'Bio Terra Med'], obs: 'Acceptă bilet de trimitere' },
  { id: 'c1', name: 'Alexandru Cîrjan', city: 'București', specs: ['Cardiologie adulți'], clinics: ['CardioRec'] },
  { id: 'ec3', name: 'Maria Mirabela Cașcaval', city: 'București', specs: ['Cardiologie pediatrică'], clinics: ['Regina Maria', 'MedLife'] },
  { id: 'ur1', name: 'Narcis Chircă', city: 'București', specs: ['Urologie adulți'], clinics: ['Regina Maria', 'Spitalul Prof. Dr. Th. Burghele'] },
  { id: 'p9', name: 'Raluca Ciauș', city: 'București', specs: ['Pediatrie'], clinics: ['MedLife'] },
  { id: 'ch3', name: 'Jean Ciurea', city: 'București', specs: ['Neurochirurgie adulți'], clinics: ['Sanador', 'Global Medical Health', 'Spitalul Bagdasar-Arseni'] },
  { id: 'ort7', name: 'Radu Ciuvică', city: 'București', specs: ['Ortopedie adulți'], clinics: ['Regina Maria', 'Spitalul Nord', 'Spitalul Bagdasar-Arseni', 'Kinetic'] },
  { id: 'inf1', name: 'Diana Cocei', city: 'București', specs: ['Infertilitate / Embriologie'], clinics: ['Regina Maria'], obs: 'Embriolog' },
  { id: 'ch5', name: 'Ionuț Coman', city: 'București', specs: ['Chirurgie generală adulți'], clinics: ['Spitalul Bagdasar-Arseni'] },
  { id: 'ch4', name: 'Violeta Coman', city: 'București', specs: ['Chirurgie generală adulți'], clinics: ['Spitalul Bagdasar-Arseni'] },
  { id: 'g11', name: 'Diana Comandașu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Spitalul Giulești', 'Elginmed'] },
  { id: 'g21', name: 'Ion Constantinescu', city: 'Câmpina', specs: ['Obstetrică-ginecologie'], clinics: ['Clinica Miludi', 'Sanconfind'] },
  { id: 'ort4', name: 'Valentina Contanu', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['Cron Phoenix'] },
  { id: 'ort6', name: 'Mihai-Alexandru Cordunianu', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['Regina Maria', 'MedLife', 'Sanador'] },
  { id: 'gas1', name: 'Alexandra Coroleucă', city: 'București', specs: ['Gastroenterologie pediatrică'], clinics: ['Spitalul Grigore Alexandrescu', 'KidMED', 'Rosana Medical'] },
  { id: 'c6', name: 'Iulian Cosei', city: 'București', specs: ['Cardiologie adulți'], clinics: ['Regina Maria'] },
  { id: 'p13', name: 'Irina Costache', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria', 'Cabinet personal'] },
  { id: 'nf1', name: 'Claudiu George Costea', city: 'București', specs: ['Nefrologie pediatrică'], clinics: ['Spitalul Fundeni', 'KidMED', 'Nefroped', 'Sanador'] },
  { id: 'of2', name: 'Roxana Cozubaș', city: 'București', specs: ['Oftalmologie pediatrică'], clinics: ['Ocuvista'] },
  { id: 'ort5', name: 'Raluca-Daniela Damean', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['Regina Maria', 'Adeomed'] },
  { id: 'nr3', name: 'Gabriela Damian-Burueană', city: 'București', specs: ['Neurologie pediatrică'], clinics: ['Spitalul Universitar'] },
  { id: 'derm4', name: 'Monica Dărmănescu', city: 'București', specs: ['Dermatologie adulți'], clinics: ['Dermaceutica', 'Mikomed22'] },
  { id: 'g13', name: 'Alina Dascălu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Oestrogene Clinique'] },
  { id: 'derm3', name: 'Adriana Diaconeasa', city: 'București', specs: ['Dermatologie pediatrică'], clinics: ['Spitalul Grigore Alexandrescu', 'Wellborn', 'Bioderm'] },
  { id: 'g14', name: 'Alina Diaconu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria', 'Spitalul Memorial', 'Sanador'] },
  { id: 'p16', name: 'Carmen Liliana Dincă', city: 'București', specs: ['Pediatrie'], clinics: ['Sanador'] },
  { id: 'derm2', name: 'Veronica Dinu', city: 'București', specs: ['Dermatologie adulți', 'Dermatologie pediatrică'], clinics: ['Dermalexia'] },
  { id: 'of3', name: 'Mihaela Sorina Dragomir', city: 'București', specs: ['Oftalmologie pediatrică'], clinics: ['Arena Med', 'Spitalul Victor Gomoiu'] },
  { id: 'p3', name: 'Maria-Alexandra Dragomirescu', city: 'București', specs: ['Pediatrie'], clinics: ['Medicover'] },
  { id: 'ec6', name: 'Gabriela Duică', city: 'București', specs: ['Cardiologie pediatrică'], clinics: ['Sanador', 'Medicum', 'Spitalul Marie Curie'], obs: 'Competență în ecocardiografie generală' },
  { id: 'g10', name: 'Laura Dumitrași', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Spitalul Filantropia', 'Donna Medical Center', 'Elithia'] },
  { id: 'g4', name: 'Roxana-Elena Dumitru', city: 'București, Câmpina', specs: ['Obstetrică-ginecologie'], clinics: ['Sanador', 'Rosana Medical', 'Sanconfind'] },
  { id: 'e2', name: 'Krystyna Dyachenko', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Regina Maria', 'Sanamed'], obs: 'Merge cu bilet de trimitere la Sanamed' },
  { id: 'g5', name: 'Sawas Shadi El', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria', 'Sanador', 'Cabinet personal'] },
  { id: 'p2', name: 'Monica Fildan', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria'] },
  { id: 'rec1', name: 'Daniela Găman', city: 'București', specs: ['Recuperare medicală'], clinics: ['Regina Maria', 'Spitalul Monza', 'Clinica Recover'] },
  { id: 'o1', name: 'Gabriel Ganea', city: 'București', specs: ['ORL adulți'], clinics: ['Regina Maria', 'Spitalul Militar'] },
  { id: 'e5', name: 'Grigore-Vadim Găvan', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Medicover', 'Sanador'], obs: 'Merge cu bilet de trimitere' },
  { id: 'ec7', name: 'Elisabeta-Cezarina Georgescu', city: 'București', specs: ['Ecografie generală'], clinics: ['Regina Maria', 'Medicover'] },
  { id: 'g12', name: 'Corina-Gabriela Georgescu-Bortea', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria', 'Medicover', 'Ladies Excellence Clinic'] },
  { id: 'derm1', name: 'Georgiana Gheba', city: 'București', specs: ['Dermatologie adulți', 'Dermatologie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'g2', name: 'Adriana Ghelmene', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria'] },
  { id: 'nr1', name: 'Ana Gheorghiu', city: 'București', specs: ['Neurologie adulți'], clinics: ['Spitalul Monza'] },
  { id: 'ch1', name: 'Carmen-Loredana Gorgan', city: 'București', specs: ['Chirurgie generală adulți', 'Ecografie generală'], clinics: ['Regina Maria'] },
  { id: 'p11', name: 'Veronica Grosoșiu', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria'] },
  { id: 'p19', name: 'Eugenia-Mariana Grumezescu', city: 'Câmpina', specs: ['Pediatrie'], clinics: ['Sanconfind'] },
  { id: 'e1', name: 'Anca Hoisescu', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['MedLife', 'Enayati Medical City'] },
  { id: 'c4', name: 'Silvia Iancovici', city: 'București', specs: ['Cardiologie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'p10', name: 'Oana Iaru', city: 'București', specs: ['Pediatrie'], clinics: ['Medicum'] },
  { id: 'ec5', name: 'Ana Iulia Iavorschi', city: 'București', specs: ['Ecografie generală'], clinics: ['Regina Maria'], obs: 'Ecografie mamară' },
  { id: 'g8', name: 'Radu-Ioan Dragomir', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Medicover', 'Sanador'] },
  { id: 'ec1', name: 'Madalina Ion', city: 'București', specs: ['Ecografie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'of1', name: 'Sanda Ionescu', city: 'București', specs: ['Oftalmologie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'g7', name: 'Silviu-Petrișor Iștoc', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Medicover', 'Femme Boutique Medical'] },
  { id: 'p7', name: 'Victoria Istrate', city: 'București', specs: ['Pediatrie'], clinics: ['MedLife'] },
  { id: 'al7', name: 'Florina Corina Jurca', city: 'București', specs: ['Alergologie adulți'], clinics: ['Regina Maria'] },
  { id: 'o6', name: 'Andrei Luca', city: 'București', specs: ['ORL pediatric'], clinics: ['Regina Maria'] },
  { id: 'p18', name: 'Ciprian Lupușor', city: 'Câmpina', specs: ['Pediatrie'], clinics: ['Spitalul Municipal Câmpina'] },
  { id: 'derm5', name: 'Arina Mărgina', city: 'București', specs: ['Dermatologie adulți'], clinics: ['Regina Maria'] },
  { id: 'p4', name: 'Nicoleta Roxana Maxim', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria'] },
  { id: 'derm6', name: 'Raluca Miulescu', city: 'Brașov, București', specs: ['Dermatologie pediatrică'], clinics: ['Spitalul Sf. Constantin Brașov', 'Adeomed'] },
  { id: 'diab1', name: 'Iustina Cosmina Mogoș', city: 'București', specs: ['Diabetologie', 'Endocrinologie'], clinics: ['Medsana', 'Spitalul Agrippa Ionescu'] },
  { id: 'gas2', name: 'Crenguța Cristina Momîrlă', city: 'București', specs: ['Gastroenterologie pediatrică'], clinics: ['Medicover'] },
  { id: 'al1', name: 'Cezara Motei', city: 'București', specs: ['Alergologie adulți', 'Alergologie pediatrică'], clinics: ['Memormed', 'MedLife'], obs: 'Vede și copii peste 2 ani, Merge cu bilet de trimitere' },
  { id: 'e8', name: 'Mădălina Mușat', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Memorial', 'Sanador', 'Institutul Parhon', 'Enayati Medical City', 'Oestrogene Clinique'] },
  { id: 'nr2', name: 'Mihai Mușetescu', city: 'București', specs: ['Neurologie pediatrică'], clinics: ['Epi TSA', 'Spitalul Obregia', 'Regina Maria', 'Clinica Neuro Atipic'] },
  { id: 'ort2', name: 'Cătălin Nahoi', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['Regina Maria', 'Medicover', 'KidMED', 'Adeomed', 'Spitalul Grigore Alexandrescu', 'Rosana Medical'] },
  { id: 'al5', name: 'Adina Magdalena Neagu', city: 'București', specs: ['Alergologie adulți'], clinics: ['Regina Maria', 'Clinică personală'] },
  { id: 'ec2', name: 'Dana Nedelcu', city: 'București', specs: ['Ecografie generală'], clinics: ['Sanador', 'Regina Maria'], obs: 'Ecografie mamară' },
  { id: 'pn5', name: 'Roxana Nemeș', city: 'București', specs: ['Pneumologie adulți'], clinics: ['Sanador', 'Spitalul Marius Nasta'] },
  { id: 'al3', name: 'Claudia Adriana Nicolae', city: 'București', specs: ['Alergologie adulți'], clinics: ['Medicum'] },
  { id: 'al8', name: 'Sandra Viviana Olariu', city: 'București', specs: ['Alergologie adulți', 'Alergologie pediatrică'], clinics: ['Clinica de Alăptare', 'Sanador', 'Pediatree'], obs: 'Vede adulți și copii' },
  { id: 'g16', name: 'Andrei Mihai Oncescu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Femme Boutique Medical', 'Spitalul Polizu'] },
  { id: 'ort3', name: 'Violeta Oriță', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['Rosana Medical'], obs: 'Merge cu bilet de trimitere, Face și ecografie de șold' },
  { id: 'pn1', name: 'Mihaela Oros', city: 'București', specs: ['Pneumologie pediatrică'], clinics: ['Regina Maria'], obs: 'Suprapecializare în somnologie pediatrică' },
  { id: 'nr4', name: 'Bogdan Pană', city: 'București', specs: ['Neurologie adulți'], clinics: ['Centrul Medical Emerald'] },
  { id: 'g1', name: 'Anca Maria Panaitescu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Spitalul Filantropia', 'Regina Maria', 'Sanador', 'Elithia'] },
  { id: 'p12', name: 'Valentina Pavel', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria'], obs: 'Oferă și consult la domiciliu' },
  { id: 'e4', name: 'Oana-Andreea Popa', city: 'București', specs: ['Endocrinologie adulți'], clinics: ['Regina Maria', 'Spitalul Agrippa Ionescu'] },
  { id: 'al4', name: 'Valeria-Bianca Postoroancă', city: 'București', specs: ['Alergologie adulți'], clinics: ['Cabinet personal'], obs: 'Merge cu bilet de trimitere' },
  { id: 'anest1', name: 'Laurențiu Pricop', city: 'București', specs: ['Anestezie'], clinics: ['Regina Maria'] },
  { id: 'ps3', name: 'Gabriela Profir', city: 'București', specs: ['Medicină internă', 'Nutriție / dietetică'], clinics: ['Kilostop'] },
  { id: 'o3', name: 'Claudia-Ortensia Radu', city: 'București', specs: ['ORL adulți'], clinics: ['Medicover'] },
  { id: 'g20', name: 'Natalia Richițeanu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Royal Hospital'] },
  { id: 'ec8', name: 'Mihai Mugur Romașcanu', city: 'București', specs: ['Ecografie pediatrică'], clinics: ['MedLife', 'Sanador'] },
  { id: 'ort1', name: 'Hesham Sabbagh', city: 'București', specs: ['Ortopedie adulți'], clinics: ['Memorial', 'Regina Maria'] },
  { id: 'g19', name: 'Valentina Safta', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Medicover', 'Spitalul Filantropia', 'Femme Boutique Medical', 'Umana Fertility', 'Clinica Bless'] },
  { id: 'c5', name: 'Ana Maria Șerban', city: 'București', specs: ['Cardiologie adulți'], clinics: ['Regina Maria', 'Elginmed'] },
  { id: 'st1', name: 'Mihaela Șerbănoiu', city: 'București', specs: ['Stomatologie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'g3', name: 'Anca Marina Slabu', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Spitalul Filantropia'] },
  { id: 'pn4', name: 'Ruxandra Spătaru', city: 'București', specs: ['Pneumologie pediatrică'], clinics: ['Regina Maria', 'Sanador'] },
  { id: 'of8', name: 'Livia Șram', city: 'București', specs: ['Oftalmologie adulți'], clinics: ['Clinica Retina', 'Spitalul Clinic de Urgențe Oftalmologice București'] },
  { id: 'pn2', name: 'Iustina Violeta Stan', city: 'București', specs: ['Pneumologie pediatrică'], clinics: ['Medicum', 'KidMED', 'Institutul Național pentru Sănătatea Mamei și Copilului "Alessandrescu-Rusescu" București'] },
  { id: 'ps2', name: 'Cristina Stanciu', city: 'București', specs: ['Psihiatrie pediatrică'], clinics: ['Ioana Medical Center', 'Psihicum'] },
  { id: 'ec9', name: 'Alina Elena Stanciu', city: 'București', specs: ['Ecografie pediatrică'], clinics: ['Regina Maria'], obs: 'Face și ecografie de șold' },
  { id: 'ec4', name: 'Diana Stănescu', city: 'București', specs: ['Ecografie generală'], clinics: ['Spitalul Marie Curie', 'Qmed'] },
  { id: 'of7', name: 'Tatiana Stîngu', city: 'București', specs: ['Oftalmologie adulți'], clinics: ['Clinica Optissima', 'Clinica Bine'] },
  { id: 'e6', name: 'Maria-Lavinia Ștefan', city: 'București', specs: ['Endocrinologie pediatrică'], clinics: ['Spitalul Grigore Alexandrescu', 'GRAL Medical'] },
  { id: 'of5', name: 'Diana Stoenescu', city: 'București', specs: ['Oftalmologie adulți', 'Oftalmologie pediatrică'], clinics: ['Regina Maria'] },
  { id: 'nf2', name: 'Cristina Stoica', city: 'București', specs: ['Nefrologie pediatrică'], clinics: ['Regina Maria', 'KidMED', 'Wellborn'] },
  { id: 'g9', name: 'Corina Stoica', city: 'București', specs: ['Obstetrică-ginecologie'], clinics: ['Regina Maria', 'Medic Line'] },
  { id: 'n1', name: 'Adriana Tecuci', city: 'București', specs: ['Neonatologie'], clinics: ['Medicover', 'Spitalul Elias'] },
  { id: 'p15', name: 'Camelia Felicia Toader', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria', 'Medsana'] },
  { id: 'p5', name: 'Carmen Toma', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria'] },
  { id: 'p1', name: 'Ruxandra Tritean', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria', 'Medicover'] },
  { id: 'p6', name: 'Alexandru Ulici', city: 'București', specs: ['Ortopedie pediatrică'], clinics: ['MedLife', 'Rosana Medical', 'Spitalul Grigore Alexandrescu'] },
  { id: 'g22', name: 'Arabela Vâlcea', city: 'București, Câmpina', specs: ['Obstetrică-ginecologie'], clinics: ['Clinica Progresul', 'SanConfind', 'Clinica Miludi'] },
  { id: 'p14', name: 'Oana Vîrban', city: 'București', specs: ['Pediatrie'], clinics: ['Regina Maria', 'Cabinet personal'] },
  { id: 'ps1', name: 'Mihaela Florentina Vișan', city: 'București', specs: ['Psihiatrie pediatrică'], clinics: ['Neuro Atipic'] },
  { id: 'o7', name: 'Alexis Vuzitas', city: 'București', specs: ['ORL pediatric'], clinics: ['Regina Maria', 'Spitalului Clinic de Copii "Dr. Victor Gomoiu"'] },
  { id: 'n2', name: 'Dana Cristiana Zaciu', city: 'București', specs: ['Neonatologie'], clinics: ['Regina Maria'] },
]

const CLINIC_RENAMES = {
  'Clinică personală': 'Cabinet personal',
  'Neuro Atipic': 'Clinica Neuro Atipic',
  'Enayati': 'Enayati Medical City',
  'KidMed': 'KidMED',
  'SanConfind': 'Sanconfind',
  'Mikomed22': 'Miko Med',
  'EDA DENT': 'EDA Dent',
  'Konkret Medical': 'Konkret Medical Center',
  'MedIF Otopeni': 'MedIF',
  'Memorial': 'Spitalul Memorial',
  'Institutul Parhon': 'Institutul Național de Endocrinologie C. I. Parhon',
  'Spitalul Agrippa Ionescu': 'Spitalul Clinic de Urgență „Prof. Dr. Agrippa Ionescu"',
  'Spitalul Bagdasar-Arseni': 'Spitalul Clinic de Urgenta "Bagdasar-Arseni"',
  'Spitalul Colentina': 'Spitalul Clinic Colentina',
  'Spitalul Elias': 'Spitalul Universitar de Urgență Elias',
  'Spitalul Filantropia': 'Spitalul Clinic de Obstetrica si Ginecologie Filantropia',
  'Spitalul Fundeni': 'Institutul Clinic Fundeni',
  'Spitalul Giulești': 'Spitalul Clinic de Obstetrică-Ginecologie „Prof. Dr. Panait Sârbu" (Maternitatea Giulești)',
  'Spitalul Grigore Alexandrescu': 'Spitalul Clinic de Urgență pentru Copii Grigore Alexandrescu',
  'Spitalul Malaxa': 'Spitalul Clinic Malaxa',
  'Spitalul Marie Curie': 'Spitalul Clinic de Urgență pentru Copii „Maria Skłodowska Curie"',
  'Spitalul Marius Nasta': 'Institutul de Pneumoftiziologie Marius Nasta',
  'Spitalul Militar': 'Spitalul Universitar de Urgenţă Militar Central "Dr. Carol Davila"',
  'Spitalul Obregia': 'Spitalul Clinic de Psihiatrie "Prof. Dr. Alexandru Obregia"',
  'Spitalul Polizu': 'Spitalul Clinic Polizu (Maternitatea Polizu)',
  'Spitalul Prof. Dr. Th. Burghele': 'Spitalul Clinic Prof. Dr. Th. Burghele',
  'Spitalul Universitar': 'Spitalul Universitar de Urgență București',
  'Spitalul Victor Gomoiu': 'Spitalului Clinic de Copii "Dr. Victor Gomoiu"',
  'Spitalului Clinic de Copii "Dr. Victor Gomoiu"': 'Spitalului Clinic de Copii "Dr. Victor Gomoiu"',
  'Spitalul clinic de urgență pentru copii Brașov': 'Spitalul Clinic de Urgență pentru Copii Brașov',
  'Institutul Național pentru Sănătatea Mamei și Copilului "Alessandrescu-Rusescu" București': 'Institutul Național pentru Sănătatea Mamei și Copilului "Alessandrescu-Rusescu" București',
}

function normalizeClinic(name) {
  return CLINIC_RENAMES[name] || name
}

function parseName(fullName) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { first_name: parts[0], last_name: '' }
  const last_name = parts[parts.length - 1]
  const first_name = parts.slice(0, -1).join(' ')
  return { first_name, last_name }
}

function esc(str) {
  return (str || '').replace(/'/g, "''")
}

function pgArray(arr) {
  return 'ARRAY[' + arr.map(s => `'${esc(s)}'`).join(', ') + ']'
}

const lines = doctors.map(d => {
  const { first_name, last_name } = parseName(d.name)
  const obs = d.obs || ''
  const clinics = d.clinics.map(normalizeClinic)
  return `('${d.id}', '${esc(first_name)}', '${esc(last_name)}', ${pgArray(d.specs)}, '${esc(d.city)}', ${pgArray(clinics)}, '${esc(obs)}', '', 'approved')`
})

const sql = `-- Moms4Moms — upsert ${doctors.length} doctori
-- Run this in the Supabase SQL editor (bypasses RLS)

INSERT INTO doctors (id, first_name, last_name, specs, city, clinics, obs, note, status)
VALUES
${lines.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  first_name   = EXCLUDED.first_name,
  last_name    = EXCLUDED.last_name,
  specs        = EXCLUDED.specs,
  city         = EXCLUDED.city,
  clinics      = EXCLUDED.clinics,
  obs          = EXCLUDED.obs,
  note         = EXCLUDED.note,
  status       = EXCLUDED.status;
-- recommendations_count is preserved (not overwritten)
`

const fs = require('fs')
fs.writeFileSync(__dirname + '/doctors-upsert.sql', sql)
console.log(`✓ SQL generat: scripts/doctors-upsert.sql (${doctors.length} doctori)`)
