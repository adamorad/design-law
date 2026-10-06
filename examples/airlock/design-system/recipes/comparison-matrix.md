# Recipe: comparison-matrix

**Use when:** comparing Airlock to 2 to 4 categories across 3 to 6 yes / partial / no capabilities.
**Do not use when:** cells need sentences (use comparison-cards) or there are more than 6 columns.

## Anatomy
Header block (`ds-label`, `ds-h2` with `ds-accent`, `ds-body`) then `div.ds-surface-2.ds-table-wrap` > `table.ds-table`.
Column order: capability, **Airlock first**, then the others. Cells are `span.ds-status.ds-status--yes|partial|no` with an `aria-label`. Legend line in `ds-small` repeats the three glyphs.

## Rules it obeys
6.5 (the Airlock column is second, so it is visible at 390px), 7.5 (status never colour-only), 1.5, 2.3, 4.1.

## Copy
`design-system/recipes/examples/comparison-matrix.html`

## What to surface
Put the column the reader came for where a phone shows it, which is column 2, not column 5. The legacy page puts Airlock last, so at 390px the answer is behind a horizontal scroll. Order rows so Airlock's differentiators (TTL auto-expiry, cross-session locks) come first.
