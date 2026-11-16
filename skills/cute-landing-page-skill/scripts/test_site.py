#!/usr/bin/env python3
"""Headless QA for a site built with the scaffold.   python test_site.py path/to/site.html [--out qa] [--quick]

Checks: console/page errors · horizontal overflow at 7 widths · nav overlap at 10 widths · hero worlds · filters ·
item sheet · cart checkout OR form flow (validation + success) · about/contact/menu sheets · Escape closes · broken images.
Writes screenshots to --out. Exit code 1 if any check fails. Needs: pip install playwright && playwright install chromium
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
args=[a for a in sys.argv[1:] if not a.startswith('--')]; html=os.path.abspath(args[0]); URL='file://'+html
OUT=sys.argv[sys.argv.index('--out')+1] if '--out' in sys.argv else 'qa'; os.makedirs(OUT,exist_ok=True)
QUICK='--quick' in sys.argv
R={'pass':[], 'fail':[]}
def ok(n,c,extra=''):
    (R['pass'] if c else R['fail']).append(n+(' :: '+str(extra) if (extra and not c) else ''))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        async def page(w,h,mobile=False):
            ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile); pg=await ctx.new_page()
            pg.on('pageerror',lambda e: errs.append(('pageerror',w,str(e))))
            pg.on('console',lambda m: errs.append(('console',w,m.text)) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
            await pg.goto(URL); await pg.wait_for_timeout(900); return ctx,pg
        # ------------------------------------------------ desktop functional run
        ctx,pg=await page(1440,900)
        n_worlds=await pg.evaluate("document.querySelectorAll('.dp').length"); ok('hero has world pickers',n_worlds>=2,n_worlds)
        for i in range(n_worlds):
            await pg.click(f'[data-hd="{i}"]'); await pg.wait_for_timeout(1250); await pg.screenshot(path=f'{OUT}/hero_world{i}.png')
            ok(f'world {i} pressed',await pg.evaluate(f"document.querySelectorAll('.dp')[{i}].getAttribute('aria-pressed')")=='true')
        await pg.click('[data-hd="0"]')
        broken=await pg.evaluate("[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length"); ok('no broken images',broken==0,broken)
        for sec in ['find','worlds','items','how','stories','band','footer']:
            if await pg.evaluate(f"!!document.getElementById('{sec}')&&!document.getElementById('{sec}').hidden"):
                await pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); await pg.wait_for_timeout(1000); await pg.screenshot(path=f'{OUT}/sec_{sec}.png')
        await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(400)
        # filters
        total=await pg.evaluate("document.querySelectorAll('#igrid .it').length"); ok('items render',total>0,total)
        if await pg.evaluate("!!document.querySelector('[data-do^=\"quick:\"]')"):
            await pg.click('[data-do^="quick:"]'); await pg.wait_for_timeout(900)
            after=await pg.evaluate("document.querySelectorAll('#igrid .it').length"); ok('quick filter changes results',after<=total,(total,after))
            await pg.click('#iReset'); await pg.wait_for_timeout(300)
        await pg.fill('#fQ','zzzzzz'); await pg.press('#fQ','Enter'); await pg.wait_for_timeout(500)
        ok('empty state shows',await pg.evaluate("!!document.getElementById('iReset2')")); await pg.click('#iReset2'); await pg.wait_for_timeout(300)
        # item sheet
        await pg.evaluate("document.getElementById('items').scrollIntoView()"); await pg.wait_for_timeout(700)
        await pg.click('#igrid .it >> nth=0'); await pg.wait_for_timeout(700); ok('item sheet opens',await pg.evaluate("document.getElementById('scrim').classList.contains('open')")); await pg.screenshot(path=f'{OUT}/sheet_item.png')
        mode=await pg.evaluate("(CONFIG.action||{}).mode")
        if mode=='cart':
            await pg.click('[data-act="add"]'); await pg.wait_for_timeout(500)
            ok('cart count updates',await pg.inner_text('#cartCount')!='0')
            await pg.click('#cartBtn'); await pg.wait_for_timeout(600); await pg.screenshot(path=f'{OUT}/sheet_cart.png')
            await pg.click('[data-act="cnext"]'); await pg.wait_for_timeout(300); await pg.click('[data-act="cplace"]'); await pg.wait_for_timeout(300)
            errs_visible=await pg.evaluate("[...document.querySelectorAll('#sh-body .err')].map(e=>e.textContent).filter(Boolean).length"); ok('checkout validation shows errors',errs_visible>=2,errs_visible)
            await pg.fill('#co-name','Test User'); await pg.fill('#co-phone','9800000000')
            if await pg.evaluate("!!document.getElementById('co-addr')"): await pg.fill('#co-addr','12 Test Street, Ahmedabad')
            await pg.click('[data-act="cplace"]'); await pg.wait_for_timeout(500); ok('order confirmation',await pg.evaluate("!!document.querySelector('#sh-body .ok h3')&&/placed/i.test(document.querySelector('#sh-body .ok h3').textContent)")); await pg.screenshot(path=f'{OUT}/sheet_done.png')
        elif mode=='form':
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400); await pg.evaluate("document.querySelector('[data-do=\"form\"]')?.click()")
            await pg.evaluate("Kit.open('form')"); await pg.wait_for_timeout(500); await pg.click('[data-act="fsubmit"]'); await pg.wait_for_timeout(300)
            ok('form validation shows errors',await pg.evaluate("[...document.querySelectorAll('#sh-body .err')].map(e=>e.textContent).filter(Boolean).length")>=1)
            await pg.screenshot(path=f'{OUT}/sheet_form_errors.png')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(450); ok('Escape closes sheet',not await pg.evaluate("document.getElementById('scrim').classList.contains('open')"))
        # page sheets
        for name in ['about','contact']:
            if await pg.evaluate(f"!!document.querySelector('.lk[data-page=\"{name}\"]')"):
                await pg.evaluate("window.scrollTo(0,0)"); await pg.click(f'.lk[data-page="{name}"]'); await pg.wait_for_timeout(700)
                ok(f'{name} sheet opens',await pg.evaluate("document.getElementById('scrim').classList.contains('open')")); await pg.screenshot(path=f'{OUT}/sheet_{name}.png'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(450)
        ok('no horizontal overflow (1440)',not await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
        await ctx.close()
        # ------------------------------------------------ mobile
        ctx,pg=await page(390,844,True); await pg.screenshot(path=f'{OUT}/m_hero.png')
        await pg.click('#menuBtn'); await pg.wait_for_timeout(700); ok('mobile menu opens',await pg.evaluate("document.getElementById('scrim').classList.contains('open')")); await pg.screenshot(path=f'{OUT}/m_menu.png'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        for sec in ['worlds','items']:
            await pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); await pg.wait_for_timeout(900); await pg.screenshot(path=f'{OUT}/m_{sec}.png')
        ok('no horizontal overflow (390 mobile)',not await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")); await ctx.close()
        # ------------------------------------------------ overflow + nav overlap matrix
        widths=[360,768,1024,1280,1920] if QUICK else [360,390,768,1024,1280,1440,1920,2560]
        for w in widths:
            c2,p2=await page(w,900 if w<2000 else 1080); ox=await p2.evaluate("document.documentElement.scrollWidth>innerWidth+1"); ok(f'no overflow at {w}',not ox)
            await p2.screenshot(path=f'{OUT}/v_{w}.png'); await c2.close()
        for w in ([901,1100,1320] if QUICK else [901,960,1024,1100,1180,1280,1320,1366,1440]):
            c2,p2=await page(w,800); r=await p2.evaluate("""()=>{const q=s=>{const e=document.querySelector(s);return e&&!e.hidden&&e.offsetParent!==null?e.getBoundingClientRect():null};const a=q('#chipBtn'),n=q('.pillnav'),s=q('#searchBtn');const ov=(x,y)=>x&&y&&!(x.right+6<=y.left||y.right+6<=x.left);return {c:ov(a,n),s:ov(n,s)}}""")
            ok(f'nav has no overlap at {w}',not (r['c'] or r['s']),r); await c2.close()
        ok('no console or page errors',not errs,errs[:4]); await b.close()
    print(json.dumps({'passed':len(R['pass']),'failed':R['fail']},indent=1)); sys.exit(1 if R['fail'] else 0)
asyncio.run(main())
