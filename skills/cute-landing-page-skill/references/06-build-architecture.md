# 06 · Build architecture and config reference

Contents: how the pieces fit · quick start commands · full config reference · extending the scaffold · the sheet kit API · publishing constraints · editing after publish · bug catalogue (lessons) · performance and accessibility.

## How the pieces fit

```
site.config.json  ─┐
images/*.png       ├─ scripts/build_site.py ─► one self-contained site.html (300 KB to 2 MB)
assets/scaffold/   │        (injects theme, kit, config, WebP images, grain)
assets/kit/       ─┘
scripts/test_site.py site.html ─► pass/fail list + screenshots in qa/
```

- `assets/scaffold/site.template.html` holds the markup and CSS. `assets/scaffold/app.js` renders everything from `CONFIG` (hero, nav, grids, sheets, cart, forms, hours).
- `assets/kit/kit.css` and `kit.js` provide sheets (drawer and page), toast, focus trap, inert handling, hash routing, validation helpers.
- `build_site.py` validates (missing images, unknown worlds, contrast of world colours), compresses images, injects theme variables and Google Fonts, and writes the file.
- `assets/examples/pulse-hospital-template.html` is the full hospital site (slot booking, doctors, department sheets, manage appointment). Copy its logic when a project needs slot booking.

## Quick start

```bash
python scripts/init_project.py my-site          # creates my-site/site.config.json and images/
# render or copy hero objects into my-site/images/
python scripts/build_site.py my-site/site.config.json my-site/site.html
python scripts/test_site.py my-site/site.html --out my-site/qa      # add --quick for a faster pass
# LOOK at my-site/qa/*.png, fix, rebuild, retest
```

Requirements: `pip install pillow numpy scipy playwright && playwright install chromium`.

## Config reference

Required: `brand.name`, `worlds[]`, `items[]` (or an empty list for form-only sites), `images`. Everything else is optional.

| Key | Meaning |
| --- | --- |
| `meta` | `slug` (storage key), `title`, `description`, `refPrefix` (order or request reference prefix) |
| `brand` | `name`, `short` (nav text), `tagline` (footer) |
| `currency`, `locale` | Price prefix and number formatting (`₹`, `en-IN`) |
| `theme` | `ink`, `soft`, `mute`, `line`, `tint`, `tint2`, `accent`, `fontDisplay`, `fontBody`, `googleFonts` (query string for fonts.googleapis.com/css2), `radius` (`pill`, `soft`, `sharp`), `heroWord` (false hides ghost word), `grain` (opacity), `displayCase` (`none` for mixed-case ghost word) |
| `contact` | `phone`, `whatsapp` (digits with country code), `email`, `address`, `mapsUrl`, `tagline`, `hours[]` (`label`, `days` 0 to 6 with 0 = Sunday, `open`, `close` as `HH:MM`, `24:00` allowed), `chip` (`{type:"open"}`, `{type:"text",label}`, `{type:"none"}`) |
| `nav` | `cta` (label of the nav button), `ctaDo`, `links[]` (`label`, `type` = `scroll` or `page`, `target` = section id or page name) |
| `hero` | `pickLabel`, `primary` and `secondary` (`label`, `do`), `card.label`, `pick2` (`label`, `options[]`; optional second picker, e.g. Dine in or Takeaway) |
| `worlds[]` | `id`, `name`, `word`, `bg`, `ink` (default white), `dot`, `tint`, `img`, `title`, `blurb`, `short` |
| `decor[]` | Up to two image keys that float near the hero |
| `text` | Section copy: `worldsTitle`, `worldsSub`, `itemsTitle`, `findWorld`, `findText`, `findTag`, `findPlaceholder`, `countNoun`, `popular[]` (quick chips), `storiesTitle`, `storiesSub` |
| `tagLabels` | Display names for tags |
| `items[]` | `id`, `world`, `name`, `desc`, `price`, `tags[]` (`bestseller` adds a badge and feeds "today's pick"), `img` (optional photo key), `options[]` (`name`, `choices` as `[label, priceDelta]`) |
| `action` | `mode` = `cart`, `form` or `none`; `label`; `cart` (`fulfil[]`, `deliveryFee`, `freeOver`, `taxPct`); `form` (`title`, `intro`, `fields[]`, `submitLabel`, `successTitle`, `success`). Field types: `text`, `email`, `tel`, `date`, `time`, `number`, `select` (with `options`), `chips`, `textarea`; each has `id`, `label`, `required` |
| `how` | `title`, `steps[]`, `cta`, `do`, `facts[]` (pairs), `image`, `imageAlt`, `imageCaption`, `note` |
| `stories[]` | `name`, `role`, `text` (mark as sample unless real) |
| `tools[]` | `title`, `text`, `do`, `icon` (inner SVG paths) |
| `band` | Highlight band: `eyebrow`, `title`, `text`, `bg`, `ink`, `buttons[]`, `decor[]` |
| `about` | `title`, `sub`, `heading`, `paragraphs[]`, `values[]`, `gallery[]` (`img`, `caption`), `galleryTitle`, `note` |
| `faqs[]` | `q`, `a` (shown on the contact sheet) |
| `footer` | `cols[]` (`title`, `links[]` with `label`, `do`), `small` |
| `images` | key to path (relative to the config), or `{path, max, q}` |

`do` actions: `scroll:<sectionId>`, `page:<about|contact|...>`, `item:<id>`, `world:<id>`, `form`, `cart`, `contact`.

