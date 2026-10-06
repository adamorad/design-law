---
name: design-law
description: "Builds an agent-first design system for an existing web codebase and tests whether it works. Derives a single DESIGN.md of numbered, dated, absolute rules (with the reasoning and measured counts inline) from what the UI already does, creates a closed vocabulary (tokens plus wrapper components) so product code can only use approved values, writes recipes for recurring page shapes, adds a checker whose every finding cites a DESIGN.md section, and runs an A/B test (agent without the system vs agent with it) to measure the effect. Use when asked to create a design system for AI agents, stop agents producing generic or inconsistent UI, write a DESIGN.md, enforce UI consistency with a linter, or measure whether design rules change agent output. Targets React or TSX with Tailwind for the static checker; the render audit works on any site."
allowed-tools: Read Grep Glob Bash Edit Write Agent
---

# design-law

Method: an agent-first design system is five things, built in this order, each cheap to verify.

1. **Measure drift** on the live site before writing any rule.
2. **DESIGN.md**: numbered, dated bans with the reason and a current adoption count on every rule.
3. **Closed vocabulary**: tokens in one place and wrapper components exposing only approved variants. Product code may use layout utilities and wrappers, nothing else.
4. **Recipes**: the recurring page shapes, each with a "what to surface" step so rules do not kill product thinking.
5. **Checker**: static rules plus a render check, every finding citing a DESIGN.md section and a fix.

Then **A/B test** it. Do not claim the system works until arm A and arm B are measured the same way.

Inspired by Mate Security's article "A Design System In and For the Agentic Era".

## Ground rules (always)

- Work on a new git branch. Never push, deploy, or touch hosting or env config. Commit locally at the end of each phase.
- Do not change how the live site looks. Add files; edit existing files only where a phase says so.
- Derive rules from what the site already does. No new visual direction. Rules enforce consistency, not blandness.
- If the working tree has uncommitted changes, ask which state to branch from, and use a separate git worktree so the user's work is untouched.
- Read the project's AGENTS.md or CLAUDE.md first. Verify framework APIs from the installed docs, do not guess.
- No invented numbers. Every count in DESIGN.md comes from a script or grep you ran.

## Workflow

### Phase 0: Recon
Identify framework and version, router, styling system (Tailwind, CSS modules, other), fonts, dark-mode mechanism, pages, section components, shared components. Summarise in about 10 lines. Find the dev/prod command.

