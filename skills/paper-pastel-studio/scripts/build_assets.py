#!/usr/bin/env python3
"""Regenerate assets/tokens.vars.css (variables only) from assets/tokens.css.

tokens.css is the ground truth and is Tailwind-3/plain-CSS flavoured (it uses
@apply and duplicates utilities Tailwind already ships). tokens.vars.css keeps
ONLY the two variable blocks (:root light, .dark) so Tailwind 4, plain CSS,
SCSS, CSS-in-JS and email/PDF pipelines can all share one source of values.

Run after you re-hue or retune tokens.css:   python3 scripts/build_assets.py
"""
import re, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css = open(os.path.join(root, 'assets', 'tokens.css'), encoding='utf-8').read()

start = css.index('@layer base {')
depth, i = 0, start
while True:
    c = css[i]
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0: break
    i += 1
block = css[start:i + 1]
assert ':root' in block and '.dark' in block, 'expected :root and .dark in the first @layer base'

header = (
    '/* Paper & Pastel: variables only (generated from tokens.css by scripts/build_assets.py).\n'
    '   HSL channels, no hsl() wrapper. Light = :root, dark = .dark.\n'
    '   Do not edit by hand: edit tokens.css and regenerate. */\n'
)
open(os.path.join(root, 'assets', 'tokens.vars.css'), 'w', encoding='utf-8', newline='\n').write(header + block + '\n')
print('wrote assets/tokens.vars.css', len(block), 'bytes')

# ---- assemble the Tailwind-4 starters' stylesheet: tailwind.v4.css with the variables inlined ----
v4 = open(os.path.join(root, 'assets', 'tailwind.v4.css'), encoding='utf-8').read()
vars_css = open(os.path.join(root, 'assets', 'tokens.vars.css'), encoding='utf-8').read()
assert '@import "./tokens.vars.css";' in v4
a11y = open(os.path.join(root, 'assets', 'a11y-text.css'), encoding='utf-8').read()
craft_css = open(os.path.join(root, 'assets', 'craft.css'), encoding='utf-8').read()
assert '@import "./craft.css";' in v4
assembled = v4.replace('@import "./tokens.vars.css";', vars_css).replace('@import "./craft.css";', craft_css)
# new projects ship the AA-safe text set by default (a <=2% lightness nudge, text only)
assert '/* @import "./a11y-text.css"; */' in assembled
assembled = assembled.replace('/* @import "./a11y-text.css"; */', a11y)
# Geist wiring for the two font strategies
vite_extra = '\n:root { --font-geist-sans: "Geist Variable"; --font-geist-mono: "Geist Mono Variable"; }\n'
for rel, extra in (('starters/vite/src/index.css', vite_extra), ('starters/next/app/globals.css', '')):
    p = os.path.join(root, 'assets', rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8', newline='\n').write(assembled + extra)
    print('wrote assets/' + rel)

# ---- assemble the single-file HTML starter: inject the token declarations into the template ----
def decls(block_text):
    block_text = re.sub(r'/\*.*?\*/', '', block_text, flags=re.S)
    return re.findall(r'(--[\w-]+\s*:\s*[^;]+;)', block_text)

def sel_block(css_text, selector):
    m = re.search(r'(?:^|\s)' + re.escape(selector) + r'\s*\{(.*?)\n\s*\}', css_text, re.S)
    return m.group(1) if m else ''

tok = open(os.path.join(root, 'assets', 'tokens.vars.css'), encoding='utf-8').read()
a11y_css = open(os.path.join(root, 'assets', 'a11y-text.css'), encoding='utf-8').read()
light = decls(sel_block(tok, ':root')) + decls(sel_block(a11y_css, ':root'))
dark_ = decls(sel_block(tok, '.dark')) + decls(sel_block(a11y_css, '.dark'))
# shadow-color is set explicitly in the template for light; keep dark's own value, drop light dup
light = [d for d in light if not d.startswith('--shadow-color')]
tpl = open(os.path.join(root, 'scripts', 'templates', 'html-starter.template.html'), encoding='utf-8').read()
ind = lambda ds, n: '\n'.join(' ' * n + d for d in ds)
craft_for_html = open(os.path.join(root, 'assets', 'craft.css'), encoding='utf-8').read()
html = tpl.replace('/*__CRAFT__*/', craft_for_html).replace('/*__TOKENS_LIGHT__*/', ind(light, 2)).replace('\n/*__TOKENS_DARK__*/', '\n' + ind(dark_, 4), 1)
html = html.replace('\n/*__TOKENS_DARK__*/', '\n' + ind(dark_, 2), 1)
assert '__TOKENS' not in html
# artifact.html = fragment (hosts such as Claude Artifacts wrap it in their own <html><head><body>)
# index.html    = the same content as a complete standalone document (lang, head, body)
marker = '<!-- NAV:'
head_part, body_part = html.split(marker, 1)
standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' + head_part.rstrip() +
              '\n</head>\n<body>\n' + marker + body_part.rstrip() + '\n</body>\n</html>\n')
hd = os.path.join(root, 'assets', 'starters', 'html')
open(os.path.join(hd, 'artifact.html'), 'w', encoding='utf-8', newline='\n').write(html)
open(os.path.join(hd, 'index.html'), 'w', encoding='utf-8', newline='\n').write(standalone)
print('wrote assets/starters/html/index.html + artifact.html')

# ---- plain-CSS demo: inline tokens + AA text set + pastel.css into the template ----
vt = open(os.path.join(root, 'scripts', 'templates', 'vanilla-starter.template.html'), encoding='utf-8').read()
pp = open(os.path.join(root, 'assets', 'pastel.css'), encoding='utf-8').read()
van = vt.replace('/*__CSS__*/', vars_css + '\n' + a11y_css + '\n' + craft_for_html + '\n' + pp)
open(os.path.join(root, 'assets', 'starters', 'html', 'vanilla.html'), 'w', encoding='utf-8', newline='\n').write(van)
print('wrote assets/starters/html/vanilla.html')
