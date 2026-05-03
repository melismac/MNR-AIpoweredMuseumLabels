# Esplora il Museo — Web UI Kit

Pixel-accurate recreation of the Museo Nazionale del Risorgimento Italiano web companion. Built from the reference codebase at `reference/` (mirror of `prova_sito_web/`).

## Components

- **Navbar.jsx** — sticky white bar with burger-toggler, horizontal logo, wordmark.
- **Drawer.jsx** — left offcanvas drawer with profile indicator + nav + profile accordion + language link.
- **Hero.jsx** — full-bleed photo hero with dark scrim and centered bold white title.
- **ProfileCard.jsx** — the signature card: 4:3 photo, 18px radius, soft shadow, hover lift, red CTA.
- **RoomAccordion.jsx** — accordion item with header + collapsible body (text column + photo carousel).
- **Button.jsx** — primary (red) / outline / pill variants, 44px min-height.
- **Footer.jsx** — thin two-line footer.
- **LanguagePicker.jsx** — used on the standalone `language.html` pattern.

## index.html

Interactive click-thru prototype: picks up at the language screen → home (four profile cards) → a Sala room (accordion + carousel + next-room CTA). State lives in React; `localStorage` persists language and active profile.

## What was not reproduced

- The real KnightLab timeline iframe and `<video>` embed are placeholder blocks with accurate chrome.
- The ElevenLabs audio-read button is UI-only (click does nothing).
- The actual Google Sites deep-links for rooms 2 and 3 are stubs.
