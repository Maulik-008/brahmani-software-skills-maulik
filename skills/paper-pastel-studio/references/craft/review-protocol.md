# Review protocol

[craft] adapted from `better-interface` (orchestrator and report format), `interface-review` (reviewing a change), and the stress-test skills `break`, `state-machine` and `variant`. Use it whenever you **review, audit or self-check** anything, and always before you hand back finished work.

A review owns no rules of its own: it routes to the domain files and ranks what they find. **Evidence over taste**: only a violated rule or a trigger is a finding. A density, radius or voice you merely dislike is not one, and the system's own choices (`../precedence.md`, "Deliberate deviations register") are never findings.

## 1. Escalation triggers: HIGH on sight, exempt from the cap

Keep this list in mind during every build, not only during review.

1. An interactive control with **no accessible name**.
2. A keyboard-reachable control with **no visible focus indicator**.
3. A control or path reachable by pointer but **not by keyboard**.
4. Motion or autoplay that **ignores `prefers-reduced-motion`**.
5. Content or a control **clipped, overlapped or unreachable at 320px width or 200% zoom**.
6. Body or control text **failing its contrast ratio**.
7. State or meaning carried by **colour alone**.
8. A **destructive action** with no confirmation, undo or distinct treatment.
9. **Truncated content** with no way to reach the full value.
10. Content behind a scroll edge or disclosure with **no visible cue**.
11. An **error that names no recovery path**.
12. A **semantic colour used against its meaning** (a danger hue on a non-destructive action).
13. A state change carried **by motion alone**, with no colour, icon or label left when the animation does not run.

## 2. Severity and ranking

| Level | Meaning |
|---|---|
| **HIGH** | Blocks the task, misleads, hides content or controls, risks data loss, or is a systemic failure. Every trigger above is HIGH |
| **MEDIUM** | Harms comprehension, efficiency, adaptability or consistency |
| **LOW** | Isolated polish |

Rank within a level by **reach** (how many screens) and **fix leverage** (one token fixes many). A rule violation that is only a recommendation (AAA, 44px target, one `h1`) is never HIGH.

**Cheaper-fix ladder: take the earliest rung that works.** 1 Delete it. 2 Use the platform. 3 Reuse an existing token, spacing step or curve. 4 Correct the value. 5 Add something new.

## 3. Procedure

