import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { c, font } from '../theme'

type Step = { n: string; title: string; desc: string; final?: boolean }

const steps: Step[] = [
  {
    n: '1',
    title: 'Tilbudet kom: 84 000 kr',
    desc: 'Lekkasje bak dusjsonen. Håndverkeren anslo 158 000 kr for full utbedring — nesten det dobbelte av tilbudet.',
  },
  {
    n: '2',
    title: 'Sjekken fant 4 avvik',
    desc: 'Utelatt riving, underpriset membranarbeid, 40 % aldersfradrag der vilkårene sier maks 20 %, og nedvask som manglet helt.',
  },
  {
    n: '3',
    title: 'Klagen: krav om 156 500 kr',
    desc: 'Ett brev, fire argumenter, hver med referanse til vilkårspunkt og side — pluss håndverkertilbudet som dokumentasjon.',
  },
  {
    n: '✓',
    title: 'Svaret: nytt oppgjør på 152 000 kr',
    desc: 'Tre uker senere. Selskapet ga medhold på tre av fire punkter og møtte kravet nesten fullt ut.',
    final: true,
  },
]

type Avvik = { label: string; tag?: string; tagColor?: string; amount: string }

const avvik: Avvik[] = [
  { label: 'Riving og avfall ', tag: 'utelatt', tagColor: c.redInk, amount: '+ 21 000' },
  { label: 'Membran og flis ', tag: 'underpriset', tagColor: c.amberInk, amount: '+ 32 500' },
  { label: 'Aldersfradrag 40 → 20 %', amount: '+ 11 200' },
  { label: 'Nedvask og følgeskade', amount: '+ 7 800' },
]

export function EksempelsakDetalj() {
  return (
    <div className="mh-app">
      <div className="mh-page" style={{ maxWidth: 900 }}>
        <div style={{ background: c.paper, color: c.ink, padding: '44px 56px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.muted, marginBottom: 18 }}>
            <Link to="/eksempelsaker" style={{ color: c.green, textDecoration: 'none', fontWeight: 700 }}>
              Eksempelsaker
            </Link>{' '}
            / Vannskade bad · Oslo
          </div>
          <h2
            style={{
              margin: '0 0 14px',
              fontFamily: font.serif,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.12,
              textWrap: 'balance',
            }}
          >
            «De tilbød 84 000. Vilkårene ga 152 000.»
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 30 }}>
            {['Gjensidige Bolig Pluss', 'Vår 2026', 'Avgjort på 3 uker'].map((t) => (
              <span
                key={t}
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 99,
                  padding: '5px 12px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: c.body,
                }}
              >
                {t}
              </span>
            ))}
            <span
              style={{
                background: c.greenTint,
                border: `1px solid ${c.greenTintBorder}`,
                borderRadius: 99,
                padding: '5px 12px',
                fontSize: 12.5,
                fontWeight: 700,
                color: c.green,
              }}
            >
              Uten Finansklagenemnda
            </span>
          </div>

          <div
            className="mh-collapse"
            style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'start' }}
          >
            {/* left: timeline + pull-quote */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 14 }}>
                {steps.map((s) => (
                  <Fragment key={s.n}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 99,
                          background: s.final ? c.green : c.greenTint,
                          color: s.final ? c.white : c.green,
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 800,
                          fontSize: 12,
                          border: `1.5px solid ${s.final ? c.green : c.greenTintBorder}`,
                        }}
                      >
                        {s.n}
                      </div>
                      {!s.final && <div style={{ width: 2, flex: 1, background: c.border2, margin: '4px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: s.final ? 0 : 22 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: c.body, textWrap: 'pretty' }}>{s.desc}</div>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div
                style={{
                  background: c.white,
                  borderLeft: `3px solid ${c.green}`,
                  borderRadius: '0 12px 12px 0',
                  padding: '18px 22px',
                  marginTop: 26,
                  fontFamily: font.serif,
                  fontStyle: 'italic',
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: c.ink2,
                }}
              >
                «Tilbudet legger til grunn 40 % aldersfradrag. Badet ble rehabilitert i 2021 med våtromssertifikat, og
                vilkårenes punkt 6.3 setter da fradraget til maksimalt 20 %.»
                <div
                  style={{
                    fontFamily: font.sans,
                    fontStyle: 'normal',
                    fontSize: 12,
                    fontWeight: 700,
                    color: c.muted,
                    marginTop: 10,
                  }}
                >
                  FRA KLAGEBREVET · ARGUMENT 3
                </div>
              </div>
            </div>

            {/* right: summary card + avvik card + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: c.greenDeep, borderRadius: 15, padding: 24, color: c.cream }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', color: c.sage, marginBottom: 3 }}>
                  TILBUD
                </div>
                <div
                  style={{
                    fontFamily: font.serif,
                    fontSize: 24,
                    fontWeight: 600,
                    color: c.fadedSand,
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(214,73,31,.8)',
                    marginBottom: 12,
                  }}
                >
                  84 000 kr
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', color: c.sage, marginBottom: 3 }}>
                  UTFALL
                </div>
                <div style={{ fontFamily: font.serif, fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 12 }}>
                  152 000 kr
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    background: c.green,
                    border: '1px solid rgba(245,239,226,.25)',
                    color: c.dfGreen,
                    fontSize: 14,
                    fontWeight: 800,
                    borderRadius: 8,
                    padding: '6px 12px',
                  }}
                >
                  + 68 000 kr · 81 %
                </div>
              </div>

              <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 15, padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>Avvikene i saken</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: c.body }}>
                  {avvik.map((a) => (
                    <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <span>
                        {a.label}
                        {a.tag && <span style={{ color: a.tagColor, fontWeight: 700 }}>{a.tag}</span>}
                      </span>
                      <span style={{ fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{a.amount}</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: `1px dashed ${c.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  <span>Krevd</span>
                  <span style={{ color: c.green }}>+ 72 500 kr</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  <span>Innvilget</span>
                  <span style={{ color: c.green }}>+ 68 000 kr</span>
                </div>
              </div>

              <Link
                to="/kom-i-gang"
                className="btn btn-green"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: 14,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                }}
              >
                Sjekk din sak gratis →
              </Link>
              <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.5 }}>
                Anonymisert og lett omskrevet. Utfallet i én sak garanterer ikke utfallet i din.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
