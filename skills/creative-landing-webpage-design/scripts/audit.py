#!/usr/bin/env python3
"""Interface audit for a built site (references/11 to 14). Imported by test_site.py; can also run alone:

    python audit.py path/to/site.html [--out qa] [--stress]

Findings carry a severity (HIGH / MEDIUM / LOW) and the rule they break. Escalation triggers are HIGH:
control with no accessible name, keyboard-focusable control with no visible focus indicator, motion that ignores
prefers-reduced-motion, content clipped at 320 px width or 200 % zoom, text failing contrast, moving content with no
pause control, pinch-zoom disabled. Verdict: Block (any HIGH) / Needs changes (any MEDIUM or LOW) / Approve.
"""
import asyncio, json, os, sys

NAMES_JS = r"""() => {
  const vis = e => { const s = getComputedStyle(e); if (s.display==='none'||s.visibility==='hidden') return false;
    if (e.closest('[hidden],[inert],.scrim:not(.open)')) return false; const r = e.getBoundingClientRect(); return r.width>0&&r.height>0; };
  const label = e => { if (e.getAttribute('aria-label')) return e.getAttribute('aria-label').trim();
    const lb = e.getAttribute('aria-labelledby'); if (lb) { const t = lb.split(/\s+/).map(i=>{const x=document.getElementById(i);return x?x.textContent:''}).join(' ').trim(); if (t) return t; }
    if (e.id) { const l = document.querySelector('label[for="'+CSS.escape(e.id)+'"]'); if (l && l.textContent.trim()) return l.textContent.trim(); }
    const wl = e.closest('label'); if (wl && wl.textContent.trim()) return wl.textContent.trim();
    const img = e.querySelector('img[alt]:not([alt=""])'); if (img) return img.alt;
    const svgT = e.querySelector('svg title'); if (svgT) return svgT.textContent.trim();
    const t = (e.innerText||e.textContent||'').trim(); if (t) return t;
    return (e.getAttribute('title')||'').trim(); };
  const sel = 'a[href],button,[role=button],[role=tab],input:not([type=hidden]),select,textarea,summary,[tabindex]';
  const bad = []; document.querySelectorAll(sel).forEach(e => { if (!vis(e)) return; if (!label(e)) bad.push((e.id?'#'+e.id:e.tagName.toLowerCase())+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/)[0]:'')); });
  const noalt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => (i.className||'img')).slice(0,6);
  const meta = document.querySelector('meta[name=viewport]'); const vp = meta ? meta.content : '';
  const posTab = [...document.querySelectorAll('[tabindex]')].filter(e => parseInt(e.getAttribute('tabindex'),10) > 0).length;
  const mains = document.querySelectorAll('main,[role=main]').length;
  const first = document.querySelector('a[href],button'); const skip = !!first && /skip/i.test(first.textContent||'');
  const divClick = [...document.querySelectorAll('div[onclick],span[onclick]')].length;
  return { bad: [...new Set(bad)].slice(0,12), nBad: bad.length, noalt, lang: document.documentElement.lang||'', vp, posTab, mains, skip, divClick };
}"""

HIT_JS = r"""() => {
  const vis = e => { const s = getComputedStyle(e); if (s.display==='none'||s.visibility==='hidden') return false;
    if (e.closest('[hidden],[inert],.scrim:not(.open)')) return false; const r = e.getBoundingClientRect(); return r.width>0&&r.height>0; };
  const lt24 = [], lt40 = []; document.querySelectorAll('a[href],button,[role=button],[role=tab],input:not([type=hidden]):not([type=range]),select,summary').forEach(e => {
    if (!vis(e)) return; if (e.closest('p,li,.fq details>div,.fine,footer .lk') && e.tagName==='A') return;      /* inline links are exempt */
    const r = e.getBoundingClientRect(); const m = Math.min(r.width, r.height); const n = (e.id?'#'+e.id:e.tagName.toLowerCase())+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/)[0]:'');
    if (m < 24) lt24.push(n+' '+Math.round(r.width)+'x'+Math.round(r.height)); else if (m < 40) lt40.push(n+' '+Math.round(r.width)+'x'+Math.round(r.height)); });
  return { lt24: [...new Set(lt24)].slice(0,10), n24: lt24.length, lt40: [...new Set(lt40)].slice(0,10), n40: lt40.length };
}"""

