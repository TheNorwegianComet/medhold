import { Link } from 'react-router-dom'
import { c, font } from '../theme'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

// ---- Copy (the "kampklar" / battle-ready tone the design ships as default) ----
const copy = {
  heroKicker: 'Fikk du oppgjørstilbud fra forsikringsselskapet?',
  heroH1: 'Ikke ta det første tilbudet.',
  heroSub:
    'Forsikringsselskapet har et helt oppgjørsteam. Nå har du også det. Last opp tilbudet — Medhold viser hva vilkårene faktisk gir deg rett til, og skriver klagen for deg.',
  heroCta: 'Sjekk oppgjøret gratis',
  band: 'Bygget på de faktiske vilkårene til Gjensidige, If, Tryg og Fremtind — ikke på synsing.',
  ctaEnd: 'Du har krav på mer enn du tror.',
}

const hvordan = [
  {
    n: '01',
    t: 'Last opp',
    d: 'Tilbudet fra selskapet og skademeldingen. Har du takst eller håndverkertilbud, blir saken enda sterkere.',
  },
  {
    n: '02',
    t: 'Vi leser vilkårene',
    d: 'Hele vilkårsdokumentet, ordrett. Hver post i tilbudet sjekkes mot det du faktisk har krav på.',
  },
  {
    n: '03',
    t: 'Send klagen',
    d: 'Et ferdig brev med riktige referanser til vilkårspunkt og side. Høflig, bestemt og vanskelig å avvise.',
  },
]

const eksempler = [
  {
    tag: 'Vannskade bad',
    sted: 'Oslo',
    fra: '84 000 kr',
    til: '152 000 kr',
    diff: '+ 68 000 kr etter klage',
    flagget: 'utelatt riving, underpriset membranarbeid, feil aldersfradrag.',
  },
  {
    tag: 'Innbrudd',
    sted: 'Bergen',
    fra: '34 000 kr',
    til: '51 500 kr',
    diff: '+ 17 500 kr etter klage',
    flagget: 'dagsverdi brukt der vilkårene gir gjenanskaffelse (§ 4.1), to gjenstander utelatt.',
  },
  {
    tag: 'Bilskade · kondemnert',
    sted: 'Trondheim',
    fra: '145 000 kr',
    til: '189 000 kr',
    diff: '+ 44 000 kr etter klage',
    flagget: 'markedsverdi satt under sammenlignbare annonser, ettermontert utstyr utelatt.',
  },
]

const serEtter = [
  { t: 'Aldersfradrag over vilkårenes maksimum', ref: '§ 6' },
  { t: 'Utelatte poster: riving, avfall, følgeskader', ref: '§ 5.1' },
  { t: 'Dagsverdi brukt der du har krav på gjenanskaffelse', ref: '§ 4.1' },
  { t: 'Håndverksarbeid priset under dokumentert kostnad', ref: '§ 5.2' },
  { t: 'Egenandel trukket mer enn én gang', ref: '§ 7' },
  { t: 'Manglende dekning for alternativ bolig', ref: '§ 8.3' },
]

const faq = [
  {
    q: 'Er det lov å klage på oppgjøret?',
    a: 'Ja. Tilbudet er et utspill, ikke et vedtak. Du har full rett til å kreve ny vurdering — og selskapet plikter å svare skriftlig.',
  },
  {
    q: 'Hva om analysen ikke finner noe?',
    a: 'Da sier vi det, tydelig. Gratis-sjekken koster ingenting, og full analyse refunderes hvis vi ikke finner noe å klage på.',
  },
  {
    q: 'Hvilke selskaper støtter dere?',
    a: 'Vi har vilkårene til Gjensidige, If, Tryg og Fremtind — og du kan laste opp vilkår fra andre selskaper selv.',
  },
  {
    q: 'Er dere advokater?',
    a: 'Nei, og du trenger som regel ikke det heller. Vi hjelper deg å bruke dine egne vilkår. Trenger saken advokat, sier vi ifra.',
  },
]

