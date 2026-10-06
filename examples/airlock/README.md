# Worked example: airlock-web.vercel.app

A complete run of the skill on a one-page dark Vite site (vanilla HTML and CSS), 2026-10-06. Source site: `airlock-web/` in https://github.com/adamorad/airlock.

- `design-system/DESIGN.md`: the law the owner approved (conflicts C1 to C6 decided, C7 to C11 defaults)
- `airlock-web/src/ds.css`, `ds.js`, `vite.config.js`: the closed vocabulary and multi-page build config it produced
- `design-system/recipes/`: five recipes with HTML examples that pass the checker
- `design-system/experiment/`: the A/B brief, both arms' pages, arm B's plan, first draft, checker output and notes
- `design-system/shots/`, `experiment/a-shots`, `experiment/b-shots`: dark renders (the site has no light mode)
- `design-system/baseline.json`: baseline render and static measurements
- `design-system/EXPERIMENT.md`: metrics, what the checker caught and missed, what A did better, limits, top 5 fixes

Paths inside these files (`airlock-web/src/ds.css`, `design-system/...`) refer to the original repo layout. The checker used is [`tools/check-ui-css`](../../plugins/design-law/skills/design-law/tools/check-ui-css).