CONTRAST_JS = r"""() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', {willReadFrequently:true});
  const rgba = c => { cx.clearRect(0,0,1,1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0,0,1,1); const d = cx.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]/255]; };
  const lum = ([r,g,b]) => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const over = (f, b) => [0,1,2].map(i => f[i]*f[3] + b[i]*(1-f[3]));
  const bgOf = (e, r) => { let chain = null; const x = r.left + r.width/2, y = r.top + r.height/2;
    if (x >= 0 && y >= 0 && x < innerWidth && y < innerHeight) { const st = document.elementsFromPoint(x, y); const i = st.indexOf(e); if (i >= 0) chain = st.slice(i); }   /* what is really painted behind it */
    if (!chain) { chain = []; let n = e; while (n && n.nodeType === 1) { chain.push(n); n = n.parentElement; } }
    const layers = []; let unknown = false;
    for (const n of chain) { const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none' || n.tagName==='VIDEO' || n.tagName==='CANVAS') { unknown = true; break; }
      const c = rgba(s.backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 0.999) break; }
    let base = [255,255,255]; for (let i = layers.length-1; i >= 0; i--) base = over(layers[i], base); return {base, unknown}; };
  const opac = e => { let o = 1, n = e; while (n && n.nodeType===1) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; } return o; };
  const fails = [], unknown = []; let checked = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set(); let t;
  while ((t = walker.nextNode())) { const txt = t.textContent.trim(); if (!txt) continue; const e = t.parentElement; if (!e || seen.has(e)) continue; seen.add(e);
    if (['SCRIPT','STYLE','NOSCRIPT','OPTION'].includes(e.tagName)) continue;
    const s = getComputedStyle(e); if (s.display==='none'||s.visibility==='hidden') continue; if (e.closest('[hidden],[aria-hidden=true],[inert],.scrim:not(.open),[disabled]')) continue;
    const r = e.getBoundingClientRect(); if (r.width===0||r.height===0) continue; if (r.right<=0||r.bottom<=0) continue; const o = opac(e); if (o < 0.5) continue;
    const bg = bgOf(e, r); const name = (e.id?'#'+e.id:e.tagName.toLowerCase())+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/)[0]:'');
    if (bg.unknown) { const k = unknown.length; e.setAttribute('data-aud', k); let f0 = rgba(s.color); f0[3] *= o; unknown.push({ name, fg: f0, px: parseFloat(s.fontSize), bold: parseInt(s.fontWeight,10) >= 700, txt: txt.slice(0,28) }); continue; }
    let fg = rgba(s.color); fg[3] *= o; const col = over(fg, bg.base); const L1 = lum(col), L2 = lum(bg.base); const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const px = parseFloat(s.fontSize), bold = parseInt(s.fontWeight,10) >= 700; const large = px >= 24 || (px >= 18.66 && bold); const need = large ? 3 : 4.5; checked++;
    if (ratio < need - 0.02) fails.push(name+' '+ratio.toFixed(2)+':1 (needs '+need+') "'+txt.slice(0,28)+'"'); }
  /* icon-only controls: non-text contrast, 3:1 (WCAG 1.4.11) */
  document.querySelectorAll('button,a[href]').forEach(e => { if ((e.innerText||'').trim() || !e.querySelector('svg')) return; const s = getComputedStyle(e);
    if (s.display==='none'||s.visibility==='hidden'||e.closest('[hidden],[aria-hidden=true],[inert],.scrim:not(.open),[disabled]')) return; const r = e.getBoundingClientRect(); if (r.width===0||r.height===0||r.right<=0||r.bottom<=0) return;
    const o = opac(e); if (o < 0.5) return; const bg = bgOf(e, r); const name = 'icon ' + (e.id?'#'+e.id:e.tagName.toLowerCase())+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/)[0]:'');
    let fg = rgba(s.color); fg[3] *= o;
    if (bg.unknown) { const k = unknown.length; e.setAttribute('data-aud', k); unknown.push({ name, fg, px: 24, bold: true, txt: (e.getAttribute('aria-label')||'icon').slice(0,24) }); return; }
    const col = over(fg, bg.base); const L1 = lum(col), L2 = lum(bg.base); const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); checked++;
    if (ratio < 3 - 0.02) fails.push(name+' '+ratio.toFixed(2)+':1 (needs 3) "'+(e.getAttribute('aria-label')||'icon').slice(0,24)+'"'); });
  return { checked, unknown, fails: [...new Set(fails)].slice(0,14), nFails: fails.length };
}"""

