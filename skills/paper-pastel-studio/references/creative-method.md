# The creative method: "hard work, every element"

The tokens and recipes make a screen **on-system**. This method makes it **good**. A tidy reskin is a failure. Generic cards, a centred logo over a centred card, template heroes and "AI-looking" layouts get rejected. [core]

The structured version of this method, with the anti-template tests and the usability checks, is `design-process.md`. The micro-moments below must respect `craft/motion.md` (frequency decides what may animate; every animated state also leaves a static cue).

## The brief to give yourself (and any sub-agent) every time
> Redesign every element again. Pick every element and think about how to make it more modern, good, attractive and unique, and how people will be here more and feel more excitement and engagement.
> Do more creative design for every tab and every element. This is an important feature of our users and must be great to work with, so do the hard work: style every tab's each component's each element, one by one, and make them great.

## Process (in order)
1. **Read the real code and capture "before"**: files, states, data, measurements (control heights, where the first useful content sits). Judge at realistic desktop widths (1280, 1440, 1920) and 375, not an 800px window.
2. **Analyse first**: who uses this, what do they want in the first five seconds, what is confusing or wasted space, what makes them come back. One short concept per page, one line per element.
3. **Build a shared kit first** (one file), then convert tab by tab, element by element, reusing one visual vocabulary so related pages feel like one product.
4. **Add delight to every element** (catalogue below), all cheap CSS/transform motion, reduced-motion safe.
5. **Second opinion** from another design/accessibility lens if available; apply and say what changed.
6. **Verify in a browser** (both themes, five widths, axe). If the page needs auth or a backend, use a throwaway mock with rich data (many items, every state, signed in and guest) and **delete every mock file afterwards**.
7. **Report honestly**: before/after, per element what changed and which engagement moment it adds, what could not be verified.

## Confirmed taste (use it)
- **Pastel paper, not dark panels.** White or pastel surfaces, a per-page pastel gradient background (one hue family per page) with a card lifting off it by hairline + soft shadow. Big dark side panels on marketing/auth pages were **rejected**. Dark only through the theme toggle.
- **Compact scale.** Everything starts "too big". Control height 32 to 40px, titles about 20 to 24px, body 13 to 14px, meta 11 to 12px mono. Slim headers, content above the fold. Keep a 44px hit area invisibly.
- **Square-ish form cards.** A tall narrow form looks wrong: widen the card, two columns for field pairs, one on phones.
- **Signature elements**: a marker-underlined key word in headings (pastel `from-chip-*` stroke), icon-chip fields, a segmented progress strip in the six hues, pill tab switchers, the ink pill CTA with an arrow in a circle, pastel error panels with an icon, mono micro labels,
  a tinted header band inside cards, Show/Hide text pills for passwords, rule chips that light up live, watermarks on tiles, avatar stacks, breathing live dots.
- **A brand lockup**: mono wordmark with an accent dot plus a small mark on a pastel disc in a white pill.
- **One toolbar, not three rows.** Merge tabs, search, sort and filters into one compact row; active-filter chips only when set.
- **Secondary help behind a button** (a popover), not permanently on the page.
- **Calm loading, never skeleton flicker.** Invisible for about 280ms, then a small spinner with a mono label, height reserved. Skeletons only for large lists that reliably take long.
- **Designed states everywhere**: loading, empty (illustration + friendly line), error with retry, offline, full/locked/ended, signed out.

## Engagement micro-moments (pick per element, do not force all)
Count-up numbers that tick once. Breathing live dot. Staggered tile arrival. Hover lift and a soft sheen. Pop-in for chips and slots. Copy button that flips to a check. Confetti and ripple on completion. Streak flame flicker. Medal shimmer once. Reaction glyph that pops and settles.
"N active now" presence chip. Welcome chip on join. Sticky date chips and a scroll-to-latest pill in chat. A ticket strip for code entry that lights one slot per character. A live preview tile in create flows that takes the chosen option.
All CSS/transform, cheap, and reduced-motion safe.

## Hard rules (always)
- **Visual layer only.** Preserve behaviour (APIs, sockets, flows, auth gating, routes, query params, analytics, data shapes). **Never invent data, numbers, names or social proof**; show a designed empty state.
- **Tokens only**: no raw Tailwind colours or hex; `chip-*`/`tint-*` for category colour. Lucide only. Radius ladder and pills. Mono for numerals/meta.
- **One filled primary action per view.**
- Titles never end with a brand suffix. Headings never end in a full stop. No em dashes in visible copy. Never show a raw route/URL as visible text; never link a page to itself.
- SEO and robots stay as they are unless told otherwise; one `h1`; `noindex` stays `noindex`.
- Accessibility per quality-gates.md. Desktop first, mobile complete. Never ship `user-scalable=no`.
- Do not commit or push without being asked.

## Practical gotchas
- Shell-based Python/sed edits mangle backslashes. Write the script to a file.
- Re-read a file before editing if someone else may have changed it.
- Headless screenshots can time out or crop; retry, and measure with JavaScript (sizes, overflow, class state). CSS transitions may not advance in a hidden pane.
- Run `tsc --noEmit` and filter for the files you touched; unrelated repo errors may already exist.
- Keep a status file with one row per route.

## Report format
Per page, per tab, per element: what it is now and the engagement moment it adds. Then the SKILL.md report.
