import { c } from '../theme'

export function Personvern() {
  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 560 }}>
        <div style={{ padding: '32px 34px', color: c.ink }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Dokumentene dine — kort forklart
          </h2>
          <p style={{ margin: '0 0 22px', fontSize: 14.5, lineHeight: 1.6, color: c.body, textWrap: 'pretty' }}>
            Du deler noe av det mest private du har: skader, verdier, hjemmet ditt. Sånn behandler vi det.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '15px 18px',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ✓
              </span>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Kryptert</b> under overføring og lagring, hos leverandør i EU/EØS.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '15px 18px',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ✓
              </span>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Slettes automatisk</b> 30 dager etter at saken lukkes — eller straks, hvis du
                ber om det.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '15px 18px',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ✓
              </span>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Deles aldri</b> — ikke med forsikringsselskapet, ikke med noen andre.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '15px 18px',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ✓
              </span>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: c.body }}>
                <b style={{ color: c.ink }}>Brukes kun til din sak</b> — aldri til å trene modeller eller til
                markedsføring.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${c.border}`,
            }}
          >
            <span style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.5 }}>
              Behandlingsgrunnlag: GDPR art. 6 (1) b<br />
              Spørsmål? personvern@medhold.no
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: c.rust2, cursor: 'pointer' }}>
              Slett alle dokumenter nå
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
