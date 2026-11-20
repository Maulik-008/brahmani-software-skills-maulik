#!/usr/bin/env python3
"""Audit a project (or file) for off-system patterns from the Paper & Pastel design system
and for violations of the craft rules (references/craft/*.md).

  python3 audit.py <path> [--json] [--rule ID ...] [--max 8] [--include-vendor]

Reads .tsx .jsx .ts .js .vue .svelte .astro .html .htm .css .scss .mdx. Skips node_modules, build output,
lockfiles, and the token files themselves (tokens*.css, globals.css variable blocks are allowed raw values).
Exit code 1 if any ERROR-level finding exists. Use it to (1) write the audit list before a conversion,
(2) re-run after each phase, (3) gate CI.

Levels:  ERROR = reject on sight in the system.   WARN = usually wrong, check context.   INFO = count only.
Every finding ends with the fix, so the output is a to-do list.
"""
import os, re, sys, json
from collections import Counter, defaultdict

EXT = {'.tsx', '.jsx', '.ts', '.js', '.mjs', '.vue', '.svelte', '.astro', '.html', '.htm', '.css', '.scss', '.mdx'}
SKIP_DIRS = {'node_modules', '.next', 'dist', 'build', '.git', '.turbo', '.vercel', 'coverage', '.cache', 'out', '.svelte-kit', '.nuxt', 'vendor', '__pycache__'}
TOKEN_FILE = re.compile(r'(^|/)(tokens[\w.\-]*|a11y-text|craft|paper-pastel[\w.\-]*|pastel)\.css$|tailwind\.(v3|v4)\.|\.preset\.|tailwind\.config', re.I)

HUES = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
UTIL = 'bg|text|border|ring|from|to|via|fill|stroke|divide|outline|decoration|shadow|accent|caret|placeholder'

