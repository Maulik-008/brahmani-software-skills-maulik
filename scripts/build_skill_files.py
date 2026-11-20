#!/usr/bin/env python3
"""Package every skill in ../skills into a ready-to-upload .skill file in ../skill-files.

  python scripts/build_skill_files.py            # build all
  python scripts/build_skill_files.py paper-pastel-studio   # build one

A skill is any folder under skills/ that contains a SKILL.md. The .skill file is a zip whose
single top-level folder is the skill folder (what Claude.ai / Claude desktop expect).
Run it again after you edit a skill so the downloadable file stays in sync.
"""
import os, re, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'skills')
OUT = os.path.join(ROOT, 'skill-files')
SKIP_DIRS = {'node_modules', '__pycache__', '.git', '.DS_Store'}
EXEC = ('.sh', '.py', '.mjs')

def check(skill_dir, name):
    text = open(os.path.join(skill_dir, 'SKILL.md'), encoding='utf-8').read()
    m = re.match(r'---\r?\nname:\s*(.+?)\r?\n(.*?)\r?\n---', text, re.S)
    warn = []
    if not m:
        return ['SKILL.md has no frontmatter']
    if m.group(1).strip() != name:
        warn.append(f'frontmatter name "{m.group(1).strip()}" differs from folder "{name}"')
    d = re.search(r'description:\s*(.*)', m.group(2), re.S)
    desc = re.sub(r'^[>|][-+]?\s*', '', d.group(1)).strip() if d else ''
    desc = ' '.join(x.strip() for x in desc.split('\n'))
    if len(desc) > 1024:
        warn.append(f'description is {len(desc)} chars (Claude.ai upload limit is 1024)')
    return warn

def build(name):
    d = os.path.join(SRC, name)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, name + '.skill')
    n = 0
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(d):
            dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
            for f in sorted(files):
                if f in SKIP_DIRS:
                    continue
                p = os.path.join(root, f)
                arc = os.path.relpath(p, SRC).replace(os.sep, '/')
                zi = zipfile.ZipInfo(arc, date_time=(2026, 1, 1, 0, 0, 0))
                zi.compress_type = zipfile.ZIP_DEFLATED
                zi.external_attr = (0o755 if f.endswith(EXEC) else 0o644) << 16
                z.writestr(zi, open(p, 'rb').read()); n += 1
    print(f'  {name}.skill  {n} files  {os.path.getsize(out) // 1024} KB')
    for w in check(d, name):
        print(f'    WARNING: {w}')

def main():
    names = sys.argv[1:] or sorted(x for x in os.listdir(SRC) if os.path.isfile(os.path.join(SRC, x, 'SKILL.md')))
    print(f'Building into {OUT}')
    for n in names:
        if not os.path.isfile(os.path.join(SRC, n, 'SKILL.md')):
            print(f'  skip {n}: no SKILL.md'); continue
        build(n)

if __name__ == '__main__':
    main()
