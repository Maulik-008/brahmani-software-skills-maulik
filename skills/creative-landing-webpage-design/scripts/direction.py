#!/usr/bin/env python3
"""Creative direction engine: proposes a DIFFERENT visual direction for each new site.

  python direction.py "cafe in Ahmedabad, coffee and ice cream"                       # propose
  python direction.py "boutique gym in Pune" --avoid-file ../prev/direction.json      # differ from the last site
  python direction.py "clinic" --avoid preset:noir,hero:demo --seed 7 --json out.json
  python direction.py --list                                                          # show all archetypes

It maps the topic to domains, picks from curated archetypes (preset x hero layout x nav x blocks x type x motion x imagery),
excludes anything you pass with --avoid / --avoid-file, mutates secondary axes with a seeded dice roll, and adds the domain's
'extra effort' modules and one 'surprise' idea. The original 'sunlit-worlds' look is penalised so it is not the automatic answer. Treat the output as a strong starting hypothesis: you may override a choice,
but only for a reason you can state, and the final site must differ from the previous one on preset AND hero layout.
"""
import argparse, hashlib, json, random, sys
A={ # archetype: preset, hero, nav, blocks, imagery, motion, feel, domains
 'sunlit-worlds':dict(preset='world',hero='stage',nav='pill',blocks=['find','worlds','items','how','stories','band'],imagery='3d objects per world',motion='weighty 1.2s',feel='saturated, playful, one hero object',domains=['food','dessert','kids','retail','gifts','wellness']),
 'paper-editorial':dict(preset='paper',hero='editorial',nav='bar',blocks=['marquee','items','story','gallery','reviews','faq','band'],imagery='photography or still-life crops inline in the headline',motion='calm 0.9s',feel='publication, quiet luxury, serif',domains=['food','hotel','boutique','legal','studio','realestate','portfolio','beauty']),
 'noir-demo':dict(preset='noir',hero='demo',nav='bar',blocks=['marquee','bento','story','estimator','compare','faq','band'],imagery='product UI and abstract type, no objects',motion='crisp 0.5s',feel='dark mode, product-as-hero, neon accent',domains=['saas','automation','fintech','agency','ai','health-ops']),
 'brutal-bento':dict(preset='brutal',hero='bento',nav='bar',blocks=['marquee','schedule','estimator','compare','faq','band'],imagery='cut-out objects on flat colour tiles',motion='snappy 0.35s',feel='raw, loud, thick borders, hard shadows',domains=['fitness','sport','events','creative','youth','bar','streetwear']),
 'glass-frame':dict(preset='glass',hero='frame',nav='rail',blocks=['worlds','team','map','faq','band'],imagery='still-life or photo under a soft tint, frosted cards',motion='floating 1.0s',feel='soft lavender, floating glass, vertical rail',domains=['health','realestate','hotel','spa','school','wellness']),
 'sticker-pop':dict(preset='sticker',hero='stage',nav='pill',blocks=['find','worlds','items','story','stories','band'],imagery='friendly objects, doodles, tilted sticker cards',motion='bouncy 0.8s',feel='cream, hard offset shadows, playful',domains=['kids','dessert','bakery','toys','pets','party','education']),
 'luxe-editorial':dict(preset='luxe',hero='editorial',nav='bar',blocks=['story','gallery','team','faq','band'],imagery='dark still-life or photography, gold hairlines',motion='slow 1.4s',feel='warm black, serif, spaced caps, hairline gold',domains=['jewellery','hotel','restaurant','beauty','legal','realestate']),
 'bento-glass':dict(preset='glass',hero='bento',nav='pill',blocks=['bento','story','compare','faq','band'],imagery='objects or icons on soft tiles',motion='floating 1.0s',feel='modular tiles, soft, modern',domains=['saas','health','education','services','home']),
 'noir-frame':dict(preset='noir',hero='frame',nav='rail',blocks=['gallery','story','team','map','band'],imagery='moody still-life or photography',motion='slow 1.2s',feel='dark, cinematic, accent pop',domains=['nightlife','bar','hotel','fitness','music','events','restaurant']),
 'paper-bento':dict(preset='paper',hero='bento',nav='bar',blocks=['bento','marquee','story','team','faq','band'],imagery='objects on warm paper tiles',motion='calm 0.9s',feel='editorial grid, friendly',domains=['studio','legal','education','services','portfolio','food']),
}
DOM={'food':['cafe','coffee','tea','restaurant','bakery','kitchen','food','bistro','canteen','dhaba','pizza'],'dessert':['ice cream','dessert','sweet','chocolate','gelato','cake','kulfi','pastry'],'kids':['kids','children','toy','nursery','baby','playschool'],
 'retail':['shop','store','fashion','boutique','clothing','apparel','shoes'],'gifts':['gift','florist','flower','stationery'],'wellness':['wellness','yoga','meditation','ayurveda','nutrition'],'health':['clinic','hospital','doctor','dental','dentist','medical','physio','pharmacy','health'],
 'health-ops':['clinic automation','practice management'],'saas':['saas','software','app','platform','startup','tool','api','dashboard'],'automation':['automation','workflow'],'ai':[' ai ','assistant','agent'],'fintech':['fintech','payments','bank','insurance','loan'],'agency':['agency','consulting','studio'],
 'fitness':['gym','fitness','crossfit','pilates','boxing','training','workout'],'sport':['sport','football','cricket','badminton','arena'],'events':['event','wedding','festival','concert','venue'],'creative':['portfolio','photographer','designer','artist','film'],
 'realestate':['real estate','property','apartment','builder','broker','interior'],'hotel':['hotel','resort','homestay','villa','b&b','stay'],'spa':['spa','salon','barber','massage','beauty'],'beauty':['salon','makeup','skincare','cosmetic'],
 'school':['school','college','coaching','tuition','academy','course'],'education':['education','learning','classes','tutor'],'legal':['law','legal','advocate','lawyer','accounting','ca firm','tax'],'jewellery':['jewellery','jewelry','ring','gold'],'bar':['bar','brewery','pub','lounge','cocktail'],
 'nightlife':['club','nightlife','dj','music'],'pets':['pet','vet','dog','cat'],'party':['party','balloon'],'home':['furniture','decor','home services','plumber','cleaning','repair'],'services':['services','installation','repair','agency'],'portfolio':['portfolio'],'streetwear':['streetwear','sneaker'],'youth':['youth','gen z'],'toys':['toy']}
