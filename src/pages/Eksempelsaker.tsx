import { Link } from 'react-router-dom'
import { c, font } from '../theme'
import { SiteNav } from '../components/SiteNav'

type Sak = {
  tag: string
  sted: string
  fra: string
  til: string
  diff: string
  flagget: string
}

const saker: Sak[] = [
  {
    tag: 'Vannskade bad',
    sted: 'Oslo',
    fra: '84 000 kr',
    til: '152 000 kr',
    diff: '+ 68 000 kr etter klage',
    flagget: 'utelatt riving, underpriset membranarbeid, feil aldersfradrag, utelatt nedvask.',
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
  {
    tag: 'Reiseforsikring',
    sted: 'Stavanger',
    fra: '9 800 kr',
    til: '23 400 kr',
    diff: '+ 13 600 kr etter klage',
    flagget: 'avbruddsdager feilberegnet, medisinske utlegg utelatt (§ 9.2).',
  },
  {
    tag: 'Storm · takskade',
    sted: 'Kristiansand',
    fra: '210 000 kr',
    til: '268 000 kr',
    diff: '+ 58 000 kr etter klage',
    flagget: 'følgeskade på loft utelatt, prisnivå fra 2022 lagt til grunn (§ 5.2).',
  },
  {
    tag: 'Vannskade kjøkken',
    sted: 'Bærum',
    fra: '41 000 kr',
    til: '66 500 kr',
    diff: '+ 25 500 kr etter klage',
    flagget: 'utelatt riving, egenandel trukket to ganger (§ 7).',
  },
]

const filtre = ['Vannskade', 'Innbrudd', 'Bilskade', 'Reise', 'Bygning']

function SakCard({ sak }: { sak: Sak }) {
  return (
    <div
      style={{
        background: c.white,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span
          style={{
            background: c.greenTint,
            color: c.green,
            borderRadius: 99,
            padding: '4px 11px',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {sak.tag}
        </span>
        <span style={{ color: c.muted, fontSize: 12, fontWeight: 600, padding: '4px 0' }}>{sak.sted}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <span
          style={{
            fontFamily: font.serif,
            fontSize: 18,
            color: c.muted,
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(214,73,31,.75)',
            textDecorationThickness: '2px',
          }}
        >
          {sak.fra}
        </span>
        <span style={{ color: c.muted, fontSize: 14 }}>→</span>
        <span style={{ fontFamily: font.serif, fontSize: 26, fontWeight: 700 }}>{sak.til}</span>
      </div>
      <div
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          background: c.green,
          color: c.dfGreen,
          fontSize: 12.5,
          fontWeight: 700,
          borderRadius: 6,
          padding: '3px 9px',
          marginBottom: 14,
        }}
      >
        {sak.diff}
      </div>
      <div
        style={{
          fontSize: 13.5,
          lineHeight: 1.55,
          color: c.body,
          borderTop: `1px solid ${c.border}`,
          paddingTop: 12,
          flex: 1,
        }}
      >
        <b style={{ color: c.ink }}>Flagget:</b> {sak.flagget}
      </div>
      <Link
        to="/eksempelsak"
        style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: c.green, textDecoration: 'none' }}
      >
        Les hele saken →
      </Link>
    </div>
  )
}

export function Eksempelsaker() {
  return (
    <div className="mh-app">
      <div className="mh-page">
        <div style={{ background: c.paper, color: c.ink }}>
          <SiteNav active="cases" />
          <div className="mh-pad" style={{ padding: '48px 56px 20px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 38, fontWeight: 800, letterSpacing: '-1px' }}>
              Saker som lignet på din
            </h2>
            <p style={{ margin: '0 0 24px', color: c.body, fontSize: 16, maxWidth: 620, textWrap: 'pretty' }}>
              Anonymiserte saker fra pilotperioden. Alle tall er faktiske tilbud og faktiske utfall — men hver sak er
              sin egen, og utfall varierer.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: 99,
                  fontSize: 13.5,
                  fontWeight: 700,
                  background: c.greenDeep,
                  color: c.cream,
                  border: `1.5px solid ${c.greenDeep}`,
                }}
              >
                Alle
              </span>
              {filtre.map((f) => (
                <span
                  key={f}
                  className="pill-hover"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 99,
                    fontSize: 13.5,
                    fontWeight: 700,
                    background: c.white,
                    color: c.body,
                    border: `1.5px solid ${c.border}`,
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
            <div
              className="mh-collapse"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}
            >
              {saker.map((sak) => (
                <SakCard key={sak.tag} sak={sak} />
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: c.muted, margin: '18px 0 40px' }}>
              Beløp er avrundet og detaljer endret for å bevare anonymitet. Ingen sak er en garanti for utfallet i
              din.
            </div>
          </div>
          <div
            className="mh-pad mh-wrap-sm"
            style={{
              background: c.greenDeep,
              padding: '36px 56px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: c.cream,
            }}
          >
            <div style={{ fontFamily: font.serif, fontSize: 24, fontWeight: 700 }}>Lurer du på om din sak ligner?</div>
            <Link
              to="/kom-i-gang"
              className="btn btn-paper"
              style={{ padding: '13px 24px', borderRadius: 11, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}
            >
              Sjekk oppgjøret gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
