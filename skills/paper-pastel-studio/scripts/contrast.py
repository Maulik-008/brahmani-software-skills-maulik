#!/usr/bin/env python3
"""Measure WCAG contrast for the Paper & Pastel token pairs, straight from tokens.css.

Usage:
  python3 contrast.py path/to/tokens.css            # table, both themes
  python3 contrast.py path/to/tokens.css --fail     # only failures
  python3 contrast.py path/to/tokens.css --json     # machine readable

Exit code 1 if any pair marked REQUIRED fails. Re-run after changing any token
(re-hueing the accent, tweaking a tint). It reads the file, so nothing here is
hard-coded to the default palette.
"""
import re, sys, json

def parse_blocks(css):
    """Return {'light': {...}, 'dark': {...}} of token -> (h, s, l)."""
    def grab(selector):
        m = re.search(r'(?:^|\s)' + re.escape(selector) + r'\s*\{(.*?)\n\s*\}', css, re.S)
        out = {}
        if not m:
            return out
        for name, h, s, l in re.findall(
                r'--([\w-]+)\s*:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%', m.group(1)):
            out[name] = (float(h), float(s), float(l))
        return out
    light, dark = grab(':root'), grab('.dark')
    merged_dark = dict(light); merged_dark.update(dark)
    return {'light': light, 'dark': merged_dark}

def hsl_to_rgb(h, s, l):
    s, l = s / 100, l / 100
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = l - c / 2
    r, g, b = [(c, x, 0), (x, c, 0), (0, c, x), (0, x, c), (x, 0, c), (c, 0, x)][int(h // 60) % 6]
    return (r + m, g + m, b + m)

def blend(fg, bg, a):
    return tuple(f * a + b * (1 - a) for f, b in zip(fg, bg))

def lum(rgb):
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def q8(rgb):
    # browsers composite and paint in 8-bit sRGB; quantise so our numbers match axe / DevTools
    return tuple(round(v * 255) / 255 for v in rgb)

def ratio(a, b):
    la, lb = lum(q8(a)), lum(q8(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

CATS = ['blue', 'violet', 'emerald', 'coral', 'amber', 'teal']

def pairs(t, theme):
    """(label, fg_rgb, bg_rgb, threshold, required)"""
    g = lambda n: hsl_to_rgb(*t[n])
    white = (1, 1, 1); black = (0, 0, 0)
    out = []
    bg = g('background')
    surfaces = {'background': bg, 'surface-1': g('surface-1'), 'surface-2': g('surface-2')}
    for name, s in surfaces.items():
        out.append((f'foreground on {name}', g('foreground'), s, 4.5, True))
        out.append((f'muted-foreground on {name}', g('muted-foreground'), s, 4.5, True))
        out.append((f'primary (links) on {name}', g('primary'), s, 4.5, True))
    out.append(('cta-foreground on cta (the one button)', g('cta-foreground'), g('cta'), 4.5, True))
    # non-text contrast, WCAG 1.4.11 (3:1): the focus ring must be visible on every surface it can sit on
    for name, s_ in surfaces.items():
        out.append((f'focus ring (--ring) vs {name} (non-text, 3:1)', g('ring'), s_, 3.0, True))
    # the hairline input edge is the identity; WCAG 1.4.11 wants 3:1 for the boundary that identifies a control.
    # Reported as a warning (strict-AA products add --input-edge, see references/precedence.md).
    if 'input' in t:
        out.append(('input border (--input) vs background (non-text, 3:1; strict-AA only)', g('input'), bg, 3.0, False))
    if 'input-edge' in t:
        out.append(('input edge (--input-edge) vs background (non-text, 3:1)', g('input-edge'), bg, 3.0, True))
    out.append(('primary-foreground on primary', g('primary-foreground'), g('primary'), 4.5, False))
    out.append(('primary text on primary/5% callout', g('primary'), blend(g('primary'), bg, 0.05), 4.5, False))
    for st in ('destructive', 'success', 'warning'):
        out.append((f'{st} text on background', g(st), bg, 4.5, False))
        wash = blend(g(st), bg, 0.05)
        out.append((f'{st} text on {st}/5% callout', g(st), wash, 4.5, False))
        out.append((f'{st} text on {st}/6% callout over surface-1 band', g(st), blend(g(st), g('surface-1'), 0.06), 4.5, False))
        out.append((f'{st}-foreground on {st} (solid fill)', g(f'{st}-foreground'), g(st), 4.5, False))
    chip_on_tint = white if theme == 'light' else black
    chip_alpha = 0.7 if theme == 'light' else 0.2
    for c in CATS:
        chip, tint = g(f'accent-{c}'), g(f'tint-{c}')
        out.append((f'chip-{c} on background', chip, bg, 4.5, False))
        out.append((f'chip-{c} on its own tint', chip, tint, 4.5, False))
        pill = blend(chip_on_tint, tint, chip_alpha)
        out.append((f'chip-{c} on pill over tint', chip, pill, 4.5, False))
        out.append((f'chip-{c} on 15% own-colour pill (bg-chip-{c}/15)', chip, blend(chip, bg, 0.15), 4.5, False))
        out.append((f'foreground on tint-{c}', g('foreground'), tint, 4.5, True))
        out.append((f'foreground/70 on tint-{c}', blend(g('foreground'), tint, 0.7), tint, 4.5, True))
        out.append((f'chip-{c} glyph vs background (non-text, 3:1)', chip, bg, 3.0, False))
    return out

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    css = open(sys.argv[1], encoding='utf-8').read()
    themes = parse_blocks(css)
    if not themes['light']:
        print('Could not find a :root block with HSL channel tokens.'); sys.exit(2)
    only_fail = '--fail' in sys.argv
    as_json = '--json' in sys.argv
    results, bad = [], 0
    for theme in ('light', 'dark'):
        for label, fg, bgc, need, req in pairs(themes[theme], theme):
            r = ratio(fg, bgc)
            ok = r >= need
            if not ok and req:
                bad += 1
            results.append({'theme': theme, 'pair': label, 'ratio': round(r, 2),
                            'needs': need, 'pass': ok, 'required': req})
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        for theme in ('light', 'dark'):
            print(f'\n== {theme.upper()} ==')
            for x in (r for r in results if r['theme'] == theme):
                if only_fail and x['pass']:
                    continue
                mark = 'ok  ' if x['pass'] else ('FAIL' if x['required'] else 'warn')
                print(f"  {mark} {x['ratio']:>5}:1  (need {x['needs']})  {x['pair']}")
        n = sum(1 for r in results if not r['pass'])
        print(f'\n{len(results)} pairs, {n} below threshold, {bad} REQUIRED failing.')
    sys.exit(1 if bad else 0)

if __name__ == '__main__':
    main()
