# A/B brief (identical for both arms)

Add a detail page for the **Locks** tool group, one of the five groups already shown in the "22 MCP Tools" section of the airlock-web home page.

- URL: `/tools/locks.html`. The site is a Vite multi-page app; the page must be built by `npx vite build` (a second HTML page needs the build to include it; if the repo has no `vite.config.js` or does not already include extra pages, add what is needed as a NEW file).
- Use only text that is already on the site (`airlock-web/index.html`): the group name, the five tool names, the hero terminal lines, the comparison rows and table rows about locking, the daemon sentences, the install steps. Do not write new claims, numbers, benchmarks, quotes or feature descriptions. You may reorganise, split and reuse existing sentences.
- Include a link back to the home page, and a way to copy the install command.
- The site is dark-only. The page must work at 390px and 1280px widths, with no sideways scroll except a deliberate table scroller.
- Do not edit existing files (index.html, src/style.css, src/main.js). New files only.
- Verify with `npx vite build` and look at the result with `npx vite preview` on your own port. Do not push, deploy or touch hosting config.
- Commit locally on your branch when done.

Chosen because Locks has the richest existing text (five tools, a two-terminal conflict demo, a comparison row, two matrix rows) without needing anything the site does not already say.
