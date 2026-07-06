import { StrictMode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Admin } from './Admin'

// StrictMode double-invokes state updaters in dev — rendering under it here
// guards the "exactly one log entry per action" behavior against regressions.
function renderAdmin() {
  return render(
    <StrictMode>
      <Admin />
    </StrictMode>,
  )
}

/** The switch element sits right after its "Simuler nedetid"/"Slå på igjen" label. */
function clickSwitch(label: string, index = 0) {
  const el = screen.getAllByText(label)[index].nextElementSibling
  expect(el).not.toBeNull()
  fireEvent.click(el!)
}

beforeEach(() => {
  localStorage.clear()
})

describe('initial state', () => {
  it('shows all four providers up, no banner, three historic log entries', () => {
    renderAdmin()
    expect(screen.getAllByText('OPPE')).toHaveLength(4)
    expect(screen.queryByText(/rutet om automatisk/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/28\. jun|12\. jun|2\. jun/)).toHaveLength(3)
  })

  it('runs every task on its primary model', () => {
    renderAdmin()
    expect(screen.getAllByText('AKTIV')).toHaveLength(4)
    expect(screen.queryAllByText('NEDE')).toHaveLength(0)
  })
})

describe('failover simulation', () => {
  it('marks the provider down and reroutes every affected chain', () => {
    renderAdmin()
    clickSwitch('Simuler nedetid') // Anthropic is the first provider
    expect(screen.getByText('NEDE (SIMULERT)')).toBeInTheDocument()
    expect(
      screen.getByText('1 leverandør nede — 4 oppgaver er rutet om automatisk. Brukerne merker ingenting.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('GPT-5.2').length).toBeGreaterThanOrEqual(2)
  })

  it('adds exactly ONE log entry per toggle, even under StrictMode', () => {
    renderAdmin()
    clickSwitch('Simuler nedetid')
    expect(screen.getAllByText(/markert nede \(simulering\)/)).toHaveLength(1)
    clickSwitch('Slå på igjen')
    expect(screen.getAllByText(/frisk igjen etter helsesjekk/)).toHaveLength(1)
  })

  it('reports "Ingen modeller oppe!" when a whole chain is down', () => {
    renderAdmin()
    clickSwitch('Simuler nedetid', 0) // Anthropic
    clickSwitch('Simuler nedetid', 1) // Google (index shifts as labels change)
    clickSwitch('Simuler nedetid', 1) // Mistral
    expect(screen.getAllByText('Ingen modeller oppe!')).toHaveLength(2)
    expect(screen.getByText(/3 leverandører nede/)).toBeInTheDocument()
  })
})

describe('API keys', () => {
  it('updates the key after a successful test call and logs it once', async () => {
    renderAdmin()
    fireEvent.click(screen.getAllByText('Endre nøkkel')[0]) // Anthropic
    fireEvent.change(screen.getByLabelText('Ny API-nøkkel for Anthropic'), {
      target: { value: 'sk-ant-ny-nokkel-xyz9' },
    })
    fireEvent.click(screen.getByText('Lagre og test'))
    expect(await screen.findByText(/API-nøkkel oppdatert for Anthropic/, undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getAllByText(/API-nøkkel oppdatert for Anthropic/)).toHaveLength(1)
    expect(screen.getByText('••••xyz9 · OK')).toBeInTheDocument()
    // editor closed
    expect(screen.queryByLabelText('Ny API-nøkkel for Anthropic')).not.toBeInTheDocument()
  })

  it('rejects a too-short key and keeps the old one', async () => {
    renderAdmin()
    fireEvent.click(screen.getAllByText('Endre nøkkel')[0])
    fireEvent.change(screen.getByLabelText('Ny API-nøkkel for Anthropic'), { target: { value: 'kort' } })
    fireEvent.click(screen.getByText('Lagre og test'))
    expect(await screen.findByText(/Testkallet feilet/, undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('••••8f2b · OK')).toBeInTheDocument()
    expect(screen.queryByText(/API-nøkkel oppdatert/)).not.toBeInTheDocument()
  })
})

describe('providers', () => {
  it('adds a provider after a successful test call; its models become chain options', async () => {
    renderAdmin()
    fireEvent.click(screen.getByText('+ Legg til leverandør'))
    fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'Cohere' } })
    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'EU · Frankfurt' } })
    fireEvent.change(screen.getByLabelText('Modeller'), { target: { value: 'Command R+' } })
    fireEvent.change(screen.getByLabelText('API-nøkkel'), { target: { value: 'co-demo-nokkel-123' } })
    fireEvent.click(screen.getByText('Kjør testkall og legg til'))
    expect(await screen.findByText(/lagt til som leverandør etter vellykket testkall/, undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getAllByText('OPPE')).toHaveLength(5)
    expect(screen.getByText('Fjern leverandør')).toBeInTheDocument()
    // the new model is available in the chain editor
    fireEvent.click(screen.getAllByText('Endre kjede')[0])
    expect(screen.getAllByRole('option', { name: 'Command R+' }).length).toBeGreaterThan(0)
  })

  it('validates the add form', async () => {
    renderAdmin()
    fireEvent.click(screen.getByText('+ Legg til leverandør'))
    fireEvent.click(screen.getByText('Kjør testkall og legg til'))
    expect(await screen.findByText('Fyll ut navn, region og minst én modell.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'X' } })
    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'EU' } })
    fireEvent.change(screen.getByLabelText('Modeller'), { target: { value: 'GPT-5.2' } })
    fireEvent.click(screen.getByText('Kjør testkall og legg til'))
    expect(await screen.findByText(/finnes allerede hos en annen leverandør/)).toBeInTheDocument()
  })

  it('refuses to remove a provider whose model is used in a chain', async () => {
    renderAdmin()
    // add a provider and put its model into a chain
    fireEvent.click(screen.getByText('+ Legg til leverandør'))
    fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'Cohere' } })
    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'EU' } })
    fireEvent.change(screen.getByLabelText('Modeller'), { target: { value: 'Command R+' } })
    fireEvent.change(screen.getByLabelText('API-nøkkel'), { target: { value: 'co-demo-nokkel-123' } })
    fireEvent.click(screen.getByText('Kjør testkall og legg til'))
    await screen.findByText('Fjern leverandør', undefined, { timeout: 3000 })
    fireEvent.click(screen.getAllByText('Endre kjede')[0])
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Command R+' } })
    fireEvent.click(screen.getByText('Lagre kjede'))
    // now try to remove
    fireEvent.click(screen.getByText('Fjern leverandør'))
    expect(screen.getByText(/Kan ikke fjernes — en modell herfra står i kjeden for «Vilkårsanalyse»/)).toBeInTheDocument()
    expect(screen.getAllByText('OPPE')).toHaveLength(5)
  })
})

