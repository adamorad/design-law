# Recipe: project-grid

**Use when:** 2 to 4 live products, each with a screenshot, a one to two sentence description and 2 to 3 tags.
**Do not use when:** items have no screenshot (use repo-list) or there is exactly one (use featured-project). Do not use for more than 4 across; add rows instead.

## Anatomy
`Section id title intro` > grid `grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4` > `Reveal className="h-full"` (delay `i * 0.08`) > `Card kind="site"` with `image`, `imageAlt`, `tags`.

## Rules it obeys
2.3 (card title 18px), 5.3 (gap-5, breakpoints), 5.4 (p-5, gap-3), 6.1, 6.2 (arrow only, no "Visit site" line), 6.4 (tags neutral), 3.1 (16px radius), 7.1.

## Copy
`design-system/recipes/examples/project-grid.tsx`

## What to surface
Per card, the first sentence must carry the distinctive fact that is already in the text: for StackFollow it is "a weekly email every Monday", for RealCy "260+ new-build developments on an interactive map". Order the cards by which the reader should open first, not by date. If two descriptions begin with the same verb, rewrite one from the site's existing words.
