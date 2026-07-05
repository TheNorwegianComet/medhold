import { useState } from 'react'
import { c, font } from '../theme'

type LogType = 'failover' | 'ok' | 'info'
type LogEntry = { tid: string; txt: string; type: LogType }

const provDefs = [
  { id: 'anthropic', name: 'Anthropic', region: 'USA · DPA + SCC', models: ['Claude Sonnet 4.5', 'Claude Haiku 4.5'], lat: '1,2 s', cost: '3 940 kr', key: '••••8f2b' },
  { id: 'openai', name: 'OpenAI', region: 'USA · DPA + SCC', models: ['GPT-5.2'], lat: '1,6 s', cost: '1 210 kr', key: '••••c41a' },
  { id: 'google', name: 'Google Vertex AI', region: 'EU · europe-west4', models: ['Gemini 3 Pro', 'Gemini 3 Flash'], lat: '1,4 s', cost: '860 kr', key: '••••77e0' },
  { id: 'mistral', name: 'Mistral', region: 'EU · Paris', models: ['Mistral Large 3'], lat: '1,1 s', cost: '470 kr', key: '••••2d9c' },
] as const

const provOf: Record<string, string> = {}
provDefs.forEach((p) => p.models.forEach((m) => (provOf[m] = p.id)))

const taskDefs = [
  { name: 'Vilkårsanalyse', desc: 'Lange dokumenter · høy presisjon', chain: ['Claude Sonnet 4.5', 'GPT-5.2', 'Gemini 3 Pro'] },
  { name: 'Gratis sjekk', desc: 'Rask triage · lav kost', chain: ['Claude Haiku 4.5', 'Gemini 3 Flash', 'Mistral Large 3'] },
  { name: 'Klagebrev', desc: 'Norsk språk · formell tone', chain: ['Claude Sonnet 4.5', 'Gemini 3 Pro', 'GPT-5.2'] },
  { name: 'Spørsmål i analysen', desc: 'Chat · korte svar', chain: ['Claude Haiku 4.5', 'Mistral Large 3', 'Gemini 3 Flash'] },
] as const

const defaultLogg: LogEntry[] = [
  { tid: '28. jun · 14:02', txt: 'OpenAI svarte 429 (rate limit) i 18 minutter — Vilkårsanalyse rutet automatisk til neste modell i kjeden. 41 analyser gikk som normalt.', type: 'failover' },
  { tid: '12. jun · 09:44', txt: 'Gemini 3 Flash over latens-terskelen (20 s) — Gratis sjekk rutet til Mistral Large 3 i 32 minutter.', type: 'failover' },
  { tid: '2. jun · 16:10', txt: 'Claude Haiku 4.5 satt som ny primær for Gratis sjekk. Kjeden ellers uendret.', type: 'info' },
]

const kpis = [
  { label: 'TILGJENGELIGHET 30 D', value: '99,97 %', color: c.green },
  { label: 'FAILOVER-HENDELSER 30 D', value: '3' },
  { label: 'ANALYSER I DAG', value: '214' },
  { label: 'LLM-KOST JULI', value: '6 480 kr' },
]

const failoverRules: [string, string][] = [
  ['Bytt ved timeout over', '20 sek'],
  ['Bytt ved feilrate over', '5 % / 2 min'],
  ['Nye forsøk før bytte', '2 · backoff'],
  ['Tilbake til primær etter', '10 min friske sjekker'],
  ['Varsling ved failover', 'E-post + Slack'],
]

