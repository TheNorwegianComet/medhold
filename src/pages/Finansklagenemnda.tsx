import { c, font } from '../theme'

export function Finansklagenemnda() {
  const sectionLabel = {
    fontSize: 12.5,
    fontWeight: 700,
    color: c.muted,
    letterSpacing: '.05em',
  } as const

  const endre = {
    fontSize: 12.5,
    fontWeight: 700,
    color: c.green,
    cursor: 'pointer',
  } as const

  const valueBox = {
    background: c.white,
    border: `1px solid ${c.border}`,
    borderRadius: 11,
    padding: '14px 18px',
    fontSize: 14,
    lineHeight: 1.6,
    color: c.ink2,
  } as const

  const chip = {
    background: c.white,
    border: `1px solid ${c.border}`,
    borderRadius: 99,
    padding: '6px 13px',
    fontSize: 12.5,
    fontWeight: 600,
    color: c.body,
  } as const

  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 880 }}>
        <div
          className="dv-card"
          style={{ width: 880, background: c.paper, color: c.ink }}
        >
          {/* dark-green header band */}
          <div style={{ background: c.greenDeep, padding: '28px 36px', color: c.cream }}>
            <div
              className="mh-wrap-sm"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    color: c.sage,
                    marginBottom: 6,
                  }}
                >
                  NESTE INSTANS · GRATIS KLAGEORDNING
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Klage til Finansklagenemnda
                </div>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontSize: 12.5,
                  color: c.sage,
                  lineHeight: 1.5,
                }}
              >
                Fylt ut automatisk fra sak 2417-VS<br />
                Les over, endre om du vil — og send.
              </div>
            </div>
          </div>

          {/* light-green status strip */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: '16px 36px',
              background: c.greenTint,
              borderBottom: `1px solid ${c.greenTintBorder}`,
              fontSize: 13,
              fontWeight: 600,
              color: c.greenInk,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: c.green, fontWeight: 800 }}>✓</span>Intern klage sendt 5. juli
            </span>
            <span style={{ color: c.sage }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: c.green, fontWeight: 800 }}>✓</span>Selskapet fastholdt tilbudet 24. juli
            </span>
            <span style={{ color: c.sage }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: c.green, fontWeight: 800 }}>✓</span>Kravet om intern klagebehandling er oppfylt
            </span>
          </div>

          {/* numbered sections */}
          <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 1 KLAGER */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={sectionLabel}>1 · KLAGER</span>
                <span style={endre}>Endre</span>
              </div>
              <div style={valueBox}>
                Kari Holm · Bekkefaret 12, 0283 Oslo · kari@epost.no · 924 xx xxx
              </div>
            </div>

            {/* 2 INNKLAGET SELSKAP */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={sectionLabel}>2 · INNKLAGET SELSKAP</span>
                <span style={endre}>Endre</span>
              </div>
              <div style={valueBox}>
                Gjensidige Forsikring ASA · Saksnummer 2417-VS · Polise: Bolig Pluss, avtale 88 41 23
              </div>
            </div>

            {/* 3 HVA SAKEN GJELDER */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={sectionLabel}>3 · HVA SAKEN GJELDER</span>
                <span style={endre}>Endre</span>
              </div>
              <div style={{ ...valueBox, lineHeight: 1.65 }}>
                Uenighet om oppgjør etter vannskade på bad. Selskapets tilbud på 60 000 kr avviker fra
                vilkårenes dekning på tre punkter: utelatt riving og avfallshåndtering (§ 5.1),
                underpriset membran- og flisarbeid i strid med dokumentert kostnad (§ 5.2), og
                aldersfradrag utover vilkårenes maksimum (§ 6.3).
              </div>
            </div>

            {/* 4 KRONOLOGI */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={sectionLabel}>4 · KRONOLOGI</span>
                <span style={endre}>Endre</span>
              </div>
              <div style={{ ...valueBox, lineHeight: 1.9 }}>
                <b>12. juni</b> — Vannskade oppdaget, skademelding sendt<br />
                <b>18. juni</b> — Oppgjørstilbud mottatt: 60 000 kr<br />
                <b>5. juli</b> — Skriftlig klage sendt med krav om 99 300 kr<br />
                <b>24. juli</b> — Selskapet fastholdt opprinnelig tilbud
              </div>
            </div>

            {/* 5 KRAVET */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={sectionLabel}>5 · KRAVET</span>
                <span style={endre}>Endre</span>
              </div>
              <div
                style={{
                  ...valueBox,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Korrigert oppgjør i tråd med vilkårene</span>
                <span
                  style={{
                    fontFamily: font.serif,
                    fontWeight: 700,
                    fontSize: 19,
                    color: c.green,
                  }}
                >
                  99 300 kr
                </span>
              </div>
            </div>

            {/* 6 VEDLEGG */}
            <div>
              <div style={{ ...sectionLabel, marginBottom: 8 }}>
                6 · VEDLEGG — FØLGER SAKEN AUTOMATISK
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={chip}>Klagebrev 5. juli</span>
                <span style={chip}>Selskapets svar</span>
                <span style={chip}>Oppgjørstilbud</span>
                <span style={chip}>Håndverkertilbud</span>
                <span style={chip}>Skademelding</span>
                <span style={chip}>Vilkår (34 s.)</span>
              </div>
            </div>

            {/* bottom actions */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 6 }}>
              <span
                className="btn btn-green"
                style={{
                  padding: '14px 24px',
                  borderRadius: 11,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: `0 2px 0 ${c.greenShadow}`,
                }}
              >
                Send inn klagen
              </span>
              <span
                className="btn btn-ghost"
                style={{
                  border: '1.5px solid #C9D8CE',
                  color: c.green,
                  padding: '14px 22px',
                  borderRadius: 11,
                  fontWeight: 700,
                  fontSize: 14.5,
                  cursor: 'pointer',
                }}
              >
                Last ned som PDF
              </span>
              <span style={{ fontSize: 12.5, color: c.muted, marginLeft: 6, lineHeight: 1.5 }}>
                Gratis · Normal behandlingstid 3–6 måneder<br />
                Du kan trekke klagen når som helst.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
