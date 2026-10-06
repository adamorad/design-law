# Recipe: comparison-cards

**Use when:** 2 to 3 approaches, each with a few labelled rows, and one is the recommendation.
**Do not use when:** you need a dense grid (comparison-matrix).

## Anatomy
Header block then `div.ds-grid` of `ds-surface-1.ds-card`. The recommended one is `ds-surface-2.ds-card.ds-card--featured` with `span.ds-label.ds-badge` "Recommended". Rows: `ul.ds-rows` > `li.ds-rows__item` with `span.ds-dot.ds-dot--yes|partial|no` and `span.ds-small`.

## Rules it obeys
4.1 (two surface levels; glass only on the featured card), 3.2 (violet border only on featured), 7.5, 2.3.

## Copy
`design-system/recipes/examples/comparison-cards.html`

## What to surface
Each row names the capability and then the verdict in the site's own words ("No, race conditions", "named, with TTL"). Lead each card with the row where the approaches differ most, and keep the recommended card's rows in the same order as the others so the eye can compare.
