# DESIGN.md - adammorad.com

Law for any agent or human who builds UI in this repo. Numbered, dated, absolute.
Every checker finding (`design-system/check-ui`) cites a section number from this file.

Derived from the site as of commit `c88c90a` (2026-10-06). Where the site disagreed with
itself, the owner chose a winner; those rules are marked **Decided** with the options that lost.
"Adoption" is the measured count on `c88c90a` and says how much of the site already obeys the rule.

## 0. How to read this

0.1 **If neighbouring code contradicts this file, the neighbour is debt, not an example.**
Do not copy a class string from `hero.tsx`, `work.tsx`, `contact.tsx` or `ayalon-preview.tsx`
unless this file also allows it. Copy from `design-system/recipes/` instead.

0.2 **Closed vocabulary.** Product code (anything under `src/app/` and `src/components/` except
`src/components/ds/`) may only use: layout utilities (flex, grid, gap, padding, margin, width,
alignment, aspect, position) and the wrappers exported by `@/components/ds`.
Type, colour, radius, border, shadow and opacity utilities are vocabulary-only: they appear
inside `src/components/ds/` and `src/app/globals.css` and nowhere else.
_Why:_ an agent cannot pick a wrong value if the wrong value is not spelled in product code.

0.3 **No rule here is a taste preference.** Each has a number or a measured count behind it.
If a rule blocks something the content genuinely needs, change this file in its own commit
with a dated entry in section 12. Never work around it in a component.

0.4 Decided 2026-10-06 (all sections below unless stated).

## 1. Colour

1.1 **Only these tokens exist:** `background`, `foreground`, `muted`, `card`, `border`, `accent`,
`accent-foreground`, plus the named tokens added in `globals.css` under "DS tokens"
(`border-hover`, `nav`, `nav-border`, `scrim`, `scrim-strong`, `device-frame`).
Tailwind palette colours (`bg-blue-500`, `text-gray-400`, `bg-black`, `text-white`) are banned.
_Why:_ every token has a light and a dark value, so any theme works without extra code.
_Adoption:_ 8 of 8 text colours resolve to a token value (`#111113 #6b6b70 #2f5eea #fafafa` light,
four dark twins). 0 palette colours.

1.2 **No hex, rgb, hsl or `oklch` literals outside `globals.css`.**
_Why:_ a literal does not flip in dark mode; `#0b0b0d` in the phone frame is the only case today.
_Adoption:_ 1 violation (`ayalon-preview.tsx:21`). 14 token definitions in `globals.css`.

1.3 **No opacity modifier on any colour (`/40`, `/80`, `bg-black/10`, `border-accent/40`) and no
`opacity-*` utility outside `ds/button`.** If a translucent colour is needed it becomes a token.
_Why:_ opacity is how muted text sneaks in. Faded text on a faded fill has no number to audit;
the measured contrast of `muted` (5.08:1 on `background`) is only true at full alpha.
_Adoption:_ 7 colour-opacity violations (`border-accent/40` x2, `border-border/80`,
`bg-background/80`, `bg-black/10`, `bg-black/25`, `shadow-black/20`); 2 `opacity-90`
hovers (both buttons, allowed only inside `ds/button`).
_Decided 2026-10-06._ Lost: allowing opacity on non-text only.

1.4 **Secondary text is `text-muted`, one grey, nothing else.** Never lighter, never `opacity-*`,
never smaller than 12px.
_Why:_ 5.08:1 on `background` and 5.30:1 on `card` in light; 7.08:1 and 6.64:1 in dark. WCAG AA
needs 4.5:1 below 24px, and the light margin is 0.58. A lighter grey fails.
_Adoption:_ 16 `text-muted` uses, 0 other greys.

1.5 **Accent (`#2f5eea` light, `#5b8cff` dark) is for: the primary button fill, the rotating word,
link hover and link-like action text. Nothing else.** Text on an accent fill is
`accent-foreground` (5.15:1 light, 6.26:1 dark). Accent text on `background` is 5.15:1, on `card` 5.37:1.
_Why:_ accent is the single signal for "this is interactive or this is the point". Used for
decoration it stops meaning that.
_Adoption:_ 10 `text-accent` uses, all interactive or the hero word.