TRANS_JS = r"""() => { const bad = []; document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); if (s.transitionProperty === 'all' && s.transitionDuration.split(',').some(d => parseFloat(d) > 0)) bad.push((e.id?'#'+e.id:e.tagName.toLowerCase())+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/)[0]:'')); if (s.willChange === 'all') bad.push('will-change:all '+e.tagName); });
  return [...new Set(bad)].slice(0,10); }"""

MOTION_JS = r"""() => { const run = [...document.querySelectorAll('.mq-track')].filter(e => getComputedStyle(e).animationName !== 'none').length;
  const mq = document.querySelectorAll('.mq').length, pauses = document.querySelectorAll('.mq .mq-pause').length;
  const hp = document.getElementById('hPause'); return { run, mq, pauses, heroPause: !!hp && !hp.hidden, parallax: document.querySelectorAll('[data-parallax]').length }; }"""

INPUT_JS = r"""() => [...document.querySelectorAll('input:not([type=hidden]):not([type=range]):not([type=checkbox]):not([type=radio]),select,textarea')].filter(e => e.getBoundingClientRect().width>0).map(e => parseFloat(getComputedStyle(e).fontSize)).filter(v => v < 16).length"""

STRESS_JS = r"""() => { const LONG = 'Donaudampfschiffahrtsgesellschaftskapitaen2026'; const bad = []; const targets = ['.it h3','.it .nm','.rv2 p','.bt-t h3','.tm-t b','.st-c h3','.fq summary>span','.mini b','.doc h3'];
  targets.forEach(sel => document.querySelectorAll(sel).forEach((e, i) => { if (i > 2) return; const keep = e.textContent; e.textContent = LONG; const host = e.closest('.it,.rv2,.bt-t,.tm,.st-c,.fq,.mini,.doc,section') || e.parentElement;
    if (host && (host.scrollWidth > host.clientWidth + 1 || e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow === 'visible')) bad.push(sel); e.textContent = keep; }));
  return { bad: [...new Set(bad)], pageOverflow: document.documentElement.scrollWidth > innerWidth + 1 }; }"""


