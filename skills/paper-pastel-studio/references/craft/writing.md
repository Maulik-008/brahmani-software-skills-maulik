# Writing the interface

[craft] adapted from `better-writing`. A deliberate brand voice is not a defect: raise departures from plain language only for **inconsistency, ambiguity, translation risk or a tone mismatched to the stakes.** [P&P] tone default: calm, plain language, no em dashes, no raw routes or URLs as visible text, no invented numbers or social proof.

## 1. Inventory first

Before writing or reviewing, find the translation layer (`t(`, `i18n.`, `<FormattedMessage`, `$t(`, `locales/**/*.json`, `messages/*.json`, `*.po`, `*.strings`; copy may also come from a CMS or API). List the **noun per object** and the **verb per action** (project vs workspace; Delete vs Remove) and the **case per element type**. One word per concept, everywhere.

## 2. Voice and tone

- One voice, one vocabulary. Multi-step flows: **Get started** (enter), **Continue** or **Next** (advance), **Done** (finish).
- Tone follows the stakes: success, onboarding and empty states can be warm and light; routine and settings are neutral and minimal; **errors and destructive actions are calm and plain with zero playfulness**; data loss and security are serious and explicit.
- Address the reader as **"you"**, not "the user". In errors avoid "we". Possessives sparingly ("Favorites", not "Your favorites"). Do not mix perspectives within a flow.
- Plain words. No idioms, no jokes that will not translate, no gendered phrasing ("Subscribers can post recipes"). Match the input device: **tap** on touch, **click** with a pointer, **select** when both.
- **Build strings whole.** No sentence assembled from fragments; use placeholders inside one message. Plurals use locale rules (`Intl.PluralRules`, ICU), never `n === 1 ? "" : "s"`. Numbers, dates, currency and lists go through `Intl`.

## 3. Buttons, links, toggles

- **Buttons: verb first.** "Send", "Save draft", "Delete project". Never "OK!" or "Let's go!". An icon-only control's accessible name names the **action** ("Close", not "X icon").
- **Links describe the destination.** "Read the billing docs", never "Click here". Two "Learn more" on a page get suffixes ("Learn more about exports").
- **Case:** one policy per element type; **sentence case** by default. "Save Changes" beside "Discard changes" is an inconsistency.
- **Toggles describe the ON state** ("Send read receipts", not "Don't send read receipts"). Link straight to a setting ("Notification settings"), not a description of the path to it.

## 4. Errors

Say **how to fix it**, beside the failing field. No blame, no "oops", no exclamation marks. Hints are positive ("Use at least 8 characters") and shown as helper text *before* the input.

| Instead of | Write |
|---|---|
| That password is too short | Choose a password with at least 8 characters |
| Invalid date | Enter a date as DD/MM/YYYY |
| Oops! Something went wrong. | Unable to save. Check your connection and try again. |
| Error 500 | Unable to load invoices. Try again in a few minutes. |

If the same error keeps firing, redesign the input rather than rewording the error.

## 5. Destructive actions

**Undo beats confirmation** for reversible, frequent actions: "Project archived. Undo". **Confirm** only for the irreversible, anything that affects other people, or anything that destroys many items.

| Case | Title | Body | Buttons |
|---|---|---|---|
| Reversible | Toast: "Project archived" | | **Undo** |
| Irreversible, one item | Delete "Q3 report"? | This permanently deletes the report and its 4 comments. | **Delete report** / Cancel |
| Many items | Delete 12 files? | You can't undo this. | **Delete 12 files** / Cancel |
| Affects others | Remove Design? | The 8 members of Design lose access. | **Remove team** / Cancel |
| Account, workspace, repo | Delete acme-web? | Type "acme-web" to confirm. | **Delete repository** (enabled when it matches) / Cancel |

The title names the **action and the object** (never "Are you sure?"). The body says what is lost, **with counts**. Buttons are verb plus object (never Yes / No). Focus lands on the least destructive button.

## 6. Status messages

Keep in-progress and done messages parallel.

| State | Example |
|---|---|
| In progress | Saving changes… / Loading invoices… |
| Done | Changes saved / Invite sent to sam@example.com (cut "successfully") |
| Failed | Changes not saved. Check your connection and try again. |
| Unavailable | Add a payment method to publish |
| Partial | 9 of 12 files uploaded. Retry 3 failed files |

Drop "Please" from routine instructions. Never leave a state unwritten: loading, empty, error, success, offline, locked each get a message.

## 7. Empty states and placeholders

[P&P] An empty state is an icon-in-circle, one friendly line and **one `bg-cta` action** (decision 17). Copy rules: say **what this place is**, **how to fill it**, and give **one clear next action**. A filtered empty state names the query and offers the exit: "No results for 'quarterly'. Clear filters". Never park persistent information in an empty state (it disappears once there is data). **Placeholders show a realistic example** in the accepted format (`name@example.com`, `DD/MM/YYYY`), never instructions, and never replace a label.

## 8. Numbers, dates, units

```js
new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(4320)   // €4,320.00
new Intl.NumberFormat(locale, { style: 'unit', unit: 'megabyte' }).format(12)        // 12 MB
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)                // Jun 30, 2026
new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day')           // yesterday
new Intl.ListFormat(locale, { type: 'conjunction' }).format(['Ana', 'Ben', 'Cy'])    // Ana, Ben, and Cy
```
ICU plural: `{count, plural, =0 {No new messages} one {# new message} other {# new messages}}`. Never `toLocaleDateString()` with no locale, never build a date from `getMonth()`.

## 9. [P&P] copy rules that always apply

Titles never carry a brand suffix. Headings never end in a full stop. No em dashes. Never show a raw route or URL as visible text (use a named link) and never link a page to itself. Never invent data, statistics, names or testimonials: show a designed empty state or a clearly marked placeholder.

## 10. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| "Click here", "Read more" with no object | Destination-describing text |
| "Oops", "Something went wrong", "!" in an error | Say what happened and how to fix it |
| `"..." + n + "..."` concatenation, or `n === 1 ? "" : "s"` | Whole string with a placeholder, ICU plural |
| OK / Yes / No dialog buttons | Verb plus object |
| "Are you sure?" | Name the action and the object |
| "successfully" | Cut it: "Changes saved" |
| "Please" in a routine instruction | Cut it |
| Toggle labels starting Don't / Disable / Hide | Describe the ON state |
| `aria-label` "Trash", "Close icon", "X" | Name the action |
| `toLocaleDateString()` with no locale | `Intl.DateTimeFormat` |
| Mixed case per element type | One policy |
| Placeholder carrying an instruction | Example value, real label |
