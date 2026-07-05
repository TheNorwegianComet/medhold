import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { c, font } from '../theme'
import { Logo } from '../components/Logo'

// Norwegian currency formatting matching the prototype's fmt().
// Exported for unit tests.
export function fmt(n: number): string {
  const sign = n < 0 ? '−' : ''
  return sign + Math.abs(n).toLocaleString('nb-NO').replace(/[  ]/g, ' ') + ' kr'
}

type IncKey = 'm' | 'r' | 'f'
type Tone = 'hoflig' | 'bestemt'
type PayMetode = 'vipps' | 'kort'

const GREEN = c.green
const TINT = c.greenTint
const BORDER = c.border
const MUTED = c.muted2

const stepNames = ['Last opp', 'Gratis sjekk', 'Full analyse', 'Klagebrev', 'Veien videre']

type Post = {
  key?: IncKey
  name: string
  ok?: boolean
  warn?: boolean
  chip?: string
  tilbud: number
  bor: number
  ref?: string
  reason: string
}

export const basePosts: Post[] = [
  { name: 'Rørlegger og sanitærutstyr', ok: true, tilbud: 22000, bor: 22000, reason: 'I tråd med takstrapporten.' },
  { name: 'Maling og overflater', ok: true, tilbud: 10000, bor: 10000, reason: 'I tråd med takstrapporten.' },
  {
    key: 'm',
    name: 'Membran og flislegging',
    chip: 'UNDERPRISET',
    warn: true,
    tilbud: 46000,
    bor: 61000,
    ref: '§ 5.2 · s. 14',
    reason:
      'Vilkårene dekker «nødvendige kostnader til reparasjon». Håndverkertilbudet ditt dokumenterer 61 000 kr.',
  },
  {
    key: 'r',
    name: 'Riving og avfallshåndtering',
    chip: 'UTELATT',
    tilbud: 0,
    bor: 18500,
    ref: '§ 5.1 · s. 13',
    reason: 'Nødvendig del av reparasjonen — mangler helt i tilbudet.',
  },
  {
    key: 'f',
    name: 'Aldersfradrag våtrom',
    chip: 'FEIL SATS',
    tilbud: -18000,
    bor: -12200,
    ref: '§ 6.3 · s. 17',
    reason:
      'Selskapet trekker 30 %. Badet er fra 2019 — vilkårene tillater maks 20 % for våtrom under 10 år.',
  },
]

export const deltas: Record<IncKey, number> = { m: 15000, r: 18500, f: 5800 }

const selskapNames = ['Gjensidige', 'If', 'Tryg', 'Fremtind', 'Annet']
const skadetypeNames = ['Vannskade', 'Innbrudd', 'Bilskade', 'Reise', 'Bygning']

