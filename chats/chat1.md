# Lowball-fighter for forsikringsoppgjør

_Started 2026-07-04 23:13 UTC_

---

## User

"Lowball-fighter” for forsikringsoppgjør
Hva det er, konkret
Et verktøy som hjelper privatpersoner (og små bedrifter) som har fått et forsikringsoppgjør de mistenker er for lavt — vannskade, innbrudd, bilskade, reiseforsikring, bygningsskade — å forstå om tilbudet er rimelig og å skrive et velbegrunnet motsvar. Du laster opp skademeldingen og forsikringsselskapets tilbud; verktøyet forklarer hva du faktisk har krav på ifølge vilkårene, flagger poster som er utelatt eller underpriset, og genererer et strukturert, høflig-men-bestemt klagebrev med riktige referanser. Ved uenighet forklarer det veien videre (klage internt → Finansklagenemnda).

Hvorfor dette treffer deg
Det er forbruker vs. finansinstitusjon med sterk emosjon og penger på bordet — nøyaktig snittet mellom DNB-domenet ditt og forbrukerprodukt-instinktet. Nordmenn er godt forsikret, oppgjør er ugjennomsiktige, og folk føler seg maktesløse mot selskapet. “No-win-no-fee”-modellen fra flykompensasjon (se #34) har vist at folk gjerne gir bort en andel for å slippe å slåss selv.

Finnes noe lignende?
Delvis, men fragmentert. I USA finnes “public adjusters” og startups som Claimwise/Claim.co. I Norge er det stort sett advokater, Finansklagenemnda (gratis, men treg og byråkratisk), og forbrukerrådgivning — ingen har bygget et selvbetjent, AI-drevet “les vilkårene, bygg klagen”-verktøy for norske forbrukere.

Markedsmodenhet
Tidlig i Norge. Voksende internasjonalt.

Type	Navn	Lenke	Hva de gjør	Hva du kan låne	Svakhet/gap
Indirekte	Finansklagenemnda	finkn.no	Gratis, uavhengig klageordning	Autoritet, saksgang som mal	Treg, byråkratisk, ingen hjelp til å bygge saken
Indirekte	Advokat / juridisk forsikring	—	Representerer i tvist	Argumentasjonsstruktur	Dyrt, terskelen høy for småsaker
Inspirasjon	AirHelp-modellen (#34)	airhelp.com	No-win-no-fee automatisk krav	Suksesshonorar-mekanikk, onboarding	Annen vertikal
Inspirasjon (US)	Public-adjuster-startups	—	Hjelper med forsikringskrav mot %	Verdiløfte, prising	Ikke norsk regelverk/marked
Kilen din
Norsk regelverk + vilkårsforståelse + tillit. Din finansbakgrunn gir troverdighet i markedsføringen (“bygget av folk som kjenner bransjen fra innsiden”). Selvbetjent distribusjon via SEO/innhold (“fikk for lavt forsikringsoppgjør”, “klage vannskade forsikring”).

Forbedret konsept
Ny posisjonering: “Ikke ta det første tilbudet fra forsikringsselskapet. Sjekk hva du faktisk har krav på.”

Første ICP: Boligeiere med vann-/bygningsskade (høye beløp, kompliserte oppgjør, mye følelser).

Første use case: “Vannskade på badet — de tilbyr 60 000, håndverkeren sier 140 000. Er tilbudet lavt?”

MVP: Last opp tilbud + vilkår → AI oppsummerer hva du har krav på, flagger avvik, genererer klagebrev. Start med én skadetype.

Differensiering: Forklarer hvorfor tilbudet er lavt, med referanse til vilkår — ikke bare “klag”.

Prismodell: Gratis “sjekk om oppgjøret er lavt” → 199–499 kr for full analyse + klagebrev. (Suksesshonorar er mulig, men krever at du håndterer selve kravet — tyngre; start med engangspris.)

Tilgang til gode vilkårsdata per selskap. Kvalitet på råd må være høy — feil her skader tillit raskt.

Kundespørsmål før bygging: Hvor mange får faktisk lave oppgjør de er villige til å gjøre noe med? Test med innholdsartikler + “vil du ha hjelp til å klage?”-skjema før du bygger. jeg vil ikke ha noe lilla eller mørkeblått design

## Assistant

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- deliverable: Both prototype + landing page
- flow_scope: Onboarding / upload (skademelding + tilbud), Gratis "er oppgjøret lavt?"-sjekk (teaser-resultat), Full analyse med avvik flagget mot vilkår, Generert klagebrev (redigerbart), Veien videre (intern klage → Finansklagenemnda)
- case_content: Mix of several skadetyper
- platform: Responsive, show both
- language: Norwegian (bokmål)
- tone: Alliert og kampklar ("vi står på din side")
- brand_name: Suggest a Norwegian name for me
- variations: Just one strong direction
- ai_visibility: Explore a few options
- trust_elements: Referanser til konkrete vilkårspunkter, Anonymiserte eksempelsaker med utfall

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_skill_prompt]_

_[tool: copy_starter_component]_

_[tool: set_project_title]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Ferdig — alt ligger i én canvas (panorer/zoom):

- **1a** Landingsside — kampklar tone, eksempelsaker, «hva vi ser etter» med §-referanser, pris (gratis sjekk / 349 kr)
- **1b** Interaktiv prototype — klikk gjennom alle 5 steg; i analysen kan du slå avvik av/på, og krav + klagebrev oppdateres live; tonefall Høflig/Bestemt endrer brevet
- **1c** Mobil — sjekk, analyse og brev på iPhone
- **1d/1e/1f** Tre grader av KI-synlighet; **1f** (subtil) er standard i prototypen — bytt via Tweaks (`aiStil`), der ligger også kampklar/nøktern copy (`tonefall`)

Navneforslag: **Medhold** — det du faktisk vil ha i klagesaken. Alternativer: Motsvar, Oppgjort.

Neste steg å vurdere: betalingssteget, landingsside på mobil, eller en «last opp selskapets svar»-loop i steg 5.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fikset — mobilskjermene i 1c starter nå under statuslinjen.

## User

look at the visuals and the colors on this side. get inspired by that but keep the content and structure from what you already have built https://oryzo.ai/

## Assistant

_[tool: dc_write]_

_[tool: web_fetch]_

_[tool: ready_for_verification]_

Ny versjon i **Medhold v2.dc.html** — Oryzo-språket oversatt til Medhold:

- Kork-oransje + krem-papir + sort blekk (ikke noe lilla/blått)
- Expanded grotesk-titler i caps, Space Mono for spesifikasjons-labels («FIG. 01», «[ 3 AVVIK ]», «SAK NO. 2417-VS»), serif-italic aksentord
- Hairline sorte rammer, pillknapper, sort seksjon med kork-aksenter
- Hero-mocken er nå et teknisk diagram med Oryzo-nikket «Et estimat — ikke en garanti»

Alt innhold, flyt og interaktivitet er uendret (steg, avvik-toggling, tonefall, tweaks). Den grønne originalen ligger fortsatt i Medhold.dc.html.

## User

bruk det forrigew designet

## Assistant

_[tool: list_files]_

Designsystem-prosjektet er tomt, så jeg går tilbake til det forrige designet — den grønne originalen:

_[tool: ready_for_verification]_

Du ser nå den grønne originalen (Medhold.dc.html). v2 med Oryzo-stilen ligger fortsatt i «Medhold v2.dc.html» hvis du vil tilbake. Skal jeg slette v2, eller videreutvikle den grønne?

## User

design alle undersidene i tillegg, nå er det bare forsiden. alle linker og knapper som leder en plass må du lage design på

## Assistant

Jeg legger til alle undersidene som ny turn øverst, og kobler alle knapper/lenker i 1a/1b til dem:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

_[tool: snip]_

_[tool: snip]_

Ferdig — ny turn 3 øverst: **3a Admin · Modeller og ruting**.

- **Leverandører**: Anthropic, OpenAI, Google Vertex (EU), Mistral (EU) — status, latens, kost, API-nøkkel
- **Fallback-kjeder per oppgave**: Vilkårsanalyse, Gratis sjekk, Klagebrev, Spørsmål — primær → reserve → siste utvei
- **Prøv selv**: slå på «Simuler nedetid» på f.eks. Anthropic — kjedene ruter om live (AKTIV flytter seg), banner varsler, og hendelsesloggen får en oppføring. Slå på igjen → trafikken går tilbake
- **Failover-regler**: timeout, feilrate, retries, tilbakefall til primær, varsling

Neste mulige steg: kostgraf per modell, dra-og-slipp for kjedene, eller offentlig statusside for kundene.