### Choosing the action mode

- Food, retail, gifts: `cart` (WhatsApp checkout, optional delivery fee and tax, pickup or delivery).
- Restaurants, studios, events, property, services: `form` with fields suited to the job (party size, date, time, budget).
- Browse-only brochure with a strong CTA: `none` and use `contact`.
- Slot booking with availability: copy the engine from the Pulse example.

## Extending the scaffold

- **New section**: add markup with an `id` and `class="wrap"` in `site.template.html`, render it in `app.js`, add a nav link, and add `rv-s` for reveals.
- **New sheet page**: add an entry to `PAGES` in `app.js` with `title`, `sub`, `html()`, optional `foot()`, `after()`, `drawer:true` for side panels; open it with `Kit.open('name')`.
- **Different hero layout**: change the `.stage` children positions in CSS (classes `.copy`, `.pick`, `.nxt`, `.ob`). Keep layout in classes, not inline styles.
- **Photography instead of objects**: items with `img` use the photo as a full-bleed card image; worlds can use a photo with transparent PNG cut-outs for the hero.
- **Languages**: duplicate `CONFIG` text per language and swap at runtime, or build one HTML per language. Only add translations you are confident in.
- **Slot booking**: port `slotsFor`, `nextSlot`, `bookHtml`, `bookNext` from the Pulse example.

## Sheet kit API (`assets/kit/kit.js`)

`Kit.open(name)`, `Kit.close()`, `Kit.render(keepScroll)`, `Kit.setErr(id, message, inputEl)`, `Kit.toast(text, label, fn)`, `Kit.isOpen()`, `Kit.esc(str)`, `Kit.cfg` with `pages`, `act` (handlers for `data-act`), `on` (`input`, `change`, `submit`), `inert` (selectors made inert while open), `linkSel`, `hash`, `beforeOpen`, `onOpen`, `onClose`. A page is `{title, sub, drawer, html(), foot(), after()}`; `title` and `sub` may be strings or functions.

## Publishing constraints

- The published page must be one HTML file under 16 MB.
- External scripts only from `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`, `cdn.tailwindcss.com`, `code.jquery.com`, pinned to exact versions at least two weeks old. External stylesheets only from `fonts.googleapis.com` (fonts from `fonts.gstatic.com`). No remote images, no other network requests. The scaffold needs none of these except Google Fonts.
- `localStorage` works but is per viewer. Do not use `window.storage` or the Claude API in published pages.
- Plain download links and script-started saves are inert in published pages. Use `wa.me` links and `target="_blank"` for outbound links.
- Pass one emoji as favicon in the publish call.
- When the Artifact tool is not available, save to `/mnt/user-data/outputs/<name>.html` and present the file.

## Editing after publish

Small change: use the Artifact `edit` action with `old_str` and `new_str` pairs copied exactly from the file. Bigger change: edit the config or scaffold, rebuild, publish again with the same `url`. Never regex-replace a large generated HTML file; one greedy pattern once deleted three sections. Regenerate from the config or generator instead.

## Bug catalogue (lessons that cost time)

1. **Class name collisions with the kit.** A section class `.sec` clashed with the kit's secondary button `.btn.sec` and broke buttons. Use `wrap` for sections.
2. **Inline styles beat media queries.** An inline `position:absolute` on the hero object wrapper broke the mobile layout. Set layout in classes.
3. **Stuck hash flag.** After closing a sheet, the next nav click did nothing. Fixed in `kit.js`; also bind page links with a direct `Kit.open` handler.
4. **Nav overlap at mid widths.** The emergency or hours chip hit the centred nav pill between 900 and 1300 px. The chip collapses to an icon and the links tighten; `test_site.py` checks overlap at nine widths.
5. **Default button borders.** A `<button>` without `border:0` shows a dark ring. Reset borders on every custom button.
6. **Decor sized by width.** A tall cone sized to 176 px wide became 425 px tall. Size decor by height with `width:auto`.
7. **Scroll-spy on hidden sections.** Hidden elements report `top: 0`, so "Stories" lit up at the top. Skip elements with `offsetParent === null` and call the spy after init.
8. **CSS removed with a "section".** Deleting hospital-only CSS also removed shared grid rules. After pruning CSS, build and look at every section.
9. **Rule order.** A mobile media query placed before the base rule loses. Put responsive overrides at the end.
10. **`smin` with k=0 yields NaN**, so the object disappears in a render. Use `np.minimum`.
11. **Render framing sign.** `center` shifts the model; to centre a model whose middle is at P use `-P`.
12. **Background jobs die between tool calls.** Run renders and tests in the foreground with a timeout, in resumable batches.
13. **Fonts blocked in the sandbox.** Fonts fail to load in headless tests; layout is tested with fallback faces. Do not judge typography from sandbox screenshots alone.
14. **Contrast of world colours.** White text on a mid-bright colour fails 4.5:1. `build_site.py` warns; darken the background.

## Performance and accessibility checklist

Images are WebP and lazy where below the fold. No layout-property animation. Buttons are real buttons with labels. Form fields have labels, errors in `role="alert"`, `aria-invalid`. Focus is visible (white on colour, ink on light). Headings are ordered. `aria-pressed` on toggles. Sheets are `role="dialog" aria-modal`. All text meets 4.5:1 except the oversized decorative ghost word. Reduced motion is respected.
