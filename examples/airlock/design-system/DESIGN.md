# DESIGN.md - airlock-web (airlock-web.vercel.app)

Law for any agent or human who builds UI in `airlock-web/`. Numbered, dated, absolute.
Every checker finding (`design-system/check-ui`) cites a section number from this file.

Derived from the site as of commit `adb287c` (2026-10-06). The site is one dark-only page: violet glass
cards, a gradient headline and drifting orbs. This law keeps that identity and removes the variance inside it.
Where the site disagreed with itself, the owner chose a winner; those rules are marked **Decided**.
"Adoption" is the measured count on `adb287c` (`baseline.json`) and says how much of the site already obeys the rule.

## 0. How to read this

0.1 **If neighbouring code contradicts this file, the neighbour is debt, not an example.**
Do not copy a class, a declaration or a `rgba()` value from `index.html` or `src/style.css`.
Copy from `design-system/recipes/` instead. `src/style.css` is legacy and is not edited by this system.

0.2 **Closed vocabulary.** New pages and sections (anything not in the legacy `index.html`) may only use:

- class names that start with `ds-` and are defined in `src/ds.css`, and
- no inline `style=`, no `<style>`, no page-specific stylesheet, no JS that sets styles.
  Every colour, size, radius, border, shadow, blur and gradient lives in `src/ds.css` as a `--ds-*` token or a
  `ds-*` component class. _Why:_ an agent cannot choose a wrong value if the wrong value cannot be spelled in a page.
  _Adoption:_ 0 of 452 lines of `index.html` obey this (it predates it).

0.3 No rule here is a taste preference. Each has a number or a measured count behind it. If a rule blocks what
content genuinely needs, change this file in its own commit with a dated entry in section 12.

0.4 Decided 2026-10-06 (all sections below unless stated). "Default" means the owner was shown the conflict and
did not object to the recommended option.

## 1. Colour

1.1 **Only these colour tokens exist** (in `ds.css`): `--ds-bg #0a0a12`, `--ds-text`, `--ds-text-2`,
`--ds-violet #7C3AED`, `--ds-violet-bright #8B5CF6`, `--ds-violet-text #a78bfa`, `--ds-ok #22C55E`,
`--ds-warn #fbbf24`, `--ds-fail #f87171`, plus surface and border tokens in 3.2 and 4.1.
_Adoption:_ 8 tokens exist today; 126 declarations use a colour literal, 37 use `var(--...)`.

1.2 **No colour literal (`#hex`, `rgb()`, `rgba()`, `hsl()`) anywhere except the token block of `ds.css`.**
_Why:_ a literal is an undocumented decision; the site has 88 distinct colour literals used 135 times.
_Adoption:_ 135 literal uses in `style.css`; 4 inline styles carry more.

1.3 **Secondary text is `--ds-text-2` (white at alpha 0.62, 7.0:1 on `--ds-bg`). There is no tertiary text colour.**
_Why:_ the current `--text-secondary` (alpha 0.45) is exactly 4.50:1 on the page background and falls below
4.5:1 on any glass surface; `--text-tertiary` (alpha 0.28) is 2.41:1. 91 text elements per render are under 4.5:1
today, 41 of them under 3:1.
_Adoption:_ `--text` 7 uses, `--text-secondary` 10, `--text-tertiary` 3, about 20 literal text `rgba()` values.
_Decided 2026-10-06._ Lost: keeping secondary at 0.45; three greys as tokens.

1.4 **Violet has three tokens by role.** `--ds-violet #7C3AED` for fills and borders only (3.46:1 as text, so never
for text). `--ds-violet-bright #8B5CF6` for interactive text and focus (4.66:1). `--ds-violet-text #a78bfa` for
small text on dark (7.25:1). `#c084fc`, `#a855f7`, `#6d28d9` and `rgba(167,139,250,...)` are banned.
_Adoption:_ 2 tokens plus `#c084fc` x3, `#a855f7`, `#6d28d9` and many violet `rgba()` literals.
_Decided 2026-10-06._ Lost: two tokens only.

1.5 **Status colours are `--ds-ok`, `--ds-warn`, `--ds-fail` and are used only for the yes / partial / no glyphs
and dots.** Never as decoration. _Why:_ they are the only meaning-carrying colours on the site.
_Adoption:_ `#22c55e` x2, `#34d399` x2, `#fbbf24` x2, `#f87171` x1 as literals (4 greens-and-ambers for 3 meanings).
_Decided 2026-10-06 (default)._

1.6 **Every pair of text and background clears 4.5:1 (3:1 only for 24px+ text).** Gradient text (2.4) is
exempt from measurement but both stops must individually clear 4.5:1 on `--ds-bg`.
_Adoption:_ 91 elements fail at 1280 and at 390 (364 findings across 4 identical dark renders).

## 2. Type

2.1 **Families: Inter for text, JetBrains Mono for code and labels.** Nothing else.
_Adoption:_ Inter 1 declaration, JetBrains Mono 13, system fallback 1, 1 `inherit`.

