/* Signature site scaffold: everything on the page is driven by CONFIG (see site.config.example.json).
   Sections: helpers · state · hero · nav · find/items · cart · form · pages · init. */
(function () {
'use strict';
const { $, $$, esc, toast } = Kit;
const C = CONFIG, IM = IMGS;
const W = C.worlds || [], ITEMS = C.items || [], CT = C.contact || {}, AC = C.action || { mode: 'none' };
const T = Object.assign({ find: 'Search', worlds: 'Collections', items: 'Everything', tag: 'Filter' }, C.text || {});
const SLUG = (C.meta && C.meta.slug) || 'site';
const CUR = C.currency || '';
const fmt = n => CUR + Number(n).toLocaleString(C.locale || 'en-IN');
const world = id => W.find(w => w.id === id);
const item = id => ITEMS.find(i => i.id === id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const setText = (sel, t) => { const e = $(sel); if (e) e.textContent = t || ''; };
const digits = s => String(s || '').replace(/\D/g, '');
const money = n => fmt(n);


/* ---------- placeholder art for worlds without an image (abstract emblems) ---------- */
(function () {
  const shapes = [(c, b) => '<circle cx="100" cy="100" r="74" fill="' + c + '"/><circle cx="100" cy="100" r="40" fill="' + b + '"/>', (c, b) => '<rect x="36" y="36" width="128" height="128" rx="38" fill="' + c + '" transform="rotate(14 100 100)"/><circle cx="100" cy="100" r="30" fill="' + b + '"/>', (c, b) => '<path d="M100 28 L172 152 H28 Z" fill="' + c + '" stroke="' + c + '" stroke-width="20" stroke-linejoin="round"/><circle cx="100" cy="114" r="24" fill="' + b + '"/>', (c, b) => '<circle cx="70" cy="100" r="46" fill="' + c + '"/><circle cx="130" cy="100" r="46" fill="' + b + '"/>'];
  W.forEach((w, i) => { if (!w.img || !IM[w.img]) { const k = '__ph' + i; IM[k] = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' + shapes[i % shapes.length](w.dot || '#ffffff', w.tint || '#eeeeee') + '</svg>'); w.img = k; } });
})();

/* ---------- state ---------- */
const st = { cart: [], orders: [] };
try { const raw = JSON.parse(localStorage.getItem('sig_' + SLUG) || '{}'); if (Array.isArray(raw.cart)) st.cart = raw.cart.filter(l => l && item(l.id) && l.qty > 0).slice(0, 60); if (Array.isArray(raw.orders)) st.orders = raw.orders.slice(0, 10); } catch (e) {}
const save = () => { try { localStorage.setItem('sig_' + SLUG, JSON.stringify({ cart: st.cart, orders: st.orders })); } catch (e) {} };
function lumHex(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim()); if (!m) return 1; const c = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
/* text colour for a white button: the band colour when it passes 4.5:1 on white, else near-black */
function readableOnWhite(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim()); if (!m) return '#15161A';
  const c = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; return 1.05 / (L + 0.05) >= 4.5 ? '#' + m[1] : '#15161A';
}
const ui = { hero: 0, p2: 0, f: { world: 'all', q: '', tag: 'any', sort: 'featured' }, sel: null, co: { step: 'cart', fulfil: '', name: '', phone: '', addr: '', note: '', done: null, err: '' }, form: { vals: {}, done: null }, sent: null };

/* ---------- opening hours ---------- */
function minutes(t) { const p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
function ampm(t) { const m = minutes(t) % 1440, h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 && h < 24 ? 'pm' : 'am'; return ((h % 12) || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '') + ' ' + ap; }
function openState() {
  const rules = CT.hours || []; if (!rules.length) return null;
  const now = new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
  for (const r of rules) {
    if (!(r.days || []).includes(d)) continue;
    const o = minutes(r.open), c = minutes(r.close);
    if (m >= o && m < c) return { open: true, label: 'Open now · until ' + ampm(r.close) };
    if (m < o) return { open: false, label: 'Closed · opens ' + ampm(r.open) };
  }
  const nxt = rules.find(r => (r.days || []).includes((d + 1) % 7)) || rules[0];
  return { open: false, label: 'Closed · opens ' + ampm(nxt.open) };
}

/* ---------- static text ---------- */
document.title = (C.meta && C.meta.title) || C.brand.name;
$('#brand').textContent = C.brand.short || C.brand.name; $('#brand').dataset.i = (C.brand.short || C.brand.name).charAt(0);
setText('#copy', '© ' + new Date().getFullYear() + ' ' + C.brand.name); setText('#fsmall', (C.footer && C.footer.small) || '');
setText('#lblD', (C.hero && C.hero.pickLabel) || 'SELECT'); setText('#hW', T.worldsTitle || T.worlds); setText('#hWp', T.worldsSub || ''); setText('#hI', T.itemsTitle || T.items);
setText('#fl1', T.findWorld || 'Collection'); setText('#fl2', T.findText || 'Search'); setText('#fl3', T.findTag || 'Filter'); $('#fQ').placeholder = T.findPlaceholder || 'Search by name';
setText('#lcw', T.findWorld || 'Collection'); $('label[for=iTag]').textContent = T.findTag || 'Filter';
$('#ctaTop').textContent = (C.nav && C.nav.cta) || (AC.label || 'Get in touch');
$('#cartBtn').hidden = AC.mode !== 'cart';

/* ---------- navigation ---------- */
const NAV = (C.nav && C.nav.links) || [];
const NSTYLE = (C.nav && C.nav.style) || 'pill', PRESET = (C.theme && C.theme.preset) || 'world';
$('#nav').dataset.style = NSTYLE; document.body.dataset.nav = NSTYLE; document.body.dataset.preset = PRESET;
const DEFICON = ['home', 'list', 'star', 'user', 'map', 'phone'];
$('#navLinks').innerHTML = NAV.map((l, i) => NSTYLE === 'rail' ? '<a class="lk" title="' + esc(l.label) + '" href="#' + l.target + '" ' + (l.type === 'page' ? 'data-page' : 'data-s') + '="' + l.target + '">' + Blocks.ic(l.icon || DEFICON[i % 6], 22) + '<span>' + esc(l.label) + '</span></a>' : l.type === 'page' ? '<a class="lk" href="#' + l.target + '" data-page="' + l.target + '">' + esc(l.label) + '</a>' : '<a class="lk" href="#' + l.target + '" data-s="' + l.target + '">' + esc(l.label) + '</a>').join('');
const chipCfg = CT.chip || { type: 'open' };
function paintChip() {
  const b = $('#chipBtn'), b2 = $('#chipBtn2');
  if (chipCfg.type === 'none') { b.hidden = true; b2.hidden = true; return; }
  let txt = chipCfg.label || '';
  if (chipCfg.type === 'open') { const s = openState(); if (!s) { b.hidden = true; b2.hidden = true; return; } txt = s.label; b.dataset.open = s.open; }
  $('#chipTxt').textContent = txt; b.hidden = false; b2.hidden = false; b.setAttribute('aria-label', txt);
}
paintChip(); setInterval(paintChip, 60000);

/* ---------- hero (layout switch) ---------- */
const HL = (C.hero && C.hero.layout) || 'stage';
const root = document.documentElement, compact = matchMedia('(max-width:900px),(max-height:560px)');
const H = C.hero || {};
let hero = $('#top'), navLight = false;
let paintHero = () => {}, heroTimer = () => {}, heroGo = () => {};
function actDo(spec) { /* data-do style actions: scroll:id | page:name | item:id | form | cart | world:id */
  const [a, v] = String(spec).split(':');
  if (a === 'scroll') scrollTo_(v); else if (a === 'page') Kit.open(v); else if (a === 'item') openItem(v); else if (a === 'form') Kit.open('form'); else if (a === 'cart') Kit.open('cart');
  else if (a === 'world') { ui.f.world = v; renderItems(); syncFind(); scrollTo_('items'); } else if (a === 'contact') Kit.open('contact');
}
function scrollTo_(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
$('#ctaTop').addEventListener('click', () => actDo((C.nav && C.nav.ctaDo) || (AC.mode === 'cart' ? 'scroll:items' : AC.mode === 'form' ? 'form' : 'contact')));
Blocks.init({ C, IM, W, ITEMS, esc, fmt, ui, reduce, world, openState, actDo, scrollTo_, openItem, whatsappLink: s => whatsappLink(s), renderItems: () => renderItems(), syncFind: () => syncFind() });
if (HL === 'stage') {
/* ---------- hero ---------- */
function fit() { if (compact.matches) { root.style.setProperty('--k', 1); root.style.setProperty('--inv', 1); return; } const w = hero.clientWidth, h = hero.clientHeight, k = Math.min(w / 1440, h / 900); root.style.setProperty('--k', k.toFixed(5)); root.style.setProperty('--inv', (1 / k).toFixed(4)); }
fit(); addEventListener('resize', fit); addEventListener('orientationchange', fit); if (compact.addEventListener) compact.addEventListener('change', fit);
const obwrap = $('#obwrap'), obs = [];
if (C.decor && C.decor[0]) $('#dx1').src = IM[C.decor[0]]; else $('#dx1').remove();
if (C.decor && C.decor[1]) $('#dx2').src = IM[C.decor[1]]; else $('#dx2').remove();
W.forEach((w, i) => { const b = document.createElement('button'); b.className = 'ob'; b.type = 'button'; b.dataset.d = i; b.setAttribute('aria-label', w.name); b.innerHTML = '<img src="' + IM[w.img] + '" alt="" draggable="false">'; b.addEventListener('click', () => { if (b.dataset.d === '1') heroGo(1); }); obwrap.appendChild(b); obs.push(b); });
$('#dpicks').innerHTML = W.map((w, i) => '<button class="dp" type="button" data-hd="' + i + '" aria-pressed="false"><i style="background:' + (w.dot || '#fff') + '"></i>' + esc(w.name) + '</button>').join('');
if (H.pick2) { $('#pick2wrap').hidden = false; setText('#lblV', H.pick2.label); $('#vpicks').innerHTML = H.pick2.options.map((o, i) => '<button class="vb" type="button" data-hv="' + i + '" aria-pressed="false">' + esc(o) + '</button>').join(''); }
const featured = w => ITEMS.find(i => i.world === w.id && (i.tags || []).includes('bestseller')) || ITEMS.find(i => i.world === w.id);
paintHero = function () {
  const n = W.length, i = ui.hero, w = W[i], nx = W[(i + 1) % n]; if (!w) return;
  obs.forEach((b, k) => { const s = (k - i + n) % n; b.dataset.d = s; b.tabIndex = s === 1 ? 0 : -1; b.setAttribute('aria-hidden', s > 1); });
  hero.style.setProperty('--bg', w.bg); hero.style.background = w.bg; hero.style.color = w.ink || '#fff'; { const li = lumHex(w.ink || '#ffffff') > 0.5; document.documentElement.style.setProperty('--pill', li ? 'rgba(0,0,0,.24)' : 'rgba(255,255,255,.42)'); document.documentElement.style.setProperty('--pill-h', li ? 'rgba(0,0,0,.36)' : 'rgba(255,255,255,.58)'); }
  const m = $('meta[name=theme-color]'); if (m) m.setAttribute('content', w.bg);
  setText('#word', w.word || w.name.toUpperCase()); setText('#eb', w.name); setText('#h1', w.title); setText('#hp', w.blurb); setText('#nl', 'Next · ' + nx.name);
  $$('.dp').forEach((b, k) => b.setAttribute('aria-pressed', k === i)); $$('.vb').forEach(b => b.setAttribute('aria-pressed', +b.dataset.hv === ui.p2));
  const f = featured(w); setText('#nxl', (H.card && H.card.label) || "TODAY'S PICK");
  setText('#nxt1', f ? f.name : w.name); setText('#nxt2', f ? (fmt(f.price) + ' · ' + w.name) : '');
  $('#nxav').innerHTML = '<span class="ini" style="background:' + (w.tint || '#fff') + '"><img src="' + IM[w.img] + '" alt="" draggable="false" style="object-fit:contain;object-position:50% 50%"></span>';
  $('#nxgo').dataset.id = f ? f.id : '';
}
let ht = null, hover = false;
heroGo = function (d) { ui.hero = (ui.hero + d + W.length) % W.length; paintHero(); heroTimer(); }
heroTimer = function () { clearTimeout(ht); if (reduce || ui.paused || W.length < 2) return; ht = setTimeout(() => { const vis = hero.getBoundingClientRect().bottom > 200; if (!hover && vis && !Kit.isOpen() && !document.hidden) heroGo(1); else heroTimer(); }, 7000); }
$('#hPause').addEventListener('click', e => { ui.paused = !ui.paused; e.currentTarget.setAttribute('aria-pressed', ui.paused); e.currentTarget.setAttribute('aria-label', ui.paused ? 'Resume autoplay' : 'Pause autoplay'); heroTimer(); }); if (reduce) $('#hPause').hidden = true;
$('#hPrev').addEventListener('click', () => heroGo(-1)); $('#hNext').addEventListener('click', () => heroGo(1));
$('#dpicks').addEventListener('click', e => { const b = e.target.closest('[data-hd]'); if (b) { ui.hero = +b.dataset.hd; paintHero(); heroTimer(); } });
$('#vpicks').addEventListener('click', e => { const b = e.target.closest('[data-hv]'); if (b) { ui.p2 = +b.dataset.hv; paintHero(); } });
$('#nxgo').addEventListener('click', e => { const id = e.currentTarget.dataset.id; if (id) openItem(id); });
$('#heroP').textContent = (H.primary && H.primary.label) || 'Explore'; $('#heroP').addEventListener('click', () => actDo((H.primary && H.primary.do) || 'scroll:items'));
$('#heroS').textContent = (H.secondary && H.secondary.label) || 'Learn more'; $('#heroS').addEventListener('click', () => actDo((H.secondary && H.secondary.do) || 'page:about'));
hero.addEventListener('mouseenter', () => { hover = true; }); hero.addEventListener('mouseleave', () => { hover = false; hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
hero.addEventListener('focusin', () => { hover = true; }); hero.addEventListener('focusout', () => { hover = false; });
hero.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || reduce || compact.matches) return; const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3)); hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3)); });
let tx = null; hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true }); hero.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) heroGo(dx < 0 ? 1 : -1); tx = null; }, { passive: true });

}
else {
  const el = Blocks.mountHero(HL, C.hero || {}); if (el) { hero = el; navLight = el.dataset.tone === 'light'; if (C.hero && C.hero.nav) navLight = C.hero.nav === 'light'; }
}
/* ---------- scroll behaviour ---------- */
const nav = $('#nav'), spyIds = NAV.filter(l => l.type !== 'page').map(l => l.target), spyEls = spyIds.map(id => document.getElementById(id)).filter(Boolean);
function onScroll() { const y = scrollY, hh = hero.offsetHeight; nav.classList.toggle('solid', navLight || y > hh - 150); let cur = ''; spyEls.forEach(s => { if (s.offsetParent !== null && s.getBoundingClientRect().top < innerHeight * 0.45) cur = s.id; }); $$('.lk[data-s]').forEach(a => { a.classList.toggle('on', a.dataset.s === cur); if (a.dataset.s === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); }
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
$$('.lk[data-s],#brand').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollTo_(a.getAttribute('href').slice(1)); }));
$$('.lk[data-page]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); Kit.open(a.dataset.page); }));
$('#searchBtn').addEventListener('click', () => { scrollTo_('find'); setTimeout(() => $('#fQ').focus({ preventScroll: true }), 500); });
$('#menuBtn').addEventListener('click', () => Kit.open('menu')); $('#chipBtn').addEventListener('click', () => Kit.open('contact')); $('#chipBtn2').addEventListener('click', () => Kit.open('contact'));
$('#cartBtn').addEventListener('click', () => { ui.co.step = 'cart'; Kit.open('cart'); });
let io = null; if ('IntersectionObserver' in window) { io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }); }
const reveal = () => $$('.rv-s:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));

/* ---------- worlds + items ---------- */
const TAGS = [...new Set(ITEMS.flatMap(i => i.tags || []))].filter(t => t !== 'bestseller');
const tagLabel = t => (C.tagLabels && C.tagLabels[t]) || t.charAt(0).toUpperCase() + t.slice(1);
const optTags = '<option value="any">Any</option>' + TAGS.map(t => '<option value="' + esc(t) + '">' + esc(tagLabel(t)) + '</option>').join('');
$('#fTag').innerHTML = optTags; $('#iTag').innerHTML = optTags;
$('#fWorld').innerHTML = '<option value="all">All</option>' + W.map(w => '<option value="' + w.id + '">' + esc(w.name) + '</option>').join('');
$('#dgrid').innerHTML = W.map(w => '<button class="dcard" type="button" data-do="world:' + w.id + '" style="background:' + w.bg + ';color:' + (w.ink || '#fff') + '" aria-label="Open ' + esc(w.name) + '"><div class="t"><small>' + (ITEMS.filter(i => i.world === w.id).length ? ITEMS.filter(i => i.world === w.id).length + ' ' + esc(T.countNoun || 'ITEMS').toUpperCase() : esc((w.word || '').toUpperCase())) + '</small><h3>' + esc(w.name) + '</h3><p>' + esc(w.short || w.blurb) + '</p></div><img src="' + IM[w.img] + '" alt="" draggable="false"><span class="ar">' + ARROW + '</span></button>').join('');
$('#fhelp').innerHTML = (T.popular && T.popular.length ? '<span>Popular:</span>' + T.popular.map(p => '<button type="button" data-do="quick:' + esc(p) + '">' + esc(p) + '</button>').join('') : '');
function syncFind() { $('#fWorld').value = ui.f.world; $('#fQ').value = ui.f.q; $('#fTag').value = ui.f.tag; $('#iTag').value = ui.f.tag; $('#iSort').value = ui.f.sort; }
function itemCard(it, idx) {
  const w = world(it.world) || {}, rot = ((idx * 17) % 22) - 11, sc = 0.9 + ((idx * 7) % 5) / 25;
  const pic = it.img && IM[it.img] ? '<img class="ph" src="' + IM[it.img] + '" alt="' + esc(it.name) + '" loading="lazy">' : '<img class="o" src="' + IM[w.img] + '" alt="" style="transform:rotate(' + rot + 'deg) scale(' + sc.toFixed(2) + ')" draggable="false">';
  const badge = (it.tags || []).includes('bestseller') ? '<span class="badge">Bestseller</span>' : '';
  const pills = (it.tags || []).filter(t => t !== 'bestseller').slice(0, 3).map(t => '<span class="pl">' + esc(tagLabel(t)) + '</span>').join('');
  const label = AC.mode === 'cart' ? 'View & add' : 'View details';
  return '<button class="it" type="button" data-do="item:' + it.id + '"><div class="pt" style="background:' + (w.tint || '#EEE') + '">' + badge + pic + '</div><div class="bd"><div class="nm"><span>' + esc(it.name) + '</span><span class="pricetag">' + fmt(it.price) + '</span></div><div class="ds">' + esc(it.desc || '') + '</div><div class="tgs">' + pills + '</div><div class="act"><span>' + label + '</span></div></div></button>';
}
function renderItems() {
  const f = ui.f; let list = ITEMS.slice();
  if (f.world !== 'all') list = list.filter(i => i.world === f.world);
  if (f.tag !== 'any') list = list.filter(i => (i.tags || []).includes(f.tag));
  if (f.q) { const q = f.q.toLowerCase(); list = list.filter(i => (i.name + ' ' + (i.desc || '') + ' ' + (i.tags || []).join(' ') + ' ' + ((world(i.world) || {}).name || '')).toLowerCase().includes(q)); }
  if (f.sort === 'low') list.sort((a, b) => a.price - b.price); else if (f.sort === 'high') list.sort((a, b) => b.price - a.price); else if (f.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  setText('#iCount', list.length + ' of ' + ITEMS.length + ' shown');
  $('#wchips').innerHTML = [['all', 'All']].concat(W.map(w => [w.id, w.name])).map(c => '<button class="chip" type="button" data-do="wchip:' + c[0] + '" aria-pressed="' + (f.world === c[0]) + '">' + esc(c[1]) + '</button>').join('');
  $('#igrid').innerHTML = list.length ? list.map(itemCard).join('') : '<div class="ok" style="grid-column:1/-1;background:var(--card);border-radius:30px"><b style="font-size:18px">' + (f.q ? 'No results for “' + esc(f.q) + '”' : 'Nothing matches those filters') + '</b><span class="muted">Try another collection, or clear the filters.</span><button class="btn" type="button" id="iReset2">Clear filters</button></div>';
  const r2 = $('#iReset2'); if (r2) r2.addEventListener('click', resetItems);
}
function resetItems() { ui.f = { world: 'all', q: '', tag: 'any', sort: 'featured' }; syncFind(); renderItems(); }
$('#fform').addEventListener('submit', e => { e.preventDefault(); ui.f.world = $('#fWorld').value; ui.f.q = $('#fQ').value.trim(); ui.f.tag = $('#fTag').value; renderItems(); syncFind(); scrollTo_('items'); });
$('#iTag').addEventListener('change', function () { ui.f.tag = this.value; renderItems(); syncFind(); }); $('#iSort').addEventListener('change', function () { ui.f.sort = this.value; renderItems(); });
$('#iReset').addEventListener('click', resetItems);
document.addEventListener('click', e => {
  const b = e.target.closest('[data-do]'); if (!b) return; const spec = b.dataset.do, [a, ...r] = spec.split(':'), v = r.join(':');
  if (a === 'quick') { ui.f = { world: 'all', q: v, tag: 'any', sort: ui.f.sort }; renderItems(); syncFind(); scrollTo_('items'); }
  else if (a === 'wchip') { ui.f.world = v; renderItems(); syncFind(); } else actDo(spec);
});

/* ---------- item sheet ---------- */
function openItem(id) { const it = item(id); if (!it) return; ui.sel = { id, opts: {}, qty: 1 }; (it.options || []).forEach(g => { ui.sel.opts[g.name] = g.choices[0][0]; }); Kit.open('item'); }
function unitPrice(it, opts) { let p = it.price; (it.options || []).forEach(g => { const c = g.choices.find(c => c[0] === opts[g.name]); if (c) p += (+c[1] || 0); }); return p; }
function thumb(it) { const w = world(it.world) || {}; return '<span class="th" style="background:' + (w.tint || '#EEE') + '">' + (it.img && IM[it.img] ? '<img class="ph" src="' + IM[it.img] + '" alt="">' : '<img src="' + IM[w.img] + '" alt="">') + '</span>'; }

/* ---------- cart ---------- */
const CART = AC.cart || {};
const lineKey = l => l.id + '|' + JSON.stringify(l.opts || {});
function cartCount() { return st.cart.reduce((n, l) => n + l.qty, 0); }
function paintCart() { const n = cartCount(), b = $('#cartCount'); b.textContent = n; b.hidden = !n; }
function totals() {
  const sub = st.cart.reduce((s, l) => s + unitPrice(item(l.id), l.opts) * l.qty, 0);
  const del = (ui.co.fulfil && /deliver/i.test(ui.co.fulfil)) ? (CART.freeOver && sub >= CART.freeOver ? 0 : (CART.deliveryFee || 0)) : 0;
  const tax = Math.round((sub * (CART.taxPct || 0)) / 100);
  return { sub, del, tax, total: sub + del + tax };
}
function addToCart() {
  const s = ui.sel, it = item(s.id), key = lineKey({ id: s.id, opts: s.opts }); const ex = st.cart.find(l => lineKey(l) === key);
  if (ex) ex.qty = Math.min(20, ex.qty + s.qty); else st.cart.push({ id: s.id, opts: Object.assign({}, s.opts), qty: s.qty });
  save(); paintCart(); Kit.close(); toast('Added ' + s.qty + ' × ' + it.name, 'View cart', () => { ui.co.step = 'cart'; Kit.open('cart'); });
}
function lineHtml(l, idx) {
  const it = item(l.id), up = unitPrice(it, l.opts), opts = Object.values(l.opts || {}).join(' · ');
  return '<div class="mini">' + thumb(it) + '<div class="mid"><b>' + esc(it.name) + '</b><span class="muted small">' + esc(opts) + '</span><div class="qty"><button type="button" data-act="cq" data-id="' + idx + '" data-v="-1" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button type="button" data-act="cq" data-id="' + idx + '" data-v="1" aria-label="Increase quantity">+</button></div></div><b class="pricetag">' + fmt(up * l.qty) + '</b></div>';
}
function whatsappLink(text) { const n = digits(CT.whatsapp); return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(text) : ''; }
function cartHtml() {
  const co = ui.co;
  if (co.done) { const o = co.done; const wa = whatsappLink(o.text); return '<div class="ok"><div class="c">' + CHK + '</div><h3 class="t" style="font-size:26px;margin:0">Order placed</h3><p class="muted" style="margin:0;max-width:44ch">Thanks ' + esc(o.name.split(' ')[0]) + '. Your order reference is <b>' + o.ref + '</b>.' + (wa ? ' Send it on WhatsApp so we can confirm quickly.' : '') + '</p></div><div class="sumbox" style="margin-bottom:16px">' + o.lines.map(l => '<div><span>' + esc(l[0]) + '</span><span>' + fmt(l[1]) + '</span></div>').join('') + '<div><b>Total</b><b>' + fmt(o.total) + '</b></div></div>' + (wa ? '<a class="btn full" href="' + wa + '" target="_blank" rel="noopener">Send order on WhatsApp</a>' : '') + '<p class="note" style="margin-top:14px">Demo checkout: nothing is charged or sent until you tap the WhatsApp button.</p>'; }
  if (!st.cart.length) return '<div class="ok"><div class="c" style="background:var(--tint);color:var(--ink)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></div><h3 class="t" style="margin:0">Your cart is empty</h3><p class="muted" style="margin:0">Add something you like from the menu.</p><button class="btn" type="button" data-act="browse">Browse the menu</button></div>';
  const t = totals();
  const sumH = '<div class="rowsum"><span>Subtotal</span><span>' + fmt(t.sub) + '</span></div>' + (CART.fulfil ? '<div class="rowsum"><span>' + (co.fulfil || CART.fulfil[0]) + '</span><span>' + (t.del ? fmt(t.del) : 'Free') + '</span></div>' : '') + (t.tax ? '<div class="rowsum"><span>Tax</span><span>' + fmt(t.tax) + '</span></div>' : '') + '<div class="rowsum tot"><span>Total</span><span>' + fmt(t.total) + '</span></div>';
  if (co.step === 'cart') return st.cart.map(lineHtml).join('') + '<div style="margin-top:14px">' + sumH + '</div>' + (CART.freeOver ? '<p class="note">Free delivery on orders over ' + fmt(CART.freeOver) + '.</p>' : '');
  const f = CART.fulfil || [];
  return '<form id="coForm" novalidate><div class="fld"><label for="co-name">Full name</label><input id="co-name" type="text" autocomplete="name" value="' + esc(co.name) + '"><p class="err" id="e-coname"></p></div><div class="fld"><label for="co-phone">Phone</label><input id="co-phone" type="text" inputmode="tel" autocomplete="tel" value="' + esc(co.phone) + '"><p class="err" id="e-cophone"></p></div>' + (f.length ? '<fieldset style="border:0;padding:0;margin:0 0 14px"><legend>How would you like it?</legend><div class="radio">' + f.map(x => '<label><input type="radio" name="fulfil" value="' + esc(x) + '"' + ((co.fulfil || f[0]) === x ? ' checked' : '') + '>' + esc(x) + '</label>').join('') + '</div></fieldset>' : '') + (/deliver/i.test(co.fulfil || f[0] || '') ? '<div class="fld"><label for="co-addr">Delivery address</label><textarea id="co-addr" style="min-height:84px">' + esc(co.addr) + '</textarea><p class="err" id="e-coaddr"></p></div>' : '') + '<div class="fld"><label for="co-note">Note (optional)</label><textarea id="co-note" maxlength="200" style="min-height:70px">' + esc(co.note) + '</textarea></div></form><div style="margin-top:6px">' + sumH + '</div><p class="err" id="e-co" role="alert">' + esc(co.err) + '</p>';
}
function cartFoot() {
  const co = ui.co; if (co.done || !st.cart.length) return '';
  return co.step === 'cart' ? '<button class="btn full" type="button" data-act="cnext">Checkout · ' + fmt(totals().total) + '</button>' : '<div style="display:flex;gap:10px"><button class="btn sec" type="button" data-act="cback">Back</button><button class="btn" style="flex:1" type="button" data-act="cplace">Place order · ' + fmt(totals().total) + '</button></div>';
}
function placeOrder() {
  const co = ui.co, nm = $('#co-name'), ph = $('#co-phone'), ad = $('#co-addr'); co.name = nm.value.trim(); co.phone = ph.value.trim(); co.note = ($('#co-note') || {}).value || ''; if (ad) co.addr = ad.value.trim();
  const r = document.querySelector('input[name=fulfil]:checked'); if (r) co.fulfil = r.value;
  let bad = null; const chk = (el, id, ok, msg) => { Kit.setErr(id, ok ? '' : msg, el); if (!ok && !bad) bad = el; };
  chk(nm, 'e-coname', co.name.length >= 2, 'Enter your name.'); chk(ph, 'e-cophone', digits(co.phone).length >= 7, 'Enter a phone number with at least 7 digits.');
  if (ad) chk(ad, 'e-coaddr', co.addr.length >= 8, 'Enter your delivery address.');
  if (bad) { bad.focus(); return; }
  const t = totals(), ref = (C.meta && C.meta.refPrefix || 'ORD') + '-' + (1000 + Math.floor(Math.random() * 9000));
  const lines = st.cart.map(l => { const it = item(l.id); return [l.qty + ' × ' + it.name + (Object.keys(l.opts || {}).length ? ' (' + Object.values(l.opts).join(', ') + ')' : ''), unitPrice(it, l.opts) * l.qty]; });
  if (t.del) lines.push(['Delivery', t.del]); if (t.tax) lines.push(['Tax', t.tax]);
  const text = 'New order ' + ref + '\n' + lines.map(l => '• ' + l[0] + ' — ' + fmt(l[1])).join('\n') + '\nTotal: ' + fmt(t.total) + '\nName: ' + co.name + '\nPhone: ' + co.phone + (co.fulfil ? '\nType: ' + co.fulfil : '') + (co.addr && /deliver/i.test(co.fulfil) ? '\nAddress: ' + co.addr : '') + (co.note ? '\nNote: ' + co.note : '');
  co.done = { ref, name: co.name, lines, total: t.total, text }; st.orders.unshift({ ref, total: t.total, at: Date.now() }); st.cart = []; save(); paintCart(); Kit.render(false);
}

/* ---------- generic form (reservations, enquiries, bookings) ---------- */
const FORM = AC.form || { title: 'Get in touch', fields: [] };
function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function fieldHtml(f) {
  const v = ui.form.vals[f.id] ?? (f.default ?? ''), id = 'f-' + f.id, lab = '<label for="' + id + '">' + esc(f.label) + (f.required ? '' : ' (optional)') + '</label>', err = '<p class="err" id="e-' + id + '"></p>';
  if (f.type === 'select') return '<div class="fld">' + lab + '<select id="' + id + '"><option value="">Choose…</option>' + (f.options || []).map(o => '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select>' + err + '</div>';
  if (f.type === 'textarea') return '<div class="fld">' + lab + '<textarea id="' + id + '" maxlength="400" placeholder="' + esc(f.placeholder || '') + '">' + esc(v) + '</textarea>' + err + '</div>';
  if (f.type === 'chips') return '<div class="fld"><span>' + esc(f.label) + '</span><div class="chips" role="group" aria-label="' + esc(f.label) + '">' + (f.options || []).map(o => '<button type="button" class="chip" data-act="fchip" data-id="' + f.id + '" data-v="' + esc(o) + '" aria-pressed="' + (v === o) + '">' + esc(o) + '</button>').join('') + '</div><p class="err" id="e-' + id + '"></p></div>';
  const type = f.type === 'date' ? 'date' : f.type === 'time' ? 'time' : f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text';
  return '<div class="fld">' + lab + '<input id="' + id + '" type="' + type + '"' + (f.type === 'tel' ? ' inputmode="tel" autocomplete="tel"' : '') + (f.type === 'email' ? ' autocomplete="email"' : '') + (f.type === 'date' ? ' min="' + today() + '"' : '') + (f.type === 'number' ? ' min="' + (f.min || 1) + '" max="' + (f.max || 50) + '"' : '') + ' value="' + esc(v) + '" placeholder="' + esc(f.placeholder || '') + '">' + err + '</div>';
}
function formHtml() {
  if (ui.form.done) { const d = ui.form.done, wa = whatsappLink(d.text); return '<div class="ok"><div class="c">' + CHK + '</div><h3 class="t" style="font-size:24px;margin:0">' + esc(FORM.successTitle || 'Request received') + '</h3><p class="muted" style="margin:0;max-width:46ch">' + esc(FORM.success || 'Thanks, we will confirm shortly.') + ' Reference <b>' + d.ref + '</b>.</p></div><div class="sumbox">' + d.rows.map(r => '<div><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') + '</div>' + (wa ? '<a class="btn full" style="margin-top:16px" href="' + wa + '" target="_blank" rel="noopener">Confirm on WhatsApp</a>' : '') + '<p class="note" style="margin-top:14px">Demo form: nothing is sent until you tap the WhatsApp button.</p>'; }
  return (FORM.intro ? '<p class="muted" style="margin-top:0">' + esc(FORM.intro) + '</p>' : '') + '<form id="gform" novalidate>' + (FORM.fields || []).map(fieldHtml).join('') + '</form>';
}
function submitForm() {
  const rows = []; let bad = null;
  (FORM.fields || []).forEach(f => {
    const el = $('#f-' + f.id); let v = f.type === 'chips' ? (ui.form.vals[f.id] || '') : (el ? el.value.trim() : ''); ui.form.vals[f.id] = v;
    let msg = ''; if (f.required && !v) msg = 'Fill in this field.'; else if (v && f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) msg = 'Enter a valid email address.'; else if (v && f.type === 'tel' && digits(v).length < 7) msg = 'Enter a phone number with at least 7 digits.'; else if (v && f.type === 'date' && v < today()) msg = 'Choose today or a later date.';
    Kit.setErr('e-f-' + f.id, msg, el); if (msg && !bad) bad = el || $('#sh-body'); if (v) rows.push([f.label, v]);
  });
  if (bad) { if (bad.focus) bad.focus(); return; }
  const ref = (C.meta && C.meta.refPrefix || 'REQ') + '-' + (1000 + Math.floor(Math.random() * 9000));
  ui.form.done = { ref, rows, text: (FORM.title || 'Request') + ' ' + ref + '\n' + rows.map(r => r[0] + ': ' + r[1]).join('\n') }; Kit.render(false);
}

/* ---------- pages ---------- */
const hoursHtml = () => (CT.hours || []).length ? '<div class="hours">' + CT.hours.map(r => '<div><span>' + esc(r.label) + '</span><span>' + ampm(r.open) + ' – ' + ampm(r.close) + '</span></div>').join('') + '</div>' : '';
const PAGES = {
  item: { drawer: true, title: () => (ui.sel && item(ui.sel.id) ? item(ui.sel.id).name : 'Item'), sub: () => ui.sel && item(ui.sel.id) ? (world(item(ui.sel.id).world) || {}).name : '', html() {
    if (!ui.sel) return '<p>Pick something from the menu.</p>'; const it = item(ui.sel.id), w = world(it.world) || {}, up = unitPrice(it, ui.sel.opts);
    const hero_ = '<div style="border-radius:26px;background:' + (w.tint || '#EEE') + ';aspect-ratio:1/.8;display:grid;place-items:center;overflow:hidden;margin-bottom:16px;position:relative">' + (it.img && IM[it.img] ? '<img src="' + IM[it.img] + '" alt="' + esc(it.name) + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' : '<img src="' + IM[w.img] + '" alt="" style="width:62%;height:84%;object-fit:contain;filter:drop-shadow(0 6px 6px rgba(0,0,0,.2)) drop-shadow(0 26px 22px rgba(0,0,0,.28))">') + '</div>';
    const opts = (it.options || []).map(g => '<div class="optgrp"><h4>' + esc(g.name) + '</h4><div class="chips" role="group" aria-label="' + esc(g.name) + '">' + g.choices.map(c => '<button class="chip" type="button" data-act="opt" data-id="' + esc(g.name) + '" data-v="' + esc(c[0]) + '" aria-pressed="' + (ui.sel.opts[g.name] === c[0]) + '">' + esc(c[0]) + (+c[1] ? ' +' + fmt(c[1]) : '') + '</button>').join('') + '</div></div>').join('');
    const pairs = ITEMS.filter(x => x.world === it.world && x.id !== it.id).slice(0, 3);
    return hero_ + '<div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline"><b style="font-size:22px;letter-spacing:-.02em">' + esc(it.name) + '</b><b class="pricetag" style="font-size:20px">' + fmt(up) + '</b></div><p style="margin:6px 0 14px;color:#3A3D47">' + esc(it.desc || '') + '</p><div class="pills" style="margin-bottom:18px">' + (it.tags || []).map(t => '<span class="pl">' + esc(tagLabel(t)) + '</span>').join('') + '</div>' + opts + (AC.mode === 'cart' ? '<div class="optgrp"><h4>Quantity</h4><div class="qty"><button type="button" data-act="sq" data-v="-1" aria-label="Decrease quantity">−</button><span>' + ui.sel.qty + '</span><button type="button" data-act="sq" data-v="1" aria-label="Increase quantity">+</button></div></div>' : '') + (pairs.length ? '<h4 style="margin:22px 0 4px;font-size:14px">More in ' + esc(w.name) + '</h4>' + pairs.map(p => '<button class="mini" type="button" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left;font:inherit;cursor:pointer" data-act="swap" data-id="' + p.id + '">' + thumb(p) + '<span class="mid"><b>' + esc(p.name) + '</b><span class="muted small">' + fmt(p.price) + '</span></span></button>').join('') : '');
  }, foot() { if (!ui.sel) return ''; const it = item(ui.sel.id), up = unitPrice(it, ui.sel.opts); if (AC.mode === 'cart') return '<button class="btn full" type="button" data-act="add">Add to cart · ' + fmt(up * ui.sel.qty) + '</button>'; if (AC.mode === 'form') return '<button class="btn full" type="button" data-act="toform">' + esc(AC.label || 'Enquire') + '</button>'; return ''; } },
  cart: { drawer: true, title: () => ui.co.done ? 'Order placed' : (ui.co.step === 'details' ? 'Your details' : 'Your cart'), sub: () => '', html: cartHtml, foot: cartFoot },
  form: { drawer: true, title: () => FORM.title || 'Get in touch', sub: () => '', html: formHtml, foot() { return ui.form.done ? '<button class="btn full" type="button" data-act="close">Done</button>' : '<button class="btn full" type="button" data-act="fsubmit">' + esc(FORM.submitLabel || 'Send') + '</button>'; } },
  about: { title: () => (C.about && C.about.title) || 'About', sub: () => (C.about && C.about.sub) || '', html() {
    const A = C.about || {}; const gal = (A.gallery || []).filter(g => IM[g.img]);
    return '<div class="cols2"><div>' + (A.heading ? '<h3 class="t" style="font-size:24px">' + esc(A.heading) + '</h3>' : '') + (A.paragraphs || []).map((p, i) => '<p style="margin:0 0 14px;max-width:58ch' + (i ? ';color:var(--mute)' : '') + '">' + esc(p) + '</p>').join('') + '<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap"><button class="btn" type="button" data-act="primary">' + esc(AC.label || 'Get started') + '</button><button class="btn sec" type="button" data-act="go" data-v="contact">Contact us</button></div></div><div style="display:grid;gap:12px;align-content:start">' + (A.values || []).map(v => '<div class="stat"><b style="font-size:20px">' + esc(v.title) + '</b><span>' + esc(v.text) + '</span></div>').join('') + '</div></div>' + (gal.length ? '<section style="margin-top:30px"><h3 class="t">' + esc(A.galleryTitle || 'Inside') + '</h3><div class="gal">' + gal.map(g => '<figure class="bnr" style="margin:0"><img src="' + IM[g.img] + '" alt="' + esc(g.caption || '') + '" loading="lazy"><figcaption>' + esc(g.caption || '') + '</figcaption></figure>').join('') + '</div></section>' : '') + (A.note ? '<p class="note" style="margin-top:18px">' + esc(A.note) + '</p>' : '');
  } },
  contact: { title: () => 'Visit and contact', sub: () => (CT.tagline || ''), html() {
    const s = openState(); const wa = whatsappLink('Hi ' + C.brand.name + '!');
    if (ui.sent) return '<div class="ok"><div class="c">' + CHK + '</div><h3 class="t" style="font-size:24px;margin:0">Message ready</h3><p class="muted" style="margin:0;max-width:46ch">Thanks ' + esc(ui.sent.name) + '. Your reference is <b>' + ui.sent.ref + '</b>.</p>' + (ui.sent.wa ? '<a class="btn" href="' + ui.sent.wa + '" target="_blank" rel="noopener">Send on WhatsApp</a>' : '') + '<button class="btn sec" type="button" data-act="again">Send another</button></div>';
    return '<div class="cols2"><form id="cform" novalidate><div class="fld"><label for="c-name">Your name</label><input id="c-name" type="text" autocomplete="name"><p class="err" id="e-cname"></p></div><div class="fld"><label for="c-phone">Phone or email</label><input id="c-phone" type="text" autocomplete="tel"><p class="err" id="e-cphone"></p></div><div class="fld"><label for="c-msg">Message</label><textarea id="c-msg" maxlength="500"></textarea><div style="display:flex;justify-content:space-between"><p class="err" id="e-cmsg"></p><span class="note" id="c-count">0 / 500</span></div></div><button class="btn" type="submit">Send message</button></form><aside>' + (s ? '<div class="warm" style="margin-bottom:18px"><div class="small muted">Today</div><div class="stk ' + (s.open ? '' : 'out') + '" style="font-size:16px;font-weight:600"><i></i>' + esc(s.label) + '</div></div>' : '') + hoursHtml() + '<dl class="kv" style="grid-template-columns:90px 1fr;margin:18px 0 22px">' + (CT.address ? '<dt>Address</dt><dd>' + esc(CT.address) + '</dd>' : '') + (CT.phone ? '<dt>Phone</dt><dd>' + esc(CT.phone) + '</dd>' : '') + (CT.email ? '<dt>Email</dt><dd>' + esc(CT.email) + '</dd>' : '') + '</dl>' + (CT.mapsUrl ? '<a class="btn sec" href="' + esc(CT.mapsUrl) + '" target="_blank" rel="noopener" style="margin-right:8px">Open in Maps</a>' : '') + (wa ? '<a class="btn sec" href="' + wa + '" target="_blank" rel="noopener">WhatsApp us</a>' : '') + ((C.faqs || []).length ? '<h3 class="t" style="margin-top:26px">Quick answers</h3>' + C.faqs.map(f => '<details><summary>' + esc(f.q) + '</summary><div>' + esc(f.a) + '</div></details>').join('') : '') + '</aside></div>';
  }, after() { const m = $('#c-msg'), c = $('#c-count'); if (m) m.addEventListener('input', () => { c.textContent = m.value.length + ' / 500'; }); } },
  menu: { drawer: true, title: () => 'Menu', sub: () => '', html() {
    const its = NAV.map(l => ['<a href="#" data-act="' + (l.type === 'page' ? 'go' : 'scroll') + '" data-v="' + l.target + '">' + esc(l.label) + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a>']).join('');
    return '<nav class="menulist" aria-label="Pages">' + its + '</nav><button class="btn full" type="button" style="margin-top:22px" data-act="primary">' + esc(AC.label || 'Get in touch') + '</button>' + (openState() ? '<div class="warm" style="margin-top:16px"><div class="stk ' + (openState().open ? '' : 'out') + '" style="font-weight:600"><i></i>' + esc(openState().label) + '</div></div>' : '');
  } }
};
Kit.cfg.pages = PAGES; Kit.cfg.inert = ['#nav', '#main', 'footer']; Kit.cfg.linkSel = '.lk[data-page]'; Kit.cfg.hash = true;
Kit.cfg.beforeOpen = (name, already) => { if (name === 'contact' && !already) ui.sent = null; if (name === 'form' && !already) ui.form.done = null; if (name === 'cart' && !already && ui.co.done) { ui.co.done = null; ui.co.step = 'cart'; } };
Kit.cfg.onClose = () => heroTimer();
Kit.cfg.act = {
  opt: b => { ui.sel.opts[b.dataset.id] = b.dataset.v; Kit.render(true); }, sq: b => { ui.sel.qty = Math.max(1, Math.min(20, ui.sel.qty + +b.dataset.v)); Kit.render(true); },
  add: addToCart, swap: b => { openItem(b.dataset.id); }, toform: () => { Kit.open('form'); },
  cq: b => { const l = st.cart[+b.dataset.id]; if (!l) return; l.qty += +b.dataset.v; if (l.qty <= 0) st.cart.splice(+b.dataset.id, 1); l && (l.qty = Math.min(l.qty, 20)); save(); paintCart(); Kit.render(true); },
  cnext: () => { const f = CART.fulfil || []; if (!ui.co.fulfil) { const pref = H.pick2 && f.find(x => x.toLowerCase() === H.pick2.options[ui.p2].toLowerCase()); ui.co.fulfil = pref || f[0] || ''; } ui.co.step = 'details'; Kit.render(false); },
  cback: () => { ui.co.step = 'cart'; Kit.render(false); }, cplace: placeOrder,
  browse: () => { Kit.close(); setTimeout(() => scrollTo_('items'), 240); },
  fchip: b => { ui.form.vals[b.dataset.id] = b.dataset.v; Kit.render(true); }, fsubmit: submitForm,
  primary: () => { Kit.close(); setTimeout(() => actDo((C.nav && C.nav.ctaDo) || (AC.mode === 'cart' ? 'scroll:items' : AC.mode === 'form' ? 'form' : 'contact')), 260); },
  go: b => Kit.open(b.dataset.v), scroll: b => { Kit.close(); setTimeout(() => scrollTo_(b.dataset.v), 220); }, close: () => Kit.close(), again: () => { ui.sent = null; Kit.render(false); }
};
Kit.cfg.on.change = e => { const t = e.target; if (t.name === 'fulfil') { ui.co.fulfil = t.value; ui.co.name = $('#co-name').value; ui.co.phone = $('#co-phone').value; ui.co.note = ($('#co-note') || {}).value || ''; Kit.render(true); } };
Kit.cfg.on.input = e => { const t = e.target; if (t.id && t.id.indexOf('f-') === 0) { ui.form.vals[t.id.slice(2)] = t.value; } };
Kit.cfg.on.submit = e => {
  const f = e.target;
  if (f.id === 'cform') { const nm = $('#c-name'), ph = $('#c-phone'), ms = $('#c-msg'); let bad = null; const chk = (el, id, ok, msg) => { Kit.setErr(id, ok ? '' : msg, el); if (!ok && !bad) bad = el; };
    chk(nm, 'e-cname', nm.value.trim().length >= 2, 'Enter your name.'); chk(ph, 'e-cphone', ph.value.trim().length >= 5, 'Enter a phone number or email.'); chk(ms, 'e-cmsg', ms.value.trim().length >= 10, 'Write at least 10 characters.');
    if (bad) { bad.focus(); return; } const ref = 'MSG-' + (1000 + Math.floor(Math.random() * 9000)); ui.sent = { name: nm.value.trim().split(' ')[0], ref, wa: whatsappLink('Hi, this is ' + nm.value.trim() + '. ' + ms.value.trim() + ' (' + ph.value.trim() + ')') }; Kit.render(false); }
  else if (f.id === 'coForm') placeOrder(); else if (f.id === 'gform') submitForm();
};

/* ---------- stories, how, band, footer ---------- */
const S = C.stories || [];
if (S.length) { $('#stories').hidden = false; setText('#hS', T.storiesTitle || 'What people say'); setText('#hSp', T.storiesSub || ''); $('#strs').innerHTML = S.map(s => '<figure class="story" style="margin:0"><div class="q" aria-hidden="true">“</div><p>' + esc(s.text) + '</p><figcaption class="who"><span>' + esc((s.name || '?').split(' ').map(x => x[0]).join('').slice(0, 2)) + '</span><div style="display:flex;flex-direction:column"><b style="font-size:15px">' + esc(s.name) + '</b><span style="font-size:13px;color:var(--mute);background:none;width:auto;height:auto;display:block;font-weight:500">' + esc(s.role || '') + '</span></div></figcaption></figure>').join('');
  const step = () => $('#strs').querySelector('.story').getBoundingClientRect().width + 34; $('#sPrev').addEventListener('click', () => $('#strs').scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' })); $('#sNext').addEventListener('click', () => $('#strs').scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' })); }
else { $('.sech .arrs') && ($('#sPrev').parentElement.hidden = true); }
$('#tools').innerHTML = (C.tools || []).map(t => '<button class="tool" type="button" data-do="' + esc(t.do) + '"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (t.icon || '<path d="M5 12h14M13 6l6 6-6 6"/>') + '</svg></span><b>' + esc(t.title) + '</b><span>' + esc(t.text) + '</span></button>').join('');
if ((C.tools || []).length || S.length) $('#stories').hidden = false;
const HW = C.how; if (HW) { $('#how').hidden = false; setText('#hHow', HW.title); $('#howList').innerHTML = (HW.steps || []).map((s, i) => '<li><span>' + (i + 1) + '</span>' + esc(s) + '</li>').join(''); setText('#howBtn', HW.cta || 'Start'); $('#howBtn').addEventListener('click', () => actDo(HW.do || 'scroll:items'));
  $('#howSide').innerHTML = (HW.image && IM[HW.image] ? '<figure class="bnr" style="margin:0 0 4px"><img src="' + IM[HW.image] + '" alt="' + esc(HW.imageAlt || '') + '" loading="lazy"><figcaption>' + esc(HW.imageCaption || '') + '</figcaption></figure>' : '') + ((HW.facts || []).length ? '<div class="sumbox">' + HW.facts.map(f => '<div><span>' + esc(f[0]) + '</span><span>' + esc(f[1]) + '</span></div>').join('') + '</div>' : '') + (HW.note ? '<p class="tw" style="margin:0">' + esc(HW.note) + '</p>' : ''); }
const B = C.band; if (B) { $('#band').hidden = false; const bi = $('#bandIn'); bi.style.background = B.bg || '#1C1A2E'; bi.style.color = B.ink || '#fff';
  bi.innerHTML = '<div style="display:flex;flex-direction:column;gap:14px;max-width:560px;position:relative"><span style="font-size:13px;font-weight:700;letter-spacing:.08em">' + esc(B.eyebrow || '') + '</span><h2>' + esc(B.title) + '</h2><p style="margin:0;font-size:17px;line-height:1.6">' + esc(B.text || '') + '</p><div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px">' + (B.buttons || []).map((b, i) => '<button type="button" data-do="' + esc(b.do) + '" style="height:58px;padding:0 28px;border-radius:999px;border:0;font-weight:700;font-size:17px;' + (i ? (lumHex(B.ink || '#ffffff') > 0.5 ? 'background:rgba(0,0,0,.24);color:inherit' : 'background:rgba(255,255,255,.5);color:inherit') : 'background:#fff;color:' + readableOnWhite(B.bg || '#1C1A2E')) + '">' + esc(b.label) + '</button>').join('') + '</div></div>' + ((B.decor || []).length ? '<div class="ob2">' + B.decor.map((k, i) => '<img src="' + IM[k] + '" alt="" style="' + (i ? 'left:150px;top:110px;height:120px;width:auto;transform:rotate(12deg)' : 'left:20px;top:6px;height:236px;width:auto;transform:rotate(-8deg)') + '">').join('') + '</div>' : ''); }
const F = C.footer || {};
$('#fcols').innerHTML = '<div class="col" style="flex:1.4 1 260px"><b style="font-size:28px;letter-spacing:-.03em">' + esc(C.brand.name) + '</b><span style="color:#C9C8E8;max-width:290px;line-height:1.6">' + esc(C.brand.tagline || '') + '</span></div>' + (F.cols || []).map(c => '<div class="col"><b>' + esc(c.title) + '</b>' + c.links.map(l => '<button type="button" data-do="' + esc(l.do) + '">' + esc(l.label) + '</button>').join('') + '</div>').join('') + '<div class="col"><b>Find us</b>' + (CT.address ? '<span style="color:#C9C8E8">' + esc(CT.address) + '</span>' : '') + (CT.phone ? '<span style="color:#C9C8E8">' + esc(CT.phone) + '</span>' : '') + (CT.email ? '<span style="color:#C9C8E8">' + esc(CT.email) + '</span>' : '') + '</div>';

/* ---------- init ---------- */
syncFind(); renderItems(); paintHero(); paintCart(); heroTimer(); document.addEventListener('visibilitychange', heroTimer); Blocks.layout(); reveal(); onScroll();
Kit.init();
})();
