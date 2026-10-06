# DESIGN.md - <project>

Law for any agent or human who builds UI in this repo. Numbered, dated, absolute.
Every checker finding (`design-system/check-ui`) cites a section number from this file.

Derived from the site as of commit `<sha>` (<date>). Where the site disagreed with itself, the owner
chose a winner; those rules are marked **Decided** with the options that lost.
"Adoption" is the measured count on `<sha>`: how much of the site already obeys the rule.

## 0. How to read this

0.1 **If neighbouring code contradicts this file, the neighbour is debt, not an example.**
Do not copy a class string from a file that predates this system unless this file also allows it.
Copy from `design-system/recipes/` instead.

0.2 **Closed vocabulary.** Product code (everything except `<vocabulary folder>`) may only use layout
utilities (flex, grid, gap, padding, margin, width, alignment, aspect, position) and the wrappers
exported by `<vocabulary import path>`. Type, colour, radius, border, shadow and opacity utilities live
in the vocabulary folder and the global stylesheet and nowhere else.
*Why:* an agent cannot pick a wrong value if the wrong value is not spelled in product code.

0.3 No rule here is a taste preference. Each has a number or a measured count behind it. If a rule blocks
something the content genuinely needs, change this file in its own commit with a dated entry in the
last section. Never work around it in a component.

0.4 Decided <date> (all sections below unless stated).

## 1. Colour

1.1 **Only these tokens exist:** <list>. Palette colours (`bg-blue-500`, `text-gray-400`, `text-white`)
are banned.
*Why:* every token has a light and a dark value.
*Adoption:* <n of n>.

1.2 **No hex, rgb, hsl or oklch literals outside the global stylesheet.**
*Adoption:* <n> violations (<file:line>).

1.3 **No opacity modifier on any colour, no `opacity-*` outside the button wrapper.**
*Why:* faded text has no audited contrast; muted <x> is <ratio>:1 only at full alpha.
*Adoption:* <n>.
*Decided <date>.* Lost: <option>.

1.4 **Secondary text is one grey, `<token>`.** Contrast: <ratio>:1 on <bg> (light), <ratio>:1 (dark).
AA needs 4.5:1 below 24px.

1.5 **Accent is for:** <list>. Nothing else.

1.6 **No gradients, no glass, no glow, no coloured badges** (unless the site already has them: then list where).

## 2. Type
2.1 Families. 2.2 Weights (list; everything else banned). 2.3 **Closed size roles** as a table:
role, wrapper, size, notes. 2.4 Tracking, case. 2.5 Sentence case.

## 3. Shape
3.1 Radius tokens, exactly <n>, with where each applies. 3.2 Border width and colour. 3.3 Dividers.

## 4. Elevation
4.1 Shadows: banned, or the named exceptions.

## 5. Layout and spacing
5.1 Page container. 5.2 Section rhythm. 5.3 Grids and gaps. 5.4 Card padding. 5.5 Intro width.
5.6 No arbitrary values. 5.7 No static inline styles. 5.8 No sideways scroll, clipped or overlapping text at the narrowest supported width.

## 6. Components
6.1 Card. 6.2 Link signal. 6.3 Button (variants and hover). 6.4 Tag. 6.5 Icons (one set, sizes, no emoji).

## 7. Motion
7.1 The one entrance animation, hover = colour or border only, reduced-motion behaviour.

## 8. Content
8.1 Every claim comes from text already on the site or the project's own repo. No invented numbers, ratings, testimonials.
8.2 No em dashes, smart quotes, decorative symbols. 8.3 Plain copy.

## 9. Banned list (index)
One line per ban with its section in brackets. Each is a checker fail.

## 10. Themes and widths
10.1 Dark mode mechanism and the ban on `dark:` overrides when tokens already flip.
10.2 Verify at <widths>, light and dark. Contrast floor.

## 11. Workflow for an agent adding or changing UI
1. Read this file. Pick a recipe and name it in the plan.
2. Write a first draft using only the vocabulary and layout utilities. Save it untouched.
3. Run the checker and save the output.
4. Fix in a copy until it passes with zero findings. Run `--render` against the running site.
5. Do the recipe's "what to surface" step.

## 12. Open items (not decided, not enforced)
Things measured but not yet chosen by the owner, with the numbers.