1.6 **No gradients, no glass, no glow, no coloured badges.**
_Adoption:_ 0 gradients, 0 glows. One `backdrop-blur` (sticky nav), which is the only blur allowed.

## 2. Type

2.1 **Family: Geist Sans (`font-sans`). Geist Mono (`font-mono`) is reserved for code and
file names and has 0 uses today.** No other family.
_Adoption:_ 100% Geist Sans.

2.2 **Weights: 400 (default) and 500 (`font-medium`). Nothing else.** No `font-bold`,
`font-semibold`, `font-light`.
_Why:_ Geist at 500 on `foreground` already clears the hierarchy; a third weight is how pages
start to shout. _Adoption:_ 53 elements at 400, 20 at 500, 0 other.

2.3 **Closed size roles.** Use the `Heading` and `Text` wrappers; never a raw `text-*` size.

| Role                | Wrapper                         | Size                     | Notes                                      |
| ------------------- | ------------------------------- | ------------------------ | ------------------------------------------ |
| Page title          | `Heading level="page"`          | 36px mobile, 48px at md+ | `font-medium tracking-tight`, one per page |
| Section title       | `Heading level="section"`       | 24px mobile, 30px at md+ | `font-medium tracking-tight`               |
| Card title          | `Heading level="card"`          | 18px                     | `font-medium tracking-tight`               |
| Featured card title | `Heading level="card-featured"` | 20px                     | Only inside a featured card                |
| Lead / intro        | `Text variant="intro"`          | 16px                     | `text-muted`, max 60ch, leading-relaxed    |
| Body                | `Text variant="body"`           | 16px                     | `text-foreground`                          |
| Card body / UI      | `Text variant="small"`          | 14px                     | `text-muted` inside cards, leading-relaxed |
| Tag                 | `Tag`                           | 12px                     | the only 12px role                         |

_Adoption:_ 27 of 27 size utilities fall inside this scale, so there are no stray sizes.
Role consistency is the problem: card titles use 3 sizes (`text-lg` x1, `text-xl` x1, `text-base` x1).
_Decided 2026-10-06:_ two sizes by role, so repo cards move from base (16px) to 18px.
Lost: one size for all cards; keeping all three.

2.4 **Headings use `tracking-tight`; body never tracks.** No `uppercase`, no `tracking-wide`.
_Adoption:_ 0 uppercase, 0 wide tracking.

2.5 **Sentence case for all headings, buttons and tags that are not proper nouns.**
_Adoption:_ all headings, buttons and tags comply (counted by hand on c88c90a).

## 3. Shape