export function Prototype() {
  // Deep-linkable step (/sak?steg=3 opens the klagebrev) — clamped to 0–4.
  const [searchParams] = useSearchParams()
  const initialStep = Math.min(4, Math.max(0, Number(searchParams.get('steg')) || 0))
  const [step, setStep] = useState(initialStep)
  const [pay, setPay] = useState(false)
  const [payMetode, setPayMetode] = useState<PayMetode>('vipps')
  const [inc, setInc] = useState<Record<IncKey, boolean>>({ m: true, r: true, f: true })
  const [tone, setTone] = useState<Tone>('bestemt')
  const [selskap, setSelskap] = useState('Gjensidige')
  const [skadetype, setSkadetype] = useState('Vannskade')

  const goStep = (i: number) => {
    setStep(i)
    setPay(false)
  }

  const krav = (Object.keys(deltas) as IncKey[]).reduce((sum, k) => sum + (inc[k] ? deltas[k] : 0), 0)
  const estimat = 60000 + krav
  const nInc = Object.values(inc).filter(Boolean).length
  const kravChip = '+ ' + fmt(krav).replace('−', '')
  const estPct = Math.round((estimat / 99300) * 100) + '%'

  return (
    <div className="mh-app">
      <div className="mh-page">
        {/* app topbar */}
        <div
          className="mh-pad"
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
              className="mh-hide-sm"
              style={{ marginLeft: 14, fontSize: 13, color: c.muted, fontWeight: 600, borderLeft: `1px solid ${c.border}`, paddingLeft: 14 }}
            >
              Sak 2417 · Vannskade bad · Gjensidige
            </span>
          </div>
          <Link to="/mine-saker" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.body }}>Kari Holm</span>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: c.greenTint, color: c.green, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>
              KH
            </div>
          </Link>
        </div>

        {/* stepper */}
        <div
          className="mh-pad mh-wrap-sm"
          style={{ display: 'flex', gap: 8, padding: '16px 32px', background: c.white, borderBottom: `1px solid ${c.border}` }}
        >
          {stepNames.map((label, i) => {
            const active = i === step
            const done = i < step
            return (
              <div
                key={label}
                onClick={() => goStep(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px 8px 9px',
                  borderRadius: 99,
                  cursor: 'pointer',
                  background: active ? GREEN : done ? TINT : '#fff',
                  border: `1.5px solid ${active ? GREEN : done ? c.greenTintBorder : BORDER}`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11.5,
                    fontWeight: 800,
                    background: active ? 'rgba(255,255,255,.2)' : done ? GREEN : c.paperAlt,
                    color: active ? '#fff' : done ? '#fff' : c.muted,
                  }}
                >
                  {done ? '✓' : String(i + 1)}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: active ? '#fff' : done ? GREEN : MUTED }}>{label}</span>
              </div>
            )
          })}
        </div>

        <div style={{ minHeight: 780 }}>
          {step === 0 && (
            <StepUpload
              selskap={selskap}
              setSelskap={setSelskap}
              skadetype={skadetype}
              setSkadetype={setSkadetype}
              onNext={() => goStep(1)}
            />
          )}
          {step === 1 && !pay && <StepGratisSjekk onUnlock={() => setPay(true)} />}
          {step === 1 && pay && (
            <StepBetaling
              payMetode={payMetode}
              setPayMetode={setPayMetode}
              onPay={() => goStep(2)}
              onBack={() => setPay(false)}
            />
          )}
          {step === 2 && (
            <StepAnalyse inc={inc} setInc={setInc} estimat={estimat} kravChip={kravChip} estPct={estPct} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <StepKlagebrev
              inc={inc}
              tone={tone}
              setTone={setTone}
              estimat={estimat}
              krav={krav}
              kravChip={kravChip}
              onSent={() => setStep(4)}
            />
          )}
          {step === 4 && <StepVeienVidere nInc={nInc} onBack={() => setStep(2)} />}
        </div>
      </div>
    </div>
  )
}

// ---------- Shared chip ----------
function ChipRow({
  items,
  selected,
  onSelect,
  variant = 'dark',
}: {
  items: string[]
  selected: string
  onSelect: (t: string) => void
  variant?: 'dark' | 'green'
}) {
  return (
    <div className="mh-wrap-sm" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((t) => {
        const sel = selected === t
        const selBg = variant === 'dark' ? c.greenDeep : GREEN
        return (
          <div
            key={t}
            onClick={() => onSelect(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 99,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              background: sel ? selBg : '#fff',
              color: sel ? c.cream : c.body,
              border: `1.5px solid ${sel ? selBg : BORDER}`,
            }}
          >
            {t}
          </div>
        )
      })}
    </div>
  )
}

