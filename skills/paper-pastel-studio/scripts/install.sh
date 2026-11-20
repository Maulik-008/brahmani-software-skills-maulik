#!/usr/bin/env bash
# Paper & Pastel installer. Never overwrites an existing file.
#
#   install.sh new  <vite|next|html|vanilla> <dir>     scaffold a complete starter project
#   install.sh add  <project-dir> [--dry-run]           add the system to an existing project
#
# `add` detects Next / Vite, Tailwind 3 / 4 / none, and a src/ folder, copies what is missing, skips what exists,
# and prints the few manual edits it deliberately does not make (importing the CSS, wrapping the layout).
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
A="$SKILL/assets"
KIT="$A/starters/react-kit"
DRY=0; [[ "${*:-}" == *"--dry-run"* ]] && DRY=1

# A working Python 3. On Windows `python3` is often a Microsoft Store stub that fails, so test each candidate.
PY=""
for c in python3 python py; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(0)' >/dev/null 2>&1; then PY="$c"; break; fi
done

say()  { printf '%s\n' "$*"; }
copy() { # copy <src> <dest>  (no clobber, creates parents, reports)
  local src="$1" dest="$2"
  if [[ -e "$dest" ]]; then say "  skip   $dest (exists)"; return 0; fi
  if [[ $DRY == 1 ]]; then say "  would  $dest"; return 0; fi
  mkdir -p "$(dirname "$dest")"; cp "$src" "$dest"; say "  add    $dest"
}
copy_tree() { # copy_tree <srcdir> <destdir>
  local sd="$1" dd="$2" f rel
  while IFS= read -r -d '' f; do rel="${f#"$sd"/}"; copy "$f" "$dd/$rel"; done < <(find "$sd" -type f -print0)
}

cmd="${1:-}"; shift || true
case "$cmd" in
new)
  kind="${1:-}"; dir="${2:-}"
  [[ -n "$kind" && -n "$dir" ]] || { sed -n '2,9p' "$0"; exit 2; }
  [[ -e "$dir" && -n "$(ls -A "$dir" 2>/dev/null)" ]] && { say "refusing: $dir exists and is not empty"; exit 1; }
  mkdir -p "$dir"
  case "$kind" in
    vite)
      copy_tree "$A/starters/vite" "$dir"
      copy_tree "$KIT/components" "$dir/src/components"; copy_tree "$KIT/lib" "$dir/src/lib"
      say; say "Next:  cd $dir && npm install && npm run dev"; say "Check: node $SKILL/scripts/verify-render.mjs --url http://localhost:5173" ;;
    next)
      copy_tree "$A/starters/next" "$dir"
      copy_tree "$KIT/components" "$dir/components"; copy_tree "$KIT/lib" "$dir/lib"
      say; say "Next:  cd $dir && npm install && npm run dev" ;;
    html)
      copy "$A/starters/html/index.html" "$dir/index.html"; copy "$A/starters/html/artifact.html" "$dir/artifact.html"
      say; say "index.html = complete standalone page. artifact.html = fragment for Claude Artifacts / hosts that wrap the page." ;;
    vanilla)
      copy "$A/tokens.vars.css" "$dir/css/tokens.vars.css"; copy "$A/a11y-text.css" "$dir/css/a11y-text.css"; copy "$A/craft.css" "$dir/css/craft.css"; copy "$A/pastel.css" "$dir/css/pastel.css"
      [[ -n "$PY" ]] || { say "the vanilla starter needs Python 3 (python3, python or py on PATH)"; exit 1; }
      "$PY" - "$A/starters/html/vanilla.html" "$dir/index.html" <<'PY'
import re, sys
h = open(sys.argv[1], encoding='utf-8').read()
h = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/tokens.vars.css">\n<link rel="stylesheet" href="css/a11y-text.css">\n<link rel="stylesheet" href="css/craft.css">\n<link rel="stylesheet" href="css/pastel.css">', h, count=1, flags=re.S)
open(sys.argv[2], 'w', encoding='utf-8').write(h)
PY
      say "  add    $dir/index.html"; say; say "Plain CSS, no build step. Serve the folder (any static server) and open index.html." ;;
    *) say "unknown kind '$kind' (vite|next|html|vanilla)"; exit 2 ;;
  esac ;;

