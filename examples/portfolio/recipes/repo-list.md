# Recipe: repo-list

**Use when:** 3 or more small items (GitHub repos, tools, templates) with no screenshots.
**Do not use when:** items need a picture to be understood (project-grid).

## Anatomy
`Section id title intro` > grid `grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3` > `Reveal className="h-full"` (delay `(i % 3) * 0.08`) > `Card kind="repo"` (no image). GitHub icon is the link signal.

## Rules it obeys
2.3 (card title 18px), 5.3, 5.4, 6.1, 6.2 (icon only), 6.4, 8.1 (no stars or download counts unless on the site already).

## Copy
`design-system/recipes/examples/repo-list.tsx`

## What to surface
Group or order by what the reader would most likely want: agent tooling first (Airlock, PortPeek), the rest after. Tags must make the stack scannable (language, protocol, platform) so a reader can find "Swift" or "MCP" without reading descriptions. Never invent popularity numbers.