3.1 **Radius tokens, exactly three:** `rounded-2xl` (16px) for containers and cards,
`rounded-full` for buttons, tags and icon buttons, and `--radius-device` (44px outer) with
`--radius-device-inner` (36px) for the phone frame only. No other `rounded-*`, no `rounded-[..]`.
_Why:_ 10 of 10 cards already use 16px and about 32 elements use the pill; the phone frame
needs hardware-shaped corners that no other element should borrow.
_Adoption:_ 10/10 cards 16px. 2 arbitrary radii (`rounded-[2.75rem]`, `rounded-[2.25rem]`),
both on the phone frame, so they become the device tokens.
_Decided 2026-10-06._ Lost: two tokens with no device exception (would change the frame's look).

3.2 **Borders: 1px, `border-border`. Hover border is `border-hover`.** No border colour other than
those two, no 2px borders.
_Adoption:_ every card, tag and outline button has a 1px `border-border` today.

3.3 **Dividers between page sections use `border-t` only, on the lower section.** No `border-b` on
a section.
_Why:_ the hero's `border-b` plus `#work`'s `border-t` stacks two lines at the same seam.
_Adoption:_ 3 of 4 sections comply (`#work`, `#open-source`, `#contact`); 1 violation (`hero.tsx:9`).

## 4. Elevation

4.1 **The site is flat. Shadows are banned.** The one exception is `shadow-device` (token
`--shadow-device`) on the phone frame in `ds/device-frame`. Play-button shadow, card shadow,
drop shadow and `shadow-*` utilities are not allowed.
_Why:_ 10 of 10 cards, both nav states and every button use borders, not elevation. Shadows on
muted-grey cards are how AI output starts to look like every other site.
_Adoption:_ 2 elements have shadows (`shadow-2xl` on the frame, `shadow-lg` on Play); 1 survives.
_Decided 2026-10-06._ Lost: banning shadows entirely (changes the frame's look).

## 5. Layout and spacing

5.1 **Page container:** `mx-auto w-full max-w-5xl px-6`, always, via `Section`. No other max width
for page content except `max-w-intro` (60ch) on intro text.
_Adoption:_ 5 of 5 content containers; the nav uses the same `max-w-5xl` without `w-full`.

5.2 **Section rhythm:** `py-12`, `snap-section` for full-height sections on md+, and
`border-t` between sections (see 3.3). Footer is `py-8`.
_Adoption:_ 4 of 4 sections use `py-12`; footer `py-8`.

5.3 **Card grids:** `gap-5`, `grid-cols-1`, then `md:grid-cols-2`, then `lg:grid-cols-3` for repos or
`lg:grid-cols-4` for products. Cards stack to one column at 390px.
_Adoption:_ both grids use `gap-5`.

5.4 **Card padding and inner gap:** `p-5` with `gap-3`. One value for all cards, including featured.
_Adoption:_ 9 of 10 cards `p-5` (featured is `p-6`); inner gap `gap-3` x4 products,
`gap-2` x5 repos, `gap-3` featured.
_Decided 2026-10-06 (default, no objection)._

5.5 **Intro paragraphs** are `Text variant="intro"` with `max-w-intro` (60ch). `max-w-md` for body copy
is banned.
_Adoption:_ 2 of 4 intro paragraphs use `max-w-[60ch]`; hero and contact use `max-w-md`.
_Decided 2026-10-06 (default)._

5.6 **No arbitrary values (`[...]`) in product code** except grid column templates inside a
recipe. _Why:_ arbitrary values are the escape hatch that defeats a closed vocabulary.
_Adoption:_ 7 arbitrary values: 2 radii (3.1), 1 colour (1.2), 1 grid template (hero),
1 hover scale (moves into `ds/card`), 2 `max-w-[60ch]` (become `max-w-intro`).

5.7 **No inline `style={{...}}` in product code** except values that are computed at runtime and
cannot be a class (e.g. the iframe scale transform).
_Adoption:_ 3 inline styles, all computed from constants in `ayalon-preview.tsx` and
`rotating-word.tsx`.

5.8 **Nothing may scroll sideways at 390px.** Text may not be clipped or overlap other text.
_Adoption:_ 0 horizontal-scroll pages, 0 clipped, 0 overlaps in 4 renders (2 widths x 2 themes).

## 6. Components

6.1 **Card** (`Card`): `rounded-2xl border border-border bg-card`, hover `border-hover`,
screenshot on top (aspect-video, `object-top`) when the item has one.
_Adoption:_ 10 cards, built from one string (`CARD` in `work.tsx`).

6.2 **Card link signal: a top-right arrow only.** Product and featured cards show `ArrowUpRight`;
repo cards show `GithubLogo`. No "Visit site" or "View on GitHub" line.
_Why:_ the whole card is the link; a text line repeats what the arrow and the title already say
and makes repo cards and product cards different heights for no reason.
_Adoption:_ 5 of 10 cards have a CTA line (4 products, 1 featured); 5 comply.
_Decided 2026-10-06._ Lost: a CTA line on every card; keeping the mix.

6.3 **Button (`Button`): two variants.** `primary` (accent fill, `accent-foreground` text) and
`outline` (border, `foreground` text). Both `rounded-full px-5 py-2.5 text-sm font-medium`,
hover `opacity-90` or `border-hover`. No scale, no shadow, no third variant.
_Adoption:_ 4 buttons written inline (hero, LinkedIn, GitHub, Play), 0 through a component, with 3
different hover behaviours (`opacity-90` x2, `scale-105`+shadow x1, border x1).
_Decided 2026-10-06._ Lost: keeping Play's scale and shadow.

6.4 **Tag (`Tag`):** `rounded-full border border-border px-2.5 py-1 text-xs text-muted`. Neutral only,
never coloured. _Adoption:_ 28 tags, all one style.

6.5 **Icons** come from `@phosphor-icons/react` only, sized 14, 16, 18 or 20, `text-muted` unless
interactive. No emoji as icons or bullets. _Adoption:_ 0 emoji.

## 7. Motion

7.1 Entrance motion is `Reveal` (fade plus 20px rise, once, 0.6s) and nothing else. Hover motion is
colour or border change only (150ms default `transition-colors`) plus the 1.02 screenshot zoom inside
`Card`. It must stay readable with `prefers-reduced-motion` (Reveal already does).
_Adoption:_ 6 reveal sites in code (hero, contact, 4 in `work.tsx`), all use `Reveal`.

## 8. Content

8.1 **Every claim on a page comes from text already on the site or in the project's own repo.** No
invented numbers, user counts, ratings, testimonials, dates or logos.
_Why:_ a portfolio that overstates is worse than a bland one. _Adoption:_ 100%.

8.2 **No em dashes, no smart quotes, no decorative symbols in copy.** _Adoption:_ 0 em dashes.

8.3 **Copy is plain: say what it does, who for, and how it is built.** Product cards are one to two
sentences; repo cards one to two sentences; tags are 2 to 3 nouns.

## 9. Banned list (index)

Each is a fail in `check-ui`. Number in brackets is the rule.

- Gradient backgrounds or gradient text [1.6]
- Glass, glow, blurred blobs; `backdrop-blur` outside the nav [1.6]
- Shadows of any kind except `shadow-device` [4.1]
- Opacity on colours, `opacity-*` outside Button, `text-gray-*`, `text-slate-*`, `text-white`, `bg-black` [1.1 1.3]
- Hex/rgb literals outside `globals.css` [1.2]
- Arbitrary sizes, radii, colours (`text-[13px]`, `rounded-[20px]`) [2.3 3.1 5.6]
- `font-bold`, `font-semibold`, `font-light`, `uppercase`, `tracking-wide` [2.2 2.4]
- Radii other than 16px, pill and device [3.1]
- `border-b` on sections; borders other than 1px `border-border` [3.2 3.3]
- Emoji in copy or as icons [6.5 8.2]
- Stat strips, "trusted by", testimonials, fake metrics, "Learn more" CTAs [8.1]
- More than two button variants; buttons written inline in product code [6.3]
- CTA text lines on cards [6.2]
- Hover scale on anything except the card screenshot [7.1]
- Inline `style` for static values [5.7]
- Horizontal scroll, clipped text, overlapping text at 390px [5.8]
- Any text below 4.5:1 contrast in light or dark [1.4 10.1]

## 10. Themes and widths

10.1 **Light and dark both ship.** Dark follows `prefers-color-scheme` (no toggle). Every colour is a
token, so nothing needs a `dark:` variant; `dark:` utilities are banned.
_Why:_ a `dark:` override duplicates a decision the token already made. _Adoption:_ 0 `dark:`.

10.2 **Verify at 1280 and 390, light and dark.** `design-system/render-audit.ts` and
`check-ui --render` do this. Text contrast must be at least 4.5:1 (3:1 for 24px or larger).
_Adoption:_ 0 failures on 4 renders.

## 11. Workflow for an agent adding or changing UI

1. Read this file. Pick a recipe in `design-system/recipes/`. Name it in your plan.
2. Write a first draft using only `@/components/ds` and layout utilities. Save it untouched.
3. Run `node design-system/node_modules/.bin/tsx design-system/check-ui/index.ts <paths>` and save the output.
4. Fix in a copy until it passes with zero findings. Run `--render` against the running site.
5. Do the recipe's "what to surface" step: decide what in this content the reader should see first.

## 12. Open items (not decided, not enforced)

12.1 Card borders and the outline button border are 1.22:1 (light) and 1.26:1 (dark) against the page,
below the 3:1 guideline for UI boundaries. Cards are decorative edges; the outline button is a
control. Not decided on 2026-10-06; no rule until the owner chooses.