// ---------- STEG 1: LAST OPP ----------
function StepUpload({
  selskap,
  setSelskap,
  skadetype,
  setSkadetype,
  onNext,
}: {
  selskap: string
  setSelskap: (t: string) => void
  skadetype: string
  setSkadetype: (t: string) => void
  onNext: () => void
}) {
  return (
    <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28, padding: '36px 32px' }}>
      <div>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px' }}>Last opp dokumentene</h2>
        <p style={{ margin: '0 0 24px', color: c.body, fontSize: 15 }}>Jo mer vi ser, jo sterkere blir saken din.</p>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: c.muted, letterSpacing: '.05em', marginBottom: 8 }}>SELSKAP</div>
        <div style={{ marginBottom: 20 }}>
          <ChipRow items={selskapNames} selected={selskap} onSelect={setSelskap} />
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: c.muted, letterSpacing: '.05em', marginBottom: 8 }}>SKADETYPE</div>
        <div style={{ marginBottom: 26 }}>
          <ChipRow items={skadetypeNames} selected={skadetype} onSelect={setSkadetype} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DocCard title="Tilbudet fra selskapet" file="Oppgjørstilbud-Gjensidige-2417.pdf · 2 sider" />
          <DocCard title="Skademeldingen din" file="Skademelding-vannskade-bad.pdf" />
          <DocCard
            title={
              <>
                Takstrapport eller håndverkertilbud <span style={{ fontWeight: 500, color: c.muted }}>(anbefalt)</span>
              </>
            }
            file="Tilbud-BadRehab-AS.pdf · 61 000 kr"
          />
          <div
            className="tint-hover"
            style={{ border: `1.5px dashed ${c.borderDash}`, borderRadius: 13, padding: '16px 20px', color: c.muted, fontSize: 14, fontWeight: 600, textAlign: 'center', cursor: 'pointer' }}
          >
            + Dra inn flere dokumenter, eller hent fra e-post
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 26 }}>
          <div onClick={onNext} className="btn btn-green" style={{ padding: '14px 26px', fontSize: 15.5, cursor: 'pointer' }}>
            Start gratis sjekk →
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: c.greenTint, border: `1px solid ${c.greenTintBorder}`, borderRadius: 13, padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: c.greenDeep, marginBottom: 6 }}>Vilkårene? Vi har dem.</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: c.greenInk }}>
            Gjensidige <b>Bolig Pluss (2025)</b> ligger allerede i systemet — alle 34 sider. Du trenger ikke lete i innboksen.
          </div>
        </div>
        <InfoCard title="Dokumentene dine er trygge" body="Krypteres, deles aldri, og slettes automatisk etter 30 dager. Du kan slette dem selv når som helst." />
        <InfoCard
          title="Tips fra oppgjørssiden"
          body="Et håndverkertilbud er det sterkeste kortet ditt. Selskapets takst er et forhandlingsutspill — ikke en fasit."
        />
      </div>
    </div>
  )
}

function DocCard({ title, file }: { title: React.ReactNode; file: string }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 13, padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: c.body }}>
            <span style={{ width: 18, height: 18, borderRadius: 99, background: GREEN, color: '#fff', display: 'inline-grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>✓</span>
            {file}
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: c.muted, cursor: 'pointer', textDecoration: 'underline' }}>Fjern</span>
      </div>
    </div>
  )
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: c.body }}>{body}</div>
    </div>
  )
}

// ---------- STEG 2: GRATIS SJEKK ----------
const teaser = [
  { k: 'UTELATT POST', color: c.redInk, bg: c.redTint, blur: 'Riving og avfallshåndtering mangler' },
  { k: 'UNDERPRISET', color: c.amberInk, bg: c.amberTint, blur: 'Membran og flislegging for lavt' },
  { k: 'FEIL FRADRAG', color: c.redInk, bg: c.redTint, blur: 'Aldersfradrag over vilkårenes maks' },
]