# (id, level, regex, message+fix, flags, file-kinds or None, line-filter)
RULES = [
 ('raw-hex', 'ERROR', r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])', 'Raw hex colour. Use a token (bg-background, text-foreground, border-border) or a category colour (chip-*/tint-*).', 0, {'.tsx','.jsx','.ts','.js','.mjs','.vue','.svelte','.astro','.html','.htm','.css','.scss','.mdx'},
  lambda l: 'theme-color' in l or 'prefers-color-scheme' in l or 'href="#' in l or "href='#" in l or re.search(r'(^|\s)(id|name)=["\']', l) or 'url(#' in l or re.search(r'https?://\S*#', l)),
 ('raw-color-fn', 'WARN', r'(?<![\w-])(rgba?|hsla?)\(\s*\d', 'Literal rgb()/hsl() colour. Use hsl(var(--token) / alpha). (Pure white/black alpha for a chip on a tint is the one sanctioned literal.)', 0, None, lambda l: bool(re.search(r'hsla?\(\s*0\s+0%\s+(100|0)%|rgba\(\s*(255,\s*255,\s*255|0,\s*0,\s*0)\s*,|rgba?\(\s*(?:255\s+255\s+255|0\s+0\s+0)\s*/', l))),
 ('palette-class', 'ERROR', r'\b(?:%s)-(?:%s)-(?:50|100|200|300|400|500|600|700|800|900|950)\b' % (UTIL, HUES), 'Tailwind palette colour class. Map to a token or one of the six category hues (chip-*/tint-*); status uses success/warning/destructive.', 0, None,
  lambda l: bool(re.search(r'bg-emerald-500', l)) and bool(re.search(r'h-(1\.5|2|2\.5|3|3\.5)\b', l))),  # sanctioned presence dot
 ('presence-dot', 'INFO', r'bg-emerald-500', 'bg-emerald-500 is allowed ONLY as a tiny presence dot (h-1.5 to h-3.5).', 0, None, lambda l: not re.search(r'h-(1\.5|2|2\.5|3|3\.5)\b', l) and False),
 ('white-black', 'WARN', r'(?<![\w/:-])(bg|text|border)-(white|black)(?![\w/-])|(?<![\w:-])(bg|text)-(white|black)/\d+', 'bg-white/black or text-white/black ignores the theme. Use background/foreground/cta tokens. (bg-white/70 + dark:bg-black/20 on a tint is the one sanctioned pair; prefer the on-tint class.)', 0, None,
  lambda l: bool(re.search(r'bg-white/70', l)) and 'dark:bg-black/20' in l),
 ('grey-shadow', 'ERROR', r'(?<![\w-])shadow(?:-(?:sm|md|lg|xl|2xl|inner))?(?![\w\[-])', 'Grey Tailwind shadow. Resting cards have NO shadow (hairline border + surface step). Hover lift/floating chrome use shadow-[...hsl(var(--shadow-color)/a)].', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'},
  lambda l: False),
 ('rounded-small', 'WARN', r'(?<![\w-])rounded(?:-(?:none|sm|md|lg|xl))?(?![\w\[-])', 'Timid corner radius. Buttons/badges/pills/avatars = rounded-full; cards 18-28px (rounded-[24px]); inputs rounded-[10px]/[12px].', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'},
  lambda l: bool(re.search(r'h-(6|7) w-(6|7)\b|underline', l))),   # rounded-lg on the callout icon square and rounded-none on the link button are sanctioned
 ('input-pill', 'ERROR', r'<(?:input|textarea|select)\b[^>]*\brounded-full', 'Inputs are the ONE control that is not a pill. Use rounded-[10px]/[12px].', 0, None, lambda l: False),
 ('max-w-wide', 'ERROR', r'max-w-(?:7xl|screen-xl|screen-2xl|\[1[3-9]\d\dpx\])\b', 'Container too wide. Ladder: max-w-5xl (nav/contact), max-w-6xl (sections/footer), max-w-2xl (copy). Never 7xl+.', 0, None, lambda l: False),
 ('gradient', 'ERROR', r'bg-gradient-to-\w+|bg-linear-to-\w+|bg-clip-text|text-transparent\b|(?<![\w-])(from|via|to)-(?:%s)-\d{2,3}' % HUES, 'Real gradient / gradient text. Headlines are solid ink; accent is a solid colour; depth comes from tint washes. (aurora-drift background blobs are the one sanctioned gradient.)', 0, None, lambda l: 'aurora' in l),
 ('serif-font', 'ERROR', r'font-serif|font-family:[^;]*\b(?:serif|Playfair|Fraunces|Georgia|Cormorant|Lora|Merriweather)\b|font-display\b', 'Second/serif display face. Geist Sans + Geist Mono only.', re.I, None, lambda l: 'sans-serif' in l.lower() and not re.search(r'Playfair|Fraunces|Georgia|Cormorant|Lora|Merriweather|font-serif', l)),
 ('other-fonts', 'WARN', r'\b(?:Inter|Roboto|Poppins|Space Grotesk|DM Sans|Montserrat|Open Sans|Nunito|Lato|Manrope)\b(?=["\',:;)\s&+])', 'Other typeface. Geist Sans + Geist Mono only (set --font-geist-sans / --font-geist-mono).', 0, {'.tsx','.jsx','.ts','.js','.css','.scss','.html','.htm','.vue','.svelte','.astro'},
  lambda l: bool(re.search(r'^\s*(//|\*|/\*)', l))),
 ('icon-library', 'WARN', r"from ['\"](?:@heroicons|react-icons|@fortawesome|@mui/icons-material|@phosphor-icons|@tabler/icons|react-bootstrap-icons|@radix-ui/react-icons|ionicons)|font-awesome|fontawesome|material-icons|bootstrap-icons", 'Non-lucide icon set. Use lucide (lucide-react) at strokeWidth 1.75. Brand logos are the exception: lucide >= 1.0 has none, use simple-icons or a generic message icon.', re.I, None, lambda l: False),
 ('emoji-icon', 'WARN', r'[\U0001F300-\U0001FAFF☀-➿⭐✅❌]', 'Emoji used as UI/icon. Use a lucide icon in a rounded-full chip.', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: bool(re.search(r'^\s*(//|\*|/\*|<!--)', l))),
 ('em-dash', 'WARN', r'—', 'Em dash in visible copy. Use a colon, comma or full stop.', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: bool(re.search(r'^\s*(//|\*|/\*|<!--)', l.strip() and l)) or l.lstrip().startswith(('//', '*', '/*', '<!--'))),
 ('zoom-lock', 'ERROR', r'user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0)?\b', 'Zoom disabled. Never ship user-scalable=no or maximum-scale=1.', 0, None, lambda l: False),
 ('outline-none', 'WARN', r'(?<![\w:-])outline-none(?![\w-])', 'outline-none without a replacement focus style. Pair with focus-visible:ring-2 focus-visible:ring-ring (or use outline-hidden).', 0, None, lambda l: 'focus' in l),
 ('primary-fill', 'WARN', r'(?<![\w:-])bg-primary(?![\w/\[-])', 'Accent `primary` as a fill. The accent is for links/focus/logo dot only; the one filled button is bg-cta. (Progress bars and tiny indicators are fine.)', 0, None, lambda l: bool(re.search(r'h-1\.5|h-1\b|h-2\b|progress|meter|indicator|dot', l, re.I))),
 ('dark-variant', 'INFO', r'(?<![\w-])dark:[\w\[]', 'dark: variant. With token-only styling you need none except dark:bg-black/20 on a tint chip. Each one is a place to check the token covers it.', 0, None, lambda l: 'dark:bg-black/20' in l),
 ('img-no-alt', 'WARN', r'<img\b(?![^>]*\balt\s*=)', '<img> without alt. Use alt="" for decoration, descriptive alt otherwise.', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: False),
 ('icon-btn-label', 'WARN', r'<button\b(?![^>]*aria-label)[^>]*>\s*<(?:svg|[A-Z]\w*Icon|[A-Z][a-z]+)\s[^>]*/?>\s*</button>', 'Icon-only <button> without aria-label (critical a11y issue).', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm'}, lambda l: False),
 # ---- craft layer (references/craft/*.md): WARN level, each message ends with the fix ----
 ('transition-all', 'WARN', r'(?<![\w-])transition-all(?![\w-])|(?<![\w-])transition(?:-property)?\s*:\s*all\b', 'craft/motion: transition on `all`. Name the properties (transition-[color,background-color,scale], or transition-property: scale, opacity).', 0, None, lambda l: False),
 ('div-onclick', 'WARN', r'<(?:div|span)\b[^>]*\bon[cC]lick\s*=', 'craft/accessibility: click handler on a non-interactive element. Use <button> for actions or <a href> for navigation.', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: bool(re.search(r'onKey(?:Down|Up|Press)|role=["\']button["\']', l)) and bool(re.search(r'tabIndex|tabindex', l))),
 ('tabindex-positive', 'WARN', r'tabindex\s*=\s*\{?\s*["\']?[1-9]', 'craft/accessibility: positive tabindex breaks the natural tab order. Use 0 (join the order) or -1 (programmatic focus).', re.I, None, lambda l: False),
 ('viewport-height', 'WARN', r'(?<![\w-])(?:h|min-h|max-h)-screen(?![\w-])|(?<![\w:.-])100vh\b', 'craft/layout: 100vh / h-screen is taller than the visible area on mobile browsers. Use 100dvh (h-dvh, min-h-dvh).', 0, None, lambda l: False),
 ('input-ios-zoom', 'WARN', r'<(?:input|textarea|select)\b[^>]*\btext-(?:xs|sm|\[(?:[0-9]|1[0-5])px\])(?![\w-])', 'craft/typography: input text under 16px makes iOS Safari zoom the page on focus. Use text-base sm:text-sm (16px on mobile).', 0, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: 'text-base' in l),
 ('text-justify', 'WARN', r'(?<![\w-])text-justify(?![\w-])|text-align\s*:\s*justify', 'craft/typography: justified text makes rivers in narrow columns. Use text-start (justify only in editorial long-form).', 0, None, lambda l: False),
 ('tnum-feature-tag', 'WARN', r'font-feature-settings\s*:[^;]*["\']\s*(?:tnum|zero|lnum|onum)', 'craft/typography: use the property, not the raw tag: font-variant-numeric: tabular-nums / slashed-zero.', 0, None, lambda l: False),
 ('submit-disabled-invalid', 'WARN', r'disabled\s*=\s*\{\s*!\s*(?:is)?[vV]alid', 'craft/accessibility: do not disable submit until the form is valid. Keep it enabled, validate on submit, and focus the first invalid field.', 0, None, lambda l: False),
 ('will-change-all', 'WARN', r'will-change\s*:\s*all|will-change-\[all\]', 'craft/motion: name the property (will-change: transform) and only after you have seen stutter.', 0, None, lambda l: False),
 ('spring-bounce', 'WARN', r'type\s*:\s*["\']spring["\'][^}\n]*\bbounce\s*:\s*(?!0(?:\.0+)?(?![\d.]))[\d.]+', 'craft/motion: spring bounce is always 0 in this system.', 0, None, lambda l: False),
 ('weak-copy', 'WARN', r'(?:>|["\'`])\s*(?:click here|oops\b[^<"\'`]*|are you sure\??)\s*(?:<|["\'`])', 'craft/writing: name the destination ("Read the billing docs"), say what happened and how to fix it (no "Oops"), and name the action and object instead of "Are you sure?".', re.I, {'.tsx','.jsx','.vue','.svelte','.astro','.html','.htm','.mdx'}, lambda l: False),
]