### Phase 1: Baseline drift
1. Install the tools: `mkdir -p design-system && cp -R <skill>/tools/. design-system/ && cd design-system && npm i` (own `package.json`, so the project's is untouched; Playwright reuses an installed Chromium, else `npx playwright install chromium`). Playwright needs a running server: use a production build, not dev.
2. Render every page at 1280px and 390px, in light and dark if supported: `npx tsx render-audit.ts --base <url> --routes /,/about --out design-system/shots --label baseline --json design-system/baseline-render.json`. It records distinct font sizes, weights, text colours, radii, shadows, text under 4.5:1 (opacity and stacked backgrounds composited), horizontal overflow, clipped text and overlaps.
3. Static scan: `npx tsx scan-static.ts src design-system/baseline-static.json` counts colour literals, arbitrary Tailwind values, inline styles, opacity-muted colours, shadow/radius/size utilities, duplicated class strings. Add hand counts for one-off components that duplicate each other.
4. Merge into `design-system/baseline.json`, note the measurement limits (images, backdrop blur), commit.

### Phase 2: Decide, then write the law
1. List every place the site disagrees with itself (3 greys, 5 radii, 3 card title sizes, 3 button hovers) with counts and file locations. Include the contrast numbers the rules will cite.
2. **STOP and ask** which option wins for each conflict. Offer a recommendation. Defaults you will apply unless objected to must be stated.
3. Write `design-system/DESIGN.md` from `references/DESIGN.template.md`: numbered sections, absolute rules, banned lists, reasons with numbers, `Decided <date>` on every decision, the adoption count next to each rule, losing options recorded, and this sentence verbatim: "If neighbouring code contradicts this file, the neighbour is debt, not an example."
4. Keep an "Open items" section for things the owner has not decided. Open items are not enforced.

### Phase 3: Vocabulary
Put tokens in one place (CSS variables or the Tailwind theme, whichever the repo uses). Replace every opacity-faded or literal value the law bans with a named token that renders the same. Create wrapper components for heading, text, button/link, card, tag, section (and any one-off the site genuinely needs, such as a device frame), exposing only approved variants. Put them under one folder (`src/components/ds/`). See `references/wrappers.md`. Do not migrate existing pages. Typecheck, build, commit.

### Phase 4: Recipes
Identify recurring shapes (hero, featured item, card grid, list, contact). For each write `design-system/recipes/<name>.md` from `references/recipe.template.md`: when to use, when not to, anatomy, rules obeyed, file to copy, and a **What to surface** step grounded in this site's real content. Each recipe has a real, typechecked example in `recipes/examples/` built only from the wrappers. Existing pages are not copy sources if they contradict the law.

### Phase 5: Checker
`design-system/check-ui/` is already copied. Adapt it:
- Edit `check-ui/rules.ts` so every rule matches a rule in this project's DESIGN.md and cites its section. Keep 15 to 25 static rules, each with `fix`.
- Keep the rule that product code outside the vocabulary folder may not use type, colour, radius, border, shadow or opacity utilities.
- Update `fixtures/dont.tsx` to typical agent output for this project (gradient hero, shadows, muted grey data, emoji, arbitrary sizes); tag every bad line with `{/* bad */}`.
- Tests (`npm test`): every recipe example has zero findings; every tagged fixture line is flagged; every rule fires at least once; every cited section exists in DESIGN.md; the render check flags `fixtures/render-dont.html` (contrast, overflow at 390, clipped text, overlap) and passes `render-clean.html`.
- Exclude `design-system/` from the project's Tailwind scan (`@source not`) so fixtures never reach the CSS bundle, and make sure the project's own typecheck does not fail on tool files.
- Run the checker on the existing code and record the count. It will be large; that is the debt, not a failure of the tool.

### Phase 6: A/B test
Pick a small task that adds a new page or component using only content already on the site. Write the brief to `design-system/experiment/BRIEF.md`. Create two git worktrees off the branch and install dependencies in each (Turbopack rejects symlinked `node_modules`).
- **Arm A** gets the brief and the repo. Remove `design-system/` from its tree. Warn the user that the repo's own wrappers and tokens still remain in A, so A is not a clean control; for a clean control branch from the commit before Phase 3.
- **Arm B** gets the brief plus DESIGN.md and this workflow: plan from a recipe (write PLAN.md), write the first draft and copy it untouched to `draft-1/`, run the checker and save the output as `check-1.txt`, fix in a copy until 0 findings (check-2, ...), run the render check, write NOTES.md about anything the rules got wrong or missed. B must not weaken the rules.
- Neither arm is merged. Both commit locally. Give each its own port.
- Measure both with the Phase 1 render audit (same metrics, all widths and themes) and run the static checker on A's output too.
- Look at the screenshots yourself. The checkers cannot see poor layout, redundant content, unreadable images or new copy that breaks the brief.

### Phase 7: Report
Write `design-system/EXPERIMENT.md`: metrics table (existing pages, A, B), screenshots, what B's first check caught (say "nothing" if so), what the checkers missed that eyes caught, anything A did better, problems the run exposed in the system, honest limits (runs per arm, same model, you wrote the rules, A contamination, task size, B knew it was checked), and the top 5 fixes for the existing site from the baseline, not applied. See `examples/` in the repo this skill ships from for a complete run.

## Rule-writing standards

- Absolute ("never", "only"), not "prefer". A rule that has exceptions lists them by name.
- Every rule carries: the reason with a number where one exists, `Adoption:` count, `Decided <date>`.
- Prefer deleting the option to forbidding it: make the approved value a token or variant so the banned value cannot be typed in product code.
- Rules are checkable. If the checker cannot see it, either add a render check or say in the rule that it needs eyes.
- Do not write rules the site does not already obey in most places unless the owner decided it in Phase 2.

## What this method does not do

- It does not make a page good. In the original run the page that passed the checker was the weaker one by eye. The checker enforces consistency; hierarchy, content choices and layout still need a person or a separate review.
- It does not replace accessibility testing. The render check covers contrast, overflow, clipping and overlap only.
