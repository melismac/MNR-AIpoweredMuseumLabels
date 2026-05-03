---
name: esplora-il-museo-design
description: Use this skill to generate well-branded interfaces and assets for Esplora il Museo (Museo Nazionale del Risorgimento Italiano), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (colors_and_type.css, assets/, preview/, ui_kits/web/).

Key things to know up front:
- Italian-first mobile-first web companion for the Torino Risorgimento museum.
- Brand red is `#dc2626` (CTA only). Text is charcoal `#202124` / `#3c4043` / `#5f6368`. Page is `#f8f9fa`. Google-blue `#1a73e8` is reserved for link-active / focus only.
- System font stack — no webfont is loaded in production. A serif companion (Cormorant / EB Garamond / Georgia) is declared in `--emu-font-serif` for editorial layouts only.
- Tone: second-person (tu), warm, slightly literary, never academic. Rhetorical questions are idiomatic.
- Emoji is minimal: 👤 and 🌐 only. Iconography is either Bootstrap's built-in masks or Bootstrap Icons (CDN).
- Hero = full-bleed photograph + `rgba(0,0,0,0.45)` scrim + white bold title. No gradients.
- Cards = 18px radius, 1px #ececec border, soft `0 2px 8px rgba(60,64,67,0.10)` shadow, hover lifts 2px.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and apply the rules above to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