1. **Resolve scope and say it.** For a large scope, narrow to one complete flow and state what was excluded. A branch, PR or uncommitted change is a **change review** (section 6).
2. **Recon:** framework, styling system, component library, tokens, themes, viewports, the test command. Read the project docs that exist (`CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, design-system docs, ADRs, `docs/design-brand.md`) and name the ones you found.
3. **Walk the domains in this order**, foundational failures first: **accessibility, layout, writing, typography, colour, surfaces and icons, motion** (the matching `craft/*.md`). Then the **identity pass**: `python scripts/audit.py <src>` (0 errors), one filled `bg-cta` per view, the reject-on-sight list in `SKILL.md`.
4. **Inspect rendered output when you claim a rendering fact.** A claim backed only by source is marked *Not verified*. Use `scripts/verify-render.mjs` (both themes, five widths, axe), then look at the screenshots.
5. **Consolidate.** One root cause is **one finding with every location**, never one per component. Maximum **15 findings**; never pad. The triggers are exempt from the cap and all listed.
6. **Read-only unless asked to implement.** If a domain file is missing, mark that domain **Not reviewed** and say so. Do not recreate the rules from memory.

## 4. Report format

**Scope and coverage** (one table):

| Domain | Evidence inspected | Result |
|---|---|---|
| Accessibility | e.g. keyboard walk of checkout, axe on `/pricing` both themes | Clear / Findings / Not reviewed |

**Findings** (one table, ordered by severity, then reach). Every finding cites `path:line` and shows the current implementation.

| Severity | Domain | Location | Before | After | Why |
|---|---|---|---|---|---|
| HIGH | Accessibility | `components/Nav.tsx:42` | `<button><Menu/></button>` | `<button aria-label="Open menu">` | Trigger 1 |

**Verification:** what you rendered, in which themes, at which widths, and what you could *not* check.

**Verdict, exactly one of:**
- **Block**: one or more HIGH findings remain.
- **Approve**: no HIGH remains. Approve covers **only** the domains inspected; name every *Not reviewed* domain in the verdict line.

Anti-patterns in a report: a separate findings section per domain (merge into one table); "Clear" for a domain whose rules never loaded; the same symptom repeated per component (one row for the shared token); a rendering claim with no render.

## 5. Findings versus recommendations

Do not mix them. A **finding** cites a rule, a criterion or a trigger. A **recommendation** is optional taste-adjacent guidance (a cleaner structure, a nicer empty state) and goes in a short separate list after the table.

## 6. Reviewing a change (branch, PR, uncommitted work)

Review **the change, not the codebase.** Read the whole diff first.

- **Scope order when none is given:** (1) `HEAD` ahead of `git merge-base origin/<default> HEAD`: the range plus uncommitted work; (2) a dirty tree: the uncommitted change; (3) neither: **ask**, never invent `HEAD~1..HEAD` on your own. Offer: the open PR on this branch, the last commit named by SHA, a named target, or a whole-repo audit.
- **Blast radius:** one hop (direct importers and callers); a second hop only for tokens, theme values and shared primitives; at most five consumers total, and say how many you did not expand.
- **Exclude** lockfiles, snapshots, generated output, vendored code and binaries, and name them.
- **Read removed lines** against what replaces them: a removal is a regression only when nothing replaces it.
- **Status per finding, by cause not location:** *Introduced*, *Regression*, or *Pre-existing* (`git blame -L <line>,<line> "$BASE"..HEAD -- <path>`; a `^` prefix means unchanged since base). Report at most three pre-existing.
- **Check intent:** PR title and body, linked issue, commit messages. Look for an **incomplete change**: a new variant missing hover, focus, active, disabled, loading or selected; a new string with no catalogue entry; a new component missing empty, loading, error, disabled or narrow states; a control added to one surface but not its siblings.
- **Read-only git:** `git fetch` is fine; `gh pr checkout`, `git checkout`, `git switch` and `git stash` are not. Render only if a cheap preview exists or the user asks; for a non-local target use `git worktree add`.
- Output adds a scope block (target, base ref, head ref, commits, files in scope, excluded, surfaces expanded) and a *Status* column.

## 7. Stress-test techniques (optional, throwaway)

Use these when a component carries risk. All three build a **temporary page** that imports the real, untouched component, are **deleted when the user says so** (search for the route and fixture names afterwards), and never edit production code unasked.

- **Break (one component, every scenario).** Infer scenarios from its props, slots, states and data, using only the axes whose cue matches (a text input gets content length and states, never item quantity). Render each, look once in a browser, report `Scenario | Observed | Owner (domain file)`. A predicted failure is not a finding. "Everything survived" is a valid result.
- **State machine (every state of one component).** States are the branches in its code and data hooks: data (loading, empty, error, one item, typical, long/scrolling, mixed, stale refetch), account (tier, role, owner versus member), feature (flags, trials, limits, locked). Name states in product words (`empty`, `member-no-access`). A grouped switcher beside the component flips a `__state` search param. Feed mock data at the data boundary, keep loading states pending until the switcher moves, keep page, fixtures and switcher in one folder for a one-delete removal. Mock data must look like the product.
- **Variants (three candidates, no ranking).** Each variant is a **different answer on one primary axis**: *Structure* (grouping, order, columns), *Density* (spacing, fit), *Emphasis* (where fill and colour go), *Type* (scale, weight contrast, measure), or *Voice* (labels, tone, amount of copy). Name them by direction (Quiet, Editorial, Dense), not "Option A". All variants clear the **same floor: the 13 triggers**. Picker via `?__variant=quiet`, one at a time at full size with realistic data. Present as a table (`Variant | Axis position | Right when | Costs`), **never mark a favourite**, say which width you judged. When one is chosen, promote it and delete the rest.

## 8. Self-check before you hand back finished work

Run sections 1 and 3 on your own output. If you cannot render, say so in the verification line rather than implying coverage. The skill's report format (`../../SKILL.md`) already carries these results.