function StepGratisSjekk({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 18, padding: 36, boxShadow: '0 20px 50px -30px rgba(33,29,21,.25)' }}>
        <div style={{ display: 'inline-block', background: c.greenTint, color: GREEN, fontSize: 11.5, fontWeight: 800, letterSpacing: '.07em', borderRadius: 6, padding: '5px 10px', marginBottom: 18 }}>
          GRATIS SJEKK · FERDIG PÅ 40 SEKUNDER
        </div>
        <h2 style={{ margin: '0 0 14px', fontFamily: font.serif, fontSize: 38, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Tilbudet ditt ser lavt ut.
        </h2>
        <p style={{ margin: '0 0 26px', fontSize: 16, lineHeight: 1.6, color: c.body, textWrap: 'pretty' }}>
          Vi fant <b>3 avvik</b> mellom tilbudet og vilkårene dine — trolig <b>36 000–43 000 kr</b> for lavt. Ett av avvikene
          gjelder en post som ikke er med i det hele tatt.
        </p>

        <div className="mh-collapse-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 26 }}>
          <div style={{ background: c.redTint, border: `1px solid ${c.redTintBorder}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.redInk, marginBottom: 4 }}>SELSKAPETS TILBUD</div>
            <div style={{ fontFamily: font.serif, fontSize: 30, fontWeight: 700, color: c.redInk }}>60 000 kr</div>
          </div>
          <div style={{ background: c.greenTint, border: `1px solid ${c.greenTintBorder}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 4 }}>VILKÅRENE TILSIER</div>
            <div style={{ fontFamily: font.serif, fontSize: 30, fontWeight: 700, color: GREEN }}>96 – 103 000 kr</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
          {teaser.map((t) => (
            <div key={t.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${c.border}`, borderRadius: 11, padding: '13px 16px', background: c.paper }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.05em', color: t.color, background: t.bg, borderRadius: 5, padding: '3px 8px' }}>{t.k}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, filter: 'blur(5px)', userSelect: 'none' }}>{t.blur}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.muted, border: `1px solid ${c.border}`, borderRadius: 6, padding: '3px 9px', background: '#fff' }}>Låst</span>
            </div>
          ))}
        </div>

        <div className="mh-wrap-sm" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div onClick={onUnlock} className="btn btn-green" style={{ padding: '14px 24px', fontSize: 15.5, cursor: 'pointer' }}>
            Lås opp full analyse · 349 kr
          </div>
          <span style={{ fontSize: 13, color: c.muted, fontWeight: 500 }}>Pengene tilbake hvis vi ikke finner noe å klage på.</span>
        </div>
      </div>
    </div>
  )
}

// ---------- STEG 2B: BETALING ----------
function StepBetaling({
  payMetode,
  setPayMetode,
  onPay,
  onBack,
}: {
  payMetode: PayMetode
  setPayMetode: (m: PayMetode) => void
  onPay: () => void
  onBack: () => void
}) {
  const payChips: { t: string; key: PayMetode }[] = [
    { t: 'Vipps', key: 'vipps' },
    { t: 'Bankkort', key: 'kort' },
  ]
  const payBtnTxt = payMetode === 'vipps' ? 'Betal 349 kr med Vipps' : 'Betal 349 kr med kort'
  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 18, padding: 34, boxShadow: '0 20px 50px -30px rgba(33,29,21,.25)' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Lås opp full analyse</h2>
        <p style={{ margin: '0 0 22px', fontSize: 14.5, color: c.body }}>Engangsbetaling. Ingen abonnement.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: c.paper, border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 18px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Full analyse + klagebrev</div>
            <div style={{ fontSize: 13, color: c.muted }}>Sak 2417 · Vannskade bad · Gjensidige</div>
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 24, fontWeight: 700 }}>349 kr</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: '16px 2px 22px', fontSize: 14, color: c.body }}>
          {[
            'Alle avvik med referanse til vilkårspunkt og side',
            'Ferdig klagebrev, klart til å sendes',
            'Frister og veien videre — helt til Finansklagenemnda',
            'Pengene tilbake hvis vi ikke finner noe å klage på',
          ].map((t) => (
            <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <span style={{ color: GREEN, fontWeight: 800 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: c.muted, letterSpacing: '.05em', marginBottom: 8 }}>BETAL MED</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {payChips.map((pc) => {
            const sel = payMetode === pc.key
            return (
              <div
                key={pc.key}
                onClick={() => setPayMetode(pc.key)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: sel ? c.greenDeep : '#fff',
                  color: sel ? c.cream : c.body,
                  border: `1.5px solid ${sel ? c.greenDeep : c.border}`,
                }}
              >
                {pc.t}
              </div>
            )
          })}
        </div>
        <div onClick={onPay} className="btn btn-green" style={{ display: 'block', padding: 15, borderRadius: 12, fontSize: 15.5, cursor: 'pointer' }}>
          {payBtnTxt}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span onClick={onBack} style={{ fontSize: 13, fontWeight: 600, color: c.muted, cursor: 'pointer', textDecoration: 'underline' }}>
            ← Tilbake til gratis-sjekken
          </span>
          <span style={{ fontSize: 12.5, color: c.muted }}>Kvittering på e-post · Sikker betaling</span>
        </div>
      </div>
    </div>
  )
}

// ---------- STEG 3: FULL ANALYSE ----------
function StepAnalyse({
  inc,
  setInc,
  estimat,
  kravChip,
  estPct,
  onNext,
}: {
  inc: Record<IncKey, boolean>
  setInc: React.Dispatch<React.SetStateAction<Record<IncKey, boolean>>>
  estimat: number
  kravChip: string
  estPct: string
  onNext: () => void
}) {
  return (
    <div style={{ padding: 32 }}>
      {/* subtle AI header (1f — the shipped default) */}
      <div className="mh-wrap-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px' }}>Full analyse · Vannskade bad</h2>
          <div style={{ fontSize: 13.5, color: c.body, fontWeight: 500 }}>
            Sammenlignet med Gjensidige Bolig Pluss (2025) og håndverkertilbudet ditt
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: c.muted, border: `1px solid ${c.border}`, background: '#fff', borderRadius: 99, padding: '5px 12px' }}>
          Analysert automatisk · kontroller referansene
        </span>
      </div>

      <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {basePosts.map((p) => {
            const flagged = !p.ok
            const key = p.key
            const inSel = flagged && key ? inc[key] : true
            const chipBg = p.ok ? TINT : p.warn ? c.amberTint : c.redTint
            const chipC = p.ok ? GREEN : p.warn ? c.amberInk : c.redInk
            const bc = !flagged ? BORDER : inSel ? (p.warn ? c.amberTintBorder : c.redTintBorder) : BORDER
            const tilbudTxt = p.tilbud === 0 ? 'ikke i tilbudet' : fmt(p.tilbud)
            const strike = flagged && p.tilbud !== 0
            return (
              <div
                key={p.name}
                onClick={flagged && key ? () => setInc((s) => ({ ...s, [key]: !s[key] })) : undefined}
                style={{
                  background: '#fff',
                  border: `1.5px solid ${bc}`,
                  borderRadius: 13,
                  padding: '16px 18px',
                  cursor: flagged ? 'pointer' : 'default',
                  opacity: inSel ? 1 : 0.45,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    {flagged ? (
                      <div style={{ width: 21, height: 21, flex: 'none', borderRadius: 6, border: `1.5px solid ${GREEN}`, background: inSel ? GREEN : '#fff', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>
                        {inSel ? '✓' : ''}
                      </div>
                    ) : (
                      <div style={{ width: 21, height: 21, flex: 'none', borderRadius: 99, background: c.greenTint, color: GREEN, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>✓</div>
                    )}
                    <span style={{ fontWeight: 700, fontSize: 15.5 }}>{p.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', color: chipC, background: chipBg, borderRadius: 5, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      {p.ok ? 'RIKTIG' : p.chip}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 14, color: c.muted, textDecoration: strike ? 'line-through' : 'none' }}>{tilbudTxt}</span>
                    <span style={{ fontSize: 13, color: c.faint }}>→</span>
                    <span style={{ fontFamily: font.serif, fontWeight: 700, fontSize: 16.5 }}>{fmt(p.bor)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 9, paddingLeft: 33 }}>
                  <span style={{ fontSize: 13.5, lineHeight: 1.5, color: c.body, textWrap: 'pretty' }}>{p.reason}</span>
                  {p.ref && (
                    <Link
                      to="/vilkar"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 12, fontWeight: 700, color: GREEN, background: c.greenTint, borderRadius: 6, padding: '3px 9px', whiteSpace: 'nowrap', flex: 'none', textDecoration: 'none' }}
                    >
                      Vilkår {p.ref}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
          <div style={{ fontSize: 13, color: c.muted, padding: '4px 2px' }}>
            Klikk på et avvik for å ta det ut av eller inn i klagen. Beløp og brev oppdateres.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: c.greenDeep, borderRadius: 15, padding: 24, color: c.cream }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', color: c.sage, marginBottom: 3 }}>SELSKAPETS TILBUD</div>
            <div style={{ fontFamily: font.serif, fontSize: 26, fontWeight: 600, color: c.fadedSand, marginBottom: 14 }}>60 000 kr</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', color: c.sage, marginBottom: 3 }}>ETTER FUNNENE DINE</div>
            <div style={{ fontFamily: font.serif, fontSize: 42, fontWeight: 700, lineHeight: 1, marginBottom: 12 }}>{fmt(estimat)}</div>
            <div style={{ display: 'inline-block', background: GREEN, border: '1px solid rgba(245,239,226,.25)', color: c.dfGreen, fontSize: 14, fontWeight: 800, borderRadius: 8, padding: '6px 12px', marginBottom: 18 }}>
              {kravChip}
            </div>
            <div style={{ height: 10, background: 'rgba(245,239,226,.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: estPct, background: c.mintBright, borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: c.sage, fontWeight: 600 }}>
              <span>Tilbud</span>
              <span>Vilkårenes nivå</span>
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 15, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>Referanser i vilkårene</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5, color: c.body }}>
              {[
                ['§ 5.1 Hva forsikringen dekker', 's. 13'],
                ['§ 5.2 Beregning av erstatning', 's. 14'],
                ['§ 6.3 Aldersfradrag våtrom', 's. 17'],
              ].map(([a, b]) => (
                <div key={a} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{a}</span>
                  <span style={{ fontWeight: 700, color: GREEN }}>{b}</span>
                </div>
              ))}
            </div>
            <Link to="/vilkar" style={{ display: 'inline-block', marginTop: 14, fontSize: 13, fontWeight: 700, color: GREEN, textDecoration: 'none' }}>
              Åpne vilkårene med funnene markert →
            </Link>
          </div>
          <div onClick={onNext} className="btn btn-green" style={{ display: 'block', padding: 15, borderRadius: 12, fontSize: 15.5, cursor: 'pointer' }}>
            Generer klagebrev →
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- STEG 4: KLAGEBREV ----------
function StepKlagebrev({
  inc,
  tone,
  setTone,
  estimat,
  krav,
  kravChip,
  onSent,
}: {
  inc: Record<IncKey, boolean>
  tone: Tone
  setTone: (t: Tone) => void
  estimat: number
  krav: number
  kravChip: string
  onSent: () => void
}) {
  const bestemt = tone === 'bestemt'
  const args: { text: string; ref?: string }[] = []
  if (inc.m)
    args.push({
      text: 'Tilbudet priser membran- og flisarbeid til 46 000 kr. Vedlagt håndverkertilbud fra BadRehab AS dokumenterer en reell kostnad på 61 000 kr. Vilkårene punkt 5.2 dekker «nødvendige kostnader til reparasjon», og jeg ber om at dokumentert pris legges til grunn.',
      ref: 'Vilkår § 5.2 · s. 14',
    })
  if (inc.r)
    args.push({
      text: 'Riving og avfallshåndtering er en nødvendig del av reparasjonen, men er ikke medtatt i tilbudet. Kostnaden er dokumentert til 18 500 kr i vedlagt tilbud, og jeg ber om at posten inkluderes, jf. vilkårene punkt 5.1.',
      ref: 'Vilkår § 5.1 · s. 13',
    })
  if (inc.f)
    args.push({
      text: 'Tilbudet legger til grunn 30 % aldersfradrag. Badet ble rehabilitert i 2019, og vilkårene punkt 6.3 setter maksimalt fradrag til 20 % for våtrom yngre enn 10 år. Jeg ber om at fradraget korrigeres.',
      ref: 'Vilkår § 6.3 · s. 17',
    })

  const intro = bestemt
    ? 'Jeg viser til deres oppgjørstilbud av 18. juni 2026 (sak 2417-VS) på 60 000 kr etter vannskade på bad. Tilbudet er vesentlig lavere enn det forsikringsvilkårene gir meg rett til, og jeg krever at oppgjøret vurderes på nytt. Avvikene er som følger:'
    : 'Jeg viser til deres oppgjørstilbud av 18. juni 2026 (sak 2417-VS) på 60 000 kr etter vannskade på bad. Etter en gjennomgang av forsikringsvilkårene mener jeg tilbudet ikke fullt ut dekker det jeg har krav på, og jeg ber derfor om en ny vurdering av følgende punkter:'
  const kravPara =
    krav > 0
      ? 'Samlet ber jeg om et korrigert oppgjør på ' + fmt(estimat) + ' — ' + fmt(krav) + ' mer enn tilbudet. Beregningen er dokumentert i vedleggene.'
      : 'Velg minst ett avvik i analysen for å bygge kravet.'
  const closing = bestemt
    ? 'Jeg ber om skriftlig svar innen tre uker. Dersom kravet ikke imøtekommes, vil saken bli brakt inn for Finansklagenemnda.'
    : 'Jeg ser frem til deres svar, og håper vi finner en god løsning. Skulle vi ikke gjøre det, vil jeg vurdere å legge saken frem for Finansklagenemnda.'
  const letterParas = [{ text: intro }, ...args, { text: kravPara }, { text: closing }]

  const toneChips: { t: string; key: Tone }[] = [
    { t: 'Høflig', key: 'hoflig' },
    { t: 'Bestemt', key: 'bestemt' },
  ]
  const argListe: { k: IncKey; t: string; sum: string }[] = [
    { k: 'm', t: 'Membran og flis', sum: '+ 15 000 kr' },
    { k: 'r', t: 'Riving og avfall', sum: '+ 18 500 kr' },
    { k: 'f', t: 'Aldersfradrag', sum: '+ 5 800 kr' },
  ]

  return (
    <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 28, padding: 32 }}>
      <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 6, boxShadow: '0 20px 50px -30px rgba(33,29,21,.3)', padding: '52px 56px', fontFamily: font.serif }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: c.body, marginBottom: 36, fontFamily: font.sans }}>
          <div>
            Kari Holm
            <br />
            Bekkefaret 12, 0283 Oslo
          </div>
          <div style={{ textAlign: 'right' }}>
            Gjensidige Forsikring ASA
            <br />
            Oppgjørsavdelingen · Sak 2417-VS
            <br />
            5. juli 2026
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 22 }}>
          Klage på oppgjørstilbud – vannskade bad – krav om nytt oppgjør
        </div>
        {letterParas.map((lp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, textWrap: 'pretty' }}>{lp.text}</p>
            {lp.ref && (
              <span style={{ display: 'inline-block', marginTop: 6, fontFamily: font.sans, fontSize: 11.5, fontWeight: 700, color: GREEN, background: c.greenTint, borderRadius: 5, padding: '3px 9px' }}>
                {lp.ref}
              </span>
            )}
          </div>
        ))}
        <div style={{ fontSize: 15, lineHeight: 1.75, marginTop: 26 }}>
          Med hilsen
          <br />
          <span style={{ fontStyle: 'italic', fontSize: 19 }}>Kari Holm</span>
        </div>
        <div style={{ marginTop: 26, paddingTop: 14, borderTop: `1px solid ${c.border}`, fontFamily: font.sans, fontSize: 12.5, color: c.muted }}>
          Vedlegg: Håndverkertilbud BadRehab AS · Takstrapport · Skademelding
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Tonefall</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {toneChips.map((t) => {
              const sel = tone === t.key
              return (
                <div
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  style={{ flex: 1, textAlign: 'center', padding: 9, borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', background: sel ? GREEN : '#fff', color: sel ? '#fff' : c.body, border: `1.5px solid ${sel ? GREEN : c.border}` }}
                >
                  {t.t}
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: 12.5, color: c.muted, marginTop: 10, lineHeight: 1.5 }}>
            Begge er saklige. «Bestemt» varsler Finansklagenemnda allerede nå.
          </div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Argumenter i brevet</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {argListe.map((a) => {
              const on = inc[a.k]
              return (
                <div key={a.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13.5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: on ? c.ink : c.faint }}>
                    <span style={{ fontWeight: 800 }}>{on ? '✓' : '—'}</span>
                    {a.t}
                  </span>
                  <span style={{ fontWeight: 700, color: on ? c.ink : c.faint }}>{on ? a.sum : 'utelatt'}</span>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${c.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800 }}>
            <span>Samlet krav</span>
            <span style={{ color: GREEN }}>{kravChip}</span>
          </div>
        </div>
        <div style={{ background: c.greenTint, border: `1px solid ${c.greenTintBorder}`, borderRadius: 13, padding: '16px 18px', fontSize: 13.5, lineHeight: 1.55, color: c.greenInk }}>
          <b>Hver referanse peker på et faktisk avsnitt</b> i vilkårene dine — selskapet kan slå det opp. Det er det som gjør
          brevet vanskelig å avvise.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="btn btn-ghost" style={{ flex: 1, padding: 12, fontSize: 14, cursor: 'pointer' }}>
            Last ned PDF
          </div>
          <div className="btn btn-ghost" style={{ flex: 1, padding: 12, fontSize: 14, cursor: 'pointer' }}>
            Kopier tekst
          </div>
        </div>
        <div onClick={onSent} className="btn btn-green" style={{ display: 'block', padding: 15, borderRadius: 12, fontSize: 15.5, cursor: 'pointer' }}>
          Merk som sendt →
        </div>
      </div>
    </div>
  )
}

// ---------- STEG 5: VEIEN VIDERE ----------
function StepVeienVidere({ nInc, onBack }: { nInc: number; onBack: () => void }) {
  const tidslinje = [
    { t: 'Klage sendt til Gjensidige', tag: 'I DAG', d: `Brevet ditt dokumenterer ${nInc} avvik med referanser til vilkårspunkt og side.`, state: 'done', line: true },
    { t: 'Selskapet svarer', tag: 'VENTER · FRIST 26. JULI', d: 'Normalt innen 2–4 uker. Hører du ikke noe, purrer vi for deg — automatisk.', state: 'active', line: true },
    { t: 'Hvis tilbudet ikke endres: Finansklagenemnda', tag: 'GRATIS', d: 'Uavhengig klageordning. Vi fyller ut skjemaet med saken din — dokumenter, avvik og referanser følger med.', state: 'wait', line: true },
    { t: 'Utbetaling', tag: 'MÅLET', d: 'Får du medhold, betaler selskapet differansen — ofte med forsinkelsesrente.', state: 'wait', line: false },
  ] as const

  return (
    <div className="mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28, padding: '36px 32px', maxWidth: 1100 }}>
      <div>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px' }}>Klagen er sendt. Nå venter vi — sammen.</h2>
        <p style={{ margin: '0 0 30px', color: c.body, fontSize: 15 }}>Du trenger ikke følge med selv. Vi passer på fristene.</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tidslinje.map((t) => {
            const mark = t.state === 'done' ? '✓' : t.state === 'active' ? '●' : ''
            const dbg = t.state === 'done' ? GREEN : t.state === 'active' ? '#fff' : c.paperAlt
            const dc = t.state === 'done' ? '#fff' : t.state === 'active' ? c.orange : c.faint
            const dbc = t.state === 'done' ? GREEN : t.state === 'active' ? c.orange : c.border2
            const tagBg = t.state === 'done' ? TINT : t.state === 'active' ? c.redTint : c.paperAlt
            const tagC = t.state === 'done' ? GREEN : t.state === 'active' ? c.redInk : c.muted
            return (
              <div key={t.t} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 99, flex: 'none', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, background: dbg, color: dc, border: `1.5px solid ${dbc}` }}>
                    {mark}
                  </div>
                  {t.line && <div style={{ width: 2, flex: 1, background: c.border2, margin: '4px 0' }} />}
                </div>
                <div style={{ paddingBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>{t.t}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: tagC, background: tagBg, borderRadius: 5, padding: '3px 8px' }}>{t.tag}</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: c.body, maxWidth: 520, textWrap: 'pretty' }}>{t.d}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Visste du?</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: c.body }}>
            Selskapet plikter å begrunne et avslag skriftlig. Svaret deres blir neste dokument du laster opp — vi leser det for
            deg og foreslår neste trekk.
          </div>
        </div>
        <div style={{ background: c.greenDeep, borderRadius: 13, padding: 20, color: c.cream }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: c.mint }}>Hvis det ender i Finansklagenemnda</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: c.paleGreen }}>
            Behandlingen er gratis. Vi gjenbruker hele saken din — dokumenter, avvik og referanser — rett inn i nemndas skjema.
            Du starter aldri på nytt.
          </div>
          <Link to="/finansklagenemnda" style={{ display: 'inline-block', marginTop: 12, fontSize: 13.5, fontWeight: 700, color: c.mint, textDecoration: 'none' }}>
            Se det utfylte skjemaet →
          </Link>
        </div>
        <div onClick={onBack} className="btn btn-ghost" style={{ textAlign: 'center', padding: 12, fontSize: 14, cursor: 'pointer' }}>
          ← Tilbake til analysen
        </div>
      </div>
    </div>
  )
}