BANK={ # domain family -> extra efforts (research-backed) + surprise ideas
 'food':dict(effort=['Text menu with filters, never a PDF','Open-now chip plus hours, phone and map in header and footer','Separate Pickup, Delivery and Dine-in actions','WhatsApp or direct ordering with an order-direct perk','Seasonal or today\'s-pick highlight'],surprise=['Brew or churn timer showing what is fresh now','Seasonal banner that follows the calendar','Table-for-tonight availability pill']),
 'health':dict(effort=['Find a doctor or location within two clicks of the hero','Provider profiles with credentials and languages','Insurance and fees clarity','Emergency line and safety copy on booking','Reminders and manage-appointment flow','WhatsApp where it is the norm'],surprise=['Which-specialist finder (non-diagnostic, with a safety line)','Visit preparation checklist per department','Quiet-hours indicator']),
 'saas':dict(effort=['Product-as-hero: an interactive demo card with 5 to 13 steps','Outcome-first headline with proof directly under the CTA','Pricing with a toggle and a highlighted plan','ROI or time-saved estimator','Single conversion goal'],surprise=['Replayable live workflow in the hero','Estimator that feeds the demo-request form','Dark and light toggle']),
 'realestate':dict(effort=['Half-map and list with result counts and pins','Filters that update without reload','Save-this-search on every card','Mortgage or EMI calculator','Neighbourhood guides'],surprise=['Commute estimator','Compare two listings side by side','Open-house countdown']),
 'retail':dict(effort=['Sticky add-to-cart on mobile','Delivery date shown, not only speed','Size, fit, material answers above the fold','Viewer to understand, configurator to personalise','Reviews with customer photos','Guest checkout'],surprise=['Build your bundle','Gift finder quiz','Restock notification chip']),
 'hotel':dict(effort=['Booking widget visible at all times','Live availability calendar','Direct-booking perks named plainly','Room-by-room galleries','Immersive scroll story of a day at the property'],surprise=['Weather-matched day itinerary','Room comparison slider','Sunset-time chip']),
 'fitness':dict(effort=['Live class schedule on the page, bookable','Free-trial CTA reachable in at most 3 clicks','Pricing with a monthly/annual toggle','Trainer bios','Location and hours at the top'],surprise=['Find-your-class quiz','Plan estimator by weekly sessions','Streak or challenge teaser']),
 'legal':dict(effort=['Six trust signals in the first fold (credentials, outcomes, reviews, pricing bands, team, booking)','Case studies with numbers set larger than client names','Published pricing bands','Live-availability consult booking','Editorial layout'],surprise=['Matter cost estimator','Plain-language glossary drawer','Consultation prep checklist']),
 'education':dict(effort=['Programme finder by age and goal','Fees table with sample values','Free demo class form','Teacher profiles','Parent FAQ'],surprise=['Learning-path builder','Weekly timetable preview','Age-matched colour worlds']),
 'beauty':dict(effort=['Service menu with duration and price','Slot booking','Before and after compare slider','Stylist profiles'],surprise=['Style quiz','Aftercare cards','Seasonal offer ribbon']),
 'creative':dict(effort=['Filterable case studies','Kinetic or oversized type','Process section with numbered steps','Clear enquiry form'],surprise=['Hover-reveal project previews','Cursor that morphs on projects','Variable-font hero']),
 'events':dict(effort=['Date and venue first','Ticket or RSVP in one step','Schedule filter','Map and travel info'],surprise=['Countdown','Lineup filter by day','Packing list']),
}
FAM={'food':['food','dessert','bakery','bar'],'health':['health','health-ops','spa','wellness'],'saas':['saas','automation','ai','fintech','agency'],'realestate':['realestate','home'],'retail':['retail','gifts','jewellery','streetwear','toys'],'hotel':['hotel'],'fitness':['fitness','sport','youth'],'legal':['legal'],'education':['education','school','kids'],'beauty':['beauty','spa'],'creative':['creative','portfolio'],'events':['events','nightlife','party']}
FONTS={'paper':[('Fraunces','Inter'),('Instrument Serif','Inter'),('DM Serif Display','DM Sans'),('Playfair Display','Source Sans 3')],'noir':[('Space Grotesk','Inter'),('Unbounded','Inter'),('Sora','Inter')],'brutal':[('Space Grotesk','Space Mono'),('Archivo Black','Archivo'),('Rubik Mono One','Rubik')],
 'glass':[('Instrument Serif','Inter'),('Plus Jakarta Sans','Inter'),('Manrope','Inter')],'sticker':[('Fredoka','Nunito'),('Baloo 2','Nunito'),('Grandstander','Nunito')],'luxe':[('Cormorant Garamond','Jost'),('Playfair Display','Jost'),('Bodoni Moda','Jost')],'world':[('Bagel Fat One','Inter'),('Fredoka','Nunito'),('Chango','Poppins')]}
