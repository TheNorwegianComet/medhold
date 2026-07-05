import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

const routes: [string, string | RegExp][] = [
  ['/', 'Ikke ta det første tilbudet.'],
  ['/kom-i-gang', 'Sjekk oppgjøret ditt. Gratis.'],
  ['/eksempelsaker', 'Saker som lignet på din'],
  ['/eksempelsak', /Vilkårene ga 152 000/],
  ['/vilkar', '§ 6 Fradrag ved erstatningsberegning'],
  ['/mine-saker', 'Hei Kari — dette skjer i sakene dine'],
  ['/finansklagenemnda', 'Klage til Finansklagenemnda'],
  ['/personvern', 'Dokumentene dine — kort forklart'],
  ['/sak', 'Last opp dokumentene'],
  ['/admin', 'Ruting per oppgave'],
]

describe('routing', () => {
  it.each(routes)('%s renders its page', (path, marker) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText(marker)).toBeInTheDocument()
  })

  it('unknown paths fall back to the landing page', () => {
    render(
      <MemoryRouter initialEntries={['/finnes-ikke']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Ikke ta det første tilbudet.')).toBeInTheDocument()
  })
})
