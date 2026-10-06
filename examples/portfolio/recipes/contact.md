# Recipe: contact

**Use when:** the last section of a page; one line of context and two actions.
**Do not use when:** you need a form (not designed here) or more than two actions.

## Anatomy
`Section id="contact" snap={false}` > `Reveal` flex (`flex-col` then `md:flex-row md:items-end md:justify-between`, `gap-8`)
- Left: `Heading level="section"` + `Text variant="intro"` in `flex flex-col gap-3`.
- Right `flex flex-col gap-3 sm:flex-row`: one primary `Button external` (LinkedIn) and one `outline` `Button external` (GitHub). Icons from Phosphor, 18px.

## Rules it obeys
6.3 (two variants max), 1.5, 2.3, 5.1, 6.5 (Phosphor only).

## Copy
`design-system/recipes/examples/contact.tsx`

## What to surface
Which single channel is the primary. The primary button is the route the owner wants used (LinkedIn today). State in the sentence what kind of contact is welcome ("interesting problems, collaborations, the odd consulting project") so the reader knows whether to write. Do not add an email address that is not already on the site.
