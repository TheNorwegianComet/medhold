/**
 * Builds a single self-contained HTML file of the app (dist-demo/medhold-demo.html):
 * hash-routed, with JS/CSS inlined and the two font families embedded as
 * data-URI @font-face rules. Suitable for static hosts with a strict CSP
 * (no external requests), e.g. Claude Artifacts.
 *
 * Usage: node scripts/build-demo.mjs [--fonts-css path/to/fonts.css]
 *   The fonts CSS is the Google Fonts css2 response (woff2 URLs); when the
 *   flag is omitted or the file/downloads are unavailable, the demo falls
 *   back to system fonts.
 */
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist-demo')

// 1. hash-routed production build
execSync('npx vite build --outDir dist-demo-assets --base ./', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, VITE_ROUTER: 'hash' },
})
const assetsDir = resolve(root, 'dist-demo-assets/assets')
const files = readdirSync(assetsDir)
const js = readFileSync(resolve(assetsDir, files.find((f) => f.endsWith('.js'))), 'utf8')
const css = readFileSync(resolve(assetsDir, files.find((f) => f.endsWith('.css'))), 'utf8')

// 2. optional: inline latin-subset fonts as data URIs
let fontCss = ''
const fontsCssArg = process.argv.indexOf('--fonts-css')
if (fontsCssArg !== -1) {
  try {
    const src = readFileSync(process.argv[fontsCssArg + 1], 'utf8')
    // keep only the latin subset (covers U+0000-00FF incl. æøå)
    const blocks = src.match(/@font-face\s*{[^}]*}/g) ?? []
    const latin = blocks.filter((b) => b.includes('U+0000-00FF'))
    fontCss = latin
      .map((block) => {
        const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
        if (!url) return ''
        const b64 = execSync(`curl -s --max-time 20 "${url}" | base64 -w0`, {
          maxBuffer: 16 * 1024 * 1024,
        })
          .toString()
          .trim()
        return block.replace(url, `data:font/woff2;base64,${b64}`)
      })
      .join('\n')
    console.log(`inlined ${latin.length} latin @font-face blocks`)
  } catch (e) {
    console.warn('font inlining skipped:', e.message)
  }
}

// 3. assemble page content (no doctype/html/head/body — the host wraps it)
const escapedJs = js.replaceAll('</script>', '<\\/script>')
const page = `<title>Medhold — sjekk forsikringsoppgjøret ditt</title>
<style>
${fontCss}
${css}
</style>
<div id="root"></div>
<script type="module">
${escapedJs}
</script>
`
mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'medhold-demo.html'), page)
console.log(`wrote dist-demo/medhold-demo.html (${Math.round(page.length / 1024)} kB)`)
