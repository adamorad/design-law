# Recipe: install-steps

**Use when:** a numbered sequence where each step has one copyable command.
**Do not use when:** a step needs more than one command (split it).

## Anatomy
`div.ds-container.ds-container--narrow` > one `ds-surface-1.ds-card` per step: `div.ds-row` with `span.ds-label.ds-badge` (number) and `h3.ds-h3`, `p.ds-small`, then `div.ds-surface-1.ds-copy-row` with `code.ds-code#id` and `button.ds-btn.ds-btn--ghost.ds-copy-btn[data-copy=id]`. End with `a.ds-scroll-hint`.

## Rules it obeys
7.3 (commands wrap, never truncate), 7.2, 2.3, 6.1.

## Copy
`design-system/recipes/examples/install-steps.html`

## What to surface
The command a reader must not get wrong. Each `code` shows its full text at 390px (wrapping if needed), and step 1 is the brew command that the hero also shows. Keep the description to one sentence taken from the site.
