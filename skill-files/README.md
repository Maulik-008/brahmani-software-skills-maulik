# skill-files

Ready-to-upload `.skill` files, one per skill in `../skills`. Download the one you need and upload it to Claude.

## Use a skill in Claude
- **Claude.ai / Claude desktop:** Settings, Capabilities, Skills, upload the `.skill` file.
- **Claude Code:** unzip into `~/.claude/skills/` (all projects) or `.claude/skills/` (one project). A `.skill` file is a plain zip.

## Skills here
| File | What it does |
|---|---|
| `paper-pastel-studio.skill` | Start, convert and design interfaces in the Paper & Pastel system (light and dark), with the craft rules, starters and audit tools |
| `creative-landing-webpage-design.skill` | Design and build a unique, modern website for any business from a one-line topic |

## Keep it in sync
These files are generated. After you edit anything under `../skills/<name>/`, rebuild:

```bash
python scripts/build_skill_files.py                    # all skills (run from the repo root)
python scripts/build_skill_files.py paper-pastel-studio   # one skill
```

Adding a new skill: create `skills/<new-name>/SKILL.md`, run the script, and the new `.skill` appears here. The script warns if the frontmatter name differs from the folder or the description is over 1024 characters (the Claude.ai upload limit).
