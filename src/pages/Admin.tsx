import { useEffect, useState } from 'react'
import { c, font } from '../theme'
import {
  type AdminState,
  type LogEntry,
  type Provider,
  type Rules,
  loadState,
  saveState,
  resetState,
  maskKey,
  credentialLabel,
  nowLabel,
  testApiKey,
} from './adminData'

const kpis = [
  { label: 'TILGJENGELIGHET 30 D', value: '99,97 %', color: c.green },
  { label: 'FAILOVER-HENDELSER 30 D', value: '3' },
  { label: 'ANALYSER I DAG', value: '214' },
  { label: 'LLM-KOST JULI', value: '6 480 kr' },
]

const inputStyle: React.CSSProperties = {
  background: '#fff',
  border: `1.5px solid ${c.border2}`,
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13.5,
  fontFamily: 'inherit',
  color: c.ink,
  outline: 'none',
  minWidth: 0,
}

const smallBtn: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

export function Admin() {
  const [state, setState] = useState<AdminState>(loadState)
  // downtime is a simulation, deliberately not persisted
  const [down, setDown] = useState<Record<string, boolean>>({})

  // editor UI state
  const [keyEditId, setKeyEditId] = useState<string | null>(null)
  const [keyDraft, setKeyDraft] = useState('')
  const [keyBusy, setKeyBusy] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [addDraft, setAddDraft] = useState({ name: '', region: '', models: '', key: '' })
  const [addBusy, setAddBusy] = useState(false)
  const [addError, setAddError] = useState('')
  const [chainEditId, setChainEditId] = useState<string | null>(null)
  const [chainDraft, setChainDraft] = useState<string[]>([])
  const [rulesEdit, setRulesEdit] = useState(false)
  const [rulesDraft, setRulesDraft] = useState<Rules>(state.rules)
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(null)

  useEffect(() => saveState(state), [state])

  const providerOf: Record<string, string> = {}
  state.providers.forEach((p) => p.models.forEach((m) => (providerOf[m] = p.id)))
  const isDown = (model: string) => !!down[providerOf[model]]
  const allModels = state.providers.flatMap((p) => p.models)

  const addLogEntries = (s: AdminState, ...entries: LogEntry[]): AdminState => ({ ...s, log: [...entries, ...s.log] })

  // ---- actions ----

  const toggleDown = (p: Provider) => {
    const nowDown = !down[p.id]
    const entry: LogEntry = nowDown
      ? { tid: nowLabel(), txt: `${p.name} markert nede (simulering). Oppgaver med ${p.models.join(' / ')} i kjeden hopper over dem automatisk.`, type: 'failover' }
      : { tid: nowLabel(), txt: `${p.name} frisk igjen etter helsesjekk — trafikken går tilbake til primær rekkefølge.`, type: 'ok' }
    setDown((s) => ({ ...s, [p.id]: nowDown }))
    setState((s) => addLogEntries(s, entry))
  }

  const openKeyEditor = (p: Provider) => {
    setKeyEditId(p.id)
    setKeyDraft('')
    setKeyError('')
  }

  const saveKey = async (p: Provider) => {
    setKeyBusy(true)
    setKeyError('')
    const res = await testApiKey(keyDraft)
    setKeyBusy(false)
    if (!res.ok) {
      setKeyError('Testkallet feilet — kontroller nøkkelen (minst 8 tegn) og prøv igjen.')
      return
    }
    const draft = keyDraft
    setState((s) =>
      addLogEntries(
        { ...s, providers: s.providers.map((x) => (x.id === p.id ? { ...x, apiKey: draft, keyStatus: 'ok' } : x)) },
        {
          tid: nowLabel(),
          txt: `${p.credentialType === 'service_account' ? 'Tjenestekonto-nøkkel' : 'API-nøkkel'} oppdatert for ${p.name} — testkall OK (${res.ms} ms).`,
          type: 'info',
        },
      ),
    )
    setKeyEditId(null)
  }

  const addProvider = async () => {
    const name = addDraft.name.trim()
    const region = addDraft.region.trim()
    const models = addDraft.models.split(',').map((m) => m.trim()).filter(Boolean)
    setAddError('')
    if (!name || !region || models.length === 0) {
      setAddError('Fyll ut navn, region og minst én modell.')
      return
    }
    if (state.providers.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setAddError('Det finnes allerede en leverandør med det navnet.')
      return
    }
    const duplicate = models.find((m) => allModels.includes(m))
    if (duplicate) {
      setAddError(`Modellen «${duplicate}» finnes allerede hos en annen leverandør.`)
      return
    }
    setAddBusy(true)
    const res = await testApiKey(addDraft.key)
    setAddBusy(false)
    if (!res.ok) {
      setAddError('Testkallet feilet — kontroller API-nøkkelen (minst 8 tegn).')
      return
    }
    const provider: Provider = {
      id: 'custom-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      region,
      models,
      lat: '—',
      cost: '0 kr',
      apiKey: addDraft.key,
      keyStatus: 'ok',
      credentialType: 'api_key',
      custom: true,
    }
    setState((s) =>
      addLogEntries(
        { ...s, providers: [...s.providers, provider] },
        { tid: nowLabel(), txt: `${name} lagt til som leverandør etter vellykket testkall (${res.ms} ms). Modeller: ${models.join(', ')}. Kan nå brukes i kjeder.`, type: 'info' },
      ),
    )
    setAddOpen(false)
    setAddDraft({ name: '', region: '', models: '', key: '' })
  }

  const removeProvider = (p: Provider) => {
    const usedBy = state.tasks.find((t) => t.chain.some((m) => p.models.includes(m)))
    if (usedBy) {
      setRowError({ id: p.id, msg: `Kan ikke fjernes — en modell herfra står i kjeden for «${usedBy.name}». Endre kjeden først.` })
      return
    }
    setRowError(null)
    setState((s) =>
      addLogEntries(
        { ...s, providers: s.providers.filter((x) => x.id !== p.id) },
        { tid: nowLabel(), txt: `Leverandøren ${p.name} fjernet. Ingen kjeder var berørt.`, type: 'info' },
      ),
    )
  }

  const saveChain = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)!
    const chain = chainDraft
    setState((s) =>
      addLogEntries(
        { ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, chain } : t)) },
        { tid: nowLabel(), txt: `Kjeden for ${task.name} endret: ${chain.join(' → ')}.`, type: 'info' },
      ),
    )
    setChainEditId(null)
  }

  const saveRules = () => {
    const draft = rulesDraft
    setState((s) => addLogEntries({ ...s, rules: draft }, { tid: nowLabel(), txt: 'Failover-reglene ble oppdatert.', type: 'info' }))
    setRulesEdit(false)
  }

  const exportLog = () => {
    const blob = new Blob([JSON.stringify(state.log, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'medhold-hendelseslogg.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const resetDemo = () => {
    setState(resetState())
    setDown({})
    setKeyEditId(null)
    setAddOpen(false)
    setChainEditId(null)
    setRulesEdit(false)
  }

  // ---- derived routing view ----
  let omrutet = 0
  const taskViews = state.tasks.map((t) => {
    const firstUp = t.chain.find((m) => !isDown(m))
    if (firstUp && firstUp !== t.chain[0]) omrutet++
    const alleNede = !firstUp
    return {
      ...t,
      nowTxt: alleNede ? 'Ingen modeller oppe!' : firstUp!,
      nowC: alleNede ? c.orange : firstUp !== t.chain[0] ? c.redInk : c.green,
      chips: t.chain.map((m, i) => {
        const isModelDown = isDown(m)
        const aktiv = m === firstUp
        return {
          t: m,
          arrow: i < t.chain.length - 1,
          tag: isModelDown ? 'NEDE' : aktiv ? 'AKTIV' : 'STANDBY',
          bg: aktiv ? c.green : isModelDown ? c.redTint : '#fff',
          c: aktiv ? '#fff' : isModelDown ? c.redInk : c.body,
          bc: aktiv ? c.green : isModelDown ? c.redTintBorder : c.border,
          deco: isModelDown ? 'line-through' : 'none',
          tagBg: aktiv ? 'rgba(255,255,255,.2)' : isModelDown ? '#fff' : c.paperAlt,
          tagC: aktiv ? c.dfGreen : isModelDown ? c.redInk : c.muted,
        }
      }),
    }
  })

  const nedeCount = Object.values(down).filter(Boolean).length
  const bannerTxt =
    nedeCount +
    (nedeCount === 1 ? ' leverandør' : ' leverandører') +
    ' nede — ' +
    omrutet +
    (omrutet === 1 ? ' oppgave er' : ' oppgaver er') +
    ' rutet om automatisk. Brukerne merker ingenting.'

  const logg = state.log.map((l) => ({
    ...l,
    dot: l.type === 'failover' ? c.orange : l.type === 'ok' ? c.green : c.faint,
  }))

  const rulesRows: [string, string][] = [
    ['Bytt ved timeout over', `${state.rules.timeoutSec} sek`],
    ['Bytt ved feilrate over', `${state.rules.errPct} % / ${state.rules.errWinMin} min`],
    ['Nye forsøk før bytte', `${state.rules.retries} · backoff`],
    ['Tilbake til primær etter', `${state.rules.backToPrimaryMin} min friske sjekker`],
    ['Varsling ved failover', state.rules.notify],
  ]

  return (
    <div className="mh-app">
      <div className="mh-page" style={{ background: c.paper, color: c.ink }}>
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
            <div key={k.label} style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 18px' }}>
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
              {state.providers.map((p) => {
                const pDown = !!down[p.id]
                return (
                  <div key={p.id} style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: '16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.6fr 90px 110px 150px 170px', gap: 14, alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                          <span style={{ width: 9, height: 9, borderRadius: 99, background: pDown ? c.orange : c.green, flex: 'none' }} />
                          <span style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.04em', color: pDown ? c.redInk : c.green, background: pDown ? c.redTint : c.greenTint, borderRadius: 5, padding: '2px 7px' }}>
                            {pDown ? 'NEDE (SIMULERT)' : 'OPPE'}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: c.muted, fontWeight: 600, paddingLeft: 18 }}>{p.region}</div>
                        {p.custom && (
                          <span onClick={() => removeProvider(p)} style={{ fontSize: 11.5, fontWeight: 700, color: c.rust2, cursor: 'pointer', paddingLeft: 18 }}>
                            Fjern leverandør
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.models.map((m) => (
                          <span key={m} style={{ fontSize: 12.5, fontWeight: 700, background: pDown ? c.redTint : c.paperAlt, color: pDown ? c.redInk : c.body, borderRadius: 6, padding: '4px 10px' }}>
                            {m}
                          </span>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>LATENS</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{pDown ? '—' : p.lat}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>KOST 30 D</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{p.cost}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>{credentialLabel(p.credentialType)}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: c.green }}>{maskKey(p.apiKey)} · OK</div>
                        <span onClick={() => openKeyEditor(p)} style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer' }}>
                          Endre nøkkel
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: c.body }}>{pDown ? 'Slå på igjen' : 'Simuler nedetid'}</span>
                        <div
                          onClick={() => toggleDown(p)}
                          style={{ width: 42, height: 24, flex: 'none', borderRadius: 99, background: pDown ? c.orange : c.border2, display: 'flex', alignItems: 'center', justifyContent: pDown ? 'flex-end' : 'flex-start', padding: 3, cursor: 'pointer', boxSizing: 'border-box' }}
                        >
                          <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.25)' }} />
                        </div>
                      </div>
                    </div>

                    {rowError?.id === p.id && (
                      <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: c.redInk, background: c.redTint, border: `1px solid ${c.redTintBorder}`, borderRadius: 9, padding: '9px 12px' }}>
                        {rowError.msg}
                      </div>
                    )}

                    {keyEditId === p.id && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${c.border}`, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="password"
                          value={keyDraft}
                          onChange={(e) => setKeyDraft(e.target.value)}
                          placeholder={p.credentialType === 'service_account' ? `Ny tjenestekonto-nøkkel for ${p.name}` : `Ny API-nøkkel for ${p.name}`}
                          aria-label={p.credentialType === 'service_account' ? `Ny tjenestekonto-nøkkel for ${p.name}` : `Ny API-nøkkel for ${p.name}`}
                          style={{ ...inputStyle, flex: 1, minWidth: 220 }}
                        />
                        <button onClick={() => saveKey(p)} disabled={keyBusy} style={{ ...smallBtn, background: c.green, color: '#fff', opacity: keyBusy ? 0.7 : 1 }}>
                          {keyBusy ? 'Kjører testkall …' : 'Lagre og test'}
                        </button>
                        <button onClick={() => setKeyEditId(null)} disabled={keyBusy} style={{ ...smallBtn, background: '#fff', color: c.body, border: `1.5px solid ${c.border2}` }}>
                          Avbryt
                        </button>
                        {keyError && <span style={{ fontSize: 12.5, fontWeight: 600, color: c.redInk, width: '100%' }}>{keyError}</span>}
                        <span style={{ fontSize: 12, color: c.muted, width: '100%' }}>Nøkkelen lagres kun i denne nettleseren, og vises aldri i sin helhet.</span>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* legg til leverandør */}
              {!addOpen ? (
                <div
                  onClick={() => setAddOpen(true)}
                  className="tint-hover"
                  style={{ border: `1.5px dashed ${c.borderDash}`, borderRadius: 13, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: c.muted, minWidth: 900, cursor: 'pointer' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700 }}>+ Legg til leverandør</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Navn · API-nøkkel · region — vi kjører testkall før den kan brukes i kjeder</span>
                </div>
              ) : (
                <div style={{ border: `1.5px dashed ${c.borderDash}`, borderRadius: 13, padding: 20, minWidth: 900, background: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Ny leverandør</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input value={addDraft.name} onChange={(e) => setAddDraft({ ...addDraft, name: e.target.value })} placeholder="Navn, f.eks. Cohere" aria-label="Navn" style={inputStyle} />
                    <input value={addDraft.region} onChange={(e) => setAddDraft({ ...addDraft, region: e.target.value })} placeholder="Region, f.eks. EU · Frankfurt" aria-label="Region" style={inputStyle} />
                    <input value={addDraft.models} onChange={(e) => setAddDraft({ ...addDraft, models: e.target.value })} placeholder="Modeller, kommaseparert" aria-label="Modeller" style={inputStyle} />
                    <input type="password" value={addDraft.key} onChange={(e) => setAddDraft({ ...addDraft, key: e.target.value })} placeholder="API-nøkkel" aria-label="API-nøkkel" style={inputStyle} />
                  </div>
                  {addError && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: c.redInk }}>{addError}</div>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button onClick={addProvider} disabled={addBusy} style={{ ...smallBtn, background: c.green, color: '#fff', opacity: addBusy ? 0.7 : 1 }}>
                      {addBusy ? 'Kjører testkall …' : 'Kjør testkall og legg til'}
                    </button>
                    <button onClick={() => { setAddOpen(false); setAddError('') }} disabled={addBusy} style={{ ...smallBtn, background: '#fff', color: c.body, border: `1.5px solid ${c.border2}` }}>
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
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
              {taskViews.map((t) => (
                <div key={t.id} style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 200px', gap: 16, alignItems: 'center' }}>
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
                      <div
                        onClick={() => {
                          setChainEditId(t.id)
                          setChainDraft([...t.chain])
                        }}
                        style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer', marginTop: 4 }}
                      >
                        Endre kjede
                      </div>
                    </div>
                  </div>

                  {chainEditId === t.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${c.border}`, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      {['Primær', 'Reserve', 'Siste utvei'].map((role, i) => (
                        <label key={role} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 700, color: c.faint, letterSpacing: '.04em' }}>
                          {role.toUpperCase()}
                          <select
                            value={chainDraft[i]}
                            onChange={(e) => {
                              const next = [...chainDraft]
                              next[i] = e.target.value
                              setChainDraft(next)
                            }}
                            style={{ ...inputStyle, fontWeight: 700 }}
                          >
                            {allModels.map((m) => (
                              <option key={m} value={m} disabled={chainDraft.includes(m) && chainDraft[i] !== m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                      <button onClick={() => saveChain(t.id)} style={{ ...smallBtn, background: c.green, color: '#fff' }}>
                        Lagre kjede
                      </button>
                      <button onClick={() => setChainEditId(null)} style={{ ...smallBtn, background: '#fff', color: c.body, border: `1.5px solid ${c.border2}` }}>
                        Avbryt
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* failover-regler + logg */}
        <div className="mh-pad mh-collapse" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, padding: '30px 32px 28px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Failover-regler</span>
              {!rulesEdit ? (
                <span
                  onClick={() => {
                    setRulesDraft(state.rules)
                    setRulesEdit(true)
                  }}
                  style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer' }}
                >
                  Endre
                </span>
              ) : (
                <span style={{ display: 'flex', gap: 10 }}>
                  <span onClick={saveRules} style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer' }}>Lagre</span>
                  <span onClick={() => setRulesEdit(false)} style={{ fontSize: 12, fontWeight: 700, color: c.muted, cursor: 'pointer' }}>Avbryt</span>
                </span>
              )}
            </div>
            {!rulesEdit ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: c.body }}>
                {rulesRows.map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span>{label}</span>
                    <span style={{ background: c.paperAlt, border: `1px solid ${c.border}`, borderRadius: 7, padding: '4px 10px', fontWeight: 700, color: c.ink }}>{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: c.body }}>
                <RuleInput label="Bytt ved timeout over (sek)" value={rulesDraft.timeoutSec} onChange={(v) => setRulesDraft({ ...rulesDraft, timeoutSec: v })} />
                <RuleInput label="Bytt ved feilrate over (%)" value={rulesDraft.errPct} onChange={(v) => setRulesDraft({ ...rulesDraft, errPct: v })} />
                <RuleInput label="… målt over (min)" value={rulesDraft.errWinMin} onChange={(v) => setRulesDraft({ ...rulesDraft, errWinMin: v })} />
                <RuleInput label="Nye forsøk før bytte" value={rulesDraft.retries} onChange={(v) => setRulesDraft({ ...rulesDraft, retries: v })} />
                <RuleInput label="Tilbake til primær etter (min)" value={rulesDraft.backToPrimaryMin} onChange={(v) => setRulesDraft({ ...rulesDraft, backToPrimaryMin: v })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>Varsling ved failover</span>
                  <select
                    value={rulesDraft.notify}
                    onChange={(e) => setRulesDraft({ ...rulesDraft, notify: e.target.value as Rules['notify'] })}
                    style={{ ...inputStyle, padding: '4px 8px', fontWeight: 700 }}
                  >
                    <option>E-post</option>
                    <option>Slack</option>
                    <option>E-post + Slack</option>
                  </select>
                </div>
              </div>
            )}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${c.border}`, fontSize: 12.5, lineHeight: 1.55, color: c.muted }}>
              Svar som allerede strømmer fullføres på modellen de startet på. Bytte gjelder kun nye kall.
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 13, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Hendelseslogg</span>
              <span onClick={exportLog} style={{ fontSize: 12, fontWeight: 700, color: c.green, cursor: 'pointer' }}>
                Eksporter →
              </span>
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

        <div className="mh-pad mh-stack-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 32px', borderTop: `1px solid ${c.border}`, fontSize: 12.5, color: c.muted }}>
          <span>Alle leverandører har databehandleravtale. Dokumenter sendes aldri til leverandører uten DPA — og aldri til trening.</span>
          <span>
            Rutingendringer logges med hvem/når. ·{' '}
            <span onClick={resetDemo} style={{ fontWeight: 700, color: c.green, cursor: 'pointer' }}>
              Tilbakestill demoen
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function RuleInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        aria-label={label}
        style={{ background: '#fff', border: `1.5px solid ${c.border2}`, borderRadius: 7, padding: '4px 8px', fontWeight: 700, width: 76, fontSize: 13.5, fontFamily: 'inherit', color: c.ink }}
      />
    </div>
  )
}
