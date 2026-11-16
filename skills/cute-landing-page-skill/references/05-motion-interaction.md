# 05 · Motion and interaction

The scaffold already implements everything below. Use this file to tune it, to explain choices, and to extend them without breaking the feel.

Contents: the signature curve · hero state machine · stage scaling · compact layout · pointer and touch · reveals and autoplay · sheets and focus · reduced motion · what not to animate.

## The signature curve

`cubic-bezier(0.51, 0, 0, 0.98)`: a slow start and a long glide to rest. It was measured from the reference sites (Figma smart-animate at 1.2 to 1.6 s). Use it for anything that changes colour or travels more than 100 px.

| Interaction | Duration | Notes |
| --- | --- | --- |
| World change (background, object, word) | 900 to 1000 ms | Background and objects share the same curve so they land together |
| Parked object to hero | 1000 ms | Transform and opacity only |
| Section reveal | 900 ms | Once per element, 26 px rise |
| Hover lift on cards | 450 ms | `translateY(-5px)` plus shadow growth |
| Buttons and chips | 200 to 300 ms | Fast, with `:active` scale .96 |
| Sheets (drawer, page) | 550 ms | Same curve, opacity .4 s |
| Toast | 500 ms | Slides up from 30 px |

Snappy brands (sport, nightlife): scale every duration by 0.6. Quiet brands (clinics, editorial): keep durations and remove tilt and parallax.

## Hero state machine

One index `ui.hero` and an array of worlds. Every object gets `data-d = (k - i + n) % n`:

- `0`: centred, full size, opacity 1.
- `1`: parked bottom-right, scale about .21, blurred 2 px, clickable (advance).
- `2`: faded out at the same corner, scale .1.
- `3` (and more): exits left, scale .9, blurred 14 px, not clickable.

Pickers, arrows, swipe (50 px threshold), the parked object and autoplay all call the same `heroGo()` or set `ui.hero`, then `paintHero()` writes colours, text, aria state and the "today's pick" card.

Autoplay advances every 7 s, but pauses on hover or focus, when the hero is mostly off-screen, when a sheet is open, when the tab is hidden, and always when the user prefers reduced motion.

## Stage scaling

The hero is composed once at 1440 x 900 and scaled to fit: `--k = min(width/1440, height/900)`, `--inv = 1/k`. Anything that must stay readable at small scales uses `max(Npx, calc(M px * var(--inv)))` so text never drops below its real minimum size (for example paragraph `max(17px, calc(15px * var(--inv)))`, buttons `max(54px, calc(46px * var(--inv)))`). The hero background is full-bleed, so letterboxing is invisible. The nav and sections use real pixels, not the stage scale.

## Compact layout

At `max-width: 900px` or `max-height: 560px` the stage becomes a normal column: copy first, then the object block (about 340 px tall, with ghost word, glow and decor inside it), then pickers, the pick card and arrows. `--k` is forced to 1. The nav pill becomes brand, cart, hours icon, menu button; on 520 px and below the "Order now" button hides to keep the menu button on screen.

Rule learned: never set `position` or `inset` inline on an element whose compact layout needs to change it. Inline styles beat media queries. Put layout in classes.

## Pointer and touch

Parallax is small: ghost word moves -26 px by -14 px, the hero object 14 px by 8 px, decor -20 px by -12 px, driven by CSS variables `--mx` and `--my` (-1 to 1) set on `pointermove` and eased with `translate .5 to .6 s ease-out`. Ignore touch pointers. Reset to 0 on leave.

## Reveals and autoplay

`IntersectionObserver` adds `.in` to `.rv-s` elements once, at 12 % visibility. Without the observer or with reduced motion, content is simply visible.

## Sheets and focus

All secondary pages are sheets from `kit.js`: a desktop page sheet (centred) or a drawer (right edge, full width on phones). Behaviour that must stay: focus moves to the close button on open and returns to the opener on close; Tab is trapped; Escape closes; the rest of the page is `inert`; hash routing (`#about`) opens sheets and back or forward works. A known bug that was fixed in the kit: after closing a sheet with `replaceState`, a stuck flag swallowed the next hash change; the fix is in `kit.js` (`clearHash` no longer sets the flag).

## Reduced motion

`@media (prefers-reduced-motion: reduce)` shortens transitions to 10 ms, disables smooth scroll, shows all reveal content, and stops autoplay. Parallax is skipped in JS.

## What not to animate

Do not animate `width`, `height`, `top`, `left` or box shadows on large areas. Animate `transform`, `opacity`, `filter` and the CSS `translate` property. Keep blur filters on small objects only.
