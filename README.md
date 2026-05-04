# Esplora il Museo — Design System

A design system for **Esplora il Museo**, a mobile-first, accessible web companion for the **Museo Nazionale del Risorgimento Italiano** (National Museum of the Italian Unification / *Risorgimento*) in Turin, Italy.

The product lets visitors pick one of four "profiles" — reading personas that change the narrative voice of the museum tour — and walk through the exhibit rooms (*sale*) at their own pace, via text, images, audio readings, and embedded KnightLab timelines.

## The product in one paragraph

*Esplora il Museo* is a companion web app for the physical museum. On the home page, the visitor picks one of four **profiles** — *Il Piccolo Visitatore* (young visitor), *Il Curioso* (the curious), *Il Visionario* (the visionary), *L'Esperto* (the expert) — each keyed to a 19th-century painting of a Risorgimento figure. From there, the site unfolds room by room (Introduzione → Sala 1 → Sala 2 → Sala 3), mixing short paragraphs of commentary, photo carousels of artworks and artefacts, embedded videos, and a KnightLab timeline. A language switcher plus an ElevenLabs text-to-speech button make the content more accessible.

## Products in this system

- **Web companion** (`ui_kits/web/`) — the single product. Public, multilingual (Italian / English), mobile-first, built on **Bootstrap 5.3** with a thin custom-overrides layer.

## Sources

All source material came from the user. The reader of this document probably cannot access the originals directly; originals are mirrored under `reference/` and `assets/`.

- **Reference codebase** (local mount): `prova_sito_web/`
  - `index.html` — home page with the four profile cards
  - `pv_sala_0.html` — "Piccolo Visitatore / Introduzione" room page (the template for every room view)
  - `language.html` — language-picker landing page
  - `css/style.css` — production stylesheet (Bootstrap overrides)
  - `css/style2.css` — second, more WCAG-conscious version of the same stylesheet (fluid type, 44px touch targets, reduced-motion support, skip link). Same visual language, more mature execution.
  - `server.js` — small Express proxy for an OpenAI translation call
  - `img/` — the museum's photographic archive (room 0–3), profile portraits, logos, hero imagery
- **Uploads** (user-attached): the museum's horizontal logo and the four profile portraits (see `assets/`).

## Index

```
colors_and_type.css          — All design tokens (colors, type, spacing, radii, shadows, motion)
README.md                    — This file
SKILL.md                     — Agent-invocable skill manifest
assets/                      — Logos, profile portraits, hero imagery, room photos
  logo_orizzontale.jpg       — Primary horizontal logo (red "!" + grey "R" + wordmark)
  logo_verticale.jpg         — Vertical/stacked logo variant
  profiles/                  — The four profile portraits (Altamura, Cospiratore Romantico, Garibaldi, Cavour)
  hero/                      — Full-bleed hero imagery (facciata, boy-with-flag, Garibaldi at Marsala…)
  rooms/                     — Selected interior / artefact photos (Sala 1, Palazzo Carignano, Parlamento Subalpino, etc.)
preview/                     — Small HTML cards that populate the Design System tab
reference/                   — Read-only mirror of the original codebase
ui_kits/web/                 — Pixel-accurate recreation of the site
  README.md                  — Component inventory + usage notes
  index.html                 — Interactive demo (home → profile → room)
  *.jsx                      — React components
```

## CONTENT FUNDAMENTALS

### Language
**Italian first, English available.** The default language is Italian; a dedicated `language.html` page with two buttons ("Italiano" / "English") sets `localStorage.language` and redirects home. The tone does not change between languages — the English version is a close translation of the Italian copy, not a separate voice.

### Voice & person
**Second person singular (tu), warm and inviting.** Never *Lei* (formal you), never *voi*. The site speaks *to* the visitor directly, as a friendly curator would. Examples from the home page:

> "Scegli il **profilo** che ti somiglia di più e lasciati guidare: nel momento in cui ti riconosci, inizia il tuo viaggio…"

> "Ti piace scoprire e farti domande? …il Museo è il luogo ideale per lasciarti guidare da racconti, oggetti e personaggi che ti accompagneranno, passo dopo passo, nella storia d'Italia."

> "Credi nel potere delle idee capaci di cambiare il mondo e unire le persone?"

