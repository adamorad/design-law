# EXPERIMENT.md - does an agent-first design system change what an agent builds?

Branch `design-law-experiment` (base `c88c90a`), run 2026-10-06. Task: add a Lin Agent case-study page
(`/work/lin-agent`) using only text already on the site (`experiment/BRIEF.md`). Neither variant is merged.
Arm A: brief + repo, `design-system/` removed from its tree. Arm B: brief + `DESIGN.md` + recipes + checker, with the prescribed workflow.

## Result in one paragraph

On every metric the Phase 1 render script measures, both arms are as clean as the existing site: 0 contrast
failures, 0 sideways scroll, 0 clipped, 0 overlapping text, in 2 widths x 2 themes. B passes the checker with 0
findings, including on its first draft, so the checker caught nothing it was built to catch. A fails it with 23
findings. By eye, A's page is the better case study. So the measurable benefit here is rule compliance, not page
quality, and the experiment cannot show the system improving outcomes.

## Metrics (render script, light+dark x 1280+390; union over renders)

| Metric | Existing home `/` | A | B |
|---|---|---|---|
| Distinct font sizes | 9 | 7 | 6 |
| Distinct font weights | 2 (400, 500) | 2 | 2 |
| Distinct text colours (resolved, 4 renders) | 8 | 6 | 6 |
| Radii | 16px, pill, 44px, 36px | 16px, pill | 16px, pill |
| Shadows | 2 | 0 | 0 |
| Text under 4.5:1 | 0 | 0 | 0 |
| Horizontal scroll pages | 0 | 0 | 0 |
| Clipped / overlapping text | 0 / 0 | 0 / 0 | 0 / 0 |
| Static checker findings | 184 (whole `src/`, `baseline-checker-findings.json`) | 23 | 0 |
| Checker findings on first draft | n/a | 23 (never ran it) | 0 (`b-artifacts/check-1.txt`) |
| Strings not already on the site | metadata title | metadata title | metadata title, "Open Lin Agent", "Back to home" |
| Existing files edited | n/a | 0 | 0 |

Existing-home figures count 4 renders of the one committed page; A and B figures count the new page only.
Screenshots: `shots/` (baseline), `experiment/a-shots/`, `experiment/b-shots/`, all four width/theme combinations.
A's 23 findings by rule: UI19 colour utilities by hand x6, UI08 raw text size x4, UI12 hand-built border x4,
UI09 tracking/leading x3, UI14 arbitrary value x2 (`max-w-[60ch]`), UI20 raw `<h>`/`<p>` x2, UI07 weight x1, UI11 radius x1.

## What B's first check caught

Nothing. `check-1.txt` is `0 findings`, `draft-1` is byte-identical to the final `page.tsx`, zero iterations.
Reasons I can see: B read the rules before writing; the wrappers (`Heading`, `Text`, `Button`, `Card`, `Section`) leave
almost nothing to get wrong; and the page is small. The checker's detection power is demonstrated only by the fixture
tests (65 findings on `dont.tsx`, all 25 static rules fire, 4 render rules fire on `render-dont.html`), not by this run.

## What the checker missed (render check and eyes)

The render check also found 0 in both arms. What the static and render checks cannot see, but a person can:
- B: the screenshot is shown at about 420px wide inside a card, so the Lin UI in it is unreadable. A shows it at 976px.
- B: "Lin Agent" appears twice (h1 and card title) and two links point to the same URL. B reported this itself.
- B: no site header or footer, so the page has no identity or way to the other sections; "Back to home" is the only exit.
- B: new strings "Open Lin Agent" and "Back to home" break "only text already on the site". The checker's text rule (UI24) only looks for hype and invented proof, not provenance.
- A: its two buttons say "Visit site" and "Selected work", both already on the site.

## What A did better

- Case-study hierarchy: the first sentence as a lede, the second as quieter support, tags below, then a full-width screenshot.
- Header with a back link to `/#work` and the shared footer, so it reads as part of the site.
- Screenshot large enough to read at 1280 and 390.
- It stayed within the brief's text constraint more faithfully than B.
- It rejected the home `Nav` for a documented reason (hash links) and wrote that down. B did too.

## What B did better

- Zero drift from the system: no hand-set sizes, borders, radii, arbitrary widths, or raw headings.
- A written plan naming recipes and a "what to surface" choice, and a saved audit trail (`b-artifacts/`).
- Recipe friction was reported specifically (below), which is useful input for the system.

## Problems in the system this run exposed

- `Card` forces title, description, tags and an external link. There is no plain image wrapper, so the hero recipe's "screenshot goes in a Card" produces a duplicate title.
- No recipe for a detail-page body. B composed from rules, which is what DESIGN.md says to do, and got a small, empty-looking page.
- `Nav` and `Footer` are not DS-aware and `Nav` is home-only; a vocabulary that excludes them pushes agents to leave them out.
- "What to surface" is advice in a recipe file, not something a checker can verify, and the output shows it was not enough.

## Honest limits

- One run per arm, one model for both (Sonnet 5.5). Differences of one finding or one font size are noise.
- I wrote the rules and the checker and I know what the existing site looks like. Rules derived from the site pass the site's style by construction.
- A was not a clean control. The repo it received already contained `src/components/ds/` and the DS tokens in `globals.css`, and A imported three of the wrappers (`Heading`, `Button`, `TagList`). Only the documents and checker were hidden. A true no-system arm would branch from `c88c90a`.
- The task was small, so there was little room for drift in either arm. A larger page (many sections, a new component) would test the system harder.
- The render check scores contrast against composited backgrounds but treats text over images as indeterminate and ignores backdrop blur; the home page has 1 such element per render, the new pages 0.
- The case study has about two sentences of source text, which limits what either page could be.
- Arm B knew its output would be checked. That alone may have changed its behaviour.

## Top 5 fixes for the existing site (from the baseline, not applied)

1. Card titles use three sizes and repo cards lack the arrow-plus-CTA pattern the others have: make repo cards 18px and drop the "Visit site" / "View on GitHub" lines (5 of 10 cards), per DESIGN.md 2.3 and 6.2.
2. Replace the 4 hand-written buttons (hero, LinkedIn, GitHub, Play) with `Button`: three different hover behaviours become one (6.3).
3. Replace the 7 colour-opacity uses (`border-accent/40` x2, `border-border/80`, `bg-background/80`, `bg-black/10`, `/25`, `shadow-black/20`) and the literal `#0b0b0d` with the DS tokens already in `globals.css` (1.2, 1.3).
4. Remove the hero's `border-b`: it stacks two lines with `#work`'s `border-t` (3.3).
5. Decide DESIGN.md 12.1: card and outline-button borders are 1.22:1 light / 1.26:1 dark, below the 3:1 UI-boundary guideline. The outline GitHub button is a control, so it is the one most worth fixing.

Reproduce: `cd design-system && npm test` (checker tests), `npm run audit -- --base <url> --routes / --out <dir> --label X --json <file>`, `npm run check -- <paths> [--render <url>]`.
