# Recipe: featured-project

**Use when:** one item is clearly the strongest and deserves full width, with a screenshot on the left (md+) and text on the right.
**Do not use when:** you would feature more than one thing on the same page, or it has no screenshot.

## Anatomy
`Section id` > `Reveal className="h-full"` > `Card featured kind=... image imageAlt`.
Featured only changes the layout (row on md+) and the title size (`card-featured`, 20px). Padding and tags are the same as any card (5.4).

## Rules it obeys
2.3 (featured title is the only 20px role), 5.4, 6.1, 6.2, 3.1.

## Copy
`design-system/recipes/examples/featured-project.tsx`. In the real page, put it in the same `Section` as the repo-list grid with `md:col-span-2 lg:col-span-3`, so the two read as one list.

## What to surface
The claim that makes this item different from its neighbours. For CV Tailor it is "nothing leaves your computer" (local model, no API key). That clause leads the description. If the item is featured but its first clause is generic, either rewrite it from the site's own words or it should not be featured.