### Tone
**Evocative, slightly literary, never academic.** Copy leans on *verbs of experience* — *scopri, lasciati guidare, immergiti, tuffati, riscopri, accompagnarti*. The museum is personified ("il Museo è la tua biblioteca vivente"). Sentences are medium-length, with one or two bold keywords per paragraph (`<b>profilo</b>`, `<b>guida virtuale</b>`) to give the eye a landmark. Rhetorical questions open many blocks: *"Ti piace scoprire…?", "Cerchi di comprendere…?"*.

### Casing
- **Title case** for section headings in the sidebar: *Home page, Il Piccolo Visitatore, L'Esperto, Sala 1*.
- **Sentence case** for body heading titles inside rooms ("Introduzione", "Introduzione alla Sala", "Media e Risorse", "Scorri la linea del Tempo!").
- **Button labels** are short imperatives in sentence case: *"Inizia l'avventura", "Scopri il Risorgimento", "Tuffati nel passato", "Riscopri la storia"*. Language buttons are in title case ("Italiano", "English").

### I / You
*You* (tu). Never *I*, never *we*. The institution refers to itself in the third person: *"il Museo celebra chi ha saputo mettersi al servizio di un ideale comune."*

### Emoji & symbols
Use is **minimal and utilitarian**, never decorative.
- 👤 as a placeholder avatar in the profile bar ("Nessun profilo selezionato").
- 🌐 as an icon for the "Choose your language" link.
- No other emoji anywhere in the product. The museum's own iconography is art historical (paintings), not emoji.

### Microcopy patterns
- Empty-state placeholder: *"Nessun profilo selezionato / Scegli un profilo per iniziare."*
- Accessibility label: *"Ascolta il testo"* (Listen to the text) with aria-live="assertive" while reading.
- Room footer CTA is always the **name of the next room** as the button label: *"Sala 1"*, *"Sala 2"* — not "Next" or "Continue".

### The vibe
Museum-curator-over-your-shoulder. Encouraging, a little romantic about history, never condescending. The young-visitor profile gets the same respectful tone as the expert profile — only the complexity of the referenced material changes.

## VISUAL FOUNDATIONS

### Overall vibe
**Google-Sites-like chrome around painterly content.** The UI is intentionally plain — white cards, soft grey page background, one red accent — and gets out of the way of the artwork. Risorgimento-era oil paintings and photographs of the museum rooms do the visual heavy lifting.

### Colors
- **Primary: red `#dc2626`** (`--emu-red-500`) — extracted from the exclamation mark in the logo's "!R" mark. Used exclusively for the primary CTA. Hover darkens to `#b91c1c`, active to `#991b1b`. The earlier stylesheet (`style.css`) transitioned primary-to-charcoal on hover; the later WCAG-corrected stylesheet (`style2.css`) uses red→darker-red instead. **We adopt the darker-red behavior** — it reads as "the same action, pressed" rather than "a different action".
- **Charcoal text** `#202124` / `#3c4043` / `#5f6368` — three values, warm-cool neutral.
- **Greys** `#f8f9fa` (page) → `#f1f3f4` (hover) → `#ececec` (card border) → `#e6e6e6` (divider) → `#dadce0` (strong border).
- **Google blue `#1a73e8`** is retained from the original stylesheet for nav-link active state, list-group active state, and focus outlines only. **Not** a brand color. Never use it for CTAs.

### Type
**System stack only.** `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, …`. No webfont loaded. Weights 400 (body), 600 (headings, nav, buttons), 700 (hero). Letter-spacing 0.2px on headings. Line-height 1.3 for headings, 1.6–1.7 for body. Heading font-size in the hero uses `clamp(1.25rem, 4vw, 2rem)` — genuinely fluid, not stepped breakpoints.

*For off-site materials* (slides, editorial layouts, print), the system allows a serif companion — Cormorant Garamond / EB Garamond / Georgia — to echo the 19th-century paintings that illustrate each profile. The production web app does not ship a serif.

### Backgrounds
- Pages: flat `#f8f9fa`.
- Navbar: flat `#ffffff` with a `#e6e6e6` bottom border.
- Hero: **full-bleed photograph** (`.intestation`) with a dark scrim overlay `rgba(0,0,0,0.45)` and white, bold title centered. No gradients, no tinted gels, no illustrations — just the photo and the scrim.
- Cards: flat white with a 1px `#ececec` border and a soft shadow. No inner gradient, no patterned fill.

