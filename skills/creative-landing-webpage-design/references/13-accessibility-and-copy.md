# 13 · Accessibility and interface copy

Two rule sets that decide whether a site works for everyone and says the right thing at the right moment. Adapted from Jakub Krehel's `better-accessibility` and `better-writing` skills (MIT; see `THIRD_PARTY_NOTICES.md`). A finding cites a WCAG 2.2 level A or AA criterion, a concrete task an assistive-technology user cannot complete, or one of the escalation triggers in `14-review-protocol.md`.

Contents: two walks · accessibility rules · escalation triggers · copy rules · detection patterns.

## Two walks

Review in two passes. **Keyboard only:** every flow completes without a mouse. **Screen reader:** every control announces a name, a role and its state. When unsure, take the platform default over a custom rebuild, and remove ARIA rather than add it.

## Accessibility rules

1. **Native elements first.** `<button>` for actions, `<a href>` for navigation, never `<div onclick>`. Real links keep middle-click and Cmd/Ctrl-click.
2. **Disabled means unavailable.** Native `disabled` when truly unavailable; `aria-disabled` only when it must stay focusable (then block the action in code).
3. **Visible focus.** Style `:focus-visible`, not bare `:focus`. Never `outline: none` without a verified replacement. A custom ring reaches 3:1 against every adjacent colour (WCAG 1.4.11). A focused element is never fully hidden by a sticky header (2.4.11).
4. **Full keyboard support.** Escape closes overlays, arrow keys move within composite widgets, Tab moves between widgets, Enter and Space activate. Use only `tabindex="0"` and `"-1"`; never a positive value. No keyboard trap except modal dialogs.
5. **Trap and restore focus.** A dialog moves focus in on open and returns it to the trigger on close; the background is inert (the scaffold's kit does this). Single-page route changes update `document.title` and move focus to the new view's heading or `<main>`.
6. **Hit areas.** WCAG 2.5.8 AA baseline 24 x 24 px; aim for 44 px on touch and 40 px on desktop. Every drag interaction has a single-pointer alternative (2.5.7).
7. **Label and type every control.** Every input has a `<label for>` or wrapping label; a placeholder is never a label. Give fields about the person a valid `autocomplete` token, a `name`, and the right `type` and `inputmode`. Never block paste.
8. **Errors that announce.** Validate on submit; do not disable the submit button until the form is valid. Mark failing fields `aria-invalid="true"`, point `aria-describedby` at the inline error, focus the first invalid field. Error text sits beside the field.
9. **Accessible names.** Icon-only controls get a descriptive `aria-label` (the action, not the glyph). The visible label text appears in the accessible name. Decorative elements are `aria-hidden="true"` (never on a focusable element).
10. **Second cue for colour.** Status needs an icon, text or underline as well as colour (1.4.1). Contrast: text 4.5:1, large text 3:1, UI boundaries and states 3:1 (1.4.3, 1.4.11); inactive controls and logos are exempt.
11. **Reduced motion.** Wrap movement, scale and blur in `@media (prefers-reduced-motion: no-preference)` so they are opt-in. Under reduced motion replace slides and scales with opacity fades, and remove parallax and autoplay. Opacity fades, spinners and instant state changes may stay.
12. **Nothing the user needs runs on a timer.** Moving, blinking or scrolling content lasting more than 5 seconds needs a visible pause control (2.2.2); auto-updating content needs one however long it runs. Toasts that carry an action or an error stay until dismissed. (The scaffold ships a pause button for hero autoplay and marquees.)
13. **Announce dynamic content** with three tools: `aria-describedby` for field validation; a polite live region (`role="status"`) for non-urgent updates such as toasts and result counts; `role="alert"` only for urgent errors not tied to a control. Render the empty live region first, then update its text.
14. **Alt text by purpose.** Decorative images `alt=""`; informative images describe the meaning; functional images describe the action.
15. **Structure is navigation.** Headings that describe sections and form a sensible outline; one visible `<main>`; a "Skip to content" link as the first focusable element; `lang` on `<html>`.
16. **Survive zoom and text resize.** Text works at 200 % (1.4.4); the page reflows at 320 px width without horizontal scrolling (1.4.10). Never `maximum-scale=1` or `user-scalable=no`.

## Escalation triggers (always HIGH)

- An interactive control with no accessible name.
- A keyboard-reachable control with no visible focus indicator.
- A pointer-reachable control or path that the keyboard cannot reach.
- Motion or autoplay that ignores `prefers-reduced-motion`.
- Content or a control clipped, overlapped or unreachable at 320 px width or 200 % zoom.
- Body or control text whose rendered contrast fails its required ratio.
- State or meaning carried by colour alone, or by motion alone.
- A destructive action with no confirmation, undo or distinct treatment.
- Truncated content with no way to reach the full value.
- Content hidden behind a scroll edge or disclosure with no visible cue.
- An error that names no way to recover.

## Copy rules (interface text)

1. **Inventory the existing words first** (nouns for objects, verbs for actions, capitalisation, voice). New copy uses them. One name per thing, in the menu, the toast and the button.
2. **One voice, tone flexes with the stakes:** warm for success and onboarding; neutral for routine actions; calm and plain for errors and confirmations; serious for data loss and security.
3. **Address the reader as "you".** In errors avoid "we" (it reads as deflection).
4. **Plain words.** Delete every word that does no work. No idioms, no jokes that will not translate. "Tap" on touch, "click" with a pointer, "select" when both apply.
5. **Build strings whole.** Never assemble a sentence from fragments around a variable; use one message with placeholders and the locale's plural rules; format numbers and dates with `Intl`.
6. **Verb-first buttons** that name the action: "Send", "Save draft", "Delete project", never "OK" or "Let's go". Dialog buttons are verb plus object, not "Yes" and "No".
7. **Links describe their destination** ("Read the billing docs", never "click here"); suffix repeated "Learn more" links with their subject.
8. **One capitalisation policy** per element type (sentence case by default).
9. **Settings describe the ON state** ("Send read receipts", not "Don't send read receipts").
10. **Errors say how to fix, next to where it broke:** "Choose a password with at least 8 characters", not "That password is too short"; no blame, no "Oops", no exclamation marks. Show known requirements as helper text before input.
11. **Undo beats confirmation** for reversible, frequent actions ("Project archived. Undo"). Confirm only for irreversible or wide-reaching actions, with a title naming the action and object ("Delete 'Q3 report'?"), a body saying what is lost, and verb-plus-object buttons.
12. **Empty states point forward:** what this place is, how to fill it, one next action. A filtered empty state names the query and offers an exit: "No results for 'quarterly'. Clear filters."
13. **Placeholders show an example** in the accepted format (`name@example.com`), never an instruction.
14. Cut "successfully" ("Changes saved"), cut routine "Please".

## Detection patterns

| Pattern | Fix |
| --- | --- |
| `outline: none` without a focus-visible replacement | Restore the ring or add a verified one |
| `<div onclick>` or `<span onclick>` | `<button>` or `<a href>` |
| Positive `tabindex` | Fix DOM order; use 0 |
| `disabled` on submit until valid | Keep enabled; validate on submit |
| `<img>` without `alt` | `alt=""` if decorative, else describe the purpose |
| `aria-label` omitting the visible text | Start the name with the visible text |
| `maximum-scale=1` or `user-scalable=no` | Remove |
| "Click here", two identical "Learn more" | Name the destination |
| "Oops", "Something went wrong", "!" in errors | Say what failed and what to do |
| "Are you sure?", "OK", "Yes", "No" on dialogs | Action plus object |
| "successfully", routine "please" | Cut |
