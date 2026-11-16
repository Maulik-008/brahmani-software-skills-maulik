# 02 · Concept engine: from a one-line topic to a unique concept

The user may give only a topic ("cafe in Ahmedabad, coffee and ice cream are the main things"). Turn it into a specific, memorable concept by working through the steps below. Do the thinking first; write the config second. Keep the user-facing summary short.

Contents: 1 read the topic · 2 local and cultural lens · 3 find the worlds · 4 choose hero objects · 5 signature interaction · 6 structure · 7 voice and copy · 8 variation axes · 9 diverge, then converge · 10 concept one-pager.

## 1. Read the topic

Extract, and write down privately:

- **Business type and sub-type** (cafe + ice cream parlour; family clinic; boutique gym).
- **Hero products or services** (the two or three things people come for).
- **Place and language** (city, country, languages people read, currency, how people contact and pay).
- **Audience and moment** (students at night, families on weekends, office workers at lunch).
- **Main conversion** (order, reserve, book, enquire, call, visit, buy).
- **Real or imaginary?** If the user names a real existing business, search the web for verified facts (address, hours, menu, social) and use only what you verify. If it is a fresh or hypothetical business, invent a plausible name and clearly mark all contact details, prices and policies as sample placeholders.

Ask at most one question, and only when the answer would change the whole concept (for example "real existing business or a new concept?"). Otherwise state your assumptions in one line and continue.

## 2. Local and cultural lens

Add two or three specific local truths to the concept so it could not be mistaken for a generic template. Use them as inspiration, never as unverified fact on the page.

Example for Ahmedabad: strong late-night food culture, hot summers that make cold items the hero from March to June, a large vegetarian and eggless audience (label "eggless" or "pure veg" only if the user confirms), Gujarati, Hindi and English readers, rupee prices formatted `en-IN`, WhatsApp as the default way to order, UPI as the default way to pay, festival moments (Navratri nights, Uttarayan in January), and area names people actually say (CG Road, Law Garden, Sabarmati Riverfront). Offer a Gujarati or Hindi greeting only if you are sure of the wording.

Do the same for any place: climate, food or shopping habits, local scripts, payment and messaging habits, seasonal peaks.

## 3. Find the worlds

A **world** is one product family with its own colour, hero object, ghost word and mood line. Use 3 to 4 worlds (2 minimum, 5 maximum). Derive them from what the business really sells, not from decoration.

For each world decide:

| Field | Rule |
| --- | --- |
| name | The customer's word ("Coffee", "Scoops", "Cold and shakes") |
| word | One short ghost word, 4 to 6 letters ideal ("COFFEE", "SCOOP", "CHILL") |
| bg | Saturated, distinct from the other worlds, 4.5:1 against its text (white by default). Use a darker shade if needed |
| tint | A light version of bg for card backgrounds |
| dot | A mid-light version for the picker dot |
| img | The hero object key |
| title / blurb | A 3 to 6 word promise and one sentence of sensory detail |

Colour semantics matter: brown and cream for coffee, raspberry or mint for ice cream, teal for cold and fresh, red for hearts, violet for brain, teal for kids. Break a convention only on purpose.

## 4. Choose the hero objects

Ask "what would a customer hold, point at, or take home?" Pick one object per world, plus two small decor objects (a bean, a cone, a pill) that float near the hero.

An object is good when it is recognisable as a 100 px silhouette, has a simple form you can build from primitives (spheres, ellipsoids, capsules, lathed profiles, tori), is friendly and not suggestive or pet-like, and sits well tone-on-tone against its world.

Choose the production route in `04-imagery-pipeline.md`: render it in 3D (default), use user photos, or write Canva prompts.

## 5. Signature interaction

Every site needs a tool tied to the customer's main decision. Pick one or two:

- **World picker with live availability** (the hero itself).
- **Filter plus search** over a catalogue, with "popular" quick chips.
- **Cart and WhatsApp checkout** for food, retail, and gifts.
- **Reservation or enquiry form** with validation for restaurants, studios, events.
- **Slot booking** (day chips, time grid, double-booking guard) for clinics, salons, trainers. See `assets/examples/pulse-hospital-template.html`.
- **Configurator or builder** (build your own sundae, choose size and extras, compare plans).
- **Map with pins or body map** for locations, real estate, physio.
- **Open-now chip** computed from real hours.

## 6. Structure

Default order: hero with worlds, find bar overlapping the hero, collections grid, filterable items, how-it-works band, stories carousel with three tools, highlight band, footer. Pages as sheets: About, Visit and contact, Cart or Form, Menu (mobile). Nav of 4 to 5 short labels. Remove sections that have nothing real to say.

## 7. Voice and copy

- Short, concrete, sensory. A headline is a promise or an image ("Brewed slow, poured with care."), never "Welcome to".
- One sentence of body copy per block. Numbers only if the user provided them.
- Sample stories, hours, addresses and prices carry an explicit "sample" marker in the UI or note.
- Microcopy is helpful: validation messages say what to do ("Enter a phone number with at least 7 digits").
- Safety lines where relevant (medical: "In an emergency call [number]. Do not use this form.").

## 8. Variation axes (so no two sites look alike)

Pick one option per axis on purpose and write the choice in the concept one-pager.

| Axis | Options |
| --- | --- |
| Display face | Bubbly (Bagel Fat One, Fredoka), elegant serif (Fraunces, DM Serif Display, Instrument Serif), techy (Space Grotesk, Unbounded), condensed bold (Anton, Bebas Neue), friendly rounded (Nunito) |
| Body face | Inter, DM Sans, Manrope, Nunito, Plus Jakarta Sans |
| Corner personality | `pill`, `soft`, `sharp` (`theme.radius`) |
| Ghost word | Big and fat, small and outlined, none (`theme.heroWord`) |
| Surface | Warm cream, cool lilac, paper white, dark mode |
| Texture | Grain 0.17 (default), heavy 0.3, none (`theme.grain`) |
| Motion | Weighty 1.2 to 1.6 s (default), snappy 0.6 s for sport and nightlife |
| Card voice | Tilted sticker cards with hard shadows, clean soft shadows, flat outlines |
| Hero layout | Object stage (default), split with photo card, full-bleed tinted photo with frosted cards, typographic marquee. Non-default layouts need CSS changes; see `06-build-architecture.md` |
| Nav | Top pill (default), vertical rail, bottom dock on mobile |

## 9. Diverge, then converge

Before choosing, sketch three genuinely different directions in your head (10 seconds each): different world logic, different hero objects, different interaction. For the Ahmedabad cafe example:

- **A. Brew & Scoop.** Three product worlds (Coffee, Ice cream, Cold and shakes), cup, cone and iced cup as heroes, cart with WhatsApp checkout.
- **B. Midnight Scoop.** Worlds are times of day (Morning brew, Afternoon chill, Late-night scoop) that follow the clock; dark mode at night; open-now chip is the star.
- **C. Kulhad & Cone.** A heritage fusion: chai in a kulhad, kulfi, and soft-serve; terracotta and saffron worlds; festival band for Navratri.

Choose the direction with the most distinctive hero object and a tool the customer will actually use, then commit. If the user asked to see options, show all three on a design canvas first (see `07-quality-gates.md`).

## 10. Concept one-pager (what you tell the user, in about 10 lines)

```
Concept: <name> · <one-line idea>
Audience and moment: ...
Worlds: <name · colour · object · word> x3
Signature interaction: ...
Variation choices: display face, corner style, texture, motion
Local touches: ...
Pages: ...
Placeholders to replace: contact, prices, hours, stories
```
