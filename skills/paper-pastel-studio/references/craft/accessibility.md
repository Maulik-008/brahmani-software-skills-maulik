# Accessibility

[craft] adapted from `better-accessibility`. Every failure is reported against a **WCAG 2.2 A/AA criterion number**, a **task an assistive-technology user cannot complete**, or an **escalation trigger** (`review-protocol.md`). Everything else is a recommendation and is never HIGH (AAA, APG conventions, one `h1`, validate-on-submit, 44/40px targets).

**Two walks, always:** keyboard only (every flow, no mouse) and screen reader (name, role, state). Prefer the platform default over a custom control; **remove ARIA rather than add it.**

## 1. Native first

`<button>` for actions, `<a href>` for navigation, never `<div onClick>`. Links keep Cmd/Ctrl/middle-click. First rule of ARIA: do not use ARIA when a native element exists.

- **Disabled:** native `disabled` for genuinely unavailable controls. `aria-disabled="true"` only when the control must stay focusable (then block pointer, keyboard and form behaviour in code). Never both on one element. A tooltip on a natively disabled control never fires.
- **Accessible name precedence:** `aria-labelledby` > `aria-label` > native label, text or `alt` > `title`. Prefer visible text, and keep the visible label inside the accessible name (2.5.3). **Icon-only control:** `aria-label` on the button, `aria-hidden="true"` on the icon.
- Common mistakes: `aria-label` on a generic `div` or `span`; a redundant `role` on a `button`; `aria-labelledby` to a missing id; `role="menu"` on a navigation list; `aria-hidden` on an ancestor of a control.

## 2. Focus

