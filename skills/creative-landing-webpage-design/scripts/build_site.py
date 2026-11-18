#!/usr/bin/env python3
"""Build ONE self-contained HTML file from a site config.

  python build_site.py site.config.json out.html

- Embeds: sheet kit, scaffold CSS/JS, config JSON, images (compressed WebP data URIs), film grain.
- Image paths in config["images"] are relative to the config file. Value = "path" or {"path":..., "max":760, "q":86}.
- Prints warnings: missing images, unknown worlds, low text contrast on world colours, oversize output.
Output must stay under 16 MB for publishing; typical output is 300 KB to 2 MB.
"""
import base64, io, json, os, sys
from PIL import Image
import numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c]; return .2126*c[0]+.7152*c[1]+.0722*c[2]
def contrast(a,b): la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+.05)/(lo+.05)
def data_uri(path,mx=760,q=86):
    im=Image.open(path); has_a=im.mode in('RGBA','LA') or 'transparency' in im.info
    im=im.convert('RGBA' if has_a else 'RGB'); sc=mx/max(im.size)
    if sc<1: im=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
def main():
    if len(sys.argv)<3: sys.exit(__doc__)
    cfg_path,out=sys.argv[1],sys.argv[2]; base=os.path.dirname(os.path.abspath(cfg_path)); C=json.load(open(cfg_path)); warn=[]
    # ---- validate
    wid={w['id'] for w in C['worlds']}
    for w in C['worlds']:
        ink=w.get('ink','#ffffff'); c=contrast(w['bg'],ink)
        if c<4.5: warn.append(f"contrast {c:.1f}:1 for world '{w['id']}' ({ink} on {w['bg']}): darken the background or switch ink (needs 4.5:1)")
    for i in C.get('items',[]):
        if i['world'] not in wid: warn.append(f"item {i['id']}: unknown world {i['world']}")
    imgs={}
    for k,v in C.get('images',{}).items():
        spec=v if isinstance(v,dict) else {'path':v}; p=os.path.join(base,spec['path'])
        if not os.path.exists(p): warn.append(f'missing image {k}: {p}'); continue
        imgs[k]=data_uri(p,spec.get('max',760),spec.get('q',86))
    need=[w.get('img') for w in C['worlds'] if w.get('img')]+[x for x in C.get('decor',[])]+[i.get('img') for i in C.get('items',[]) if i.get('img')]
    for n in need:
        if n and n not in imgs: warn.append(f'image key "{n}" is used but not provided')
    def walk(o):
        if isinstance(o,dict):
            for k,v in o.items():
                if k in ('img','image') and isinstance(v,str) and v not in imgs: warn.append(f'image key "{v}" is used in the config but not provided')
                elif k=='art' and isinstance(v,list):
                    for x in v:
                        if x not in imgs: warn.append(f'image key "{x}" (hero art) not provided')
                walk(v)
        elif isinstance(o,list):
            for x in o: walk(x)
    walk({k:v for k,v in C.items() if k!='images'})
    if C.get('hero',{}).get('layout','stage')=='stage' and C.get('theme',{}).get('preset','world')=='world': print('NOTE: default archetype (stage hero + world preset). Make sure the previous site in this conversation used a different archetype; see references/09-pattern-library.md.')
    rng=np.random.RandomState(5); g=np.clip(rng.normal(128,34,(192,192)),0,255).astype(np.uint8); b=io.BytesIO(); Image.fromarray(g,'L').save(b,'WEBP',quality=55); grain='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
    # ---- presets (visual languages): vars + fonts + css. Explicit theme keys in the config override the preset.
    PR=json.load(open(os.path.join(ROOT,'assets/scaffold/presets.json'))); TH0=C.get('theme',{}); pname=TH0.get('preset','world'); preset_css=''
    if pname!='world' and pname not in PR: sys.exit(f"unknown preset '{pname}'. Choose: world, "+', '.join(PR))
    # ---- theme
    T=dict(ink='#1C1A2E',soft='#F2F1FA',mute='#5B5881',line='#E3E2F0',tint='#EDEBFA',tint2='#F0EFF8',accent='#4B3F9E',fontDisplay='Bagel Fat One',fontBody='Inter',googleFonts='family=Inter:wght@400;500;600;700&family=Bagel+Fat+One',card='#FFFFFF')
    if pname!='world':
        p=PR[pname]; T.update(p['vars']); T.update(fontDisplay=p['fd'],fontBody=p['fb'],googleFonts=p['fonts']); preset_css=p['css']
    T.update({k:v for k,v in TH0.items() if k!='preset'})
    theme=f":root{{--ink:{T['ink']};--soft:{T['soft']};--mute:{T['mute']};--line:{T['line']};--tint:{T['tint']};--tint2:{T['tint2']};--accent:{T['accent']};--card:{T['card']};--fd:'{T['fontDisplay']}',sans-serif;--fb:'{T['fontBody']}',system-ui,sans-serif}}"
    TH=C.get('theme',{})
    if TH.get('displayCase')=='none': theme+='.wd{text-transform:none}'
    if TH.get('heroWord') is False: theme+='.wd{display:none}'
    if 'grain' in TH: theme+='.grain{opacity:%s}'%TH['grain']
    rad=TH.get('radius','pill')   # pill (default) | soft | sharp : corner personality of cards and buttons
    theme+=preset_css
    if rad in ('soft','sharp'):
        card,btn=('22px','14px') if rad=='soft' else ('6px','4px')
        theme+=('.dcard,.it,.story,.how,.fbar,.cf,.band>div,footer,.sheet.page,.bnr,.tool,.nxt,.sumbox,.warm,.stat{border-radius:%s!important}'%card+
                '.b1,.b2,.btn,.dp,.vb,.chip,.pillnav,.em,.emi,.bookbtn,.fgo,.cir,.go,.sbtn,.cartbtn,.mbtn,.badge,.pl,.fbar input,.fbar select{border-radius:%s!important}'%btn)
    kitcss=open(os.path.join(ROOT,'assets/kit/kit.css')).read(); kitjs=open(os.path.join(ROOT,'assets/kit/kit.js')).read()
    blkcss=open(os.path.join(ROOT,'assets/scaffold/blocks.css')).read(); blkjs=open(os.path.join(ROOT,'assets/scaffold/blocks.js')).read()
    tpl=open(os.path.join(ROOT,'assets/scaffold/site.template.html')).read(); app=open(os.path.join(ROOT,'assets/scaffold/app.js')).read()
    meta=C.get('meta',{}); first=C['worlds'][0]['bg']
    html=(tpl.replace('/*KITCSS*/',kitcss).replace('/*KITJS*/',kitjs).replace('/*BLOCKSCSS*/',blkcss).replace('/*BLOCKSJS*/',blkjs).replace('/*APPJS*/',app).replace('/*THEME*/',theme)
        .replace('/*LANG*/',meta.get('lang','en')).replace('/*TITLE*/',meta.get('title',C['brand']['name'])).replace('/*DESCRIPTION*/',meta.get('description','').replace('"','&quot;'))
        .replace('/*FONTSURL*/','https://fonts.googleapis.com/css2?'+T['googleFonts']+'&display=swap').replace('#D32F45"> <link','#D32F45"> <link')
        .replace('content="#D32F45"','content="'+first+'"').replace('url(/*GRAIN*/)','url('+grain+')')
        .replace('const CONFIG=/*CONFIG*/{};','const CONFIG='+json.dumps({k:v for k,v in C.items() if k!='images'},ensure_ascii=False).replace('</','<\\/')+';')
        .replace('const IMGS=/*IMGS*/{};','const IMGS='+json.dumps(imgs)+';'))
    os.makedirs(os.path.dirname(os.path.abspath(out)),exist_ok=True); open(out,'w').write(html)
    kb=len(html)//1024; print(f'built {out}: {kb} KB, {len(imgs)} images')
    if kb>14000: warn.append('output is over 14 MB: compress images (smaller "max")')
    for w in warn: print('WARNING:',w)
    if not warn: print('no warnings')
main()
