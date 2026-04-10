export const metadata = {
  title: 'Termeni și Condiții — Moms4Moms',
  description: 'Termenii și condițiile de utilizare ale platformei Moms4Moms',
}

export default function TermeniPage() {
  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Termeni și Condiții de Utilizare</h1>
      <p style={{ color: 'var(--ink-light)', fontSize: 13, marginBottom: '2rem' }}>Ultima actualizare: aprilie 2026</p>

      <Section title="1. Despre platformă">
        <p>Moms4Moms (<strong>moms4moms.ro</strong>) este o platformă comunitară de recomandări de medici, creată pentru a facilita schimbul de experiențe între părinți. Platforma nu este un serviciu medical și nu oferă sfaturi medicale.</p>
      </Section>

      <Section title="2. Disclaimer medical">
        <p style={{ fontWeight: 600, color: 'var(--rose)' }}>⚠️ Recomandările și comentariile de pe această platformă reprezintă opinii personale ale membrilor comunității și nu constituie sfaturi medicale profesioniste.</p>
        <p style={{ marginTop: 8 }}>Moms4Moms nu este responsabilă pentru deciziile medicale luate pe baza informațiilor găsite pe platformă. Consultați întotdeauna un medic pentru diagnostic și tratament.</p>
      </Section>

      <Section title="3. Conținut generat de utilizatori">
        <p>Prin postarea de recomandări, comentarii sau orice alt conținut pe platformă, utilizatorul:</p>
        <ul>
          <li>Garantează că informațiile sunt corecte și reprezintă propria experiență.</li>
          <li>Acceptă că conținutul poate fi moderat sau eliminat de administratori fără notificare prealabilă dacă încalcă acești termeni.</li>
          <li>Nu va posta conținut fals, defăimător, ofensator sau ilegal.</li>
          <li>Nu va face publicitate sau spam.</li>
        </ul>
      </Section>

      <Section title="4. Moderare">
        <p>Echipa Moms4Moms verifică recomandările și comentariile înainte de publicare. Ne rezervăm dreptul de a refuza sau elimina orice conținut care:</p>
        <ul>
          <li>Conține informații false sau înșelătoare despre medici.</li>
          <li>Este ofensator, discriminatoriu sau harassing.</li>
          <li>Promovează produse, servicii sau alte platforme.</li>
        </ul>
      </Section>

      <Section title="5. Cont de utilizator">
        <p>Autentificarea se face exclusiv prin Google sau Facebook. Ești responsabil pentru activitatea din contul tău. Contul poate fi suspendat în cazul încălcării acestor termeni.</p>
      </Section>

      <Section title="6. Proprietate intelectuală">
        <p>Logo-ul, designul și conținutul editorial al platformei aparțin Moms4Moms. Conținutul postat de utilizatori rămâne proprietatea acestora, cu acordul implicit de a fi afișat public pe platformă.</p>
      </Section>

      <Section title="7. Limitarea răspunderii">
        <p>Moms4Moms nu garantează acuratețea, completitudinea sau actualitatea informațiilor postate de utilizatori. Platforma este oferită „ca atare", fără garanții de disponibilitate continuă.</p>
      </Section>

      <Section title="8. Modificări">
        <p>Ne rezervăm dreptul de a modifica acești termeni oricând. Continuarea utilizării platformei după publicarea modificărilor constituie acceptul noilor termeni.</p>
      </Section>

      <Section title="9. Contact">
        <p>Pentru întrebări: <strong>sabina_cornovac@yahoo.com</strong></p>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: '0.6rem', color: 'var(--ink)' }}>{title}</h2>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-light)' }}>{children}</div>
    </div>
  )
}
