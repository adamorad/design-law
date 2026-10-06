# Writing the vocabulary

Goal: the wrong value cannot be typed in product code. Put every colour, size, radius, border, shadow and
opacity decision inside a small set of wrappers and tokens.

## Tokens (one place)
- Tailwind v4: CSS variables on `:root` plus a `@theme inline` block in the global stylesheet. Dark values in
  a `prefers-color-scheme` block (or the project's existing mechanism).
- Replace every opacity-faded or literal value the law bans with a token that renders the same, e.g.
  `--border-hover: color-mix(in oklab, var(--accent) 40%, transparent)`. Compare renders before and after.
- Tailwind v4 maps `--color-x`, `--radius-x`, `--shadow-x`, `--container-x` to `bg-x`, `rounded-x`,
  `shadow-x`, `max-w-x`.

## Wrappers (one folder, one index)
Minimum set: `Heading` (level -> tag + size), `Text` (variant -> size + colour + leading), `Button`
(variant -> fill/border, `href` renders `a`, `onClick` renders `button`), `Card`, `Tag`/`TagList`,
`Section` (id, optional title and intro, container, rhythm, border-t). Add one-offs the site really has.

Rules for wrappers:
- Props are a closed union of variants, never a free class string for type or colour. Layout-only
  `className` passthrough is acceptable.
- Variants map 1:1 to rows in DESIGN.md. If you add a variant, add the row first.
- Wrappers are the only files allowed to use type, colour, radius, border, shadow and opacity utilities.
  The checker exempts that folder.
- Do not migrate existing pages in this phase.

## Gotchas seen in practice
- Turbopack rejects a symlinked `node_modules` (`points out of the filesystem root`); run `npm ci` in each worktree.
- The project's typecheck may include `design-system/**/*.ts`; use extensionless imports so it passes.
- Tailwind v4 scans the whole repo: add `@source not "../../design-system"` so fixtures with banned classes
  do not end up in the CSS bundle.
- `tsx` injects `__name` into functions passed to `page.evaluate`; define `window.__name = f => f` with
  `addInitScript` (the shipped render script already does).