def kind_ok(rule, ext):
    return rule[5] is None or ext in rule[5]

def iter_files(root, include_vendor):
    if os.path.isfile(root):
        yield root; return
    for d, dirs, files in os.walk(root):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS or (include_vendor and x == 'vendor')]
        for f in files:
            if os.path.splitext(f)[1].lower() in EXT and not f.endswith(('.min.js', '.min.css', '.d.ts')):
                yield os.path.join(d, f)

CLASS_ONLY = {'grey-shadow', 'rounded-small', 'white-black'}

def strip_comments(text):
    # keep line numbers: replace each comment by the same number of newlines
    blank = lambda m: '\n' * m.group(0).count('\n')
    text = re.sub(r'/\*.*?\*/', blank, text, flags=re.S)
    text = re.sub(r'<!--.*?-->', blank, text, flags=re.S)
    return text

CLASSY = re.compile(r'^[a-z0-9!\-:\[\]/.()%,#&>*_@=+]+$')

def quoted(line):
    # only quoted strings that look like a class list (all tokens lowercase class-ish, none ending in '.' or ','),
    # so prose inside props or attributes ("No shadow at rest. Depth...") is never mistaken for a class
    out = []
    for a, b, c in re.findall(r'"([^"]*)"|\'([^\']*)\'|`([^`]*)`', line):
        t = a or b or c
        toks = t.split()
        if toks and all(CLASSY.match(k) and not k.endswith(('.', ',')) for k in toks):
            out.append(t)
    return ' '.join(out)

