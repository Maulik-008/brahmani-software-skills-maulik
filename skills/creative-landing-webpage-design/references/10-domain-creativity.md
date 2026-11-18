# 10 · Domain creativity: what each kind of site owes its visitors

A generic build looks right and helps nobody. Each domain has a short list of things visitors came to do, and a short list of extras that delight them. This file lists both, the archetypes that suit the domain, how the scaffold supports it, and where you must write custom code.

Research basis: studies and guides on restaurant, healthcare, real-estate, SaaS, e-commerce, hotel, fitness and professional-services websites (2025 to 2026). Domains marked "general practice" were not researched in that pass; treat them as sensible defaults and verify with a quick search when the stakes are high.

Contents: how to use this file · food and drink · healthcare · real estate · software and automation · retail and e-commerce · hotels and travel · fitness, studios and wellness · professional services · education (general) · nonprofit and community (general) · beauty and salons (general) · creative and events (general) · sources.

## How to use this file

1. Find the closest domain. Read **Visitors came to** and make sure the hero or the first scroll serves it.
2. Pick **Extra efforts** (at least three) and **one surprise**. Implement them for real (config, block or custom code), not as copy.
3. Check **Pitfalls** before you ship.
4. `scripts/direction.py` already carries these as `extraEffort` and `surprise` for each domain.

## Food and drink (cafe, restaurant, bakery, dessert, bar)

- **Visitors came to:** see the menu, check hours, find the place, order or reserve. Research: most visits are on phones; guests who cannot find hours, phone or address quickly leave; a text menu beats a PDF.
- **Extra efforts:** a text menu with filters and "popular" chips; an open-now chip plus hours, phone and map in header and footer; separate Pickup, Delivery and Dine-in actions; WhatsApp or direct ordering with a clear "order direct" perk; a today's-pick or seasonal highlight; schema-friendly name, address and hours.
- **Creative angles:** worlds by product family (coffee, scoops, cold); a hero object per family; an editorial hero with inline cup and cone chips; a "day at the cafe" scroll story (morning, afternoon, night); a late-night band.
- **Surprise ideas:** a freshness timer (what is brewing or churning now); a seasonal banner that follows the calendar (mango season); a table-for-tonight pill.
- **Archetypes:** `paper-editorial`, `sticker-pop`, `sunlit-worlds` (sparingly), `noir-frame` for bars.
- **Scaffold:** `items` + `cart` mode with WhatsApp; `marquee`, `story`, `gallery`, `reviews`, `faq`.
- **Pitfalls:** PDF menus, stock food photos, hours buried in a footer, claims like "pure veg" without confirmation.

## Healthcare (clinic, hospital, dental, physio, pharmacy)

- **Visitors came to:** find a doctor or location, book, check insurance, get directions, reach emergency care. Research: patients are often stressed; the best sites make "what do I do next?" obvious from the hero (find a doctor, find a location, book, portal); core tasks are one or two clicks away; provider profiles include credentials, specialty, languages, accepted insurance and a photo; real photos build trust; reminders and a manage-appointment flow reduce friction; WhatsApp matters in some regions; accessibility is mandatory.
- **Extra efforts:** a doctor directory with filters and next-available times; department pages; slot booking with a double-booking guard and a manage or cancel flow; visible emergency line and a safety sentence on forms; visiting hours and what-to-bring; reminders.
- **Creative angles:** department worlds with calm saturated colours; anatomical hero objects (heart, neuron, knee, spine); portraits matched to department tints; a body map; a quiet frame hero with a still life.
- **Surprise ideas:** a which-specialist finder from symptoms (non-diagnostic, with a safety line); a per-department "prepare for your visit" checklist; a quiet-hours indicator.
- **Archetypes:** `glass-frame`, `sunlit-worlds` (calm palette), `paper-editorial` for boutique practices.
- **Scaffold:** `worlds`, `team`, `map`, `faq`, `form` mode; slot booking via `assets/examples/pulse-hospital-template.html`.
- **Pitfalls:** unlabelled stock-looking portraits, inventing credentials, hiding insurance and fees, no emergency line, playful tilt and stickers (wrong dial), a five-screen booking flow.

## Real estate and property

