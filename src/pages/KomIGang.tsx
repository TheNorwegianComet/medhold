import { Link } from 'react-router-dom'
import { c } from '../theme'
import { Logo } from '../components/Logo'

export function KomIGang() {
  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 840 }}>
        {/* header */}
        <div
          className="mh-pad"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 32px',
            borderBottom: `1px solid ${c.border}`,
          }}
        >
          <Logo mark={24} word={16} />
          <span style={{ fontSize: 13.5, color: c.body }}>
            Har du en sak fra før?{' '}
            <Link to="/mine-saker" style={{ color: c.green, fontWeight: 700, textDecoration: 'none' }}>
              Logg inn
            </Link>
          </span>
        </div>

        {/* two-column body */}
        <div
          className="mh-collapse mh-pad"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 36,
            padding: '36px 32px 40px',
          }}
        >
          {/* left column — the sign-up */}
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.7px' }}>
              Sjekk oppgjøret ditt. Gratis.
            </h2>
            <p
              style={{
                margin: '0 0 24px',
                fontSize: 15,
                lineHeight: 1.6,
                color: c.body,
                textWrap: 'pretty',
              }}
            >
              Du trenger bare tilbudsbrevet fra selskapet. Sjekken tar to minutter, og du bestemmer selv hva du gjør etterpå.
            </p>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: c.muted,
                letterSpacing: '.05em',
                marginBottom: 8,
              }}
            >
              E-POST
            </div>
            <div
              style={{
                background: c.white,
                border: `1.5px solid ${c.border2}`,
                borderRadius: 10,
                padding: '13px 16px',
                fontSize: 15,
                color: c.ink,
                marginBottom: 12,
              }}
            >
              kari@epost.no
            </div>
            <Link
              to="/sak"
              className="btn btn-green"
              style={{
                display: 'block',
                padding: 14,
                borderRadius: 11,
                fontSize: 15.5,
              }}
            >
              Start sjekken →
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: c.border }}></div>
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>ELLER</span>
              <div style={{ flex: 1, height: 1, background: c.border }}></div>
            </div>
            <Link
              to="/sak"
              className="btn btn-outline"
              style={{
                display: 'block',
                padding: 13,
                borderRadius: 11,
                fontSize: 15,
              }}
            >
              Fortsett med <span style={{ color: c.vipps }}>Vipps</span>
            </Link>
            <div style={{ fontSize: 12.5, color: c.muted, marginTop: 14, lineHeight: 1.5 }}>
              Ingen kortopplysninger. Gratis-sjekken er helt uforpliktende.
            </div>
          </div>

          {/* right column — what happens now */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.muted, letterSpacing: '.05em' }}>
              HVA SKJER NÅ
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                1
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Last opp tilbudet</b> — og gjerne skademelding og takst. Tar rundt to minutter.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                2
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Du får svar med én gang</b> — om tilbudet ser lavt ut, og omtrent hvor mye.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                3
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Du velger selv</b> — full analyse og klagebrev koster 349 kr. Ellers koster det ingenting.
              </div>
            </div>
            <div
              style={{
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '16px 18px',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: c.body,
                marginTop: 6,
              }}
            >
              Dokumentene dine krypteres og slettes etter 30 dager.{' '}
              <Link to="/personvern" style={{ color: c.green, fontWeight: 700, textDecoration: 'none' }}>
                Les hvordan vi behandler dem →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
