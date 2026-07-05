import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Prototype, fmt, basePosts, deltas } from './Prototype'

function renderAt(search = '') {
  return render(
    <MemoryRouter initialEntries={['/sak' + search]}>
      <Prototype />
    </MemoryRouter>,
  )
}

describe('fmt (nb-NO currency)', () => {
  it('formats thousands with a plain space', () => {
    expect(fmt(15000)).toBe('15 000 kr')
    expect(fmt(99300)).toBe('99 300 kr')
  })
  it('uses the typographic minus for negatives', () => {
    expect(fmt(-12200)).toBe('−12 200 kr')
  })
  it('handles zero and small values', () => {
    expect(fmt(0)).toBe('0 kr')
    expect(fmt(800)).toBe('800 kr')
  })
})

describe('case data consistency', () => {
  it('deltas match the flagged posts (bor − tilbud)', () => {
    for (const p of basePosts) {
      if (p.key) expect(p.bor - p.tilbud).toBe(deltas[p.key])
    }
  })
  it('the full claim adds up to the 99 300 kr the design quotes', () => {
    const krav = Object.values(deltas).reduce((a, b) => a + b, 0)
    expect(60000 + krav).toBe(99300)
  })
})

describe('wizard flow', () => {
  it('starts on the upload step', () => {
    renderAt()
    expect(screen.getByText('Last opp dokumentene')).toBeInTheDocument()
  })

  it('walks upload → sjekk → betaling → analyse', () => {
    renderAt()
    fireEvent.click(screen.getByText('Start gratis sjekk →'))
    expect(screen.getByText('Tilbudet ditt ser lavt ut.')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Lås opp full analyse · 349 kr'))
    expect(screen.getByText('Lås opp full analyse')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Betal 349 kr med Vipps'))
    expect(screen.getByText('Full analyse · Vannskade bad')).toBeInTheDocument()
  })

  it('switches the pay button label with the payment method', () => {
    renderAt('?steg=1')
    fireEvent.click(screen.getByText('Lås opp full analyse · 349 kr'))
    fireEvent.click(screen.getByText('Bankkort'))
    expect(screen.getByText('Betal 349 kr med kort')).toBeInTheDocument()
  })
})

describe('deep links (?steg=N)', () => {
  it('?steg=2 opens the analysis', () => {
    renderAt('?steg=2')
    expect(screen.getByText('Full analyse · Vannskade bad')).toBeInTheDocument()
  })
  it('?steg=3 opens the letter', () => {
    renderAt('?steg=3')
    expect(screen.getByText(/Klage på oppgjørstilbud – vannskade bad/)).toBeInTheDocument()
  })
  it('out-of-range steg clamps to the last step', () => {
    renderAt('?steg=9')
    expect(screen.getByText('Klagen er sendt. Nå venter vi — sammen.')).toBeInTheDocument()
  })
  it('garbage steg falls back to upload', () => {
    renderAt('?steg=abc')
    expect(screen.getByText('Last opp dokumentene')).toBeInTheDocument()
  })
})

describe('analysis: avvik toggling updates the claim', () => {
  it('shows the full estimate with all three avvik selected', () => {
    renderAt('?steg=2')
    expect(screen.getByText('99 300 kr')).toBeInTheDocument()
    expect(screen.getByText('+ 39 300 kr')).toBeInTheDocument()
  })

  it('removing "Riving og avfallshåndtering" drops the estimate by 18 500', () => {
    renderAt('?steg=2')
    fireEvent.click(screen.getByText('Riving og avfallshåndtering'))
    expect(screen.getByText('80 800 kr')).toBeInTheDocument()
    expect(screen.getByText('+ 20 800 kr')).toBeInTheDocument()
  })

  it('clicking a correctly-priced post does nothing', () => {
    renderAt('?steg=2')
    fireEvent.click(screen.getByText('Rørlegger og sanitærutstyr'))
    expect(screen.getByText('99 300 kr')).toBeInTheDocument()
  })

  it('re-selecting a removed avvik restores the full claim', () => {
    renderAt('?steg=2')
    const post = screen.getByText('Membran og flislegging')
    fireEvent.click(post)
    expect(screen.getByText('84 300 kr')).toBeInTheDocument()
    fireEvent.click(post)
    expect(screen.getByText('99 300 kr')).toBeInTheDocument()
  })
})

describe('letter generation', () => {
  it('includes one argument per selected avvik, with § references', () => {
    renderAt('?steg=3')
    expect(screen.getByText('Vilkår § 5.2 · s. 14')).toBeInTheDocument()
    expect(screen.getByText('Vilkår § 5.1 · s. 13')).toBeInTheDocument()
    expect(screen.getByText('Vilkår § 6.3 · s. 17')).toBeInTheDocument()
    expect(screen.getByText(/korrigert oppgjør på 99 300 kr — 39 300 kr mer enn tilbudet/)).toBeInTheDocument()
  })

  it('defaults to the "bestemt" tone and switches to "høflig"', () => {
    renderAt('?steg=3')
    expect(screen.getByText(/jeg krever at oppgjøret vurderes på nytt/)).toBeInTheDocument()
    expect(screen.getByText(/innen tre uker/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Høflig'))
    expect(screen.getByText(/ber derfor om en ny vurdering/)).toBeInTheDocument()
    expect(screen.getByText(/håper vi finner en god løsning/)).toBeInTheDocument()
  })

  it('drops the argument for a deselected avvik', () => {
    renderAt('?steg=2')
    fireEvent.click(screen.getByText('Riving og avfallshåndtering'))
    fireEvent.click(screen.getByText('Generer klagebrev →'))
    expect(screen.queryByText('Vilkår § 5.1 · s. 13')).not.toBeInTheDocument()
    expect(screen.getByText('Vilkår § 5.2 · s. 14')).toBeInTheDocument()
    // sidebar marks the dropped argument as excluded
    expect(screen.getByText('utelatt')).toBeInTheDocument()
  })

  it('asks the user to pick at least one avvik when none is selected', () => {
    renderAt('?steg=2')
    fireEvent.click(screen.getByText('Membran og flislegging'))
    fireEvent.click(screen.getByText('Riving og avfallshåndtering'))
    fireEvent.click(screen.getByText('Aldersfradrag våtrom'))
    fireEvent.click(screen.getByText('Generer klagebrev →'))
    expect(screen.getByText('Velg minst ett avvik i analysen for å bygge kravet.')).toBeInTheDocument()
  })
})
