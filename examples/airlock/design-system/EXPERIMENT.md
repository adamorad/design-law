# EXPERIMENT.md - airlock-web (2026-10-06)

Task (`experiment/BRIEF.md`): add a detail page for the **Locks** tool group at `/tools/locks.html`, using only text already on the home page.
Arm A: clean control. Branched from the Phase 1 commit (`c64fd8c`), so it had no `ds.css`, no vite config and no `design-system/`.
Arm B: the full branch, told to read `DESIGN.md`, the recipes and `ds.css`, and to follow the checker workflow.
Neither arm is merged. Pages: `experiment/pages/`. B's plan, draft, checker output and notes: `experiment/b-artifacts/`. Screenshots: `experiment/a-shots/`, `experiment/b-shots/`, `shots/` (home).

## Result in one paragraph

B's page is cleaner on every number the render audit measures, and A's page is shorter and denser by eye. B passed the checker with 0 findings on its
first draft, so the checker caught nothing it was built to catch. The measurable gap exists mostly because A reused the home page's existing classes and
so inherited all of the home page's debt, while B reused `ds.css`. B's page looks sparse and repeats itself; A's reads better but fails contrast and
hides the Airlock column at 390px. The method bought consistency again, not layout quality.

## Metrics (render audit, dark; the site has no light mode, so light renders are identical)

| Metric | Existing home `/` | A | B |
|---|---|---|---|
| Distinct font sizes | 21 | 15 | 8 |
| Distinct text colours (resolved) | 50 | 40 | 12 |
| Radii | 12 | 12 | 4 |
| Distinct box-shadow values | 8 | 8 | 1 |
| Font weights seen | 400 500 600 700 | 400 500 600 700 | 400 500 600 700 (see below) |
| Text under 4.5:1, per width | 91 (41 under 3:1) | 35 (13 under 3:1) | **0** |
| Sideways scroll / clipped text / text overlap | 0 / 2 / 0 (note 1) | 0 / 0 / 0 | 0 / 0 / 0 |
| Airlock column hidden at 390px (R05) | yes | yes | no |
| `backdrop-filter` elements | 36 | 14 | 4 |
| Static checker findings | 701 (legacy `index.html` + `style.css`, `baseline-checker-findings.json`) | 186 | **0 on first draft** |
| Page height at 1280 / 390 | n/a | 2,256 / 2,832 px | 4,336 / 4,517 px |
| Strings not already on the home page | n/a | "← Airlock" back label | "Airlock home", "The five lock tools" |

Note 1: clipped text on home is the install commands cut off by an ellipsis (1 at 1280, 2 at 390). The "overlap" the audit reports between an install command and its Copy button is a measurement artifact of ellipsised text and is not counted.
A's 186 static findings are mostly 156 `UI01` hits: it reused legacy class names (`compare-card`, `tool-pill`, ...) that are not `ds-*`.
B's 700 weight: 4 elements at 1280. I did not record per-element weights; `ds.css` never sets a weight on `.ds-table th` and browsers bold `th` by default, and B has 4 column headers, so that is the likely source. If so it is a gap in the vocabulary that the static CSS rule cannot see. Unverified.

## What B's first check caught

Nothing: `b-artifacts/check-1.txt` is `0 findings`, `draft-1` is identical to the final page, zero iterations. B built the page almost entirely from recipe examples, which pass the checker by construction. As in the portfolio run, the checker's detection is demonstrated only by its fixture tests (the don't fixtures trip all 24 static rules; the render fixture trips all 5 render rules), not by this run.

The checker did catch real problems elsewhere in this project: my own recipe examples failed its tests twice (an undefined `ds-copy-btn` class; status glyphs with no accessible name) before I fixed them, and the render check flagged the legacy home page for the hidden Airlock column, truncated install commands and 91 low-contrast elements.

## What the checkers missed (my eyes and B's notes)