2.2 **Weights: 400, 500, 600.** No 700.
_Adoption:_ 400 x1, 500 x4, 600 x13, 700 x7 declarations.
_Decided 2026-10-06._ Lost: keeping 700; no visual change.

2.3 **Closed size roles. Use the class, never a raw `font-size`.**

| Role          | Class      | Size                           | Weight | Notes                                                               |
| ------------- | ---------- | ------------------------------ | ------ | ------------------------------------------------------------------- |
| Page title    | `ds-h1`    | `clamp(2rem, 5vw, 3.2rem)`     | 600    | one per page, tight tracking                                        |
| Section title | `ds-h2`    | `clamp(1.5rem, 3.5vw, 2.2rem)` | 600    |                                                                     |
| Body          | `ds-body`  | 16px                           | 400    | `--ds-text-2`                                                       |
| Small         | `ds-small` | 14px                           | 400    | `--ds-text-2`                                                       |
| Code          | `ds-code`  | 13px                           | 400    | JetBrains Mono                                                      |
| Label         | `ds-label` | 12px                           | 500    | JetBrains Mono, uppercase, 0.12em tracking, the only uppercase role |

Nothing under 12px.
_Adoption:_ 22 distinct font-size values (10px x4, 10.5px, 11px x11, 11.5px x4, 12px x4, 12.5px x4, 13px x5, 13.5px x5,
14px, 14.5px, 15px x3, 16px, 17px x2, 1rem, 1.2rem, 1.3rem x2, 7 `clamp()` headings). 24 text elements per render are 10px.
_Decided 2026-10-06._ Lost: keep sizes snapped to 7; no change.

2.4 **Uppercase and letter-spacing only on `ds-label`.** _Adoption:_ 10 uppercase declarations, 9 distinct tracking values.

2.5 **Line length for prose: `max-width: 60ch`.** (`ds-body` and `ds-small` set it.)

## 3. Shape

3.1 **Radii: 8px (`--ds-r-sm`, controls and code), 16px (`--ds-r-md`, cards and panels), pill (`--ds-r-pill`).**
No other `border-radius`. `50%` only for dots and orbs (`ds-dot`, `ds-orb`).
_Adoption:_ 12 distinct values (4, 7, 8, 10, 11, 12, 14, 16, 18, 20px; 100px x5; 50% x6).
_Decided 2026-10-06._ Lost: keep radii free; tokenise all 12.

3.2 **Borders: 1px, `--ds-border` (white 0.10), or `--ds-border-violet` (violet 0.35) for the featured item and
the badge.** No other border colour or width. _Adoption:_ 31 border declarations use 15 distinct colours.

## 4. Surface and elevation

4.1 **Two surface levels only.** `ds-surface-1`: flat, white 0.04, 1px `--ds-border`. `ds-surface-2`: glass, white 0.06,
1px `--ds-border`, `backdrop-filter: blur(22px) saturate(140%)`, shadow `--ds-shadow-glass`
(`0 16px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)`). Hero terminal cards and the featured
comparison card use surface-2; everything else surface-1.
_Why:_ 14 hand-written card recipes differ by alpha (0.03 to 0.07), border (0.07 to 0.14), radius and blur.
_Adoption:_ 14 distinct surface signatures across about 8 component families; 36 blurred elements per render.
_Decided 2026-10-06._ Lost: unify surfaces but keep radii free; tokenise all 14.

4.2 **No glow. The only shadow is `--ds-shadow-glass` on surface-2.** Violet drop glows (`0 0 28px rgba(124,58,237,0.15)`)
are banned. _Adoption:_ 12 distinct `box-shadow` values, 4 of them glows. _Decided 2026-10-06 (default)._

4.3 **One blur strength: 22px, only on surface-2, and on the decorative orbs (80px, `ds-orbs`).** _Adoption:_ 5 `backdrop-filter`
strengths (10, 12, 20, 22, 26px). _Decided 2026-10-06 (default)._

## 5. Gradient

5.1 **Gradient is allowed only as text on the page title (`ds-h1`: white to white 0.72) and on one accent phrase
(`ds-accent`: `--ds-violet-text` through `--ds-violet-bright`).** No gradient on backgrounds, borders, buttons or
badges. _Adoption:_ 6 `background-clip: text` rules and 5 gradient backgrounds. _Decided 2026-10-06 (default)._

## 6. Layout and spacing

6.1 **Three container widths by role: narrow 560px (`ds-container--narrow`, steps and prose), medium 720px
(`ds-container--medium`, hero), wide 1040px (`ds-container--wide`, tables and card grids).** Gutters 24px, 20px under 560px.
_Adoption:_ 4 widths today (560, 720, 1040, 1100). _Decided 2026-10-06 (default)._