ACC=['#C93A67','#2F7F6F','#E4572E','#4B3F9E','#C9A25B','#1F6FEB','#B4452B','#0F7B78','#FF4F2B','#7A4B8F','#C8F169','#F2A900']
def main():
    p=argparse.ArgumentParser(); p.add_argument('topic',nargs='?',default=''); p.add_argument('--avoid',default=''); p.add_argument('--avoid-file'); p.add_argument('--seed',type=int,default=0); p.add_argument('--json'); p.add_argument('--list',action='store_true'); p.add_argument('--allow-default',action='store_true',help='do not penalise the original sunlit-worlds look'); a=p.parse_args()
    if a.list:
        for k,v in A.items(): print(f"{k:16} preset={v['preset']:7} hero={v['hero']:9} nav={v['nav']:5} feel: {v['feel']}")
        return
    t=' '+a.topic.lower()+' '; doms=[d for d,ks in DOM.items() if any(k in t for k in ks)]
    avoid={}
    for tok in [x for x in a.avoid.split(',') if x]: k,v=tok.split(':'); avoid.setdefault(k,set()).add(v)
    if a.avoid_file:
        pv=json.load(open(a.avoid_file)); 
        for k in ('preset','hero','nav','archetype'): 
            if pv.get(k): avoid.setdefault(k,set()).add(pv[k])
    rng=random.Random(int(hashlib.md5((a.topic+str(a.seed)).encode()).hexdigest()[:8],16))
    cand=[]
    for name,v in A.items():
        if name in avoid.get('archetype',()) or v['preset'] in avoid.get('preset',()) or v['hero'] in avoid.get('hero',()) or v['nav'] in avoid.get('nav',()): continue
        score=1+3*len(set(v['domains'])&set(doms))+rng.random()*1.5-(0 if (a.allow_default or name!='sunlit-worlds') else 3.0); cand.append((score,name))
    if not cand: sys.exit('everything was excluded by --avoid; relax it')
    cand.sort(reverse=True); pick=rng.choice(cand[:3]); name=pick[1]; v=A[name]; cand=[pick]+[c for c in cand if c!=pick]
    fd,fb=rng.choice(FONTS[v['preset']]); acc=rng.choice([c for c in ACC if c not in avoid.get('accent',())])
    fam=next((f for f,ds in FAM.items() if set(ds)&set(doms)),None); bank=BANK.get(fam) or BANK['food'] if fam else dict(effort=['Make the main task one or two clicks from the hero','Show hours, contact and location on every page','Use real photos where people matter'],surprise=['A small tool tied to the customer\'s main decision'])
    out=dict(topic=a.topic,domains=doms,archetype=name,preset=v['preset'],hero=v['hero'],nav=v['nav'],blocks=v['blocks'],imagery=v['imagery'],motion=v['motion'],feel=v['feel'],displayFont=fd,bodyFont=fb,accent=acc,
      radius=rng.choice(['pill','soft','sharp'] if v['preset'] in ('world','glass','noir') else ['soft','sharp'] if v['preset']=='paper' else ['pill']),extraEffort=bank['effort'],surprise=rng.choice(bank['surprise']),
      runnersUp=[n for _,n in cand[1:4]],rule='The final site must differ from the previous one on preset AND hero layout. Implement at least one extraEffort item and the surprise.')
    print(json.dumps(out,indent=1,ensure_ascii=False))
    if a.json: json.dump(out,open(a.json,'w'),indent=1,ensure_ascii=False)
main()
