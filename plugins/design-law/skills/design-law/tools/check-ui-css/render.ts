import { chromium } from "playwright";
import { auditRoutes, type Metrics } from "../lib/render-metrics";
import { RENDER_RULES } from "./rules";

export type RenderFinding = { route: string; viewport: string; scheme: string; section: string; rule: string; message: string; fix: string };

const rule = (id: string) => RENDER_RULES.find((r) => r.id === id)!;

export async function renderCheck(opts: { base: string; routes: string[]; outDir: string }): Promise<{ findings: RenderFinding[]; metrics: Metrics[] }> {
  const metrics = await auditRoutes({ base: opts.base, routes: opts.routes, outDir: opts.outDir, label: "check" });
  const findings: RenderFinding[] = [];
  const push = (m: { route: string; viewport: string; scheme: string }, id: string, message: string) =>
    findings.push({ route: m.route, viewport: m.viewport, scheme: m.scheme, rule: id, section: rule(id).section, message, fix: rule(id).fix });
  for (const m of metrics) {
    for (const c of m.contrastFailures) push(m, "R01", `contrast ${c.ratio}:1 < ${c.required}:1 on "${c.text}" (${c.selector}, fg ${c.fg} on ${c.bg}, ${c.fontSize}px)`);
    if (m.overflow.horizontalScroll) push(m, "R02", `page scrolls sideways: scrollWidth ${m.overflow.docScrollWidth} > ${m.overflow.viewportWidth}`);
    for (const s of m.overflow.elementsBeyondViewport) if (!/\.ds-orb|\.orb/.test(s)) push(m, "R02", `element extends past viewport: ${s}`);
    for (const c of m.clipped) if (!/visually-hidden|sr-only/.test(c.selector)) push(m, "R03", `text clipped: "${c.text}" (${c.selector}; ${c.reason})`);
    for (const o of m.overlaps) push(m, "R04", `text overlaps text (${o.area}px2): ${o.a} x ${o.b}`);
  }

  // R05: a table that scrolls sideways at 390px must show its key column (the header containing "Airlock").
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark", reducedMotion: "reduce" });
  await ctx.addInitScript("window.__name = (f) => f;");
  const page = await ctx.newPage();
  for (const route of opts.routes) {
    await page.goto(opts.base + route, { waitUntil: "load" });
    const hidden = await page.evaluate(() => {
      const bad: string[] = [];
      document.querySelectorAll(".ds-table-wrap, .compare-matrix-wrap").forEach((w) => {
        if (w.scrollWidth <= w.clientWidth + 1) return;
        const th = Array.from(w.querySelectorAll("thead th")).find((x) => /airlock/i.test(x.textContent || "")) as HTMLElement | undefined;
        if (!th) return;
        const wr = w.getBoundingClientRect(), r = th.getBoundingClientRect();
        if (r.left < wr.left - 1 || r.right > wr.right + 1) bad.push(`"${(th.textContent || "").trim().slice(0, 30)}" key column is outside the visible ${Math.round(wr.width)}px`);
      });
      return bad;
    });
    for (const b of hidden) push({ route, viewport: "390", scheme: "dark" }, "R05", b);
  }
  await browser.close();
  return { findings, metrics };
}
