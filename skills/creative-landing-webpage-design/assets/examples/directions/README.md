# Example directions (the same scaffold, four completely different sites)

Each pair is a working `site.config.json` plus a screenshot of the result. They exist to show how far the scaffold stretches. Never copy one as the answer to a new brief: run `scripts/direction.py`, choose a direction, then write a fresh config.

| Config | Screenshot | Preset | Hero | Nav | Domain it was made for |
| --- | --- | --- | --- | --- | --- |
| `quill.config.json` | `noir-demo.jpg` | noir | demo card | bar | Automation software for clinics (no objects at all; the product is the hero) |
| `cone.config.json` | `paper-editorial.jpg` | paper | editorial (inline image chips) | bar | Cafe and ice cream |
| `forge.config.json` | `brutal-bento.jpg` | brutal | bento | bar | Strength gym |
| `cedar.config.json` | `glass-frame.jpg` | glass | frame (still-life under frosted cards) | rail | Specialist clinic |

The original stage-hero direction is `../../scaffold/site.config.example.json` (sunlit worlds, pill nav).

Images referenced by these configs (`images/...`) are not bundled. Render objects with `scripts/render_objects.py`, compose a still life with `scripts/compose_scene.py`, or supply photos.
