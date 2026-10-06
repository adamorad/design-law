# Recipe: tool-groups

**Use when:** a list of named identifiers grouped by purpose (the 22 MCP tools in 5 groups).
**Do not use when:** items need descriptions (use cards).

## Anatomy
Header block then `div.ds-stack` (`role="list"`) of `ds-surface-1.ds-card[role=listitem]`; each has `span.ds-label` and `div.ds-row` of `span.ds-pill`.

## Rules it obeys
2.3 (pills are 12px), 2.4 (uppercase only on `ds-label`), 3.1 (8px radius pill), 6.1 (narrow container).

## Copy
`design-system/recipes/examples/tool-groups.html`

## What to surface
Order groups by how an agent adopts them: Locks first (the product's reason to exist), then Notes and State, Presence, Events, Tasks. The group count and tool count in the heading (5 groups, 22 tools) must match the pills on the page.
