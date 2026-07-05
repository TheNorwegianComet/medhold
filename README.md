# Medhold

**«Ikke ta det første tilbudet fra forsikringsselskapet. Sjekk hva du faktisk har krav på.»**

Medhold is a Norwegian consumer web app — a "lowball-fighter" for insurance
settlements. A user uploads the settlement offer and their policy terms; the app
explains what the terms actually entitle them to, flags omitted or underpriced
items with references to specific clauses (§-referanser), and generates a
structured, polite-but-firm complaint letter. If the company won't budge, it
explains the path onward (internal complaint → Finansklagenemnda).

This repository is the coded implementation of a design handed off from
[Claude Design](https://claude.ai/design). The original HTML/CSS prototype and
the design conversation are preserved under [`project/`](project/) and
[`chats/`](chats/) for provenance.

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite** for dev/build
- **React Router** for the multi-page routing
- No UI framework — styling matches the design tokens in
  [`src/theme.ts`](src/theme.ts) (green/cream palette, Schibsted Grotesk +
  Source Serif 4).

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck + production build
npm run preview    # serve the production build
```

## Routes

| Path                 | Screen                                                              |
| -------------------- | ------------------------------------------------------------------ |
| `/`                  | Landing page — hero, example cases, "what we look for", pris, FAQ   |
| `/kom-i-gang`        | Get started — email / Vipps sign-in                                |
| `/sak`               | **Interactive prototype** — the 5-step flow (see below)            |
| `/eksempelsaker`     | Anonymised example cases (filterable)                              |
| `/eksempelsak`       | A single example case, told as a before/after story               |
| `/vilkar`            | Terms reader — a finding highlighted in the policy document        |
| `/mine-saker`        | Logged-in case dashboard for "Kari Holm"                           |
| `/finansklagenemnda` | Pre-filled complaint form for the financial complaints board       |
| `/personvern`        | Privacy / document-handling explainer                             |
| `/admin`             | Internal console — LLM provider routing & failover                |

## The interactive prototype (`/sak`)

A five-step state machine faithful to the original prototype logic:

1. **Last opp** — pick company + damage type, review uploaded documents
2. **Gratis sjekk** — teaser result (blurred findings) → unlock
3. **Betaling** — Vipps / card (349 kr)
4. **Full analyse** — click any _avvik_ (discrepancy) to include/exclude it; the
   claim total, progress bar and complaint letter all update live
5. **Klagebrev** — the generated letter; the **Høflig/Bestemt** tone toggle
   rewrites the intro, closing and argument list
6. **Veien videre** — timeline through to Finansklagenemnda

The analysis uses the "subtle" AI-visibility treatment (an honest
_"analysert automatisk — kontroller referansene"_ footnote), which the design
selected as the shipped default.

## The admin console (`/admin`)

Toggle **"Simuler nedetid"** on any provider (e.g. Anthropic) and the per-task
fallback chains reroute live: the AKTIV model moves down the chain, a banner
warns how many tasks were rerouted, and the event log records it. Toggle back
and traffic returns to the primary order.

## Project structure

```
src/
  theme.ts              design tokens (colors, fonts)
  index.css             reset, base styles, reusable button/hover classes
  App.tsx               router + scroll manager
  components/           Logo, SiteNav, SiteFooter
  pages/                one file per screen
project/                original Claude Design HTML/CSS prototype (reference)
chats/                  the design conversation (intent & decisions)
```

## Notes

- The mobile screens in the original design (iPhone mockups) are implemented as
  **responsive layouts** rather than a device frame — the same content reflows
  on small viewports.
- The design copy ships in the "kampklar" (battle-ready) tone the assistant set
  as default.
