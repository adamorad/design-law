# Recipes

Recurring page shapes on adammorad.com. Pick one by name in your plan. If nothing fits, compose
from DESIGN.md sections 1-8 and say in the plan that no recipe applied and why.

Examples in `examples/` are real, typechecked components built only from `@/components/ds`.
They are the copy source (DESIGN.md 0.1): do NOT copy from `src/components/hero.tsx`, `work.tsx`,
`contact.tsx` or `ayalon-preview.tsx`, which predate this system.

| Recipe | Example | Use for |
|---|---|---|
| hero | `examples/hero.tsx` | top of a page: one claim, one action, one visual |
| project-grid | `examples/project-grid.tsx` | 2-4 products with screenshots |
| featured-project | `examples/featured-project.tsx` | one item that deserves full width |
| repo-list | `examples/repo-list.tsx` | many small items without screenshots |
| contact | `examples/contact.tsx` | last section, two actions |

Every recipe ends with "What to surface". It is a required step, not decoration: the recipe fixes
the form; you still decide what in this content the reader must see first.
