import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { c } from '../theme'
import { Logo } from '../components/Logo'

// ---- Progress stepper (Lastet opp → Analysert → Klage sendt → Svar ● → Oppgjør) ----
type StepState = 'done' | 'active' | 'pending'
const steps: { state: StepState; label: string }[] = [
  { state: 'done', label: 'Lastet opp' },
  { state: 'done', label: 'Analysert' },
  { state: 'done', label: 'Klage sendt' },
  { state: 'active', label: 'Svar fra selskapet' },
  { state: 'pending', label: 'Oppgjør' },
]
// line colour between step i and i+1
const lineColors = [c.green, c.green, c.border2, c.border2]

function StepDot({ state }: { state: StepState }) {
  if (state === 'done')
    return (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 99,
          background: c.green,
          color: c.white,
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        ✓
      </div>
    )
  if (state === 'active')
    return (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 99,
          background: c.white,
          border: `2px solid ${c.orange}`,
          color: c.orange,
          display: 'grid',
          placeItems: 'center',
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        ●
      </div>
    )
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 99,
        background: c.paperAlt,
        color: c.faint,
        display: 'grid',
        placeItems: 'center',
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {' '}
    </div>
  )
}

function stepLabelStyle(state: StepState): CSSProperties {
  if (state === 'done') return { fontSize: 11, fontWeight: 700, color: c.green }
  if (state === 'active') return { fontSize: 11, fontWeight: 700, color: c.redInk }
  return { fontSize: 11, fontWeight: 600, color: c.faint }
}

export function MineSaker() {
  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 1180 }}>
        <div style={{ background: c.paper, color: c.ink }}>
          {/* ---- Header ---- */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 32px',
              background: c.white,
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Logo mark={24} word={16} />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 13,
                  color: c.green,
                  fontWeight: 700,
                  borderLeft: `1px solid ${c.border}`,
                  paddingLeft: 14,
                }}
              >
                Mine saker
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: c.body }}>Kari Holm</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  background: c.greenTint,
                  color: c.green,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                KH
              </div>
            </div>
          </div>

          {/* ---- Body grid ---- */}
          <div
            className="mh-collapse"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr',
              gap: 24,
              padding: 32,
              alignItems: 'start',
            }}
          >
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Hei Kari — dette skjer i sakene dine
              </h2>

              {/* Active case card */}
              <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 15, padding: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>Vannskade bad · Gjensidige</div>
                    <div style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>
                      SAK 2417-VS · opprettet 3. juli 2026
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      letterSpacing: '.04em',
                      color: c.redInk,
                      background: c.redTint,
                      border: `1px solid ${c.redTintBorder}`,
                      borderRadius: 99,
                      padding: '6px 13px',
                    }}
                  >
                    VENTER PÅ SVAR
                  </span>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 18 }}>
                  {steps.map((s, i) => (
                    <Fragment key={s.label}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 5,
                          flex: 1,
                        }}
                      >
                        <StepDot state={s.state} />
                        <span style={stepLabelStyle(s.state)}>{s.label}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div style={{ height: 2, flex: 1, background: lineColors[i], marginBottom: 18 }} />
                      )}
                    </Fragment>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 18,
                    fontSize: 13.5,
                    color: c.body,
                    marginBottom: 18,
                    flexWrap: 'wrap',
                  }}
                >
                  <span>
                    Krav: <b style={{ color: c.green }}>+ 39 300 kr</b>
                  </span>
                  <span>
                    Klage sendt: <b>5. juli</b>
                  </span>
                  <span>
                    Svarfrist: <b>26. juli</b> (21 dager igjen)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    to="/sak?steg=4"
                    className="btn btn-green"
                    style={{ padding: '11px 20px', borderRadius: 10, fontSize: 14 }}
                  >
                    Åpne saken →
                  </Link>
                  <Link
                    to="/sak?steg=3"
                    className="btn btn-ghost"
                    style={{ padding: '11px 20px', borderRadius: 10, fontSize: 14 }}
                  >
                    Se klagebrevet
                  </Link>
                </div>
              </div>

              {/* Closed / won case */}
              <div
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 15,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontWeight: 800, fontSize: 15.5 }}>Reiseforsikring · If</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '.04em',
                        color: c.green,
                        background: c.greenTint,
                        borderRadius: 99,
                        padding: '3px 10px',
                      }}
                    >
                      MEDHOLD
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>
                    Avsluttet 14. mai 2026 · + 8 400 kr utbetalt
                  </div>
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: c.green, cursor: 'pointer' }}>Se saken</span>
              </div>

              {/* New case CTA */}
              <Link
                to="/kom-i-gang"
                className="tint-hover"
                style={{
                  border: `1.5px dashed ${c.borderDash}`,
                  borderRadius: 13,
                  padding: 16,
                  color: c.muted,
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                + Sjekk et nytt oppgjør
              </Link>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 38 }}>
              {/* Deadlines */}
              <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>Frister vi passer på</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 'none',
                      width: 44,
                      textAlign: 'center',
                      background: c.redTint,
                      border: `1px solid ${c.redTintBorder}`,
                      borderRadius: 9,
                      padding: '6px 0',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 800, color: c.redInk }}>JUL</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: c.redInk }}>26</div>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: c.body }}>
                    Svarfrist Gjensidige, sak 2417. <b>Purrer automatisk</b> hvis svaret uteblir.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div
                    style={{
                      flex: 'none',
                      width: 44,
                      textAlign: 'center',
                      background: c.paperAlt,
                      border: `1px solid ${c.border}`,
                      borderRadius: 9,
                      padding: '6px 0',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 800, color: c.muted }}>AUG</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: c.body }}>04</div>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: c.body }}>
                    Dokumentene i sak 2417 slettes automatisk —{' '}
                    <Link to="/personvern" style={{ color: c.green, fontWeight: 700, textDecoration: 'none' }}>
                      les mer
                    </Link>
                    .
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: 14 }}>Dokumenter</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.muted }}>5 filer</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: c.body }}>
                  {[
                    'Oppgjørstilbud-Gjensidige.pdf',
                    'Skademelding-vannskade.pdf',
                    'Tilbud-BadRehab-AS.pdf',
                    'Klagebrev-2417.pdf',
                    'Vilkår-Bolig-Pluss-2025.pdf',
                  ].map((file) => (
                    <div key={file} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{file}</span>
                      <span style={{ color: c.muted, cursor: 'pointer' }}>Slett</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px dashed ${c.border}`,
                    fontSize: 12.5,
                    color: c.muted,
                    lineHeight: 1.5,
                  }}
                >
                  Alt krypteres og slettes automatisk 30 dager etter at saken lukkes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
