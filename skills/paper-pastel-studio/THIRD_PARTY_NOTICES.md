# Third-party notices

## Interface craft rules (`references/craft/`, `assets/craft.css`, the craft rules in `scripts/audit.py`)

The files in `references/craft/` (surfaces and icons, motion, typography, colour and contrast, accessibility, layout, writing, review protocol), the craft checks in `scripts/audit.py`, and the matching defaults in `assets/craft.css` are adapted from the MIT-licensed agent-skill collection by Jakub Krehel:

- https://github.com/jakubkrehel/skills (`better-interface`, `better-ui`, `better-motion`, `better-typography`, `better-colors`, `better-accessibility`, `better-layout`, `better-writing`, `interface-review`, `break`, `state-machine`, `variant`)

The text has been rewritten and restructured for the Paper & Pastel system, with its tokens, class strings and settled decisions filled in, and conflicts resolved in `references/precedence.md`. Exact numeric values (radii maths, motion durations and easings, hit areas, contrast thresholds, type floors) are kept because they are the substance of the rules. The identity layer (tokens, kit, starters, recipes, conversion playbook, decisions) is the owner's own work and is not covered by this notice.

```
MIT License

Copyright (c) 2026 Jakub Krehel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Runtime libraries named in the starters

React, Vite, Next.js, Tailwind CSS, Lucide, class-variance-authority, clsx, tailwind-merge, framer-motion, Geist and Geist Mono (SIL Open Font License), playwright-core and axe-core (used only by `scripts/verify-render.mjs`) are installed from their own registries under their own licences. Nothing from them is vendored in this skill.