def scan(path, only):
    findings = []
    ext = os.path.splitext(path)[1].lower()
    is_token_file = bool(TOKEN_FILE.search(path.replace('\\', '/')))
    try:
        text = open(path, encoding='utf-8', errors='ignore').read()
    except OSError:
        return findings
    # variable declaration lines and blocks in CSS are allowed raw values
    in_style_tokens = False
    text_nc = strip_comments(text)
    lines = text_nc.split('\n')
    for i, line in enumerate(lines, 1):
        if len(line) > 4000:
            continue
        stripped = line.strip()
        if stripped.startswith('//'):
            continue
        for rule in RULES:
            rid, level, rx, msg, flags, _, skip = rule
            if only and rid not in only: continue
            if not kind_ok(rule, ext): continue
            if is_token_file and rid in ('raw-hex', 'raw-color-fn', 'palette-class', 'white-black'): continue
            if rid in ('raw-hex', 'raw-color-fn') and re.match(r'\s*--[\w-]+\s*:', line): continue   # a custom-property declaration IS the token
            if rid in ('raw-hex','raw-color-fn') and stripped.startswith(('//', '*', '/*', '<!--')): continue
            target = quoted(line) if rid in CLASS_ONLY else line
            try:
                if re.search(rx, target, flags) and not skip(line):
                    findings.append({'file': path, 'line': i, 'rule': rid, 'level': level, 'msg': msg, 'text': stripped[:140]})
            except re.error:
                pass
    # bg-cta count per file (informational: one filled action per view)
    n = len(re.findall(r'(?<![\w:-])bg-cta(?![\w/-])', text))
    if n > 1 and ext in {'.tsx', '.jsx', '.vue', '.svelte', '.astro', '.html', '.htm'} and (not only or 'cta-count' in only):
        findings.append({'file': path, 'line': 0, 'rule': 'cta-count', 'level': 'INFO',
                         'msg': 'Several bg-cta uses in one file. One filled primary action per view; repeating it across nav/hero/footer is fine only when it is the same action.', 'text': f'{n} uses'})
    return findings

def main():
    args = sys.argv[1:]
    if not args or args[0] in ('-h', '--help'):
        print(__doc__); sys.exit(0)
    path = args[0]
    as_json = '--json' in args
    maxn = int(args[args.index('--max') + 1]) if '--max' in args else 8
    only = set()
    if '--rule' in args:
        i = args.index('--rule') + 1
        while i < len(args) and not args[i].startswith('--'):
            only.add(args[i]); i += 1
    allf = []
    nfiles = 0
    for f in iter_files(path, '--include-vendor' in args):
        nfiles += 1
        allf += scan(f, only)
    if as_json:
        print(json.dumps({'files_scanned': nfiles, 'findings': allf}, indent=2)); 
    else:
        by = defaultdict(list)
        for x in allf: by[x['rule']].append(x)
        order = {'ERROR': 0, 'WARN': 1, 'INFO': 2}
        rules = sorted(by, key=lambda r: (order[by[r][0]['level']], -len(by[r])))
        print(f'Paper & Pastel Studio audit (identity + craft): {nfiles} file(s) scanned\n')
        if not allf:
            print('No findings.')
        for r in rules:
            xs = by[r]
            files = len({x['file'] for x in xs})
            print(f"[{xs[0]['level']}] {r}: {len(xs)} in {files} file(s)\n    fix: {xs[0]['msg']}")
            for x in xs[:maxn]:
                loc = f"{x['file']}:{x['line']}" if x['line'] else x['file']
                print(f"      {loc}  {x['text']}")
            if len(xs) > maxn: print(f'      ... {len(xs) - maxn} more (use --max N or --json)')
            print()
        c = Counter(x['level'] for x in allf)
        print(f"Summary: {c.get('ERROR', 0)} error, {c.get('WARN', 0)} warn, {c.get('INFO', 0)} info")
    sys.exit(1 if any(x['level'] == 'ERROR' for x in allf) else 0)

if __name__ == '__main__':
    main()