- **Visitors came to:** search listings, narrow by filters, see them on a map, save and compare, contact. Research: portal-grade filters, map plus list with pins, saved searches embedded in the card, result counts, fast updates (slow filters lose sessions), neighbourhood guides, virtual tours, mortgage calculators, and a human point of view that portals cannot offer; quiet-luxury editorial layouts are replacing loud hero videos.
- **Extra efforts:** filter bar with counts; map and list; save-this-search; EMI or mortgage calculator (`estimator`); neighbourhood guide cards; enquire form with budget and timeline.
- **Creative angles:** a frame hero with a tinted photo and frosted search; a rail nav; an editorial story about the neighbourhood.
- **Surprise ideas:** a commute estimator; compare two listings side by side (`compare` table); open-house countdown.
- **Archetypes:** `glass-frame`, `luxe-editorial`, `paper-editorial`.
- **Scaffold:** `items` as listings, `map`, `estimator`, `compare`, `form`.
- **Pitfalls:** fake listings or prices, stock interiors, no price transparency, laggy filters.

## Software, automation and fintech

- **Visitors came to:** understand the product quickly, see it work, check price, start. Research: product-as-hero beats screenshots; interactive demos help (a short flow of 5 to 13 steps, with the best completion at 1 to 6); outcome-first headlines with proof right under the CTA; social proof in the hero; one conversion goal; pricing with a toggle and one highlighted plan.
- **Extra efforts:** the hero is a live example (`hero.demo`); an estimator for time or money saved; a plan comparison table; a short process story; a clear demo form.
- **Creative angles:** noir with a neon accent; a replayable workflow; type-led layouts with no objects at all.
- **Surprise ideas:** an estimator that feeds the demo request; a light and dark toggle; a "run it on your data" teaser.
- **Archetypes:** `noir-demo`, `bento-glass`, `paper-bento`.
- **Scaffold:** `hero.demo`, `bento`, `story`, `estimator`, `compare`, `faq`, `form`.
- **Pitfalls:** invented customer logos or metrics, jargon, three identical feature cards.

## Retail and e-commerce (fashion, jewellery, home, gifts)

- **Visitors came to:** see the product properly, choose a variant, trust the price and delivery, buy on a phone. Research: most traffic is mobile; a sticky add-to-cart; delivery shown as a date; material, fit and size answers above the fold; reviews with customer photos; guest checkout; a 3D viewer helps people understand, a configurator helps them personalise.
- **Extra efforts:** option pickers (size, colour) with price changes; a size or gift guide; a delivery estimate; a bundle builder; photography-first cards.
- **Creative angles:** colourways as worlds; editorial lookbook story; a hero object that is the product itself.
- **Surprise ideas:** build your bundle; gift finder quiz; restock notification chip.
- **Archetypes:** `luxe-editorial`, `paper-bento`, `sunlit-worlds` (colourway worlds), `brutal-bento` for streetwear.
- **Scaffold:** `items` with `options`, `cart` mode, `gallery`, `compare`.
- **Pitfalls:** hidden total cost, slow images, no mobile buy bar.

## Hotels and travel

- **Visitors came to:** picture themselves there, check dates and price, book direct. Research: the booking widget is visible at all times; a pre-filled availability widget lifts click-through; guests book direct for self-interest (best rate, extras, flexible cancellation); immersive visuals, clear room segmentation and a story of the place win.
- **Extra efforts:** a booking or availability pill in the hero (`frame` search or a custom widget); direct-booking perks stated plainly; room galleries (`gallery`); a day-in-the-life story (`story`).
- **Creative angles:** `frame` hero with a tinted photo; a luxe or paper editorial look; a map of the neighbourhood.
- **Surprise ideas:** weather-matched itinerary; room comparison slider; sunset-time chip.
- **Archetypes:** `luxe-editorial`, `glass-frame`, `paper-editorial`.
- **Pitfalls:** a booking button that leads to a third-party marketplace, stock imagery, slow hero video.

## Fitness, studios and wellness

- **Visitors came to:** see the schedule, try a class, understand the price. Research: a live class schedule is the strongest feature; the free-trial or first-class CTA belongs above the fold and should take at most three clicks; pricing with a monthly and annual toggle; trainer bios; location and hours at the top; pages must be fast.
- **Extra efforts:** `schedule` block with Book buttons; `estimator` for a plan; `compare` table for memberships; a trial form.
- **Creative angles:** bold bento hero; a loud marquee; kettlebell and dumbbell objects; a find-your-class quiz.
- **Surprise ideas:** class quiz; plan estimator by weekly sessions; streak or challenge teaser.
- **Archetypes:** `brutal-bento`, `noir-frame`, `glass-frame` (yoga, spa), `sticker-pop` (kids classes).
- **Pitfalls:** timetable hidden behind a third-party widget, no trial offer, invented transformation photos or results.