describe('chains', () => {
  it('editing a chain updates KJØRER NÅ and logs the change once', () => {
    renderAdmin()
    fireEvent.click(screen.getAllByText('Endre kjede')[0]) // Vilkårsanalyse
    const [primary] = screen.getAllByRole('combobox')
    fireEvent.change(primary, { target: { value: 'Mistral Large 3' } })
    fireEvent.click(screen.getByText('Lagre kjede'))
    expect(screen.getAllByText(/Kjeden for Vilkårsanalyse endret: Mistral Large 3/)).toHaveLength(1)
    // Vilkårsanalyse now runs on Mistral (its new primary)
    expect(screen.getAllByText('Mistral Large 3').length).toBeGreaterThanOrEqual(3) // provider pill + chip + KJØRER NÅ + log
  })
})

describe('failover rules', () => {
  it('edits and saves the rules, formatted like the design', () => {
    renderAdmin()
    fireEvent.click(screen.getByText('Endre'))
    fireEvent.change(screen.getByLabelText('Bytt ved timeout over (sek)'), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText('Nye forsøk før bytte'), { target: { value: '3' } })
    fireEvent.click(screen.getByText('Lagre'))
    expect(screen.getByText('30 sek')).toBeInTheDocument()
    expect(screen.getByText('3 · backoff')).toBeInTheDocument()
    expect(screen.getAllByText('Failover-reglene ble oppdatert.')).toHaveLength(1)
  })
})

describe('persistence', () => {
  it('keeps edits across a reload (unmount + fresh render)', async () => {
    renderAdmin()
    fireEvent.click(screen.getByText('Endre'))
    fireEvent.change(screen.getByLabelText('Bytt ved timeout over (sek)'), { target: { value: '45' } })
    fireEvent.click(screen.getByText('Lagre'))
    expect(screen.getByText('45 sek')).toBeInTheDocument()
    cleanup()
    renderAdmin()
    expect(screen.getByText('45 sek')).toBeInTheDocument()
    expect(screen.getByText('Failover-reglene ble oppdatert.')).toBeInTheDocument()
  })

  it('reset restores the defaults', () => {
    renderAdmin()
    fireEvent.click(screen.getByText('Endre'))
    fireEvent.change(screen.getByLabelText('Bytt ved timeout over (sek)'), { target: { value: '45' } })
    fireEvent.click(screen.getByText('Lagre'))
    fireEvent.click(screen.getByText('Tilbakestill demoen'))
    expect(screen.getByText('20 sek')).toBeInTheDocument()
    expect(screen.queryByText('Failover-reglene ble oppdatert.')).not.toBeInTheDocument()
  })
})

describe('log export', () => {
  it('downloads the log as JSON', () => {
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:demo')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', Object.assign(Object.create(URL), { createObjectURL, revokeObjectURL }))
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderAdmin()
    fireEvent.click(screen.getByText('Eksporter →'))
    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(click).toHaveBeenCalledTimes(1)

    click.mockRestore()
    vi.unstubAllGlobals()
  })
})