add)
  proj="${1:-}"; [[ -d "$proj" ]] || { say "usage: install.sh add <project-dir> [--dry-run]"; exit 2; }
  cd "$proj"
  stack="generic"; tw="none"
  if [[ -f package.json ]]; then
    grep -q '"next"' package.json && stack="next"
    [[ $stack == generic ]] && grep -q '"vite"' package.json && stack="vite"
    v=""
    [[ -f node_modules/tailwindcss/package.json ]] && v="$(sed -n 's/.*"version": *"\([0-9]*\)\..*/\1/p' node_modules/tailwindcss/package.json | head -1)"
    [[ -z "$v" ]] && v="$(sed -n 's/.*"tailwindcss": *"[^0-9]*\([0-9]*\)\..*/\1/p' package.json | head -1)"
    [[ "$v" == 3 || "$v" == 4 ]] && tw="$v"
  fi
  root="."; [[ -d src ]] && root="src"
  say "Detected: stack=$stack  tailwind=$tw  source root=$root/"; say
  say "Tokens and config:"
  styles="$root/styles/paper-pastel"
  copy "$A/a11y-text.css" "$styles/a11y-text.css"
  copy "$A/craft.css" "$styles/craft.css"
  case "$tw" in
    4) copy "$A/tokens.vars.css" "$styles/tokens.vars.css"; copy "$A/tailwind.v4.css" "$styles/tailwind.v4.css" ;;
    3) copy "$A/tokens.css" "$styles/tokens.css"; copy "$A/tailwind.v3.preset.ts" "$styles/preset.ts" ;;
    *) copy "$A/tokens.vars.css" "$styles/tokens.vars.css"; copy "$A/pastel.css" "$styles/pastel.css" ;;
  esac
  if [[ "$tw" != none && "$stack" != generic ]] || [[ "$tw" != none ]]; then
    say; say "React kit (components never overwritten; an existing components/ui/button.tsx is kept):"
    copy_tree "$KIT/components" "$root/components"; copy_tree "$KIT/lib" "$root/lib"
  fi
  say; say "Manual steps (not automated on purpose, they edit your files):"
  case "$tw" in
    4) say "  1. In your main CSS, replace the tailwind import with:  @import \"./styles/paper-pastel/tailwind.v4.css\";  (adjust the relative path)"
       say "     and delete the old theme tokens it replaces. Uncomment the a11y-text import there, or paste its contents. craft.css must sit beside tailwind.v4.css (it is imported from it)." ;;
    3) say "  1. tailwind.config: add  presets: [paperPastel]  (import from ./$styles/preset) and  darkMode: 'class'."
       say "  2. Global CSS, after @tailwind base: paste tokens.css, then a11y-text.css, then craft.css."
       say "  3. Tailwind 3 does not gate hover for touch: add  future: { hoverOnlyWhenSupported: true }  to tailwind.config." ;;
    *) say "  1. Link in order: tokens.vars.css, a11y-text.css, craft.css, pastel.css. Put class=\"dark\" on <html> for dark mode." ;;
  esac
  [[ "$tw" != none ]] && {
    say "  2. Wrap the app in <ThemeProvider> (components/theme.tsx) and add the no-flash <script> from components/theme-script.ts to <head>."
    say "  3. Fonts: Geist + Geist Mono as --font-geist-sans / --font-geist-mono (npm i geist  or  @fontsource-variable/geist ...)."
    say "  4. npm i class-variance-authority clsx tailwind-merge lucide-react framer-motion"
    say "  5. If your cn() helper already exists, add the extendTailwindMerge font-size group from lib/utils.ts, or text-display-* will be dropped when merged."
  }
  say "  Then:  python3 $SKILL/scripts/audit.py $root   (the off-system list)   and   node $SKILL/scripts/verify-render.mjs --url <dev url>" ;;
*) sed -n '2,9p' "$0"; exit 2 ;;
esac
