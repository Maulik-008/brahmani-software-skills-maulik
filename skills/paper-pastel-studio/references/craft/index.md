# Craft layer: the rules that make it feel finished

The identity makes a screen *on-system*. The craft layer makes it *correct and pleasant to use*: exact values, keyboard and screen-reader behaviour, motion that helps, type that renders well, layouts that survive translation, copy that tells people what to do next.

It is adapted from Jakub Krehel's `better-*` skills (MIT, `THIRD_PARTY_NOTICES.md`), rewritten for this system, with the system's tokens and class strings filled in. Conflicts with the identity are settled in `../precedence.md`: read that first if two rules seem to disagree.

## Load only what the task touches

| The task involves | Load |
|---|---|
| Cards inside cards, buttons with icons, borders and shadows, images, icon sizing | `surfaces-and-icons.md` |
| Anything that moves or changes state: press, menus, dialogs, toasts, tabs, icon swaps, drag, page reveals | `motion.md` |
| Text: scale, line length, wrapping, truncation, numbers, fonts, punctuation, mobile inputs | `typography.md` |
| Palette changes, new colours, dark mode tuning, contrast, gradients, token naming | `color-and-contrast.md` |
| Anything interactive: forms, dialogs, menus, tabs, focus, hit areas, live regions, zoom | `accessibility.md` |
| Page structure, grouping, spacing, responsive behaviour, RTL, long translations | `layout.md` |
| Labels, buttons, errors, empty states, confirmations, toasts, numbers and dates | `writing.md` |
| Reviewing, auditing, "is this good", self-check before reporting | `review-protocol.md` |

Always-on minimum for any UI work: the **escalation triggers** in `review-protocol.md` (13 items, one screen of text). Everything else is loaded on demand.

## Principles that hold across all eight files

1. **Evidence over taste.** A finding is a measured value, a broken rule or a failure a user can hit. "I'd have chosen differently" is not a finding.
2. **Exact values, not ranges.** The numbers in these files are the substance. Judgement is reserved for optical nudges and for choosing among on-system options.
3. **The cheapest fix first.** Delete it, then use the platform, then reuse an existing token, then correct a value, and only then add something new.
4. **Platform before custom.** `<button>`, `<dialog>`, `:focus-visible`, `text-wrap`, container queries, `inert`. ARIA only when nothing native exists.
5. **State is never carried by one channel.** Colour, motion and position each need a second cue (label, icon, text).
6. **Measure, do not estimate.** Contrast, sizes, overflow, timing: run the tool (`contrast.py`, `verify-render.mjs`, devtools) before claiming.

## Provenance tags

**[craft]** a rule adapted from the source skills with its exact values. **[P&P]** how this system applies or constrains it. **[measured]** verified by running code in this skill.

If the `interfaces` plugin (Jakub Krehel's `better-interface`, `better-ui`, `better-motion`, `better-typography`, `better-colors`, `better-accessibility`, `better-layout`, `better-writing`) is installed in the host, you may run `better-interface` as an **independent** second opinion after building. Tell it about the deliberate-deviations register in `precedence.md` so it does not report the system's own choices. This skill never depends on it: the rules you need are in these files.
