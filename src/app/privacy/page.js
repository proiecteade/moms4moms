export const metadata = {
  title: 'Politică de Confidențialitate — Moms4Moms',
  description: 'Politica de confidențialitate a platformei Moms4Moms',
}

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Politică de Confidențialitate</h1>
      <p style={{ color: 'var(--ink-light)', fontSize: 13, marginBottom: '2rem' }}>Ultima actualizare: aprilie 2026</p>

      <Section title="1. Cine suntem">
        <p>Moms4Moms (<strong>moms4moms.ro</strong>) este o platformă de recomandări de medici creată de și pentru mamele din România. Operatorul datelor cu caracter personal este accesibil la adresa <strong>sabina_cornovac@yahoo.com</strong>.</p>
      </Section>

      <Section title="2. Ce date colectăm">
        <ul>
          <li><strong>Date de cont</strong> — la autentificarea cu Google sau Facebook colectăm numele și adresa de email furnizate de acești furnizori.</li>
          <li><strong>Comentarii și recomandări</strong> — textele pe care le postezi public pe platformă, inclusiv experiențele cu medicii.</li>
          <li><strong>Date de utilizare</strong> — prin Google Analytics colectăm date anonime despre paginile vizitate, tipul de dispozitiv și localizarea aproximativă (nivel de oraș).</li>
        </ul>
      </Section>

      <Section title="3. Cum folosim datele">
        <ul>
          <li>Afișarea numelui tău lângă comentariile publice (dacă nu alegi opțiunea „postează anonim").</li>
          <li>Moderarea conținutului de către administratori pentru a asigura calitatea recomandărilor.</li>
          <li>Îmbunătățirea platformei pe baza datelor agregate de analytics.</li>
        </ul>
        <p>Nu vindem și nu transferăm datele tale către terți în scopuri comerciale.</p>
      </Section>

      <Section title="4. Comentarii anonime">
        <p>Poți posta comentarii ca „Anonim" bifând opțiunea disponibilă în formular. În acest caz, numele tău nu va fi afișat public. Adresa de email rămâne stocată intern exclusiv pentru moderare și prevenirea abuzurilor.</p>
      </Section>

      <Section title="5. Cookies și analytics">
        <p>Folosim <strong>Google Analytics 4</strong> pentru a înțelege cum este utilizată platforma. Datele sunt anonimizate și agregate. Poți dezactiva analytics-ul prin extensii de browser de tip ad-blocker sau prin setările Google.</p>
      </Section>

      <Section title="6. Autentificare prin Google și Facebook">
        <p>La autentificarea prin Google sau Facebook, acești furnizori ne transmit numele și emailul asociat contului tău. Nu primim parola ta. Funcționarea acestor servicii este guvernată de politicile lor proprii de confidențialitate.</p>
      </Section>

      <Section title="7. Drepturile tale">
        <p>Conform GDPR, ai dreptul să:</p>
        <ul>
          <li>Accesezi datele pe care le deținem despre tine.</li>
          <li>Soliciți ștergerea contului și a datelor asociate.</li>
          <li>Soliciți corectarea datelor incorecte.</li>
          <li>Te opui prelucrării datelor în scopuri de marketing.</li>
        </ul>
        <p>Pentru orice solicitare, contactează-ne la <strong>sabina_cornovac@yahoo.com</strong>.</p>
      </Section>

      <Section title="8. Retenția datelor">
        <p>Datele contului sunt păstrate atât timp cât contul este activ. Comentariile și recomandările publicate rămân pe platformă chiar și după ștergerea contului, în formă anonimă, dacă nu soliciți explicit ștergerea lor.</p>
      </Section>

      <Section title="9. Contact">
        <p>Pentru întrebări legate de confidențialitate: <strong>sabina_cornovac@yahoo.com</strong></p>
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