All of these passed both the static and the render check on B's page:
- **Dead space.** B uses four full-height snap sections (`ds-section` is `min-height: 100svh`). At 1280px the Locks tool list sits alone in a viewport with about half of it empty. B's page is 4,336px tall against A's 2,256px for the same content.
- **Repeats itself.** "Locks." appears as the h1 and again as the h2 of the second section, with "22 MCP TOOLS" shown twice and a scroll-hint link at the end of each section.
- **Terminals stacked.** At 1280px the two hero terminals sit in one narrow column. `ds-grid` inside `ds-center` shrinks to its content, and the hero recipe has the same structure, so the recipe causes it.
- **Headline made from a sentence fragment.** The h1 accent reads "Agent B sees it's held and backs off.", part of an existing sentence, not in the brief's list of what to reuse as a headline.
- **`ds-accent` is `display: block`**, so it cannot share a line with the text before it.

## What A did better

- One compact page with a clear order: header and install command, the five tools, the conflict demo with its one-sentence explanation, the locking comparison, the matrix, install. About half the height for the same facts.
- It kept the matrix's "Airlock" column highlighted as a distinct panel, and kept the "Resource locking" cards (verdict visible in a glance).
- Its install commands wrap at 390px, so nothing is truncated (it wrote that fix in its own CSS).

A's problems, all visible in the numbers: 35 elements under 4.5:1 per width, the Airlock column hidden at 390px, 15 font sizes, 12 radii, and every violation of the law that the home page already has.

## What the experiment exposed in the system

- `ds-section` as `100svh` makes short pages sparse. Law 6.3 chose full-height snap sections because the home page does; for a detail page it is the wrong default.
- No recipe for a detail page, a page header with a back link, or inline code in prose. B improvised with `ds-btn--ghost`.
- The hero recipe's terminals do not sit side by side in a medium container.
- `ds.css` sets weights per class but not on `th`, `strong` or other element defaults.
- The law cannot say "do not repeat the heading".

## Honest limits

- One run per arm, one model for both (Sonnet 5.5). I wrote the law, the vocabulary, the recipes and the checker.
- A's debt is inherited by design: the brief did not forbid reusing the home page's classes, and A did. A control that wrote its own CSS from scratch would have a different count.
- B knew its output would be checked, and its page is mostly assembled from recipe examples.
- Contrast is measured on composited flat backgrounds. The fixed blurred orbs behind the content and gradient text are ignored (gradient text is counted as indeterminate).
- I viewed screenshots at 1280 and 390 for both arms (dark only, because the site has no light mode).
- One small task on a one-page site.

## Top 5 fixes for the existing site (from the baseline, not applied)

1. **Contrast.** 91 text elements per width are under 4.5:1 and 41 are under 3:1. Worst: `.compare-row-cat` (2.7:1, 18 elements), `.scroll-indicator` and its arrow (2.39:1), the `✗` cells (2.0:1), `.tool-pill` (3.6:1, 22 elements). Raise `--text-secondary` to 0.62 alpha and remove the 0.28 tier (DESIGN.md 1.3, 1.6).
2. **Comparison matrix at 390px.** The Airlock column is out of sight; move it to column 2 (6.5).
3. **Truncated install commands.** The Copy rows cut the command with an ellipsis (steps 1 and 3 at 390px, step 3 at 1280px); let them wrap (7.3).
4. **Collapse the surface variants.** 14 glass recipes into 2, 12 radii into 3, 12 shadows and 5 blur strengths into one each, and delete the 15 unused `gh-*` classes (4.1 to 4.3, 3.1, 6.4).
5. **Tokens instead of literals.** 126 declarations use colour literals and 4 inline `style=` attributes carry more; 22 font sizes become 6 and nothing stays under 12px, which today covers 24 elements at 10px (1.2, 2.3).

Reproduce: `cd design-system && npm test`; `npx tsx check-ui/index.ts airlock-web/tools/locks.html`; `npx tsx check-ui/index.ts --render http://localhost:4173 --routes /tools/locks.html`.
