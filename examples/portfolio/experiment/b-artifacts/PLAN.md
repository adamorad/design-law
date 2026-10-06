# Plan (arm b): /work/lin-agent

## Recipes
- Top of page (title, lead, actions, visual): recipe `hero`. Left column: `Heading level="page"`, `Text variant="intro"`, buttons. Right column: the screenshot in a `Card` (the hero recipe says a screenshot goes in a `Card`). `Section id="top" first`.
- Screenshot + remaining description + tags: recipe `featured-project` / `project-grid` card form, via `Card kind="site"` with `image`, `imageAlt`, `tags` (arrow-only link signal, 6.2).
- Actions: `Button` primary (external, live product) and `Button` outline (back to home). Two variants max (6.3). Same two-action pattern as `contact` recipe.
- No recipe covers a detail page body; none is needed. The page is one hero Section composed from DESIGN.md 2.3, 5.1, 5.2, 5.5, 6.1-6.5. The hero recipe notes detail pages use `Heading level="page"` in `Section first`, which is what is done here. No Nav (its links are `#work` hash links that do not work off the home page, and it contains debt); back link is an outline Button to `/`.

## What to surface
Reader sees first: "publishing only after you approve the exact text". It is the distinctive fact (human approval of exact text), and the first sentence of the existing description already carries it, so it becomes the page lead (intro) directly under the title "Lin Agent". The second sentence ("Runs on LinkedIn's official API from a single dashboard.") goes in the card beside the screenshot as the how-it-is-built line, followed by the three existing tags. Primary action: open the live product (shlif.app). Secondary: back to home.

## Content rule
Only existing strings from src/components/work.tsx (description split in two, tags, imageAlt, image, href). UI labels only: "Open Lin Agent", "Back to home".
