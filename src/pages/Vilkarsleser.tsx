import { Link } from 'react-router-dom'
import { c, font } from '../theme'

export function Vilkarsleser() {
  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 1120 }}>
        <div style={{ background: c.paper, color: c.ink }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 28px',
              background: c.white,
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Vilkårene dine</span>
              <span
                style={{
                  fontSize: 13,
                  color: c.muted,
                  fontWeight: 600,
                  borderLeft: `1px solid ${c.border}`,
                  paddingLeft: 12,
                }}
              >
                Gjensidige Bolig Pluss (2025) · 34 sider
              </span>
            </div>
            <Link
              to="/sak"
              style={{
                width: 30,
                height: 30,
                borderRadius: 99,
                background: c.paperAlt,
                color: c.body,
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              ✕
            </Link>
          </div>
          <div
            className="mh-collapse"
            style={{
              display: 'grid',
              gridTemplateColumns: '330px 1fr',
              gap: 0,
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                padding: 24,
                borderRight: `1px solid ${c.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: c.muted,
                  letterSpacing: '.05em',
                  marginBottom: 2,
                }}
              >
                FUNN I DENNE SAKEN
              </div>
              <div
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 11,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>§ 5.1 · Riving og avfall</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: c.redInk,
                      background: c.redTint,
                      borderRadius: 5,
                      padding: '2px 7px',
                    }}
                  >
                    UTELATT
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>
                  Side 13 · + 18 500 kr
                </div>
              </div>
              <div
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 11,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>§ 5.2 · Membran og flis</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: c.amberInk,
                      background: c.amberTint,
                      borderRadius: 5,
                      padding: '2px 7px',
                    }}
                  >
                    UNDERPRISET
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>
                  Side 14 · + 15 000 kr
                </div>
              </div>
              <div
                style={{
                  background: c.white,
                  border: `2px solid ${c.green}`,
                  borderRadius: 11,
                  padding: '14px 16px',
                  boxShadow: '0 4px 14px -8px rgba(30,92,67,.4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>§ 6.3 · Aldersfradrag</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: c.redInk,
                      background: c.redTint,
                      borderRadius: 5,
                      padding: '2px 7px',
                    }}
                  >
                    FEIL SATS
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: c.green, fontWeight: 700 }}>
                  Side 17 · + 5 800 kr · vises nå →
                </div>
              </div>
              <div
                style={{
                  background: c.greenTint,
                  border: `1px solid ${c.greenTintBorder}`,
                  borderRadius: 11,
                  padding: '14px 16px',
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: c.greenInk,
                  marginTop: 6,
                }}
              >
                Dette er selskapets eget dokument — vi har bare funnet frem til riktig side. Det du
                ser her, kan selskapet også slå opp.
              </div>
            </div>
            <div className="mh-doc-pad" style={{ padding: '28px 34px', background: '#EFEBE0' }}>
              <div
                className="mh-doc-pad"
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 4,
                  boxShadow: '0 16px 40px -24px rgba(33,29,21,.35)',
                  padding: '44px 52px',
                  fontFamily: font.serif,
                }}
              >
                <div
                  className="mh-wrap-sm"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: font.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.08em',
                    color: c.muted,
                    marginBottom: 26,
                  }}
                >
                  <span>GJENSIDIGE BOLIG PLUSS — FORSIKRINGSVILKÅR</span>
                  <span>SIDE 17 AV 34</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 16 }}>
                  § 6 Fradrag ved erstatningsberegning
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: '#9A937F',
                    marginBottom: 16,
                  }}
                >
                  <b style={{ color: '#9A937F' }}>6.2 Generelt.</b> Ved beregning av erstatning gjøres
                  det fradrag for verdiøkning som følge av at brukt gjenstand erstattes med ny, samt
                  for alder og slitasje der dette er angitt i punktene nedenfor.
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.8,
                    color: c.ink2,
                    marginBottom: 4,
                  }}
                >
                  <b>6.3 Aldersfradrag for våtrom.</b> For skade på våtrom beregnes aldersfradrag av
                  samlede reparasjonskostnader, inkludert arbeid og materialer. Fradraget regnes fra
                  det året våtrommet var nytt eller sist ble fullstendig rehabilitert.{' '}
                  <mark
                    style={{
                      background: c.dfGreen,
                      padding: '2px 3px',
                      borderBottom: `2.5px solid ${c.green}`,
                      fontWeight: 600,
                    }}
                  >
                    For våtrom som er 10 år eller yngre skal fradraget ikke overstige 20 prosent.
                  </mark>{' '}
                  For våtrom eldre enn 10 år økes fradraget med 5 prosentpoeng per påbegynt år,
                  begrenset oppad til 50 prosent.
                </div>
                <div
                  style={{
                    background: c.greenTint,
                    border: `1px solid ${c.greenTintBorder}`,
                    borderRadius: 10,
                    padding: '14px 18px',
                    margin: '16px 0 20px',
                    fontFamily: font.sans,
                  }}
                >
                  <div
                    className="mh-wrap-sm"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, color: c.greenInk }}>
                      <b>Badet ditt er fra 2019 — sju år gammelt.</b> Tilbudet bruker 30 % fradrag;
                      denne setningen setter taket til 20 %.
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: c.white,
                        background: c.green,
                        borderRadius: 6,
                        padding: '4px 10px',
                        whiteSpace: 'nowrap',
                        flex: 'none',
                      }}
                    >
                      AVVIK · + 5 800 KR
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.75, color: '#9A937F' }}>
                  <b style={{ color: '#9A937F' }}>6.4 Aldersfradrag for elektrisk anlegg.</b> For
                  skade på elektrisk anlegg beregnes fradrag med 5 prosent per påbegynt år fra
                  anlegget var 10 år, begrenset oppad til …
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  fontSize: 13,
                  fontWeight: 600,
                  color: c.muted,
                }}
              >
                <span>Sist oppdatert av Gjensidige: januar 2025</span>
                <span style={{ color: c.green, fontWeight: 700, cursor: 'pointer' }}>
                  Åpne hele dokumentet (PDF) →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
