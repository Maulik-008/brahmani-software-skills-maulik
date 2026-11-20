# Website patterns (marketing, content, auth) [core templates, ext detail]

Classify the page into a family first. If nothing fits, name the closest family and extend it; do not invent a new visual language.
All families are Direction A. A complete page built from the kit is `assets/starters/react-kit/components/demo-page.tsx`; a single-file version is `assets/starters/html/index.html`.

## Global chrome
- **Navigation**: floating pill nav (components.md). **Footer**: surface-1 + dot grid, tint-blue CTA card, columns, mono bottom bar.

## Home / landing
`Nav -> hero -> proof (only if real) -> features (featured + secondary + minimal) -> process -> testimonials (only if real, tinted, hues cycled) -> FAQ -> footer CTA`. Alternate `bg-surface-1` bands.
- **Hero**: eyebrow chip, **solid-ink** `text-display-sm sm:text-display md:text-display-lg` headline (never a gradient), `max-w-2xl` muted lead, **one** `bg-cta` + one `outline`.
  Size the hero to its content, not `100vh`. Optional aurora + noise behind it.
- **Features**: 3 featured showcase cards (staggered) + a row of 4 list cards + 3 minimal cards. Never 9 identical cards.
- **Process**: a real sequence only. Numbered markers appear only if the order is information. Otherwise use icon chips.
- **Proof / testimonials / stats**: real, attributed, or absent. A designed empty section beats an invented quote. Hero stats need a source.
- **FAQ**: hairline `divide-y` list in a `rounded-[24px]` surface-1 card, native `<details>`.

## Detail / SEO landing (many near-identical pages)
Nav, hero with a preset/option pill row (current = `bg-cta`, siblings = `outline`) beside the primary interactive card, 3 secondary "why" cards, related items as compact list cards (hue cycled), FAQ, footer.
One `h1`, correct heading order, unique `<title>` and description per page, never a brand suffix after the page title.

## Blog
- **Index**: centred hero, category filter pills, a featured post (large `bg-tint-{hue}` card), a grid of blog cards (cycled tint, mono category pill, meta row), footer.
- **Post**: category chip, `text-display-sm` title, meta row, cover as a `bg-tint-{hue}` band with a big watermark icon (never a stock photo), two-column body (prose `max-w-2xl`, callouts) + a sticky right rail (TOC + one related-action card).

## Pricing
Three plans: featured (`rounded-[28px]` tint, the one `bg-cta`), two secondary (`surface-1`). Mono prices with `tabular-nums`, `Check` rows in `chip-emerald`, FAQ below. State what is and is not included.

## Contact / forms
Single `rounded-[24px]` card, label-above fields, icon-chip fields, two-column pairs on desktop (single on phones), inline errors, `bg-cta` submit, a **real success state**. Wider-than-tall: a tall narrow form looks wrong.

## Auth (login / register / forgot)
A light pastel page background in **one hue family**, a wide card with a tinted header band, two-column field pairs, icon-chip inputs, a Show/Hide text pill for passwords, live password-rule chips that light up,
one ink pill CTA with an arrow in a circle, social sign-in as outline pills. **No big dark panel** (the owner rejected it). A brand lockup: mono wordmark with an accent dot plus a mark on a pastel disc in a white pill.

## Visual and SEO hygiene
- No stock photos as covers: use tint bands with watermarks. Real photos only when they are real (people, product).
- Keep one `h1`; `noindex` pages stay `noindex`; routes, slugs and structured data are not touched by a reskin.
- Headings never end in a full stop. No em dashes in visible copy. Never show a raw route or URL as visible text; use named links and never link a page to itself.
- Images via the framework image component with explicit `sizes`; alt text real or empty.

## Tone of copy
Calm, plain, specific. Name things by what people recognise. Active voice; controls say what happens ("Publish", then "Published"). Errors say what went wrong and how to fix it.
