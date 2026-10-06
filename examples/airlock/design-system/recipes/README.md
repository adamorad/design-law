# Recipes

Recurring shapes on airlock-web. Name one in your plan. If none fits, compose from DESIGN.md and say so.

Examples in `examples/` are complete HTML pages built only from `ds-*` classes (DESIGN.md 0.2). They link
`../../../airlock-web/src/ds.css` so they render from `file://`. **In a real page** put the page under
`airlock-web/` (Vite picks up every `.html` there) and use this head instead of the `<link>` to ds.css:

```html
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>...</title>
  <!-- Inter 400/500/600 and JetBrains Mono 400/500 from Google Fonts, as in index.html -->
  <script type="module" src="/src/ds.js"></script>
</head>
<body> <div class="ds-orbs" aria-hidden="true"> ds-orb--1, ds-orb--2, ds-orb--3 </div> sections... </body>
```

Do not copy from `index.html` or `src/style.css`: they predate the law (DESIGN.md 0.1).

| Recipe | Example | Use for |
|---|---|---|
| hero | `examples/hero.html` | top of a page: badge, claim, tagline, install command, proof |
| comparison-matrix | `examples/comparison-matrix.html` | one capability grid, 3 to 6 rows, 3 to 5 columns |
| comparison-cards | `examples/comparison-cards.html` | 2 to 3 approaches side by side, one recommended |
| tool-groups | `examples/tool-groups.html` | named groups of monospace items |
| install-steps | `examples/install-steps.html` | numbered steps, each with a copyable command |

Every recipe ends with "What to surface".