### Imagery
**Warm, slightly desaturated, oil-paint-led.** The profile portraits are 19th-century Italian paintings (Altamura, Induno, Dugoni-attrib, Sindor/Dugoni — documented in `assets/profiles/`). Room photography is architectural and museographic — vaulted ceilings, statues, illuminated display cases, framed artefacts on red velvet. Overall palette of the imagery skews **warm**: reds, ochres, wood browns, cream walls. No black-and-white, no grain filter, no high-contrast photography. Images are shown on cards with `aspect-ratio: 4/3` and `object-fit: cover`, and in heroes as full-bleed cover backgrounds.

### Motion
- **Short, functional, fades and colour shifts only.** Durations 0.15s (links, nav, accordion) and 0.2s (cards, buttons). Easing: plain `ease`.
- **No bouncing**, no spring, no slide-ins, no fancy hero animation.
- **Card hover** lifts the card 2px (`translateY(-2px)`) and deepens the shadow from `0 2px 8px` to `0 8px 24px`.
- **Button :active** scales down to `0.98` — a tiny press feedback.
- **prefers-reduced-motion** is fully honoured (`style2.css`, "section 13"): all transitions collapse to 0.01ms and the card lift is disabled.

### Hover states
- **Buttons**: background darkens within the same hue (red→darker red, grey→darker grey). No colour change.
- **Cards**: shadow deepens + 2px lift.
- **Nav links**: colour shifts from `#3c4043` charcoal → `#1a73e8` blue.
- **List-group items**: background fills with `#f1f3f4`, text shifts to `#1a73e8`.
- **Dropdowns**: row fills with `#f1f3f4`, text stays charcoal.

### Press states
- Buttons: `transform: scale(0.98)` + further-darkened background (`#991b1b` for primary).
- Cards: the hover state persists; no additional press treatment.

### Borders
- Default border colour `#e6e6e6`, thickness 1px.
- Strong border `#dadce0` (for outline-secondary buttons).
- The accordion and list-group use `#ececec` variants via Bootstrap defaults.

### Shadows
A soft two-step elevation system:
- **Resting** `0 2px 8px rgba(60,64,67,0.10)` — profile cards, surfaces.
- **Elevated** `0 8px 24px rgba(60,64,67,0.10)` — generic `.shadow-sm` utility.
- **Floating** `0 8px 24px rgba(60,64,67,0.18)` — hovered cards.
- **Dropdown** `0 12px 28px rgba(60,64,67,0.18)` — dropdown-menu, offcanvas-like surfaces.

Note: shadows are tinted with charcoal `(60,64,67)` not pure black — keeps them cool and consistent with the text palette. No inner shadows anywhere.

### Protection gradients vs capsules
**Capsules, always.** Hero titles sit on a flat `rgba(0,0,0,0.45)` scrim across the entire hero, reinforced by a subtle `text-shadow: 0 1px 3px rgba(0,0,0,0.4)` on the text itself (from `style2.css`). No gradient-to-transparent treatments. The scrim is opaque at a single value.

### Layout rules
- **Mobile-first.** Base design is single-column; 2-col grid kicks in at `md` (≥768px); 4-col grid at `xl` (≥1200px) — but the production site actually caps profile cards at 2-col because the four portraits read better larger.
- **Container** caps at Bootstrap's default `1140px`. Content never feels edge-to-edge on desktop.
- **Sticky nav** at the top (`.sticky-top`). The burger-toggler lives at the far left, followed by the logo+wordmark.
- **Offcanvas left drawer** for full navigation on all screen sizes — this site chose not to expand to a full desktop nav, even at `lg`. Everything stays in the drawer.
- **Footer** is thin: a copyright line + a subtitle, both in `.text-secondary small`.

### Transparency & blur
- Hero scrim uses alpha (`rgba(0,0,0,0.45)`). That is the only intentional use of transparency.
- **No backdrop-filter, no blur effects anywhere.** Not on the navbar, not on cards, not on modals. This is a flat system.