export function LandingPage() {
  return (
    <div className="mh-app">
      <div className="mh-page">
        <SiteNav cta={copy.heroCta} />

        {/* hero */}
        <div
          className="mh-collapse mh-pad"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: 56,
            padding: '64px 56px 56px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                background: c.paperAlt,
                border: '1px solid #E4DAC3',
                color: '#6F5E38',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 99,
                marginBottom: 20,
              }}
            >
              {copy.heroKicker}
            </div>
            <h1 style={{ margin: '0 0 18px', fontSize: 58, lineHeight: 1.02, letterSpacing: '-2px', fontWeight: 800 }}>
              {copy.heroH1}
            </h1>
            <p style={{ margin: '0 0 28px', fontSize: 18, lineHeight: 1.6, color: c.body, maxWidth: 520, textWrap: 'pretty' }}>
              {copy.heroSub}
            </p>
            <div className="mh-wrap-sm" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to="/kom-i-gang" className="btn btn-green" style={{ padding: '15px 26px', fontSize: 16 }}>
                {copy.heroCta}
              </Link>
              <Link
                to="/eksempelsak"
                className="btn btn-ghost"
                style={{ padding: '15px 22px', fontWeight: 600, fontSize: 15 }}
              >
                Se en eksempelsak
              </Link>
            </div>
            <div
              className="mh-wrap-sm"
              style={{ display: 'flex', gap: 20, marginTop: 22, fontSize: 13, color: c.muted, fontWeight: 500 }}
            >
              <span>Gratis sjekk på 2 minutter</span>
              <span>·</span>
              <span>Full analyse fra 349 kr</span>
              <span>·</span>
              <span>Ingen advokat nødvendig</span>
            </div>
          </div>

          {/* hero mock: analyseresultat */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: c.white,
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                boxShadow: '0 24px 60px -24px rgba(33,29,21,.25)',
                padding: '24px 24px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Vannskade bad · Gjensidige</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: c.muted, letterSpacing: '.06em' }}>SAK 2417-VS</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 5 }}>Selskapets tilbud</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ height: 14, width: '60%', background: c.redBar, border: `1px solid ${c.redBarBorder}`, borderRadius: 4 }} />
                <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 16, color: c.rust }}>60 000 kr</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 5 }}>Det vilkårene gir deg rett til</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ height: 14, width: '100%', background: '#CDE2D3', border: '1px solid #9EC4A9', borderRadius: 4 }} />
                <div style={{ fontFamily: font.serif, fontWeight: 700, fontSize: 16, color: c.green, whiteSpace: 'nowrap' }}>
                  ≈ 99 300 kr
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <MockFlag color={c.redInk} bg={c.redTint} border={c.redTintBorder} text="Utelatt: riving og avfall" sref="§ 5.1" />
                <MockFlag color={c.amberInk} bg={c.amberTint} border="#E7D5A8" text="Underpriset: membran og flis" sref="§ 5.2" />
                <MockFlag
                  color={c.redInk}
                  bg={c.redTint}
                  border={c.redTintBorder}
                  text="Aldersfradrag: 30 % — vilkårene sier maks 20 %"
                  sref="§ 6.3"
                />
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${c.border}`, fontSize: 12.5, color: c.muted, fontWeight: 500 }}>
                3 avvik funnet · sjekket mot Gjensidige Bolig Pluss (2025)
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: -16,
                right: -14,
                transform: 'rotate(6deg)',
                background: c.orange,
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '.08em',
                padding: '8px 14px',
                borderRadius: 8,
                boxShadow: '0 8px 20px -8px rgba(214,73,31,.6)',
              }}
            >
              LAVT TILBUD
            </div>
          </div>
        </div>

        {/* trust band */}
        <div
          className="mh-pad"
          style={{
            background: c.greenDeep,
            color: '#E9E2D0',
            textAlign: 'center',
            padding: '18px 56px',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '.01em',
          }}
        >
          {copy.band}
        </div>

        {/* slik virker det */}
        <div className="mh-pad" style={{ padding: '64px 56px' }} id="slik-virker-det">
          <h2 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px' }}>Slik virker det</h2>
          <p style={{ margin: '0 0 32px', color: c.body, fontSize: 16 }}>
            Fra tilbud til velbegrunnet klage på under ti minutter.
          </p>
          <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {hvordan.map((h) => (
              <div key={h.n} style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, padding: '26px 24px' }}>
                <div style={{ fontFamily: font.serif, fontSize: 34, fontWeight: 700, color: c.green, marginBottom: 12 }}>{h.n}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{h.t}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.55, color: c.body, textWrap: 'pretty' }}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* eksempelsaker (dark) */}
        <div className="mh-pad" style={{ background: c.greenDeep, padding: '60px 56px', color: c.cream }}>
          <div
            className="mh-wrap-sm"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, gap: 12 }}
          >
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px' }}>Saker som lignet på din</h2>
            <span style={{ fontSize: 13, color: c.sage, fontWeight: 500 }}>Anonymiserte saker fra pilotperioden. Utfall varierer.</span>
          </div>
          <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {eksempler.map((e) => (
              <div
                key={e.tag}
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,239,226,.16)', borderRadius: 14, padding: 24 }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  <span style={{ background: 'rgba(245,239,226,.12)', borderRadius: 99, padding: '4px 11px', fontSize: 12, fontWeight: 700 }}>
                    {e.tag}
                  </span>
                  <span style={{ color: c.sage, fontSize: 12, fontWeight: 600, padding: '4px 0' }}>{e.sted}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: font.serif,
                      fontSize: 19,
                      color: c.fadedSand,
                      textDecoration: 'line-through',
                      textDecorationColor: 'rgba(214,73,31,.75)',
                      textDecorationThickness: '2px',
                    }}
                  >
                    {e.fra}
                  </span>
                  <span style={{ color: c.sage, fontSize: 15 }}>→</span>
                  <span style={{ fontFamily: font.serif, fontSize: 28, fontWeight: 700 }}>{e.til}</span>
                </div>
                <div style={{ display: 'inline-block', background: c.green, color: c.dfGreen, fontSize: 12.5, fontWeight: 700, borderRadius: 6, padding: '3px 9px', marginBottom: 16 }}>
                  {e.diff}
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: c.paleGreen, borderTop: '1px solid rgba(245,239,226,.14)', paddingTop: 12 }}>
                  <span style={{ fontWeight: 700, color: c.cream }}>Flagget:</span> {e.flagget}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* hva vi ser etter */}
        <div className="mh-pad" style={{ padding: '64px 56px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px' }}>
            Vi leser det med liten skrift. Ordrett.
          </h2>
          <p style={{ margin: '0 0 30px', color: c.body, fontSize: 16, maxWidth: 640 }}>
            Hvert funn peker på et konkret punkt i dine egne vilkår — ikke på generelle råd. Dette er de vanligste grepene vi
            fanger opp:
          </p>
          <div className="mh-collapse-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
            {serEtter.map((s) => (
              <div
                key={s.ref + s.t}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 11,
                  padding: '15px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: c.orange, flex: 'none' }} />
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{s.t}</span>
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: c.green, background: c.greenTint, borderRadius: 6, padding: '3px 9px', whiteSpace: 'nowrap' }}
                >
                  {s.ref}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* pris */}
        <div className="mh-pad" style={{ padding: '8px 56px 64px' }} id="pris">
          <h2 style={{ margin: '0 0 28px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px' }}>Pris</h2>
          <div className="mh-collapse-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 860 }}>
            <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Gratis sjekk</div>
              <div style={{ fontFamily: font.serif, fontSize: 40, fontWeight: 700, marginBottom: 14 }}>0 kr</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14.5, color: c.body, lineHeight: 1.45 }}>
                <div>Svar på om tilbudet ser lavt ut</div>
                <div>Antall avvik vi fant</div>
                <div>Estimert differanse</div>
              </div>
            </div>
            <div style={{ background: c.white, border: `2px solid ${c.green}`, borderRadius: 16, padding: 28, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 24,
                  background: c.green,
                  color: '#fff',
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '.06em',
                  borderRadius: 6,
                  padding: '4px 10px',
                }}
              >
                NÅR DU VIL KLAGE
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Full analyse + klagebrev</div>
              <div style={{ fontFamily: font.serif, fontSize: 40, fontWeight: 700, marginBottom: 14 }}>349 kr</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14.5, color: c.body, lineHeight: 1.45 }}>
                <div>Alle avvik, med referanse til vilkårspunkt og side</div>
                <div>Ferdig klagebrev — klart til å sendes</div>
                <div>Plan for veien videre, med frister</div>
                <div>Avslag? Vi fyller ut Finansklagenemnda-skjemaet gratis</div>
              </div>
              <Link
                to="/kom-i-gang"
                className="btn btn-green"
                style={{ display: 'block', marginTop: 18, padding: 12, borderRadius: 10, fontSize: 15, boxShadow: 'none' }}
              >
                Start med gratis sjekk
              </Link>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: c.muted }}>
            Ingen abonnement. Du betaler kun når du velger å klage.
          </div>
        </div>

        {/* faq */}
        <div className="mh-pad" style={{ padding: '0 56px 64px' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Vanlige spørsmål</h2>
          <div className="mh-collapse-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 40px' }}>
            {faq.map((f) => (
              <div key={f.q} style={{ borderTop: `1px solid ${c.border}`, paddingTop: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 6 }}>{f.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: c.body, textWrap: 'pretty' }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* slutt-CTA */}
        <div style={{ background: c.green, padding: 56, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontFamily: font.serif, fontSize: 38, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 20 }}>
            {copy.ctaEnd}
          </div>
          <Link to="/kom-i-gang" className="btn btn-paper" style={{ padding: '15px 30px', fontWeight: 800, fontSize: 16 }}>
            {copy.heroCta}
          </Link>
        </div>

        <SiteFooter />
      </div>
    </div>
  )
}

function MockFlag({ color, bg, border, text, sref }: { color: string; bg: string; border: string; text: string; sref: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 9,
        padding: '9px 12px',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{text}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color, background: '#fff', borderRadius: 5, padding: '2px 7px' }}>{sref}</span>
    </div>
  )
}
