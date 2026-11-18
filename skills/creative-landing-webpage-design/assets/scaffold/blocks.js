/* Layout library: alternative hero layouts + page blocks. Loaded before app.js; app.js calls Blocks.init(ctx).
   Hero layouts: editorial · frame · demo · bento     (stage lives in app.js)
   Blocks: marquee · bento · story · compare · estimator · gallery · faq · schedule · reviews · team · stats · map
   A block spec in config.page.order looks like {"block":"marquee","id":"ticker", ...options}. */
const Blocks = (function () {
  let X = null;                                   // context from app.js
  const ICONS = {
    bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>', download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>', branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11c0 4-6 3-12 6"/>',
    shuffle: '<path d="M4 7h4l8 10h4M4 17h4l3-4M13 11l3-4h4M18 5l2 2-2 2M18 15l2 2-2 2"/>', send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z"/>', database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.300 7-3V6M5 12v6c0 1.700 3.100 3 7 3s7-1.300 7-3v-6"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2zM10 21h4"/>', check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>', calendar: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.500-4 4.500-5 8-5s6.500 1 8 5"/>', heart: '<path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9L12 3z"/>', map: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
    phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>', bag: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', home: '<path d="M4 11l8-7 8 7v9H4z"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>', play: '<path d="M7 5l12 7-12 7V5z"/>', spark: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3z"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  const ic = (n, s) => '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || ICONS.spark) + '</svg>';
  const mk = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const ctas = h => { const p = h.primary || {}, s = h.secondary || {}; return '<div class="ctas"><button class="bt1" type="button" data-do="' + X.esc(p.do || 'scroll:items') + '">' + X.esc(p.label || 'Explore') + '</button>' + (s.label ? '<button class="bt2" type="button" data-do="' + X.esc(s.do || 'page:about') + '">' + X.esc(s.label) + '</button>' : '') + '</div>'; };
  const imgTag = (k, alt, cls) => X.IM[k] ? '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + X.IM[k] + '" alt="' + X.esc(alt || '') + '" draggable="false">' : '';

  /* ================= HERO LAYOUTS ================= */
  const hero = {};
  hero.editorial = (H) => {
    const E = H.editorial || {}, W = X.W;
    let lines = E.lines;
    if (!lines) lines = [[W[0].name, { img: W[0].img }, 'and'], [(W[1] || W[0]).name.toLowerCase(), { img: (W[1] || W[0]).img }, (E.tail || 'made well.')]];
    const head = lines.map(l => '<span class="he-l">' + l.map(p => typeof p === 'string' ? '<span>' + X.esc(p) + '</span>' : p.em ? '<em>' + X.esc(p.em) + '</em>' : '<span class="he-chip" style="background:' + (p.bg || (X.world(p.world) || {}).tint || 'var(--tint)') + '">' + imgTag(p.img, '') + '</span>').join(' ') + '</span>').join('');
    const strip = W.map((w, i) => '<button type="button" class="he-row" data-do="world:' + w.id + '"><span class="he-n">' + String(i + 1).padStart(2, '0') + '</span><span class="he-t">' + X.esc(w.name) + '</span><span class="he-d">' + X.esc(w.short || '') + '</span><span class="he-c">' + (X.ITEMS.filter(i2 => i2.world === w.id).length ? X.ITEMS.filter(i2 => i2.world === w.id).length + ' ' + X.esc((X.C.text && X.C.text.countNoun) || 'items') : '') + '</span>' + ic('arrow', 20) + '</button>').join('');
    const art = (E.art || W.map(w => w.img)).slice(0, 3).map((k, i) => '<div class="he-art-i a' + i + '" style="background:' + ((W[i] || W[0]).tint || 'var(--tint)') + '">' + imgTag(k, '') + '</div>').join('');
    return mk('<section id="top" class="hero2 he" data-tone="light" aria-label="Introduction"><div class="he-in"><div class="he-top"><span class="he-eb">' + X.esc(E.eyebrow || (X.C.brand.tagline || '')) + '</span><span class="he-eb he-r">' + X.esc(E.corner || '') + '</span></div><h1 class="he-h">' + head + '</h1><div class="he-mid"><div class="he-txt"><p>' + X.esc(E.sub || H.sub || '') + '</p>' + ctas(H) + '</div><div class="he-art" aria-hidden="true">' + art + '</div></div></div><div class="he-strip">' + strip + '</div></section>');
  };
  hero.frame = (H) => {
    const F = H.frame || {}, W = X.W, side = F.side || {};
    const bg = F.image && X.IM[F.image] ? 'background-image:url(' + X.IM[F.image] + ')' : 'background:' + (F.bg || W[0].bg);
    const thumbs = W.slice(0, 4).map(w => '<button type="button" class="hf-th" data-do="world:' + w.id + '" style="background:' + (w.tint || '#EEE') + '" aria-label="' + X.esc(w.name) + '">' + imgTag(w.img, '') + '</button>').join('');
    const sel = '<form class="hf-search" role="search"><label><span>' + X.esc((X.C.text && X.C.text.findWorld) || 'Collection') + '</span><select id="hfW"><option value="all">All</option>' + W.map(w => '<option value="' + w.id + '">' + X.esc(w.name) + '</option>').join('') + '</select></label><label class="w2"><span>' + X.esc((X.C.text && X.C.text.findText) || 'Search') + '</span><input id="hfQ" type="text" placeholder="' + X.esc((X.C.text && X.C.text.findPlaceholder) || 'Search') + '" autocomplete="off"></label><button type="submit" class="hf-go" aria-label="Search">' + ic('search') + '</button></form>';
    const el = mk('<section id="top" class="hero2 hf" data-tone="dark" aria-label="Introduction"><div class="hf-bg" style="' + bg + '"></div><div class="hf-tint" style="background:' + (F.tint || 'rgba(20,18,30,.38)') + '"></div><div class="hf-card hf-main"><span class="hf-eb">' + X.esc(F.eyebrow || '') + '</span><h1>' + X.esc(H.title || X.C.brand.name) + '</h1><p>' + X.esc(H.sub || '') + '</p>' + ctas(H) + '</div>' + (side.title ? '<div class="hf-card hf-side"><span class="hf-eb">' + X.esc(side.label || '') + '</span><b>' + X.esc(side.title) + '</b><p>' + X.esc(side.text || '') + '</p><div class="hf-ths">' + thumbs + '</div></div>' : '') + (F.search !== false ? sel : '') + '</section>');
    /* adaptive glass: sample the image, then pick dark glass + white text or frosted white glass + dark text */
    const decide = L => { if (L > 0.2) { el.dataset.glass = 'light'; document.body.dataset.heroGlass = 'light'; const r = document.documentElement.style; r.setProperty('--pill', 'rgba(255,255,255,.72)'); r.setProperty('--pill-h', 'rgba(255,255,255,.9)'); } };
    const src = F.image && X.IM[F.image];
    if (src) { const im = new Image(); im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d'); g.drawImage(im, 0, 0, 24, 24); const d = g.getImageData(0, 0, 24, 24).data, ls = []; for (let i = 0; i < d.length; i += 4) { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; ls.push(0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2])); } ls.sort((x, y) => x - y); decide(ls[Math.floor(ls.length * 0.75)]); } catch (e) {} }; im.src = src; }
    else { const m = /^#?([0-9a-f]{6})$/i.exec(String(F.bg || W[0].bg).trim()); if (m) { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; decide(0.2126 * f(parseInt(m[1].slice(0, 2), 16)) + 0.7152 * f(parseInt(m[1].slice(2, 4), 16)) + 0.0722 * f(parseInt(m[1].slice(4, 6), 16))); } }
    el.querySelector('.hf-search').addEventListener('submit', e => { e.preventDefault(); X.ui.f.world = $('#hfW', el).value; X.ui.f.q = $('#hfQ', el).value.trim(); X.renderItems(); X.syncFind(); X.scrollTo_('items'); });
    return el;
  };
  const $ = (s, r) => (r || document).querySelector(s);
  hero.demo = (H) => {
    const D = H.demo || {}, steps = D.steps || [];
    const list = steps.map((s, i) => '<li class="hd-s" data-i="' + i + '"><span class="hd-i">' + ic(s.icon || 'spark', 20) + '</span><span class="hd-t"><b>' + X.esc(s.title) + '</b><small>' + X.esc(s.sub || '') + '</small></span></li>').join('');
    const el = mk('<section id="top" class="hero2 hd" data-tone="' + (H.tone || 'dark') + '" aria-label="Introduction"><div class="hd-in"><div class="hd-copy"><span class="hd-eb">' + X.esc(D.eyebrow || '') + '</span><h1>' + X.esc(H.title || X.C.brand.name) + '</h1><p>' + X.esc(H.sub || '') + '</p>' + ctas(H) + (D.proof ? '<div class="hd-proof">' + X.esc(D.proof) + '</div>' : '') + '</div><div class="hd-card" role="group" aria-label="Live example"><div class="hd-head"><b>' + X.esc(D.title || 'Example') + '</b><span class="hd-st" id="hdSt">' + X.esc(D.status || 'Running') + '</span></div><ol class="hd-list">' + list + '</ol><div class="hd-foot"><span>' + X.esc(D.note || 'Example with sample data.') + '</span><button type="button" class="hd-re" id="hdRe">' + ic('play', 16) + ' Replay</button></div></div></div>' + (D.word ? '<div class="hd-word" aria-hidden="true">' + X.esc(D.word) + '</div>' : '') + '</section>');
    const items = [...el.querySelectorAll('.hd-s')]; let i = -1, tm = null, hover = false;
    const stat = el.querySelector('#hdSt');
    function paint() { items.forEach((it, k) => { it.classList.toggle('on', k === i); it.classList.toggle('done', k < i); }); stat.textContent = i >= items.length - 1 ? (D.done || 'Complete') : (D.status || 'Running'); stat.classList.toggle('ok', i >= items.length - 1); }
    function tick() { clearTimeout(tm); if (hover) { tm = setTimeout(tick, 400); return; } if (i < items.length - 1) { i++; paint(); tm = setTimeout(tick, D.speed || 1000); } }
    function play() { i = -1; paint(); tm = setTimeout(tick, 500); }
    if (X.reduce) { i = items.length - 1; paint(); } else play();
    el.querySelector('#hdRe').addEventListener('click', play); const card = el.querySelector('.hd-card'); card.addEventListener('mouseenter', () => { hover = true; }); card.addEventListener('mouseleave', () => { hover = false; });
    return el;
  };
  hero.bento = (H) => {
    const B = H.bento || {}, W = X.W;
    const tiles = B.tiles || [{ type: 'headline', span: [2, 2] }].concat(W.slice(0, 3).map(w => ({ type: 'world', id: w.id })), [{ type: 'status' }, { type: 'cta' }]);
    return mk('<section id="top" class="hero2 hb" data-tone="light" aria-label="Introduction"><div class="bt-grid hb-grid">' + tiles.map(t => tile(t, H)).join('') + '</div></section>');
  };
  function tile(t, H) {
    const sp = t.span || [1, 1], st = 'grid-column:span ' + sp[0] + ';grid-row:span ' + sp[1] + (t.bg ? ';background:' + t.bg : '') + (t.ink ? ';color:' + t.ink : '');
    const cls = 'bt-t bt-' + t.type + (t.bg ? ' has-bg' : '');
    if (t.type === 'headline') return '<div class="' + cls + '" style="' + st + '"><span class="bt-eb">' + X.esc(t.eyebrow || (X.C.hero && X.C.hero.eyebrow) || '') + '</span><h1>' + X.esc(t.title || H.title || X.C.brand.name) + '</h1><p>' + X.esc(t.text || H.sub || '') + '</p>' + ctas(H) + '</div>';
    if (t.type === 'world') { const w = X.world(t.id); if (!w) return ''; return '<button type="button" class="' + cls + '" data-do="world:' + w.id + '" style="' + st + ';background:' + w.bg + ';color:' + (w.ink || '#fff') + '"><span class="bt-eb">' + (X.ITEMS.filter(i => i.world === w.id).length ? X.ITEMS.filter(i => i.world === w.id).length + ' ' + X.esc((X.C.text && X.C.text.countNoun) || 'items') : X.esc(w.short || w.word || '')) + '</span><b>' + X.esc(w.name) + '</b>' + imgTag(w.img, '', 'bt-o') + '</button>'; }
    if (t.type === 'image') return '<div class="' + cls + '" style="' + st + '">' + imgTag(t.img, t.alt || '', 'bt-ph') + (t.caption ? '<span class="bt-cap">' + X.esc(t.caption) + '</span>' : '') + '</div>';
    if (t.type === 'status') { const s = X.openState(); return '<button type="button" class="' + cls + '" data-do="page:contact" style="' + st + '"><span class="bt-eb">TODAY</span><b>' + X.esc(s ? s.label : (t.text || 'Visit us')) + '</b>' + ic('clock', 26) + '</button>'; }
    if (t.type === 'cta') return '<button type="button" class="' + cls + '" data-do="' + X.esc(t.do || 'scroll:items') + '" style="' + st + '"><span class="bt-eb">' + X.esc(t.eyebrow || '') + '</span><b>' + X.esc(t.label || 'Get started') + '</b>' + ic('arrow', 28) + '</button>';
    if (t.type === 'stat') return '<div class="' + cls + '" style="' + st + '"><b class="bt-big">' + X.esc(t.value) + '</b><span>' + X.esc(t.label || '') + '</span></div>';
    if (t.type === 'quote') return '<div class="' + cls + '" style="' + st + '"><p>“' + X.esc(t.text) + '”</p><span class="bt-eb">' + X.esc(t.name || '') + '</span></div>';
    if (t.type === 'text') return '<div class="' + cls + '" style="' + st + '"><b>' + X.esc(t.title || '') + '</b><p>' + X.esc(t.text || '') + '</p></div>';
    if (t.type === 'icon') return '<div class="' + cls + '" style="' + st + '">' + ic(t.icon, 30) + '<b>' + X.esc(t.title || '') + '</b><span>' + X.esc(t.text || '') + '</span></div>';
    return '';
  }

  /* ================= BLOCKS ================= */
  const wirePause = el => { const bt = el.querySelector('.mq-pause'); if (!bt) return; if (X.reduce) { bt.hidden = true; return; } bt.addEventListener('click', () => { const p = el.classList.toggle('paused'); bt.setAttribute('aria-pressed', p); bt.setAttribute('aria-label', p ? 'Resume scrolling' : 'Pause scrolling'); }); };
  const blk = {};
  const sec = (spec, inner, cls) => mk('<section class="wrap blk ' + (cls || '') + '" id="' + X.esc(spec.id || spec.block) + '"' + (spec.title ? ' aria-labelledby="' + X.esc((spec.id || spec.block) + '-h') + '"' : '') + '>' + (spec.title ? '<div class="sech rv-s"><div><h2 id="' + X.esc((spec.id || spec.block) + '-h') + '">' + X.esc(spec.title) + '</h2>' + (spec.sub ? '<p>' + X.esc(spec.sub) + '</p>' : '') + '</div></div>' : '') + inner + '</section>');

  blk.marquee = (s) => {
    const items = (s.items || []).map(i => typeof i === 'string' ? '<span class="mq-t">' + X.esc(i) + '</span>' : '<span class="mq-i">' + imgTag(i.img, '') + '</span>').join('<span class="mq-d" aria-hidden="true">✦</span>');
    const el = mk('<section class="blk mq ' + (s.style || '') + '" id="' + X.esc(s.id || 'marquee') + '" aria-label="' + X.esc(s.label || 'Highlights') + '" style="' + (s.bg ? 'background:' + s.bg : '') + (s.ink ? ';color:' + s.ink : '') + '"><div class="mq-track" style="animation-duration:' + (s.speed || 38) + 's"><div class="mq-set">' + items + '</div><div class="mq-set" aria-hidden="true">' + items + '</div></div><button type="button" class="mq-pause" aria-pressed="false" aria-label="Pause scrolling"><svg class="pp-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z"/></svg><svg class="pp-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg></button></section>');
    wirePause(el); return el;
  };
  blk.bento = (s) => sec(s, '<div class="bt-grid rv-s">' + (s.tiles || []).map(t => tile(t, s)).join('') + '</div>');
  blk.story = (s) => {
    const ch = s.chapters || [];
    const el = sec(s, '<div class="st rv-s"><div class="st-vis" aria-hidden="true">' + ch.map((c, i) => '<div class="st-v' + (i ? '' : ' on') + '" data-i="' + i + '" style="background:' + (c.bg || 'var(--tint)') + '">' + (c.img ? imgTag(c.img, '') : '') + (c.big ? '<span class="st-big">' + X.esc(c.big) + '</span>' : '') + '</div>').join('') + '<div class="st-prog"><i></i></div></div><div class="st-chs">' + ch.map((c, i) => '<article class="st-c' + (i ? '' : ' on') + '" data-i="' + i + '"><span class="st-k">' + String(i + 1).padStart(2, '0') + (c.kicker ? ' · ' + X.esc(c.kicker) : '') + '</span><h3>' + X.esc(c.title) + '</h3><p>' + X.esc(c.text || '') + '</p>' + (c.img ? '<div class="st-m" style="background:' + (c.bg || 'var(--tint)') + '">' + imgTag(c.img, '') + '</div>' : '') + '</article>').join('') + '</div></div>', 'st-sec');
    const cs = [...el.querySelectorAll('.st-c')], vs = [...el.querySelectorAll('.st-v')], bar = el.querySelector('.st-prog i');
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const i = +e.target.dataset.i; cs.forEach((c, k) => c.classList.toggle('on', k === i)); vs.forEach((v, k) => v.classList.toggle('on', k === i)); bar.style.height = ((i + 1) / cs.length * 100) + '%'; } }), { rootMargin: '-45% 0px -45% 0px' }); cs.forEach(c => io.observe(c)); }
    return el;
  };
  blk.compare = (s) => {
    if (s.mode === 'table') { const cols = s.cols || [], rows = s.rows || []; return sec(s, '<div class="cp-t rv-s"><table><thead><tr><th></th>' + cols.map((c, i) => '<th' + (i === (s.hl == null ? -1 : s.hl) ? ' class="hl"' : '') + '>' + X.esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr><th scope="row">' + X.esc(r[0]) + '</th>' + r.slice(1).map((v, i) => '<td' + (i === (s.hl == null ? -1 : s.hl) ? ' class="hl"' : '') + '>' + (v === true ? ic('check', 18) : v === false ? '–' : X.esc(v)) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'); }
    const B = s.before || {}, A = s.after || {};
    const el = sec(s, '<div class="cp-s rv-s"><div class="cp-p" style="background:' + (B.bg || 'var(--tint)') + '">' + imgTag(B.img, B.label) + '<span class="cp-l">' + X.esc(B.label || 'Before') + '</span></div><div class="cp-p cp-a" style="background:' + (A.bg || 'var(--tint2)') + '">' + imgTag(A.img, A.label) + '<span class="cp-l r">' + X.esc(A.label || 'After') + '</span></div><div class="cp-h" aria-hidden="true"><i>' + ic('arrow', 18) + '</i></div><label class="sr" for="' + X.esc((s.id || 'cmp') + '-r') + '">Compare before and after</label><input class="cp-r" id="' + X.esc((s.id || 'cmp') + '-r') + '" type="range" min="0" max="100" value="50"></div>');
    const st = el.querySelector('.cp-s'), r = el.querySelector('.cp-r'), set = v => { st.style.setProperty('--p', v + '%'); }; set(50); r.addEventListener('input', () => set(r.value));
    return el;
  };
  blk.estimator = (s) => {
    const F = s.fields || [], id = s.id || 'est';
    const fields = F.map(f => f.type === 'select' ? '<div class="es-f"><label for="' + id + '-' + f.id + '">' + X.esc(f.label) + '</label><select id="' + id + '-' + f.id + '">' + f.options.map((o, i) => '<option value="' + i + '">' + X.esc(o[0]) + '</option>').join('') + '</select></div>' : '<div class="es-f"><label for="' + id + '-' + f.id + '">' + X.esc(f.label) + ' <b id="' + id + '-' + f.id + '-v"></b></label><input type="range" id="' + id + '-' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + (f.value == null ? f.min : f.value) + '"></div>').join('');
    const el = sec(s, '<div class="es rv-s"><div class="es-in">' + fields + '</div><div class="es-out"><span class="es-l">' + X.esc(s.resultLabel || 'Estimate') + '</span><output class="es-n" id="' + id + '-n" for="' + F.map(f => id + '-' + f.id).join(' ') + '"></output><small>' + X.esc(s.note || 'Sample numbers. Replace with your real pricing.') + '</small>' + (s.cta ? '<button class="bt1" type="button" data-do="' + X.esc(s.cta.do || 'form') + '">' + X.esc(s.cta.label) + '</button>' : '') + '</div></div>');
    const calc = () => { let t = +s.base || 0; F.forEach(f => { const e = el.querySelector('#' + id + '-' + f.id); if (f.type === 'select') t += (+f.options[+e.value][1] || 0); else { const v = +e.value; t += v * (+f.rate || 0); el.querySelector('#' + id + '-' + f.id + '-v').textContent = v + (f.unit ? ' ' + f.unit : ''); } }); if (s.min != null) t = Math.max(s.min, t); el.querySelector('#' + id + '-n').textContent = (s.prefix != null ? s.prefix : X.C.currency || '') + Math.round(t).toLocaleString(X.C.locale || 'en-IN') + (s.suffix || ''); X.ui.est = { id, total: Math.round(t) }; };
    el.addEventListener('input', calc); calc(); return el;
  };
  blk.gallery = (s) => {
    const el = sec(s, '<div class="gl2 rv-s"><div class="gl2-r" tabindex="0" aria-label="' + X.esc(s.title || 'Gallery') + '">' + (s.items || []).map(i => '<figure class="gl2-i" style="background:' + (i.bg || 'var(--tint)') + ';flex-basis:' + (i.w || 320) + 'px">' + imgTag(i.img, i.caption || '') + (i.caption ? '<figcaption>' + X.esc(i.caption) + '</figcaption>' : '') + '</figure>').join('') + '</div><div class="arrs"><button type="button" class="g-p" aria-label="Previous">' + ic('arrow', 20).replace('d="M5 12h14M13 6l6 6-6 6"', 'd="M19 12H5M11 6l-6 6 6 6"') + '</button><button type="button" class="g-n" aria-label="Next">' + ic('arrow', 20) + '</button></div></div>');
    const r = el.querySelector('.gl2-r'); el.querySelector('.g-p').addEventListener('click', () => r.scrollBy({ left: -340, behavior: X.reduce ? 'auto' : 'smooth' })); el.querySelector('.g-n').addEventListener('click', () => r.scrollBy({ left: 340, behavior: X.reduce ? 'auto' : 'smooth' }));
    return el;
  };
  blk.faq = (s) => sec(s, '<div class="fq rv-s">' + (s.items || []).map((f, i) => '<details' + (i === 0 && s.open !== false ? ' open' : '') + '><summary><span>' + X.esc(f.q) + '</span></summary><div>' + X.esc(f.a) + '</div></details>').join('') + '</div>');
  blk.reviews = (s) => { const rv = (s.items || []).map(r => '<figure class="rv2"><p>“' + X.esc(r.text) + '”</p><figcaption><b>' + X.esc(r.name) + '</b><span>' + X.esc(r.role || 'sample review') + '</span></figcaption></figure>').join(''); return mk('<section class="blk mq rvw" id="' + X.esc(s.id || 'reviews') + '" aria-label="Reviews">' + (s.title ? '<h2 class="rvw-h">' + X.esc(s.title) + '</h2>' : '') + '<div class="mq-track" style="animation-duration:' + (s.speed || 60) + 's"><div class="mq-set">' + rv + '</div><div class="mq-set" aria-hidden="true">' + rv + '</div></div><button type="button" class="mq-pause" aria-pressed="false" aria-label="Pause scrolling"><svg class="pp-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z"/></svg><svg class="pp-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg></button></section>'); wirePause(el); return el; };
  blk.team = (s) => sec(s, '<div class="tm rv-s">' + (s.people || []).map(p => '<article class="tm-c"><div class="tm-p" style="background:' + (p.bg || 'var(--tint)') + '">' + (p.img && X.IM[p.img] ? imgTag(p.img, p.name, 'ph') : '<span>' + X.esc(p.name.split(' ').map(x => x[0]).join('').slice(0, 2)) + '</span>') + '</div><b>' + X.esc(p.name) + '</b><span>' + X.esc(p.role || '') + '</span>' + (p.bio ? '<p>' + X.esc(p.bio) + '</p>' : '') + '</article>').join('') + '</div>');
  blk.stats = (s) => { const el = sec(s, '<div class="sx rv-s">' + (s.items || []).map(i => '<div class="sx-i"><b data-to="' + X.esc(String(i.value)) + '">' + X.esc(String(i.value)) + '</b><span>' + X.esc(i.label) + '</span></div>').join('') + '</div>'); return el; };
  blk.schedule = (s) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], cl = s.classes || [], used = [...new Set(cl.map(c => c.day))].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
    const el = sec(s, '<div class="sc rv-s"><div class="chips sc-d" role="group" aria-label="Day">' + used.map((d, i) => '<button type="button" class="chip" data-d="' + d + '" aria-pressed="' + (i === 0) + '">' + days[d] + '</button>').join('') + '</div><div class="sc-l" aria-live="polite"></div></div>');
    const list = el.querySelector('.sc-l'), draw = d => { list.innerHTML = cl.filter(c => c.day === d).sort((a, b) => a.time < b.time ? -1 : 1).map(c => '<div class="sc-r"><span class="sc-t">' + X.esc(c.time) + '</span><span class="sc-n"><b>' + X.esc(c.name) + '</b><small>' + X.esc((c.level || '') + (c.teacher ? ' · ' + c.teacher : '')) + '</small></span><button type="button" class="bt2 sc-b" data-do="' + X.esc(s.do || 'form') + '">' + X.esc(s.cta || 'Book') + '</button></div>').join('') || '<p class="muted">No classes this day.</p>'; };
    draw(used[0]); el.querySelector('.sc-d').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; el.querySelectorAll('.sc-d .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(+b.dataset.d); }); return el;
  };
  blk.map = (s) => {
    const pins = s.pins || [], rnd = (() => { let a = 7; return () => (a = (a * 9301 + 49297) % 233280) / 233280; })();
    let roads = '';
    for (let i = 0; i < 7; i++) { const x = 40 + i * 85 + (rnd() - .5) * 26; roads += '<path d="M' + x + ' -10 L' + (x + (rnd() - .5) * 50) + ' 410" stroke-width="5"/>'; }
    for (let i = 0; i < 5; i++) { const y = 30 + i * 85 + (rnd() - .5) * 26; roads += '<path d="M-10 ' + y + ' L610 ' + (y + (rnd() - .5) * 40) + '" stroke-width="5"/>'; }
    roads += '<path d="M-10 320 C 150 250 250 330 380 230 S 560 150 610 90" stroke-width="15"/><path d="M120 -10 C 160 120 300 140 340 410" stroke-width="12"/>';
    const el = sec(s, '<div class="mp rv-s"><div class="mp-m"><svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" opacity=".13">' + roads + '</g></svg>' + pins.map((p, i) => '<button type="button" class="mp-p' + (i ? '' : ' on') + '" style="left:' + p.x + '%;top:' + p.y + '%" data-i="' + i + '" aria-label="' + X.esc(p.name) + '"><i>' + (i + 1) + '</i></button>').join('') + '</div><div class="mp-l">' + pins.map((p, i) => '<button type="button" class="mp-r' + (i ? '' : ' on') + '" data-i="' + i + '"><b>' + X.esc(p.name) + '</b><span>' + X.esc(p.note || '') + '</span></button>').join('') + '</div></div>');
    el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; el.querySelectorAll('[data-i]').forEach(x => x.classList.toggle('on', x.dataset.i === b.dataset.i)); }); return el;
  };

  /* ================= LAYOUT ================= */
  function layout() {
    const P = X.C.page || {}, main = $('#main'); if (!P.order) return;
    const known = { find: 'find', worlds: 'worlds', items: 'items', how: 'how', stories: 'stories', band: 'band' };
    const keep = new Set(['top']), made = [];
    P.order.forEach(tok => {
      if (typeof tok === 'string') { const el = document.getElementById(known[tok] || tok); if (el) { main.appendChild(el); keep.add(el.id); } return; }
      const f = blk[tok.block]; if (!f) return; const el = f(tok); if (el) { main.appendChild(el); made.push(el); keep.add(el.id); }
    });
    ['find', 'worlds', 'items', 'how', 'stories', 'band'].forEach(id => { const el = document.getElementById(id); if (el && !keep.has(id)) el.hidden = true; });
    main.querySelectorAll('.rv-s').forEach(e => e.classList.contains('in') || null);
  }
  return {
    init(ctx) { X = ctx; },
    mountHero(name, H) { const f = hero[name]; if (!f) return null; const el = f(H); const old = document.getElementById('top'); old.replaceWith(el); return el; },
    layout, ic, ICONS
  };
})();
