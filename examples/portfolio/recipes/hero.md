# Recipe: hero

**Use when:** the first screen of a page needs one claim, one action and one visual.
**Do not use when:** the page is a detail page that already has a title (use `Heading level="page"` in a plain `Section first`), or there is no visual (drop the right column, keep the left).

## Anatomy
`Section id="top" first` > `Reveal` grid (`lg:grid-cols-[1.1fr_0.9fr]`, `gap-12`, `items-center`)
- Left, `flex flex-col items-start gap-6`: `Heading level="page"` (one per page), `Text variant="intro"`, one `Button` (primary).
- Right: the visual. A phone-shaped visual goes in `DeviceFrame width={288}`; a screenshot goes in a `Card`.

## Rules it obeys
2.3 (page title 36/48px), 1.5 (accent only on the button), 3.3 (`first` means no border-t), 4.1 (only the device shadow), 5.1, 5.5 (60ch intro), 6.3 (one primary button).

## Copy
`design-system/recipes/examples/hero.tsx`

## What to surface
Pick the one sentence a stranger could repeat after five seconds. On this site the page claims "AI agent runtimes, local-first developer tools, independent products"; the visual is the thing they can touch (Ayalon Drive is playable). Lead with what can be used now, not with a list of skills. Check that the single button leads to the evidence (`#work`), not to a bio.
