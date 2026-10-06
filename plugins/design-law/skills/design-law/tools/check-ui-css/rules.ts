export type Rule = { id: string; section: string; title: string; fix: string };

const R = (id: string, section: string, title: string, fix: string): Rule => ({ id, section, title, fix });

export const RULES: Record<string, Rule> = {
  UI01: R("UI01", "0.2", "Class not from the ds-* vocabulary", "Use only classes that start with ds- and exist in your ds.css. Pick the matching recipe in design-system/recipes/."),
  UI02: R("UI02", "0.2", "ds-* class that ds.css does not define", "Typo or invented class. Use an existing ds-* class, or add the variant to ds.css and DESIGN.md first."),
  UI03: R("UI03", "0.2", "Inline style attribute", "Remove style=. Every value lives in ds.css as a token or ds-* class."),
  UI04: R("UI04", "0.2", "<style> element in a page", "Remove it. Pages carry no CSS; add a ds-* class to ds.css and DESIGN.md if one is missing."),
  UI05: R("UI05", "0.2", "Stylesheet or script other than the shell", "Pages load fonts, then <script type=module src=/src/ds.js>. No page CSS, no inline scripts."),
  UI06: R("UI06", "9.2", "Emoji or decorative symbol in copy", "Use plain text. Only the status glyphs and the arrows used for scroll hints are allowed."),
  UI07: R("UI07", "9.1", "Invented proof or marketing filler", "Use only claims already on the site or in the Airlock README. Remove social proof, numbers and hype words."),
  UI08: R("UI08", "2.3", "Heading element without its ds class, h4-h6, or more than one h1", "h1.ds-h1 (one per page), h2.ds-h2, h3.ds-h3. No h4-h6."),
  UI09: R("UI09", "6.5", "Table outside ds-table-wrap or without ds-table", "Wrap as div.ds-surface-2.ds-table-wrap > table.ds-table so it scrolls inside its panel."),
  UI10: R("UI10", "7.2", "Raw <button> without ds-btn", "Use class ds-btn plus ds-btn--primary or ds-btn--ghost (copy buttons also ds-copy-btn)."),
  UI11: R("UI11", "7.5", "Status glyph without an accessible name", "Add aria-label=\"Yes\" | \"No\" | \"Possible with effort\" to span.ds-status, or aria-hidden=\"true\" when adjacent text already says it."),
  UI12: R("UI12", "0.2", "Presentational element or attribute", "Remove <b>, <i>, <center>, <font>, align= and bgcolor=. Use ds-* classes."),
  UI13: R("UI13", "6.4", "Positional section name (foldN, section-N)", "Name by role. The ds-section class already does the layout."),
  UI14: R("UI14", "7.3", "Copy row without a wrapping ds-copy-row, or code without an id", "Use div.ds-surface-1.ds-copy-row > code.ds-code#id + button.ds-copy-btn[data-copy=id]."),
  UI15: R("UI15", "1.2", "Colour literal outside the token block", "Use a --ds-* token. If a colour is missing, add a token in ds.css and DESIGN.md section 1."),
  UI16: R("UI16", "2.3", "Font size outside the role table", "Use ds-h1, ds-h2, ds-h3, ds-body, ds-small, ds-code or ds-label. Nothing under 12px."),
  UI17: R("UI17", "2.2", "Font weight other than 400, 500, 600", "Use 400, 500 or 600 (roles in 2.3 set them)."),
  UI18: R("UI18", "3.1", "Border radius outside 8px, 16px, pill, 50%", "Use var(--ds-r-sm), var(--ds-r-md) or var(--ds-r-pill)."),
  UI19: R("UI19", "4.2", "Shadow, glow, blur or filter outside the surface tokens", "Use ds-surface-1 or ds-surface-2. Only --ds-shadow-glass and --ds-blur exist."),
  UI20: R("UI20", "5.1", "Gradient other than the two text gradients", "Use a flat token fill. Gradient text only through ds-h1 and ds-accent."),
  UI21: R("UI21", "6.2", "Spacing off the 4/8/12/16/24/32/48/64 scale", "Use var(--ds-s-1) to var(--ds-s-8) or a ds-gap-* class."),
  UI22: R("UI22", "8.1", "Animation, keyframes or hover transform", "Hover is a colour or border change only. Only the orbs and the scroll arrow animate."),
  UI23: R("UI23", "2.4", "Uppercase or letter-spacing outside ds-label", "Use class ds-label for labels. No text-transform or letter-spacing elsewhere."),
  UI24: R("UI24", "0.2", "Page-specific stylesheet", "Delete it. New pages use ds.css only; add the missing variant to ds.css and DESIGN.md."),
};

export const ALL_RULES = Object.values(RULES);

// Render rules (check-ui --render)
export const RENDER_RULES: Rule[] = [
  R("R01", "1.6", "Text under 4.5:1 contrast (3:1 at 24px+)", "Use --ds-text, --ds-text-2, --ds-violet-text or --ds-violet-bright on dark surfaces."),
  R("R02", "6.5", "Page scrolls sideways or element extends past the viewport", "Use fluid layout and ds-container--*; tables scroll only inside ds-table-wrap."),
  R("R03", "7.3", "Text clipped by its container", "Let it wrap (ds-copy-row code wraps with overflow-wrap:anywhere). No fixed heights or ellipsis on copy."),
  R("R04", "6.5", "Text overlapping text", "Remove absolute positioning or negative margins between text blocks."),
  R("R05", "6.5", "Scrolling table hides its Airlock column at 390px", "Put the Airlock column second so it is visible without scrolling."),
];
