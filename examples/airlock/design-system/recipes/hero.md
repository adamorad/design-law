# Recipe: hero

**Use when:** the first screen needs one claim, one install command and visible proof.
**Do not use when:** the page is a detail page (use a `ds-h1` plus `ds-body` inside `ds-container--medium`, no terminals).

## Anatomy
`section.ds-section#top` > `div.ds-container.ds-container--medium.ds-center`
- `span.ds-label.ds-badge`, `h1.ds-h1` containing one `span.ds-accent` phrase, `p.ds-body`.
- `div.ds-surface-1.ds-copy-row`: `code.ds-code` (never ellipsised, 7.3) plus `button.ds-btn.ds-btn--ghost.ds-copy-btn[data-copy]`.
- Proof: `div.ds-grid` of `ds-surface-2.ds-terminal` cards (`aria-hidden` when decorative).
- `p.ds-small` compatibility line, then `a.ds-scroll-hint` to the next section.

## Rules it obeys
2.3 (one h1), 5.1 (only gradient text is h1 and accent), 4.1 (terminals are surface-2), 7.3, 1.3 (secondary text AA), 6.1 (medium container).

## Copy
`design-system/recipes/examples/hero.html`

## What to surface
Show the conflict before the claim. The strongest thing the site already has is the pair of terminals: A gets `locked: true`, B gets `locked: false` and `held_by: "subagent-A"`. Make sure the pair is visible without scrolling at 1280 and that the install command is the first interactive element after the headline. Do not add numbers that are not already on the site.
