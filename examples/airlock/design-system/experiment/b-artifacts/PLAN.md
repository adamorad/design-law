# PLAN: /tools/locks.html (arm B)

## Recipes per part
| Part | Recipe | Notes |
|---|---|---|
| Header + install | none fits (hero says detail pages use ds-h1 + ds-body in ds-container--medium, no terminals) | composed from DESIGN.md 2.3, 6.1, 7.2, 7.3; back link is a ds-btn--ghost, install is ds-copy-row |
| Tool list | tool-groups | one group only: label "Locks", five ds-pill |
| Conflict demo | hero (the terminal pair only) | surface-2 ds-terminal cards, reused text of the two hero terminals |
| Locking rows vs others | comparison-matrix | 3 locking rows, Airlock is column 2 (6.5) |
| Approaches | comparison-cards | rows "Resource locking" and "Multi-agent safe" for Shell, Session-Scoped Skills, Airlock (featured) |
| Daemon explanation | none (composed: ds-surface-1 ds-card with ds-h3 + ds-small, 7.1) | sentences split from the "landscape" insight |
| Install | install-steps | 3 steps, 1 sentence each |

## What to surface
First: the conflict. Group name Locks as h1, one sentence ("Agent A locks npm-install, Agent B sees it's held and backs off. No conflicts."), then the install command (first interactive element after the back link), then the two terminals (A gets locked: true, B gets locked: false, held_by "subagent-A") immediately, because that pair is the product's proof. Next the five tool names (what the reader would call), then the differentiators: cross-session locks and TTL auto-expiry first in the matrix, since the recipe says those are Airlock's differentiators.