## Professional services (law, accounting, consulting, architecture)

- **Visitors came to:** decide whether to trust you and book a conversation. Research: six trust signals in the first fold lift bookings (named clients, published outcomes with real numbers, credentialed bios with photos, third-party reviews, published pricing bands, a booking widget with live availability); numbers set larger than client names; editorial layouts with strong grids and restrained colour; speed counts.
- **Extra efforts:** credential strip; case study cards with outcomes (only real numbers); a team block; a consultation form; plain-language FAQ.
- **Creative angles:** `paper` or `luxe` presets; an editorial hero with a serif display face; a long, calm story.
- **Surprise ideas:** matter cost estimator; plain-language glossary drawer; consultation prep checklist.
- **Archetypes:** `paper-editorial`, `luxe-editorial`, `paper-bento`.
- **Pitfalls:** invented awards or case numbers, gavel-and-scales clichés, hidden fees.

## Education (general practice)

- **Visitors came to:** find the right programme, see fees, try a class. **Extra efforts:** a programme finder by age or goal (`worlds` + filters), fee table, demo-class form, teacher profiles, parent FAQ. **Surprise ideas:** learning-path builder; weekly timetable preview. **Archetypes:** `sticker-pop` (early years), `paper-bento`, `bento-glass`. **Pitfalls:** invented results, rankings and pass rates.

## Nonprofit and community (general practice)

- **Visitors came to:** understand the cause, trust the organisation, give or volunteer. **Extra efforts:** donation amount chips with plain impact copy, transparency page, event calendar filtered by date, volunteer form. **Surprise ideas:** impact calculator with sample values; a story that follows one programme. **Archetypes:** `paper-editorial`, `sticker-pop`, `glass-frame`. **Pitfalls:** invented impact numbers; manipulative urgency.

## Beauty and salons (general practice)

- **Visitors came to:** see services, durations and prices, pick a time. **Extra efforts:** service menu with durations, slot booking, before and after slider (`compare`), stylist profiles. **Surprise ideas:** style or skincare quiz; aftercare cards. **Archetypes:** `luxe-editorial`, `paper-editorial`, `glass-frame`.

## Creative studios, portfolios and events (general practice)

- **Visitors came to:** judge the work or find the date and book. **Extra efforts:** filterable case studies, process steps, clear enquiry; for events, date and venue first, one-step RSVP, schedule filter, map. **Surprise ideas:** hover-reveal previews, a cursor that morphs over projects, a countdown. **Archetypes:** `brutal-bento`, `noir-frame`, `paper-bento`.

## Sources (research pass, 2025 to 2026)

- Restaurants: Sauce, Chowly, Toast, ChowNow and other restaurant-website guides (text menus, mobile traffic share, visible hours and phone, separate pickup and delivery actions, order-direct perks).
- Healthcare: Healthcare Success, Rave Health, Orbix Studio, Redberries, Element8 (patient-first UX, find-a-doctor and book tasks, provider profile content, trust and accessibility, WhatsApp in some markets, ER wait-time idea).
- Real estate: Luxury Presence, WPResidence, Redefine, WeWeb (map and list, saved searches, calculators, virtual tours, quiet-luxury trend, filter speed).
- SaaS: SaaSFrame, Navattic, Orbix, SaaSHero, Veza Digital (product-as-hero, interactive demos, outcome-first headlines, proof under CTA).
- E-commerce: Baymard-based summaries, Shopify and Hostinger guides, Utsubo and Dopple on 3D viewers and configurators (sticky add-to-cart, mobile-first, delivery date, variant UI).
- Hotels: Mediaboom, Cloudbeds, Hooray, StudioMeyer (booking widget visibility, direct-booking perks, immersive storytelling).
- Fitness: StudioMeyer, GymDesk, Whipp Studio, B12 (live schedule, trial funnel, pricing toggle, trainer bios).
- Professional services: Redefine Web, PaperStreet, MagnifyLab (trust signals in the first fold, editorial layouts, published pricing bands).