export function Admin() {
  const [adminDown, setAdminDown] = useState<Record<string, boolean>>({})
  const [adminLogg, setAdminLogg] = useState<LogEntry[]>([])

  const isDown = (m: string) => !!adminDown[provOf[m]]

  const toggle = (p: (typeof provDefs)[number]) => {
    const nowDown = !adminDown[p.id]
    const entry: LogEntry = nowDown
      ? { tid: 'Nå nettopp', txt: `${p.name} markert nede (simulering). Oppgaver med ${p.models.join(' / ')} i kjeden hopper over dem automatisk.`, type: 'failover' }
      : { tid: 'Nå nettopp', txt: `${p.name} frisk igjen etter helsesjekk — trafikken går tilbake til primær rekkefølge.`, type: 'ok' }
    setAdminDown((s) => ({ ...s, [p.id]: nowDown }))
    setAdminLogg((l) => [entry, ...l])
  }

  let omrutet = 0
  const tasks = taskDefs.map((t) => {
    const firstUp = t.chain.find((m) => !isDown(m))
    if (firstUp && firstUp !== t.chain[0]) omrutet++
    const alleNede = !firstUp
    return {
      name: t.name,
      desc: t.desc,
      nowTxt: alleNede ? 'Ingen modeller oppe!' : firstUp!,
      nowC: alleNede ? c.orange : firstUp !== t.chain[0] ? c.redInk : c.green,
      chips: t.chain.map((m, i) => {
        const down = isDown(m)
        const aktiv = m === firstUp
        return {
          t: m,
          arrow: i < t.chain.length - 1,
          tag: down ? 'NEDE' : aktiv ? 'AKTIV' : 'STANDBY',
          bg: aktiv ? c.green : down ? c.redTint : '#fff',
          c: aktiv ? '#fff' : down ? c.redInk : c.body,
          bc: aktiv ? c.green : down ? c.redTintBorder : c.border,
          deco: down ? 'line-through' : 'none',
          tagBg: aktiv ? 'rgba(255,255,255,.2)' : down ? '#fff' : c.paperAlt,
          tagC: aktiv ? c.dfGreen : down ? c.redInk : c.muted,
        }
      }),
    }
  })

  const nedeCount = Object.values(adminDown).filter(Boolean).length
  const bannerTxt =
    nedeCount +
    (nedeCount === 1 ? ' leverandør' : ' leverandører') +
    ' nede — ' +
    omrutet +
    (omrutet === 1 ? ' oppgave er' : ' oppgaver er') +
    ' rutet om automatisk. Brukerne merker ingenting.'

  const logg: (LogEntry & { dot: string })[] = [...adminLogg, ...defaultLogg].map((l) => ({
    ...l,
    dot: l.type === 'failover' ? c.orange : l.type === 'ok' ? c.green : c.faint,
  }))

  return (
    <div className="mh-app">
      <div className="mh-page" style={{ background: '#FAF6EE', color: '#211D15' }}>
        {/* topbar */}
        <div
          className="mh-pad"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', background: c.greenDeep, color: c.cream }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, background: c.cream, borderRadius: 6, display: 'grid', placeItems: 'center', color: c.greenDeep, fontFamily: font.serif, fontWeight: 700, fontSize: 14 }}>M</div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Medhold</span>
            <span style={{ background: c.orange, color: '#fff', fontSize: 10.5, fontWeight: 800, letterSpacing: '.07em', borderRadius: 5, padding: '3px 8px', marginLeft: 2 }}>ADMIN</span>
            <div className="mh-hide-sm" style={{ display: 'flex', gap: 20, marginLeft: 26, fontSize: 13.5, fontWeight: 600, color: c.sage }}>
              <span style={{ cursor: 'pointer' }}>Oversikt</span>
              <span style={{ color: '#fff', borderBottom: `2px solid ${c.mintBright}`, paddingBottom: 2 }}>Modeller og ruting</span>
              <span style={{ cursor: 'pointer' }}>Saker</span>
              <span style={{ cursor: 'pointer' }}>Team</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mh-hide-sm" style={{ fontSize: 13, fontWeight: 600, color: c.sage }}>eier@medhold.no</span>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: c.green, color: c.dfGreen, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>E</div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mh-pad mh-collapse-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, padding: '22px 32px 0' }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ background: '#fff', border: '1px solid #E8E1D2', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: c.muted, letterSpacing: '.05em', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontFamily: font.serif, fontSize: 26, fontWeight: 700, color: k.color ?? c.ink }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* failover banner */}
        {nedeCount > 0 && (
          <div className="mh-pad" style={{ margin: '16px 32px 0', background: c.redTint, border: `1.5px solid ${c.orange}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: c.orange, flex: 'none' }} />
            <span style={{ fontSize: 14.5, fontWeight: 700, color: c.redInk }}>{bannerTxt}</span>
          </div>
        )}

        {/* leverandører */}
        <div className="mh-pad" style={{ padding: '26px 32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px' }}>Leverandører</h3>
            <span style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>Helsesjekk hvert 30. sekund · siste: for 12 sek siden</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 900 }}>
              {provDefs.map((p) => {
                const down = !!adminDown[p.id]
                return (
                  <div
                    key={p.id}
                    style={{ background: '#fff', border: '1px solid #E8E1D2', borderRadius: 13, padding: '16px 20px', display: 'grid', gridTemplateColumns: '1.3fr 1.6fr 90px 110px 130px 190px', gap: 14, alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 99, background: down ? c.orange : c.green, flex: 'none' }} />
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.04em', color: down ? c.redInk : c.green, background: down ? c.redTint : c.greenTint, borderRadius: 5, padding: '2px 7px' }}>
                          {down ? 'NEDE (SIMULERT)' : 'OPPE'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: c.muted, fontWeight: 600, paddingLeft: 18 }}>{p.region}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.models.map((m) => (
                        <span key={m} style={{ fontSize: 12.5, fontWeight: 700, background: down ? c.redTint : c.paperAlt, color: down ? c.redInk : c.body, borderRadius: 6, padding: '4px 10px' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>LATENS</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{down ? '—' : p.lat}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>KOST 30 D</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{p.cost}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>API-NØKKEL</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: c.green }}>{p.key} · OK</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#544E42' }}>{down ? 'Slå på igjen' : 'Simuler nedetid'}</span>
                      <div
                        onClick={() => toggle(p)}
                        style={{ width: 42, height: 24, flex: 'none', borderRadius: 99, background: down ? c.orange : c.border2, display: 'flex', alignItems: 'center', justifyContent: down ? 'flex-end' : 'flex-start', padding: 3, cursor: 'pointer', boxSizing: 'border-box' }}
                      >
                        <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.25)' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div style={{ border: `1.5px dashed ${c.borderDash}`, borderRadius: 13, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: c.muted, minWidth: 900 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>+ Legg til leverandør</span>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Navn · API-nøkkel · region — vi kjører testkall før den kan brukes i kjeder</span>
              </div>
            </div>
          </div>
        </div>

        {/* ruting per oppgave */}
        <div className="mh-pad" style={{ padding: '30px 32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px' }}>Ruting per oppgave</h3>
            <span style={{ fontSize: 12.5, color: c.muted, fontWeight: 600 }}>Rekkefølgen er fallback-kjeden: primær → reserve → siste utvei</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 760 }}>
              {tasks.map((t) => (
                <div key={t.name} style={{ background: '#fff', border: '1px solid #E8E1D2', borderRadius: 13, padding: '16px 20px', display: 'grid', gridTemplateColumns: '230px 1fr 200px', gap: 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>{t.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {t.chips.map((ch, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, background: ch.bg, color: ch.c, border: `1.5px solid ${ch.bc}`, borderRadius: 99, padding: '6px 12px', textDecoration: ch.deco }}>
                          {ch.t}
                          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.05em', background: ch.tagBg, color: ch.tagC, borderRadius: 4, padding: '2px 6px', textDecoration: 'none' }}>{ch.tag}</span>
                        </span>
                        {ch.arrow && <span style={{ color: c.faint, fontWeight: 700 }}>→</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em', marginBottom: 2 }}>KJØRER NÅ</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: t.nowC }}>{t.nowTxt}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer', marginTop: 4 }}>Endre kjede</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* failover-regler + logg */}
        <div className="mh-pad mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, padding: '30px 32px 28px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E8E1D2', borderRadius: 13, padding: 22 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Failover-regler</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: '#544E42' }}>
              {failoverRules.map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>{label}</span>
                  <span style={{ background: c.paperAlt, border: '1px solid #E8E1D2', borderRadius: 7, padding: '4px 10px', fontWeight: 700, color: c.ink }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #E8E1D2', fontSize: 12.5, lineHeight: 1.55, color: c.muted }}>
              Svar som allerede strømmer fullføres på modellen de startet på. Bytte gjelder kun nye kall.
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E1D2', borderRadius: 13, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Hendelseslogg</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer' }}>Eksporter →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {logg.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: l.dot, flex: 'none', marginTop: 5 }} />
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: c.muted, letterSpacing: '.03em', marginBottom: 2 }}>{l.tid}</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, color: c.ink2, textWrap: 'pretty' }}>{l.txt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mh-pad mh-stack-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 32px', borderTop: '1px solid #E8E1D2', fontSize: 12.5, color: c.muted }}>
          <span>Alle leverandører har databehandleravtale. Dokumenter sendes aldri til leverandører uten DPA — og aldri til trening.</span>
          <span>Rutingendringer logges med hvem/når.</span>
        </div>
      </div>
    </div>
  )
}
