import { test, expect, type Page } from '@playwright/test'

const routes: [string, string][] = [
  ['/', 'Ikke ta det første tilbudet.'],
  ['/kom-i-gang', 'Sjekk oppgjøret ditt. Gratis.'],
  ['/eksempelsaker', 'Saker som lignet på din'],
  ['/eksempelsak', 'Vilkårene ga 152 000'],
  ['/vilkar', '§ 6 Fradrag ved erstatningsberegning'],
  ['/mine-saker', 'dette skjer i sakene dine'],
  ['/finansklagenemnda', 'Klage til Finansklagenemnda'],
  ['/personvern', 'Dokumentene dine — kort forklart'],
  ['/sak', 'Last opp dokumentene'],
  ['/admin', 'Ruting per oppgave'],
]

function collectPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

test.describe('routes', () => {
  for (const [path, marker] of routes) {
    test(`${path} renders without JS errors`, async ({ page }) => {
      const errors = collectPageErrors(page)
      await page.goto(path)
      await expect(page.getByText(marker).first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }
})

test.describe('mobile (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (const [path] of routes) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(1)
    })
  }
})

test.describe('the 5-step wizard', () => {
  test('full happy path: upload → sjekk → betaling → analyse → brev → veien videre', async ({ page }) => {
    await page.goto('/sak')
    await page.getByText('Start gratis sjekk →').click()
    await expect(page.getByText('Tilbudet ditt ser lavt ut.')).toBeVisible()

    await page.getByText('Lås opp full analyse · 349 kr').click()
    await page.getByText('Betal 349 kr med Vipps').click()
    await expect(page.getByText('Full analyse · Vannskade bad')).toBeVisible()
    await expect(page.getByText('99 300 kr')).toBeVisible()

    await page.getByText('Generer klagebrev →').click()
    await expect(page.getByText(/Klage på oppgjørstilbud – vannskade bad/)).toBeVisible()

    await page.getByText('Merk som sendt →').click()
    await expect(page.getByText('Klagen er sendt. Nå venter vi — sammen.')).toBeVisible()
  })

  test('toggling an avvik updates the totals and the letter', async ({ page }) => {
    await page.goto('/sak?steg=2')
    await page.getByText('Riving og avfallshåndtering').click()
    await expect(page.getByText('80 800 kr')).toBeVisible()
    await expect(page.getByText('+ 20 800 kr')).toBeVisible()

    await page.getByText('Generer klagebrev →').click()
    await expect(page.getByText('Vilkår § 5.2 · s. 14')).toBeVisible()
    await expect(page.getByText('Vilkår § 5.1 · s. 13')).not.toBeVisible()
  })

  test('tone toggle rewrites the letter', async ({ page }) => {
    await page.goto('/sak?steg=3')
    await expect(page.getByText(/jeg krever at oppgjøret vurderes på nytt/)).toBeVisible()
    await page.getByText('Høflig', { exact: true }).click()
    await expect(page.getByText(/ber derfor om en ny vurdering/)).toBeVisible()
    await expect(page.getByText(/håper vi finner en god løsning/)).toBeVisible()
  })

  test('deep links land on the right step and clamp out-of-range values', async ({ page }) => {
    await page.goto('/sak?steg=3')
    await expect(page.getByText(/Klage på oppgjørstilbud – vannskade bad/)).toBeVisible()
    await page.goto('/sak?steg=99')
    await expect(page.getByText('Klagen er sendt. Nå venter vi — sammen.')).toBeVisible()
  })
})

test.describe('admin failover', () => {
  test('simulating downtime reroutes chains, logs once, and recovers', async ({ page }) => {
    await page.goto('/admin')
    const anthropicSwitch = page
      .getByText('Simuler nedetid')
      .first()
      .locator('xpath=following-sibling::div[1]')
    await anthropicSwitch.click()

    await expect(page.getByText('NEDE (SIMULERT)')).toBeVisible()
    await expect(
      page.getByText('1 leverandør nede — 4 oppgaver er rutet om automatisk. Brukerne merker ingenting.'),
    ).toBeVisible()
    await expect(page.getByText(/markert nede \(simulering\)/)).toHaveCount(1)

    await page.getByText('Slå på igjen').first().locator('xpath=following-sibling::div[1]').click()
    await expect(page.getByText(/frisk igjen etter helsesjekk/)).toHaveCount(1)
    await expect(page.getByText('NEDE (SIMULERT)')).not.toBeVisible()
  })
})

test.describe('navigation', () => {
  test('landing CTAs lead to kom-i-gang, which starts a case', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sjekk oppgjøret gratis' }).first().click()
    await expect(page).toHaveURL(/\/kom-i-gang$/)
    await page.getByText('Start sjekken →').click()
    await expect(page).toHaveURL(/\/sak$/)
  })

  test('eksempelsaker cards open the case story', async ({ page }) => {
    await page.goto('/eksempelsaker')
    await page.getByText('Les hele saken →').first().click()
    await expect(page).toHaveURL(/\/eksempelsak$/)
    await expect(page.getByText('«De tilbød 84 000. Vilkårene ga 152 000.»')).toBeVisible()
  })

  test('mine-saker buttons deep-link into the case', async ({ page }) => {
    await page.goto('/mine-saker')
    await page.getByText('Se klagebrevet').click()
    await expect(page.getByText(/Klage på oppgjørstilbud – vannskade bad/)).toBeVisible()
    await page.goBack()
    await page.getByText('Åpne saken →').click()
    await expect(page.getByText('Klagen er sendt. Nå venter vi — sammen.')).toBeVisible()
  })

  test('in-page hash links scroll, including on a second click', async ({ page }) => {
    await page.goto('/')
    const pris = page.getByRole('link', { name: 'Pris', exact: true })
    await pris.click()
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 3000 })
      .toBeGreaterThan(100)
    await page.evaluate(() => window.scrollTo(0, 0))
    await pris.click()
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 3000 })
      .toBeGreaterThan(100)
  })

  test('analysis § references open the vilkårsleser and ✕ returns to the case', async ({ page }) => {
    await page.goto('/sak?steg=2')
    await page.getByText('Vilkår § 6.3 · s. 17').click()
    await expect(page).toHaveURL(/\/vilkar$/)
    await expect(page.getByText('§ 6 Fradrag ved erstatningsberegning')).toBeVisible()
    await page.getByText('✕').click()
    await expect(page).toHaveURL(/\/sak$/)
  })
})
