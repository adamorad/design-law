# NOTES (arm B)

- check-1 passed with 0 findings on the first draft; no fix iterations were needed (draft-1 equals the final file).
- Not caught by the checker, seen in screenshots: at 1280 the two hero terminals stack in a narrow column instead of sitting side by side. `.ds-grid` inside `.ds-center` (align-items: center) shrinks to content width, so auto-fit gives one column. The recipe's hero example has the same structure, so the vocabulary has no way to make the pair side by side inside a medium container without a new class.
- `.ds-accent` is `display: block`, so it always breaks onto its own line; "Locks." and the accent phrase cannot share a line.
- `ds-scroll-hint` as a text link at the end of each section is the only "next" affordance; there is no vocabulary for a section nav or a tool-page header with a back link (used `ds-btn--ghost` for "Airlock home").
- Full-height snap sections (6.3) leave large empty gaps on short sections (the one-card tool list) at 1280.
- `ds-code` inside `ds-body` prose works but has no inline-code treatment (no background).
- No recipe for a detail page; hero.md only says "ds-h1 plus ds-body in ds-container--medium".
