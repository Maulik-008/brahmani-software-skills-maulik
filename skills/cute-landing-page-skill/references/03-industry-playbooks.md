# 03 · Industry playbooks

Starting points for common businesses. Each entry gives worlds, hero objects (with the primitives to build them), the tool, the scaffold action mode, pages, and cautions. Adapt, never copy: the concept engine (`02`) still decides the final choices.

Action modes in the scaffold: `cart` (order and WhatsApp checkout), `form` (reservation or enquiry), `none` (browse only). Slot-based booking needs the Pulse example engine (`assets/examples/pulse-hospital-template.html`).

Contents: food and drink · health · beauty and fitness · retail · property and home · education and services · creative and tech · community.

## Food and drink

**Cafe, coffee, bakery.** Worlds by product family: Coffee (brown), Bakes (golden), Cold drinks (teal). Objects: latte cup on saucer (lathe cup, torus handle, foam heart via `heart2d`), croissant (curved capsule chain with ridges), iced takeaway cup (lathe plus sleeve, lid, straw), bean (ellipsoid with a carved groove). Tool: menu filter plus cart with WhatsApp. Mode `cart`. Add an open-now chip. Caution: label vegetarian, eggless or Jain only if confirmed.

**Ice cream and desserts.** Worlds by format: Scoops, Sundaes, Kulfi and cakes. Objects: two-scoop waffle cone (rcone with a sine waffle displacement, ellipsoid scoops, torus skirt, cherry), sundae glass (lathe), cake slice (box with layers), kulfi stick (rounded capsule). Playful dial: tilted cards, hard shadows. Seasonal band (mango season, festival).

**Restaurant.** Worlds by meal or cuisine: Brunch, Dinner, Drinks. Objects: plated dish is hard to render, so use a signature item (bowl lathe with a heap of noodles from tori, a skewer, a thali set of lathed bowls) or switch to photography via the Canva prompt pack. Tool: reservation form with party size and date, plus menu. Mode `form`, with an optional cart.

**Bar, brewery, juice bar.** Worlds by drink families. Objects: bottle (lathe), glass with fruit slices (lathe plus ellipsoids, no transparency, use opaque tumbler styles), can (lathe). Tool: menu filter and a table form.

## Health

**Clinic, hospital, dental.** Calm dial. Worlds by department (heart red, brain violet, children teal, bones blue; dental could be mint and white). Objects: anatomical heart, neuron, teddy bear, bent-limb knee, tooth (lathe plus lobes), mannequin figure for a body map. Tool: find a doctor, slot booking with double-booking guard, manage or cancel appointment. Pages: department sheets, doctor profiles. Always show the emergency number and a safety line on booking and contact. Portraits are illustrative until replaced; say so. Reference implementation: `assets/examples/pulse-hospital-template.html`.

**Pharmacy, wellness, nutrition.** Worlds: Prescriptions, Wellness, Care. Objects: capsule (two-tone lathe), bottle, herb leaf. Tool: search, refill request form (mode `form`). Add a prominent compliance line when required.

**Physio, therapy, mental health.** Calmest dial, softer palette, slower motion, no playful tilt. Tool: body map with pins (`assets/examples/scenes-medical.py` has a mannequin), intake form.

**Pet care and vet.** Worlds: Dogs, Cats, Small pets. Objects: a bowl, a collar tag, a ball. Avoid bone shapes in medical contexts (they read as pet shops). Use bones only deliberately here.

## Beauty and fitness

**Salon, spa, barber.** Worlds by service family: Hair, Skin, Nails or Massage. Objects: scissors (hard), comb, perfume bottle (lathe), candle, stacked stones, towel roll (capsule). Tool: service list with duration and price, slot booking or form. Editorial dial, `radius: soft`.

**Gym, yoga, studio.** Bold dial. Worlds by class type (Strength, Cardio, Mind). Objects: dumbbell (lathe plus capsule), kettlebell (sphere plus torus handle), yoga mat roll, water bottle. Tool: class schedule filter, trial booking form. Condensed display face, 0.6 s motion.

## Retail

**Fashion, accessories, jewellery.** Editorial dial, `radius: sharp`, fewer worlds (colourways), larger photography. Objects: a puffer jacket needs photography or heavy modelling, so prefer photos via Canva; a ring (torus with a gem), a bag (rounded box with a handle torus), sneakers (hard). Tool: colour and size pickers, cart, size guide.

**Home, decor, furniture.** Worlds by room or material. Objects: vase (lathe), lamp (lathe plus cone), chair (boxes, capsules). Tool: filter by room, enquire form, cart for small items.

**Gifts, florists, stationery.** Playful dial. Objects: bouquet (stems from capsules, flower heads from ellipsoid petals), gift box (rounded box and torus ribbon). Tool: occasion filter, cart with a delivery date field (use the generic `form` fields).

## Property and home services

**Real estate.** Reference: Lunar Homes. Full-bleed photography under a soft tint, frosted cards, a vertical pill rail, filters and a map. Objects are photos. Tool: filter bar, saved searches, compare, enquire form. Mode `form`.

**Home services (plumber, cleaner, repair).** Crisp dial, clear price lists. Worlds by service. Objects: a wrench (capsules), spray bottle (lathe), toolbox. Tool: quote request form with photo note, WhatsApp button front and centre.

## Education and services

**Coaching, courses, schools.** Worlds by programme (age groups or subjects), like the children's hospital worlds: bears, stars, flowers recoloured per age. Objects: books (boxes), pencil (capsule plus cone), globe (sphere plus torus). Tool: programme finder, enquiry form, fees table with sample values.

**Law, finance, consulting.** Crisp or calm dial. One accent world, serif display face, `radius: soft`. Objects: abstract (stacked slabs, coins as lathed discs). Tool: consultation form, FAQ.

## Creative and tech

**Portfolio, studio, agency.** Editorial dial. Worlds by discipline. Objects: the work itself as large images. Tool: filter by discipline, case study sheets, enquiry form.

**SaaS, app.** Crisp dial. One or two worlds (plans or audiences). Hero object: the product UI as a clean mock inside a rounded device. Tool: pricing configurator, comparison table, sign-up form. Never invent customer logos or metrics.

## Community

**NGO, events, places of worship.** Calm to warm dial. Worlds by programme or season. Objects: symbolic and simple (a diya from a lathed bowl plus flame ellipsoid, a seedling). Tool: donate or volunteer form, event list filtered by date. Respect religious and cultural symbols: use only what the user confirms.

## Choosing quickly

If the business is not listed, find its closest relative here, keep its tool, then invent the worlds from what it really sells. The tool and the hero object matter more than the section order.
