# maulik-smart-tech-ai-skills

The Claude skills that **Maulik Joshi** uses for regular development and for creating software projects: one place to keep them, improve them, and download them whenever a new project or a new Claude setup needs them.

Each skill is a folder of instructions, reference files, starter assets and scripts that Claude loads on demand. Install a skill once and Claude applies it whenever a request matches it, so every project starts from the same standards instead of from scratch.

## Skills

| Skill | Use it when you want to | Highlights |
|---|---|---|
| [`paper-pastel-studio`](skills/paper-pastel-studio/README.md) | Start a new project, website, SaaS or feature in the Paper & Pastel design (light and dark), convert an existing app to it, or design and review a screen well | White-first editorial canvas with true ink-black dark mode, six pastel category colours, one ink pill button, Geist type. Includes starters (Vite, Next, plain HTML/CSS), an audit linter, contrast checker, render verifier, a craft layer of exact interface rules (motion, type, accessibility, layout, copy) and a design process |
| [`creative-landing-webpage-design`](skills/creative-landing-webpage-design/SKILL.md) | Design and build a unique, modern website for any business from a one-line topic, so no two sites look alike | Chooses a distinct creative direction each time, domain-specific features, composed or 3D imagery, automated QA, a Canva prompt pack |

There is also an agent, [`maulikagent`](agents/maulikagent.md), kept at the repo root (currently a placeholder). The hands-off `paper-pastel-studio` agent lives inside its skill folder, at `skills/paper-pastel-studio/agents/`.

## Repository layout

```
maulik-smart-tech-ai-skills/
├── skills/                  the source of truth: one folder per skill, each with a SKILL.md
├── skill-files/             ready-to-upload .skill files, one per skill (generated)
├── scripts/
│   └── build_skill_files.py rebuilds skill-files/ from skills/
├── agents/                  Claude Code agents
└── README.md
```

## Use a skill

**Claude.ai or Claude desktop (easiest):** download a file from [`skill-files/`](skill-files/) and upload it under Settings, Capabilities, Skills.

**Claude Code, for every project:**
```bash
cp -r skills/paper-pastel-studio ~/.claude/skills/
```
**Claude Code, for one project:** copy the skill folder into that project's `.claude/skills/`. Copy agent files into `.claude/agents/` (or `~/.claude/agents/`).

Restart the session, then ask Claude "what skills do you have?" and look for the skill name. After that, just describe the job: "start a new SaaS in the pastel design", "convert this app to the pastel design", "design a landing page for a bakery".

## Add or update a skill

1. Create or edit `skills/<skill-name>/`. The folder name must match the `name:` in its `SKILL.md`, and the `description:` should say what the skill does and when to use it (keep it under 1024 characters for Claude.ai).
2. Rebuild the downloadable files:
   ```bash
   python scripts/build_skill_files.py                  # all skills
   python scripts/build_skill_files.py <skill-name>     # one skill
   ```
3. Commit the change together with the regenerated `.skill` file so the download never lags behind the source.

Requirements for the build script: Python 3. On Windows use `python`.

## Credits and licences

- The Paper & Pastel identity, tokens, kit and decisions are Maulik Joshi's own design system.
- `paper-pastel-studio` and `creative-landing-webpage-design` adapt interface-craft rules from Jakub Krehel's MIT-licensed skills (<https://github.com/jakubkrehel/skills>). Each skill carries its own `THIRD_PARTY_NOTICES.md` with the full notice.
