# A/B brief (identical for both arms)

Add a case-study page for **Lin Agent**, one of the products already listed in "Selected work".

- Route: `/work/lin-agent` (Next.js App Router, new file under `src/app/work/lin-agent/`).
- Use only text that is already on the site (`src/components/*.tsx`). Do not write new claims,
  numbers, quotes, dates or feature lists. You may reorganise, split and reuse the existing
  sentences, tags, alt text and the existing screenshot `/projects/lin.jpg`.
- Include a link to the live product (`https://shlif.app/`) and a way back to the home page.
- The page must work in light and dark mode (the site follows `prefers-color-scheme`) and at
  390px and 1280px widths, with no sideways scroll.
- Do not edit existing files (no change to the home page, nav, or global CSS). New files only.
  The page is reached by URL; no link from the home page is needed.
- Verify it builds (`npx next build`). Do not push, deploy or touch hosting config.
- Commit locally on your branch when done.

Chosen because Lin Agent has the richest existing text (a two-sentence description, three tags,
a screenshot) without needing anything the site does not already say.
