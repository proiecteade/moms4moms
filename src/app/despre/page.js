import Link from 'next/link'

export const metadata = {
  title: 'Despre — Moms4Moms',
  description: 'Moms4Moms România — comunitatea de femei care se susțin una pe alta. Recomandări de medici verificate de mame, pentru mame.',
}

export default function DesprePage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

      {/* Intro */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: '1.25rem', color: 'var(--ink)' }}>
          Despre Moms4Moms
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-light)' }}>
          Moms4Moms România <em>(powered by Sabina Cornovac)</em> este mai mult decât un grup de mame — e o comunitate de femei care se susțin una pe alta.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-light)', marginTop: '1rem' }}>
          Vorbim despre maternitate și copii, dar și despre noi ca femei și identitatea de dincolo de rolul de mamă.
          Ne bucurăm împreună, ne îngrijorăm împreună și ne ajutăm să găsim oamenii de încredere de care avem nevoie — așa s-a născut această pagină, din nevoia de a accesa rapid recomandările mamelor din comunitate, recomandări pe care ne bazăm și cu ochii închiși.
        </p>
      </div>

      {/* CTA Comunitate */}
      <div style={{ background: 'var(--cream)', borderRadius: 16, padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: '1.25rem', color: 'var(--ink)' }}>
          💗 Hai alături de noi
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="https://chat.whatsapp.com/JxCs89PsYvyB57q3huC6FT?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: '#25D366', color: 'white', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(37,211,102,0.25)', transition: 'all 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Grup WhatsApp
          </a>
          <a
            href="https://www.facebook.com/groups/774414941387642/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: '#1877F2', color: 'white', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(24,119,242,0.25)', transition: 'all 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Grup Facebook
          </a>
        </div>
      </div>

      {/* Tutorial */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: '1.5rem', color: 'var(--ink)' }}>
          Cum funcționează
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: '🔍', title: 'Caută un medic', desc: 'Caută după nume, specialitate sau oraș. Folosește filtrele pentru a restrânge rezultatele.', note: 'Nu e nevoie de cont.' },
            { icon: '👤', title: 'Creează-ți un cont', desc: 'Vrei să recomanzi, să comentezi sau să propui un medic? Click pe "Intră în cont" din colțul dreapta sus. Te autentifici cu Facebook sau Google — rapid și simplu.', note: null },
            { icon: '👍', title: 'Recomandă un medic', desc: 'Pe cardul unui medic, apasă butonul "Recomandă". Un singur click — recomandarea ta contează!', note: null },
            { icon: '💬', title: 'Lasă un comentariu', desc: 'Intră pe pagina medicului și scrie experiența ta. Comentariile sunt verificate înainte de publicare.', note: null },
            { icon: '➕', title: 'Propune un medic nou', desc: 'Nu găsești medicul tău preferat? Apasă "+ Adaugă medic" și completează fișa. Va fi publicat după verificare.', note: null },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: 'white', border: '1px solid var(--border)', borderRadius: 12,
              padding: '1rem 1.25rem',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'var(--teal-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{step.title}</span>
                  {step.note && (
                    <span style={{ fontSize: 12, background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                      {step.note}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 4, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/medici" className="nav-btn nav-btn-primary" style={{ fontSize: 15, padding: '10px 28px' }}>
            Caută un medic →
          </Link>
        </div>
      </div>

    </div>
  )
}