- Style `:focus-visible`, not bare `:focus`. Prefer the browser's ring, or `outline: 2px solid hsl(var(--ring)); outline-offset: 2px` (the system's ring). `--ring` measures 5.07:1 on white and 5.95:1 on ink [measured]. A custom ring must reach **3:1 against every colour it crosses** (1.4.11). The AAA target (2.4.13) is a 2px perimeter with a 3:1 change of contrast.
- **Never `outline: none` / `outline-none` without a verified replacement** (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`). Keep system colours in forced-colors mode (`forced-color-adjust: none` only where checked).
- **A focused element must not hide behind a sticky or floating header or footer** (2.4.11). The system has a floating nav: `html { scroll-padding-top: 6rem }` (in `assets/craft.css`). Anchor targets use `scroll-margin-top`, but never both padding and margin for the same header.
- **Skip link** to `<main id="main">` as the first focusable element:
  ```css
  .skip-link { position: absolute; inset-inline-start: -999px; }
  .skip-link:focus { inset-inline-start: 16px; inset-block-start: 16px; }
  ```
- Focus management: dialogs focus the first focusable on open (the **least destructive** action for a destructive dialog) and return focus to the trigger on close. An SPA route change updates `document.title`, moves focus to the new view's `h1` or `main` (`tabindex="-1"`), restores scroll on back/forward and scrolls to top on a new navigation.

## 3. Keyboard

Every pointer interaction needs a keyboard path. `tabindex="0"` joins the tab order, `tabindex="-1"` is for programmatic focus, **never positive values**. Composite widgets use roving tabindex (active item 0, others -1).

| Widget | Keys |
|---|---|
| Dialog | Tab / Shift+Tab trapped inside; Escape closes |
| Tabs | Arrows wrap; Home/End; Tab leaves to the panel (automatic or manual activation) |
| Menu button | Enter / Space / ArrowDown opens and focuses the first item; ArrowUp the last; Escape closes and refocuses the button |
| Disclosure | Button with `aria-expanded`; Enter / Space toggles |
| Combobox | ArrowDown opens; Enter accepts; Escape closes and returns to the input; typing filters; `aria-activedescendant` on the input |
| Listbox / radio group | Arrows move selection; one Tab stop |

Escape dismisses the **last opened** layer first: tooltip, then menu, then dialog. Enter in a textarea inserts a newline; Ctrl/Cmd+Enter only if you implement it. Use Radix/Base UI primitives for these: they already encode the table.

## 4. Dialogs

Prefer `<dialog>` with `showModal()` (inert background, Escape built in). Custom: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, the background `inert`, and the dialog rendered outside the inert container (portal or sibling).

## 5. Hit areas

- WCAG 2.5.8 AA: **24 x 24 CSS px** minimum (with exceptions). Aim **44 x 44 on touch, 40 x 40 in dense desktop UI** (heuristic; the system uses 44). AAA 2.5.5 is 44 x 44.
- Spacing exception: an undersized target passes if a 24px circle centred on it touches no other target's circle (a 20px target needs 4px of gap).
- **Extend invisibly**, never by enlarging the visual: a pseudo-element (the kit's `after:absolute after:-inset-1.5`, or `.tap-target`). Put it on the `<label>` or `<button>`, not an `<input>`. Two controls' hit areas never overlap: shrink the pseudo-element to the largest size that does not collide.
- Decorative layers: `pointer-events: none` (and `aria-hidden` if an element).
- **Every drag needs a single-pointer alternative** (2.5.7); multipoint and path gestures need one too (2.5.1). `touch-action: none` only on a surface that implements its own gestures.

## 6. Forms

- Every input has a `<label for>` or a wrapping label. **Placeholder is never the label.** A checkbox and its text share one hit target.
- **Validate on submit. Never disable submit until valid** (exception: a destructive confirm whose label states the requirement, such as typing the name). Keep submit enabled, show a spinner beside the original label, use `aria-disabled="true"` while pending (native `disabled` drops focus).
- Errors: `aria-invalid="true"` on the failing field, `aria-describedby` pointing at an **inline error element beside the field**, focus the first invalid field on failure, `novalidate` on the form when you render your own errors. Not a red border alone. Do not block typing; trim before validating.
- Success: a polite live region. Form-level failure: `role="alert"` (form-level only).
- Valid `autocomplete` tokens (1.3.5): `name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-line1`, `postal-code`, `country`, `cc-number`, `cc-exp`, `cc-csc`, `cc-name`, `username`, `current-password`, `new-password`, `one-time-code` (prefix a section, for example `shipping street-address`).
- `inputmode="numeric"` for OTP, PIN and card numbers (keep `type="text"`); `decimal` for money; `type="number"` only for a true quantity. `spellcheck="false"` on emails, codes and usernames. **Never block paste.**
- [P&P] Input text is 16px on mobile (`typography.md` section 6). Input boundary contrast: see `../precedence.md`.

## 7. Announcements

| Need | Use |
|---|---|
| Field-specific message | `aria-describedby` |
| Non-urgent, not tied to a field (toast, count, loading) | `role="status"` (polite, atomic) |
| Urgent, not tied to a field (session expiry, form-level error) | `role="alert"` (assertive, atomic) |

**Mount the empty live region in the DOM before you write text into it.** Default to polite. Never move focus to a toast. Loading: `aria-busy="true"` on the region, "Loading…" then the outcome. `sr-only` = 1px width and height, `margin: -1px`, `clip: rect(0 0 0 0)`, `clip-path: inset(50%)`, `white-space: nowrap`; never `display: none` or `visibility: hidden`. `aria-hidden` never goes on a focusable element.

## 8. Colour, motion, timing

- Contrast and colour-only state: `color-and-contrast.md`. Reduced motion: `motion.md` section 12.
- **Moving, blinking or scrolling content over 5 seconds needs a visible pause control** (2.2.2), and so does auto-updating content. Looping media counts. Toasts with an action or an error stay until dismissed; a timed toast lasts at least 5 seconds and pauses on hover and focus. **Never put critical information only in a timed element.**

## 9. Zoom and reflow

Text survives **200% resize** (1.4.4). Content reflows at **320 CSS px** with no horizontal scrolling (1.4.10; equals 1280px at 400% zoom). Two-dimensional content (tables, maps, code) may scroll **inside its own container**. Text containers use `min-height`, not `height`. **Never `maximum-scale=1` or `user-scalable=no`.** Prefer `rem` and `em` in media queries.

## 10. Semantics

Landmarks `header`, `nav`, `aside`, `footer`, one visible `main`. Multiple navs are labelled (`<nav aria-label="Primary">`). The page title matches the context, most specific first (2.4.2). One `h1`, no skipped heading levels (recommendation).

**Images:** decorative `alt=""` (present, not missing); informative: describe the meaning; functional: describe the action (`alt="Search"`, not "magnifying glass"); image of text: the exact text; complex (chart): short summary plus the data nearby. A missing `alt` is worse than an empty one. **SVG:** decorative `aria-hidden="true"`; meaningful `role="img"` with `aria-label`. Video needs captions (1.2.2), audio a transcript (1.2.1), no autoplay with sound (1.4.2). [P&P] Charts get `role="img"` plus an `aria-label` stating the finding, and a table or summary beside them.

## 11. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| `outline: none` with no `:focus-visible` replacement | Add the ring |
| `<div onClick>` / `role="button"` without key handling | `<button>` |
| `tabIndex={1}` or any positive value | `0` or `-1` |
| `disabled={!isValid}` on a submit button | Keep enabled, validate on submit |
| Live region mounted together with its text | Mount empty first |
| `aria-live="assertive"` on a success toast | `role="status"` |
| `<img>` with no `alt` | `alt=""` or a description |
| `aria-label` that omits the visible label | Include the visible text |
| `aria-hidden` on an ancestor of a control | Remove |
| `maximum-scale=1` / `user-scalable=no` | Remove |
| Tooltip on a natively disabled control | `aria-disabled` and keep it focusable |
| `onDragStart` with no button alternative | Add a single-pointer path |
| Sticky or floating header covering focus | `scroll-padding-top` |
| Icon-only button, no name | `aria-label` |
| Inputs with placeholder as the label | Real `<label>` |