async def measure_over_images(pg, items, limit=30):
    """Text over photographs or gradients: hide the text, screenshot the box behind it, and compare the worst-case
    background luminance (10th / 90th percentile) with the text colour."""
    import io
    import numpy as np
    from PIL import Image
    def lin(a):
        a = a / 255.0; return np.where(a <= 0.03928, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    fails = []; n = 0
    await pg.add_style_tag(content='[data-aud]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}')
    for i, it in enumerate(items[:limit]):
        ok = await pg.evaluate("i => { const e = document.querySelector('[data-aud=\"'+i+'\"]'); if (!e) return false; e.scrollIntoView({block:'center'}); return true; }", i)
        if not ok: continue
        await pg.wait_for_timeout(140)
        bb = await pg.evaluate("i => { const r = document.querySelector('[data-aud=\"'+i+'\"]').getBoundingClientRect(); return {x:r.left, y:r.top, width:r.width, height:r.height}; }", i)
        if bb['width'] < 4 or bb['height'] < 4 or bb['x'] < 0 or bb['y'] < 0 or bb['x'] + bb['width'] > 1600 or bb['y'] + bb['height'] > 4000: continue
        try: png = await pg.screenshot(clip=bb, animations='disabled')
        except Exception: continue
        px = np.asarray(Image.open(io.BytesIO(png)).convert('RGB')).reshape(-1, 3).astype(float)
        if len(px) == 0: continue
        L = 0.2126 * lin(px[:, 0]) + 0.7152 * lin(px[:, 1]) + 0.0722 * lin(px[:, 2])
        med = px[np.argsort(L)[len(L) // 2]]
        fr, fg_, fb, fa = it['fg']; col = np.array([fr, fg_, fb]) * fa + med * (1 - fa)
        Lt = float(0.2126 * lin(col[0]) + 0.7152 * lin(col[1]) + 0.0722 * lin(col[2]))
        worst = min(((max(Lt, b) + 0.05) / (min(Lt, b) + 0.05)) for b in (float(np.percentile(L, 10)), float(np.percentile(L, 90))))
        large = it['px'] >= 24 or (it['px'] >= 18.66 and it['bold']); need = 3 if large else 4.5; n += 1
        if worst < need - 0.02: fails.append(f"{it['name']} {worst:.2f}:1 (needs {need}) \"{it['txt']}\"")
    return n, fails

async def run_audit(browser, URL, OUT, stress=False):
    F = []                                   # (severity, rule, detail)
    def add(sev, rule, detail): F.append({'severity': sev, 'rule': rule, 'detail': detail})
    async def open_page(w, h, mobile=False, reduced=False):
        ctx = await browser.new_context(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile, reduced_motion='reduce' if reduced else 'no-preference')
        pg = await ctx.new_page(); await pg.goto(URL); await pg.wait_for_timeout(900); return ctx, pg
    async def reveal(pg):
        H = await pg.evaluate("document.documentElement.scrollHeight")
        for y in range(0, H, 700):
            await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(900); await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(1400)

    # ---- desktop: names, structure, contrast, hit areas, transitions, inputs
    ctx, pg = await open_page(1440, 900); await reveal(pg)
    n = await pg.evaluate(NAMES_JS)
    if n['nBad']: add('HIGH', 'Accessible name (WCAG 4.1.2)', f"{n['nBad']} control(s) without a name: {', '.join(n['bad'])}")
    if n['noalt']: add('HIGH', 'Image alt (WCAG 1.1.1)', f"images without an alt attribute: {', '.join(n['noalt'])}")
    if not n['lang']: add('MEDIUM', 'Language (WCAG 3.1.1)', '<html> has no lang attribute')
    if 'user-scalable=no' in n['vp'].replace(' ', '') or 'maximum-scale=1' in n['vp'].replace(' ', ''): add('HIGH', 'Zoom (WCAG 1.4.4)', f"viewport blocks zoom: {n['vp']}")
    if n['posTab']: add('MEDIUM', 'Focus order (WCAG 2.4.3)', f"{n['posTab']} element(s) with positive tabindex")
    if n['mains'] != 1: add('MEDIUM', 'Landmarks (WCAG 1.3.1)', f"expected one <main>, found {n['mains']}")
    if not n['skip']: add('MEDIUM', 'Bypass blocks (WCAG 2.4.1)', 'no "Skip to content" link as the first focusable element')
    if n['divClick']: add('MEDIUM', 'Native elements', f"{n['divClick']} div/span with onclick instead of a button or link")
    c = await pg.evaluate(CONTRAST_JS)
    if c['nFails']: add('HIGH', 'Text contrast (WCAG 1.4.3)', f"{c['nFails']} text element(s) fail: " + ' | '.join(c['fails'][:8]))
    # stage hero: every world recolours the hero, so measure each one
    if await pg.evaluate("(CONFIG.hero||{}).layout||'stage'") == 'stage':
        nW = await pg.evaluate("document.querySelectorAll('.dp').length"); seen = set(c['fails'])
        for i in range(nW):
            await pg.click(f'[data-hd="{i}"]'); await pg.wait_for_timeout(1700)
            cw = await pg.evaluate(CONTRAST_JS); new = [f for f in cw['fails'] if f not in seen]; seen.update(new)
            if new: add('HIGH', 'Text contrast (WCAG 1.4.3)', f"world {i}: {len(new)} additional text element(s) fail: " + ' | '.join(new[:6]))
        await pg.click('[data-hd="0"]'); await pg.wait_for_timeout(1500)
    if c['unknown']:
        nm, fl = await measure_over_images(pg, c['unknown']); over_measured = nm
        if fl: add('HIGH', 'Text contrast over images (WCAG 1.4.3)', f"{len(fl)} of {nm} measured from pixels fail: " + ' | '.join(fl[:8]))
    else: over_measured = 0
    h = await pg.evaluate(HIT_JS)
    if h['n24']: add('MEDIUM', 'Target size (WCAG 2.5.8, minimum 24 px)', f"{h['n24']} control(s) under 24 px: {', '.join(h['lt24'][:6])}")
    if h['n40'] > 6: add('LOW', 'Hit area (target 40 px desktop)', f"{h['n40']} control(s) between 24 and 40 px, e.g. {', '.join(h['lt40'][:5])}")
    t = await pg.evaluate(TRANS_JS)
    if t: add('MEDIUM', 'Transition specificity', f"transition: all / will-change: all on {', '.join(t[:6])}")
    m = await pg.evaluate(MOTION_JS)
    if m['mq'] and m['pauses'] < m['mq']: add('HIGH', 'Pause moving content (WCAG 2.2.2)', f"{m['mq'] - m['pauses']} marquee(s) without a pause control")
    layout = await pg.evaluate("(CONFIG.hero||{}).layout||'stage'")
    if layout == 'stage' and not m['heroPause']: add('HIGH', 'Pause moving content (WCAG 2.2.2)', 'hero autoplay has no pause control')
    # keyboard walk: every stop shows a focus indicator
    nofocus = []
    await pg.evaluate("window.scrollTo(0,0); document.body.focus()")
    for i in range(70):
        await pg.keyboard.press('Tab')
        r = await pg.evaluate("""() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e);
          const ring = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0; const shadow = s.boxShadow !== 'none'; const hid = e.closest('[hidden],[inert]');
          return { n: (e.id?'#'+e.id:e.tagName.toLowerCase())+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\\s+/)[0]:''), ring, shadow, hid: !!hid, tag: e.tagName }; }""")
        if r and not r['ring'] and not r['shadow'] and r['tag'] not in ('INPUT', 'SELECT', 'TEXTAREA'): nofocus.append(r['n'])
    if nofocus: add('HIGH', 'Focus visible (WCAG 2.4.7)', f"{len(nofocus)} stop(s) with no outline or ring: {', '.join(sorted(set(nofocus))[:8])}")
    await ctx.close()

    # ---- reduced motion
    ctx, pg = await open_page(1440, 900, reduced=True); mr = await pg.evaluate(MOTION_JS)
    if mr['run']: add('HIGH', 'Reduced motion (WCAG 2.3.3)', f"{mr['run']} marquee animation(s) still run under prefers-reduced-motion")
    await ctx.close()

    # ---- reflow: 320 px and 200 % zoom (1280 px at 200 % = 640 CSS px)
    for w, label in ((320, '320 px width'), (640, '200 % zoom')):
        ctx, pg = await open_page(w, 800, mobile=(w == 320)); await reveal(pg)
        if await pg.evaluate("document.documentElement.scrollWidth > innerWidth + 1"):
            add('HIGH', 'Reflow (WCAG 1.4.10)', f'horizontal scrolling at {label}')
        await pg.screenshot(path=f'{OUT}/a11y_{w}.png'); await ctx.close()

    # ---- mobile: input size, touch targets
    ctx, pg = await open_page(390, 844, mobile=True); await reveal(pg)
    ni = await pg.evaluate(INPUT_JS)
    if ni: add('MEDIUM', 'Input text size (iOS zoom)', f'{ni} field(s) under 16 px on mobile')
    hm = await pg.evaluate(HIT_JS)
    if hm['n40'] > 4: add('LOW', 'Hit area (target 44 px touch)', f"{hm['n40']} control(s) under 40 px on mobile, e.g. {', '.join(hm['lt40'][:5])}")
    if hm['n24']: add('MEDIUM', 'Target size (WCAG 2.5.8)', f"{hm['n24']} control(s) under 24 px on mobile: {', '.join(hm['lt24'][:5])}")
    if stress:
        s = await pg.evaluate(STRESS_JS)
        if s['bad']: add('MEDIUM', 'Stress: long unbreakable string', f"overflow in {', '.join(s['bad'])}")
        if s['pageOverflow']: add('HIGH', 'Stress: long unbreakable string', 'page scrolls sideways')
    await ctx.close()

    order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}; F.sort(key=lambda f: order[f['severity']])
    verdict = 'Block' if any(f['severity'] == 'HIGH' for f in F) else ('Needs changes' if F else 'Approve')
    return {'verdict': verdict, 'findings': F, 'contrast_checked': c['checked'], 'contrast_measured_from_pixels': over_measured, 'contrast_unmeasured': max(0, len(c['unknown']) - over_measured)}

async def _main():
    from playwright.async_api import async_playwright
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; URL = 'file://' + os.path.abspath(args[0])
    OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'qa'; os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); r = await run_audit(b, URL, OUT, stress='--stress' in sys.argv); await b.close()
    print(json.dumps(r, indent=1)); sys.exit(1 if r['verdict'] == 'Block' else 0)

if __name__ == '__main__':
    asyncio.run(_main())
