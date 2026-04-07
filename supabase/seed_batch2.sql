-- Batch 2 — medici noi din thread FB
-- Rulează asta în Supabase SQL Editor
-- Conține: 38 medici noi (INSERT) + 2 actualizări la medici existenți (UPDATE)

-- ─── ACTUALIZĂRI LA MEDICI EXISTENȚI ───────────────────────────────────────

-- Borangiu Andrei: adăugare prenume + clinici suplimentare (MedLife, Marie Curie)
UPDATE doctors SET
  first_name = 'Andrei',
  clinics = ARRAY['MedLife','Spitalul Marie Curie','Budimex','Cabinet privat']
WHERE id = 'o4';

-- Diana Stoenescu: adăugare specialitate oftalmologie pediatrică
UPDATE doctors SET
  specs = ARRAY['Oftalmologie adulți','Oftalmologie pediatrică']
WHERE id = 'of5';

-- ─── MEDICI NOI ────────────────────────────────────────────────────────────

INSERT INTO doctors (id, first_name, last_name, specs, city, clinics, obs, note, status, submitted_at) VALUES

-- Obstetrică-ginecologie
('g13','Alina','Dascălu',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Oestrogene Clinique'],'','','approved',99),
('g14','Alina','Diaconu',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Regina Maria'],'','','approved',100),
('g15','Roxana','Bohîlțea',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['MedLife','Spitalul Filantropia'],'','','approved',101),
('g16','Andrei Mihai','Oncescu',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Femme Boutique Medical','Spitalul Polizu'],'','','approved',102),
('g17','Mohamad','Al Akkad',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Regina Maria'],'','','approved',103),
('g18','Adriana','Andrei',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Sanador'],'','','approved',104),
('g19','Valentina','Safta',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Medicover','Spitalul Filantropia'],'','','approved',105),
('g20','Natalia','Richițeanu',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Royal Hospital'],'','','approved',106),
('g21','Ion','Constantinescu',ARRAY['Obstetrică-ginecologie'],'Câmpina',ARRAY['Clinica Miludi'],'','','approved',107),
('g22','Arabela','Valcea',ARRAY['Obstetrică-ginecologie'],'București',ARRAY['Clinic Progresul'],'','','approved',108),

-- Endocrinologie adulți
('e7','Cristina','Blaga',ARRAY['Endocrinologie adulți'],'București',ARRAY['Regina Maria'],'','','approved',109),
('e8','Mădălina','Mușat',ARRAY['Endocrinologie adulți'],'București',ARRAY['Oestrogene Clinique','Sanador','Institutul Parhon'],'Conf. Dr.','','approved',110),

-- Pediatrie
('p16','Carmen','Dincă',ARRAY['Pediatrie'],'București',ARRAY['Sanador Buzești'],'','','approved',111),
('p17','Iuliana','Baluță',ARRAY['Pediatrie'],'București',ARRAY['Sanador Decebal','Sanador Băneasa'],'','','approved',112),
('p18','Ciprian','Lupușoru',ARRAY['Pediatrie'],'Câmpina',ARRAY['Spitalul Municipal Câmpina'],'','','approved',113),
('p19','Eugenia-Mariana','Grumezescu',ARRAY['Pediatrie'],'Câmpina',ARRAY['SanConfind Câmpina'],'','','approved',114),

-- ORL pediatric
('o9','Andrei','Buruiană',ARRAY['ORL pediatric'],'București',ARRAY['Sanador','Spitalul Marie Curie'],'','','approved',115),

-- Ortopedie
('ort7','Radu','Ciuvică',ARRAY['Ortopedie adulți'],'București',ARRAY['Regina Maria','Spitalul Bagdasar Arseni'],'','','approved',116),
('ort8','Călin','Calancea',ARRAY['Ortopedie pediatrică'],'Brașov',ARRAY['Clinica Calmedo'],'','','approved',117),

-- Dermatologie
('derm3','Adriana','Diaconeasa',ARRAY['Dermatologie pediatrică'],'București',ARRAY['Grigore Alexandrescu','Wellborn Băneasa'],'','','approved',118),
('derm4','Monica','Dărmănescu',ARRAY['Dermatologie adulți'],'București',ARRAY['Clinica Dermaceutica'],'','','approved',119),
('derm5','Arina','Mărgina',ARRAY['Dermatologie adulți'],'București',ARRAY['Regina Maria'],'','','approved',120),
('derm6','Raluca','Miulescu',ARRAY['Dermatologie adulți'],'Brașov',ARRAY['Spitalul Sf Constantin'],'','','approved',121),

-- Neurologie
('nr4','Bogdan','Pană',ARRAY['Neurologie adulți'],'București',ARRAY['Centrul Medical Emerald'],'','','approved',122),

-- Alergologie
('al5','Adina','Neagu',ARRAY['Alergologie adulți'],'București',ARRAY['Regina Maria'],'','','approved',123),
('al6','Camelia','Berghea',ARRAY['Alergologie adulți'],'București',ARRAY['Clinica Wellborn'],'','','approved',124),
('al7','Florina','Jurca',ARRAY['Alergologie adulți'],'București',ARRAY['Regina Maria'],'','','approved',125),
('al8','Sandra','Olariu',ARRAY['Alergologie adulți','Alergologie pediatrică'],'București',ARRAY['Clinica de Alăptare','Sanador'],'Vede adulți și copii','','approved',126),

-- Ecografie
('ec5','Ana-Maria','Iavorschi',ARRAY['Ecografie mamară'],'București',ARRAY['Regina Maria'],'','','approved',127),
('ec6','Gabriela','Duică',ARRAY['Ecografie generală'],'București',ARRAY['Sanador Victoriei'],'Ecografie cardiacă','','approved',128),
('ec7','Elisabeta','Georgescu',ARRAY['Ecografie generală'],'București',ARRAY['Regina Maria Pipera'],'Ecografie abdominală','','approved',129),
('ec8','Mihai','Romașcanu',ARRAY['Ecografie pediatrică'],'București',ARRAY['MedLife'],'','','approved',130),
('ec9','Alina','Stanciu',ARRAY['Ecografie pediatrică'],'București',ARRAY['Regina Maria'],'Ecografie pediatrică șold','','approved',131),

-- Nefrologie pediatrică
('nf2','Cristina','Stoica',ARRAY['Nefrologie pediatrică'],'București',ARRAY['Regina Maria','KidMed'],'','','approved',132),

-- Recuperare medicală
('rec1','Daniela','Găman',ARRAY['Recuperare medicală'],'București',ARRAY['Regina Maria'],'','','approved',133),

-- Urologie
('ur1','Narcis','Chircă',ARRAY['Urologie adulți'],'București',ARRAY['Regina Maria Titu Maiorescu'],'','','approved',134),

-- Infertilitate / Embriologie
('inf1','Diana','Cocei',ARRAY['Infertilitate / Embriologie'],'București',ARRAY['Fertility Institute (fosta Columna)'],'Embriolog','','approved',135),

-- Pneumologie adulți
('pn5','Roxana','Nemes',ARRAY['Pneumologie adulți'],'București',ARRAY[]::text[],'','','approved',136);
