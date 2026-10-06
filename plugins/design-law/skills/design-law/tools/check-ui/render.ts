import { auditRoutes, type Metrics } from "../lib/render-metrics";

export type RenderFinding = {
  route: string;
  viewport: string;
  scheme: string;
  section: string;
  rule: string;
  message: string;
  fix: string;
};

export async function renderCheck(opts: { base: string; routes: string[]; outDir: string }): Promise<{ findings: RenderFinding[]; metrics: Metrics[] }> {
  const metrics = await auditRoutes({ base: opts.base, routes: opts.routes, outDir: opts.outDir, label: "check" });
  const findings: RenderFinding[] = [];
  for (const m of metrics) {
    const base = { route: m.route, viewport: m.viewport, scheme: m.scheme };
    for (const c of m.contrastFailures)
      findings.push({ ...base, rule: "R01", section: "10.2", message: `contrast ${c.ratio}:1 < ${c.required}:1 on "${c.text}" (${c.selector}, fg ${c.fg} on ${c.bg}, ${c.fontSize}px)`, fix: "Use a token pair from section 1 (muted on background/card is at least 5.08:1). Do not fade text." });
    if (m.overflow.horizontalScroll)
      findings.push({ ...base, rule: "R02", section: "5.8", message: `page scrolls sideways: scrollWidth ${m.overflow.docScrollWidth} > ${m.overflow.viewportWidth}`, fix: "Find the widest element; use fluid layout, wrap text, remove fixed widths." });
    for (const s of m.overflow.elementsBeyondViewport)
      findings.push({ ...base, rule: "R02", section: "5.8", message: `element extends past viewport: ${s}`, fix: "Constrain with w-full / min-w-0 / flex-wrap, or change to a stacked layout at this width." });
    for (const c of m.clipped)
      findings.push({ ...base, rule: "R03", section: "5.8", message: `text clipped: "${c.text}" (${c.selector}; ${c.reason})`, fix: "Remove fixed heights and overflow-hidden on text containers, or let the text wrap." });
    for (const o of m.overlaps)
      findings.push({ ...base, rule: "R04", section: "5.8", message: `text overlaps text (${o.area}px2): ${o.a} x ${o.b}`, fix: "Remove absolute positioning or negative margins between text blocks." });
  }
  return { findings, metrics };
}