### Corner radii
A deliberate ladder:
- `4px` — focus rings
- `8px` — nav toggler, accordion item chrome
- `10px` — buttons (including CTA button inside cards), list-group items
- `14px` — dropdown menu
- `18px` — `.rounded-4`, profile cards and large surfaces
- `999px` (pill) — available via `.rounded-pill` but used sparingly.

### Cards — the signature component
```
1px border  #ececec
18px radius
shadow-sm   0 2px 8px rgba(60,64,67,0.10)
overflow: hidden (photo bleeds to the 18px corner)
hover:  translateY(-2px) + shadow to 0 8px 24px rgba(60,64,67,0.18)
```
Inside: a 4:3 cover image, then `1.25rem` padding body with `gap: 0.75rem` between `h3`, description, and CTA button. CTA button is `width: 100%`, `min-height: 44px`, red.

### Touch & accessibility
- Minimum touch target **44×44px** — enforced explicitly on `.btn`, `.nav-link`, `.accordion-button`, `.list-group-item-action`, `.dropdown-item`, `.navbar-toggler`.
- Skip-link pattern included in `style2.css`.
- Focus ring is a solid `3px #1a73e8` at `3px` offset with `4px` radius — bright enough to read on photo heroes.

## ICONOGRAPHY

**The museum app does not ship an icon set.** The codebase uses, in total:
1. **Two emoji as icons** — 👤 (profile placeholder) and 🌐 (language link). Both are inline Unicode characters, not assets.
2. **Bootstrap's built-in icons via CSS masks** — the hamburger toggler (`.navbar-toggler-icon`), the accordion chevron (`.accordion-button::after`), the offcanvas close button (`.btn-close`), and the carousel control arrows (`.carousel-control-prev-icon` / `.carousel-control-next-icon`). These are all SVG data URIs inside `bootstrap.min.css` — they inherit the current `color` and therefore restyle automatically.
3. **Photographic imagery** in place of custom illustration — each profile is introduced by a 19th-century painting, not an icon. This is the brand's deliberate choice: art in lieu of icons.

**Guidance for this design system:**
- If an icon is needed, **prefer a Bootstrap Icons glyph** (CDN: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css`) — same stroke weight and grid as the masks Bootstrap already uses in the reference codebase. This is our **standard substitution** because no first-party icon set exists.
- Do not hand-draw SVG icons. Do not introduce Lucide / Heroicons / FontAwesome unless explicitly requested.
- **Never introduce new emoji** beyond the two existing ones without approval — the museum tone is not emoji-forward.
- For figurative/hero content, reach for the **paintings and photographs** in `assets/`. They are the icon system.

### Inventory in `assets/`
- **Logo**: `logo_orizzontale.jpg` (primary), `logo_verticale.jpg`.
- **Profile portraits** (the four "icons" of the home page):
  - `piccolo_visitatore.jpeg` — Saverio Altamura, *Il fanciullo italiano* (boy with tricolour flag, 1860s).
  - `curioso.jpg` — *Il cospiratore romantico* (romantic conspirator portrait).
  - `visionario.jpeg` — Garibaldi sbarco di Marsala (Garibaldi at Marsala).
  - `esperto.jpeg` — Portrait of Camillo Benso, Conte di Cavour.
- **Hero imagery**: `facciata_home.jpg` (Palazzo Carignano façade, the home-hero), `ragazzo_altamura.jpg`, `cavour_ritratto2.jpg`, `cospiratore_romantico.jpg`, `garibaldi_marsala.jpg`.
- **Room photos**: selected interiors and artefacts from Sala 0 (introduction, Parlamento Subalpino) and Sala 1.

## FONTS — substitution notice

**The production site uses only the OS system font stack; no webfont is loaded.** We have not substituted anything for the core UI. The system stack is preserved faithfully in `--emu-font-sans`.

The design system also proposes an **optional serif companion** (`--emu-font-serif`: Cormorant Garamond / EB Garamond / Georgia) for off-site materials such as decks or editorial layouts. Cormorant Garamond and EB Garamond are available on Google Fonts; Georgia is a system fallback. **This serif is not loaded by default** and is not used by `ui_kits/web/`. Flag to the user if they want us to commit to a specific serif.

## CAVEATS

- **The translation API call** in `server.js` is a minimal OpenAI proxy; it is not part of the visual system and is documented only as context.
