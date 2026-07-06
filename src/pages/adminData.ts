// State model + persistence for the admin console. The console is a working
// frontend against browser storage: API keys, providers, chains and rules are
// editable and survive reload; there is no backend yet, so the "testkall" that
// validates a key is simulated.

export type KeyStatus = 'ok' | 'testing' | 'error'

/**
 * How the provider authenticates: OpenAI/Anthropic/Mistral use API keys,
 * while Google Vertex AI uses a GCP service account (AIza-style API keys
 * belong to the separate Gemini Developer API, not Vertex).
 */
export type CredentialType = 'api_key' | 'service_account'

export type Provider = {
  id: string
  name: string
  region: string
  models: string[]
  lat: string
  cost: string
  /** full credential as entered; only the masked form is ever rendered */
  apiKey: string
  keyStatus: KeyStatus
  credentialType: CredentialType
  custom?: boolean
}

export function credentialLabel(t: CredentialType): string {
  return t === 'service_account' ? 'TJENESTEKONTO' : 'API-NØKKEL'
}

export type TaskChain = {
  id: string
  name: string
  desc: string
  /** model names, primary first */
  chain: string[]
}

export type Rules = {
  timeoutSec: number
  errPct: number
  errWinMin: number
  retries: number
  backToPrimaryMin: number
  notify: 'E-post' | 'Slack' | 'E-post + Slack'
}

export type LogType = 'failover' | 'ok' | 'info'
export type LogEntry = { tid: string; txt: string; type: LogType }

export type AdminState = {
  providers: Provider[]
  tasks: TaskChain[]
  rules: Rules
  log: LogEntry[]
}

export const defaultState: AdminState = {
  providers: [
    { id: 'anthropic', name: 'Anthropic', region: 'USA · DPA + SCC', models: ['Claude Sonnet 5', 'Claude Haiku 4.5'], lat: '1,2 s', cost: '3 940 kr', apiKey: 'sk-ant-demo-a8f2b', keyStatus: 'ok', credentialType: 'api_key' },
    { id: 'openai', name: 'OpenAI', region: 'USA · DPA + SCC', models: ['GPT-5.5'], lat: '1,6 s', cost: '1 210 kr', apiKey: 'sk-demo-9dc41a', keyStatus: 'ok', credentialType: 'api_key' },
    { id: 'google', name: 'Google Vertex AI', region: 'EU · europe-west4', models: ['Gemini 3 Pro', 'Gemini 3 Flash'], lat: '1,4 s', cost: '860 kr', apiKey: 'sa-medhold-llm-4f2a77e0', keyStatus: 'ok', credentialType: 'service_account' },
    { id: 'mistral', name: 'Mistral', region: 'EU · Paris', models: ['Mistral Large 3'], lat: '1,1 s', cost: '470 kr', apiKey: 'mst-demo-c2d9c', keyStatus: 'ok', credentialType: 'api_key' },
  ],
  tasks: [
    { id: 'vilkar', name: 'Vilkårsanalyse', desc: 'Lange dokumenter · høy presisjon', chain: ['Claude Sonnet 5', 'GPT-5.5', 'Gemini 3 Pro'] },
    { id: 'sjekk', name: 'Gratis sjekk', desc: 'Rask triage · lav kost', chain: ['Claude Haiku 4.5', 'Gemini 3 Flash', 'Mistral Large 3'] },
    { id: 'brev', name: 'Klagebrev', desc: 'Norsk språk · formell tone', chain: ['Claude Sonnet 5', 'Gemini 3 Pro', 'GPT-5.5'] },
    { id: 'sporsmal', name: 'Spørsmål i analysen', desc: 'Chat · korte svar', chain: ['Claude Haiku 4.5', 'Mistral Large 3', 'Gemini 3 Flash'] },
  ],
  rules: { timeoutSec: 20, errPct: 5, errWinMin: 2, retries: 2, backToPrimaryMin: 10, notify: 'E-post + Slack' },
  log: [
    { tid: '28. jun · 14:02', txt: 'OpenAI svarte 429 (rate limit) i 18 minutter — Vilkårsanalyse rutet automatisk til neste modell i kjeden. 41 analyser gikk som normalt.', type: 'failover' },
    { tid: '12. jun · 09:44', txt: 'Gemini 3 Flash over latens-terskelen (20 s) — Gratis sjekk rutet til Mistral Large 3 i 32 minutter.', type: 'failover' },
    { tid: '2. jun · 16:10', txt: 'Claude Haiku 4.5 satt som ny primær for Gratis sjekk. Kjeden ellers uendret.', type: 'info' },
  ],
}

// v2: corrected provider facts (Vertex service account, current model generation)
const STORAGE_KEY = 'medhold-admin-v2'

export function loadState(): AdminState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultState)
    const parsed = JSON.parse(raw) as AdminState
    // minimal shape check — fall back rather than crash on stale data
    if (!Array.isArray(parsed.providers) || !Array.isArray(parsed.tasks)) return structuredClone(defaultState)
    if (parsed.providers.some((p) => !p.credentialType)) return structuredClone(defaultState)
    // a "testing" status must not survive a reload
    parsed.providers = parsed.providers.map((p) => ({ ...p, keyStatus: p.keyStatus === 'testing' ? 'ok' : p.keyStatus }))
    return parsed
  } catch {
    return structuredClone(defaultState)
  }
}

export function saveState(state: AdminState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode / sandbox) — the console still works, it just won't persist
  }
}

export function resetState(): AdminState {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return structuredClone(defaultState)
}

/** ••••7f2b — never render more than the last 4 characters of a key. */
export function maskKey(key: string): string {
  return '••••' + key.slice(-4)
}

/** Timestamp in the log's design language, e.g. "I dag · 14:32". */
export function nowLabel(): string {
  return 'I dag · ' + new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Simulated key-validation call ("vi kjører testkall før den kan brukes").
 * Any key of 8+ characters validates; the delay mimics a real roundtrip.
 */
export function testApiKey(key: string): Promise<{ ok: boolean; ms: number }> {
  const ms = 180 + Math.floor(Math.random() * 400)
  return new Promise((resolve) => setTimeout(() => resolve({ ok: key.trim().length >= 8, ms }), 700))
}
