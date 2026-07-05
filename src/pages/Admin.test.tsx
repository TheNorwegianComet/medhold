import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Admin } from './Admin'

// StrictMode double-invokes state updaters in dev — rendering under it here
// guards the "exactly one log entry per toggle" fix against regressions.
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
    // all four chains have an Anthropic model as primary → all reroute
    expect(
      screen.getByText('1 leverandør nede — 4 oppgaver er rutet om automatisk. Brukerne merker ingenting.'),
    ).toBeInTheDocument()
    // Vilkårsanalyse now runs on its first backup
    expect(screen.getAllByText('GPT-5.2').length).toBeGreaterThanOrEqual(2) // chip + "KJØRER NÅ"
  })

  it('adds exactly ONE log entry per toggle, even under StrictMode', () => {
    renderAdmin()
    clickSwitch('Simuler nedetid')
    expect(screen.getAllByText(/markert nede \(simulering\)/)).toHaveLength(1)
    clickSwitch('Slå på igjen')
    expect(screen.getAllByText(/frisk igjen etter helsesjekk/)).toHaveLength(1)
  })

  it('recovers when the provider is switched back on', () => {
    renderAdmin()
    clickSwitch('Simuler nedetid')
    clickSwitch('Slå på igjen')
    expect(screen.queryByText(/rutet om automatisk/)).not.toBeInTheDocument()
    expect(screen.getAllByText('OPPE')).toHaveLength(4)
    expect(screen.getAllByText('AKTIV')).toHaveLength(4)
  })

  it('reports "Ingen modeller oppe!" when a whole chain is down', () => {
    renderAdmin()
    // Gratis sjekk chain = Claude Haiku (Anthropic) → Gemini Flash (Google) → Mistral Large (Mistral)
    clickSwitch('Simuler nedetid', 0) // Anthropic
    clickSwitch('Simuler nedetid', 1) // Google (OpenAI stays up)
    clickSwitch('Simuler nedetid', 1) // Mistral (index shifts as labels change)
    // Gratis sjekk and Spørsmål i analysen share those three providers
    expect(screen.getAllByText('Ingen modeller oppe!')).toHaveLength(2)
    expect(screen.getByText(/3 leverandører nede/)).toBeInTheDocument()
  })
})