6.2 **Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px** (`--ds-s-1` to `--ds-s-8`). No other gap, margin or padding.
Page sections use `padding: 80px 24px 48px` (`ds-section`). _Adoption:_ 14 distinct `gap` values (2 to 40px) and 29 distinct `padding` values.
_Decided 2026-10-06 (default)._

6.3 **Sections are full-height snap sections (`ds-section`: `min-height: 100svh`, `scroll-snap-align: start`).**
_Adoption:_ 4 of 4 sections. (Three use `100vh`, one `100svh`.)

6.4 **Name by role, never by position.** No `foldN`, no numbered classes. _Adoption:_ 4 `fold*` section blocks out of order;
15 CSS classes (`gh-*`, `sr-only`) are unused dead code.

6.5 **Nothing may scroll sideways at 390px except a table inside `ds-table-wrap`, and the Airlock column of a comparison
table is always column 2 so it is visible without scrolling.** *Why:* at 390px the Airlock column of the legacy comparison
table (column 5) is out of sight, and that column is the point of the table.
*Adoption:* 0 pages scroll sideways; 1 table hides its Airlock column.

## 7. Components

7.1 **Surface card (`ds-card`):** `ds-surface-1` or `ds-surface-2`, 16px radius, padding `--ds-s-5`, title in `ds-h3`
(`ds-h3`, see 2.3). _Adoption:_ 8 hand-built card families (compare-card, step-card, tool-group, terminal-card, matrix wrap, insight, install row, badge).

7.2 **Buttons: `ds-btn--primary` (violet fill, white text) and `ds-btn--ghost` (surface-1 + border).** Both 8px radius, 13px,
weight 600, hover is a colour step only. _Adoption:_ copy buttons only today (4), one style, no primary button.

7.3 **Copy row (`ds-copy-row`):** code on the left in `ds-code` with `overflow-wrap: anywhere` (no ellipsis), Copy button on the
right. Text may wrap to two lines. _Why:_ the install command is truncated with an ellipsis at 390px, hiding the part of
the command the reader must copy. _Adoption:_ 4 copy rows, all truncating when narrow.

7.4 **Pill (`ds-pill`), badge (`ds-badge`, violet border) and tool pill:** `ds-label` text, 8px or pill radius.

7.5 **Status glyphs:** `ds-status--yes` (check), `--partial` (tilde), `--no` (cross) in `--ds-ok`, `--ds-warn`, `--ds-fail`.
Each is paired with text or an `aria-label`; colour is never the only signal.

## 8. Motion

8.1 **Only two animations exist: the drifting orbs and the scroll arrow bounce. Both stop under
`prefers-reduced-motion`.** Hover is a colour or border change only; no scale or rotate.
_Adoption:_ 4 keyframes, 5 animation declarations; one hover scales and rotates the credit image (debt).

## 9. Content

9.1 **Every claim comes from text already on the site or in the Airlock repo's README.** No invented numbers,
benchmarks, testimonials, logos or customer names. _Adoption:_ 100%.

9.2 **No emoji. Symbols only the status glyphs and `↓ ←` scroll hints.** _Adoption:_ 0 emoji, 34 symbols (check, cross, arrows).

## 10. Banned list (index)

- Colour literals outside the token block [1.2]; text greys other than `--ds-text-2` [1.3]; banned violets [1.4]
- Inline `style=`, `<style>`, page-specific CSS, classes not starting `ds-` in new pages [0.2]
- Font sizes below 12px or outside the role table [2.3]; weight 700 [2.2]; uppercase outside `ds-label` [2.4]
- Border radius outside 8, 16, pill [3.1]; border colours other than the two tokens [3.2]
- Surface recipes other than surface-1 and surface-2 [4.1]; glow, shadows other than glass [4.2]; blur other than 22px [4.3]
- Gradient on anything except the two text gradients [5.1]
- Containers other than narrow, medium, wide [6.1]; spacing off the scale [6.2]; `foldN` or positional names [6.4]
- Ellipsis-truncated code in copy rows [7.3]; tables that hide their key column at 390px [6.5]
- Hover scale or rotate; any animation other than orbs and the scroll arrow [8.1]
- Emoji; invented proof [9.1 9.2]
- Any text under 4.5:1 [1.6]

## 11. Workflow for an agent adding or changing UI

1. Read this file. Pick a recipe in `design-system/recipes/` and name it in your plan.
2. Write a first draft as a new `.html` page using only `ds-*` classes. Save it untouched.
3. Run `design-system/node_modules/.bin/tsx design-system/check-ui/index.ts <page.html>` and save the output.
4. Fix in a copy until it passes with 0 findings. Run `--render` against `vite preview`.
5. Do the recipe's "what to surface" step.

## 12. Open items (not decided, not enforced)

12.1 The install command is `brew install adamorad/tap/airlock`; Linux is mentioned only in prose. Which is primary on a
narrow screen has not been chosen.
12.2 The comparison table has 5 columns and no way to compare 2 of them on a phone. A stacked layout per competitor was
not decided.
