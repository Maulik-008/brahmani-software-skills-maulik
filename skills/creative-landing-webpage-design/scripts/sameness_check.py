#!/usr/bin/env python3
"""Compare two site configs and report how alike their design direction is (0 to 1).

  python sameness_check.py previous/site.config.json new/site.config.json [--max 0.55]

Axes compared: preset, hero layout, nav style, display and body fonts, accent hue, corner style, action mode,
the set of block types, and world count. Exits non-zero if similarity exceeds --max, so a build that looks like the
previous one is caught before it ships.
"""
import json, sys, colorsys
def hue(h):
    try: h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return colorsys.rgb_to_hsv(r,g,b)[0]
    except Exception: return None
def feats(c):
    t=c.get('theme',{}); order=(c.get('page') or {}).get('order') or ['find','worlds','items','how','stories','band']
    blocks={(x if isinstance(x,str) else x.get('block')) for x in order}
    return dict(preset=t.get('preset','world'),hero=(c.get('hero') or {}).get('layout','stage'),nav=(c.get('nav') or {}).get('style','pill'),fd=t.get('fontDisplay'),fb=t.get('fontBody'),acc=hue(t.get('accent','#000000')),radius=t.get('radius','pill'),mode=(c.get('action') or {}).get('mode'),blocks=blocks,worlds=len(c.get('worlds',[])))
a,b=feats(json.load(open(sys.argv[1]))),feats(json.load(open(sys.argv[2]))); mx=float(sys.argv[sys.argv.index('--max')+1]) if '--max' in sys.argv else 0.55
W=dict(preset=3,hero=3,nav=1.5,fd=1.5,fb=0.5,acc=1,radius=1,mode=0.5,blocks=2.5,worlds=0.5); s=0; same=[]
for k,w in W.items():
    if k=='blocks': j=len(a[k]&b[k])/max(1,len(a[k]|b[k])); s+=w*j; (same.append(f'blocks overlap {j:.0%}') if j>0.6 else None)
    elif k=='acc': 
        if a[k] is not None and b[k] is not None: d=min(abs(a[k]-b[k]),1-abs(a[k]-b[k])); m=1 if d<0.06 else 0; s+=w*m; (same.append('accent hue') if m else None)
    elif k=='worlds': m=1 if a[k]==b[k] else 0; s+=w*m
    else:
        m=1 if a[k]==b[k] else 0; s+=w*m
        if m: same.append(f'{k}={a[k]}')
sim=s/sum(W.values()); print(f'similarity {sim:.2f} (max allowed {mx})'); print('same on:',', '.join(same) or 'nothing')
if sim>mx: print('TOO SIMILAR: change preset and hero layout, then fonts, nav and blocks.'); sys.exit(1)
print('OK: clearly different direction.')
