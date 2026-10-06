# Notes (arm b)
- check-1 exit status 0, 0 findings on first draft; no iterations needed (draft-1 == final page.tsx).
- Render check: 0 findings (4 renders).
- Not caught by checker: duplicate title ("Lin Agent" appears as h1 and as card h3); card title is redundant on a detail page.
- Not caught: card link repeats the "Open Lin Agent" button target (two links to same URL, fine).
- DESIGN/recipes friction: no recipe for a detail page body; hero recipe says screenshot goes in a Card but Card forces title/description/tags and an external link, so the h1 and card title duplicate. Nav is hash-link only and cannot be reused off the home page; Footer not used.
