import { readFileSync } from "node:fs";
import type { ComputedRecord, Metrics } from "./render-metrics";

// design-law.json: the allowed computed values, with the DESIGN.md section each cites.
export type Law = {
  sections: { fontSize: string; fontWeight: string; fontFamily: string; radius: string; shadow: string };
  fontSizes: { px: number[]; fluid?: Array<{ min: number; max: number }>; tolerance?: number };
  fontWeights: number[];
  fontFamilies: string[];
  radii: { px: number[]; pill?: boolean; circle?: boolean };
  shadows: string[]; // normalised ("C" replaces colours), "none" always allowed
  ignoreSelectors?: string[]; // regex sources, e.g. decorative orbs, visually hidden
};

export type ComputedFinding = {
  route: string;
  viewport: string;
  scheme: string;
  rule: string;
  section: string;
  message: string;
  count: number;
};

export const loadLaw = (path: string): Law => JSON.parse(readFileSync(path, "utf8"));

const RULE = { fontSize: "R06", fontWeight: "R07", fontFamily: "R08", radius: "R09", shadow: "R10" } as const;

export const COMPUTED_RULES = [
  { id: "R06", prop: "fontSize", title: "Computed font size outside the law", fix: "Use a role class from the size table; never a raw size. Nothing below the minimum." },
  { id: "R07", prop: "fontWeight", title: "Computed font weight outside the law", fix: "Roles set weights. Also set weights on element defaults (th, strong, b, h1-h6) so browser defaults cannot leak in." },
  { id: "R08", prop: "fontFamily", title: "Computed font family outside the law", fix: "Use the two families the law names; check code, pre, button and input defaults." },
  { id: "R09", prop: "radius", title: "Computed border radius outside the law", fix: "Use the radius tokens only." },
  { id: "R10", prop: "shadow", title: "Computed shadow outside the law", fix: "Use the surface tokens; no ad-hoc shadows or glows." },
];

export function checkComputed(metrics: Metrics[], law: Law): ComputedFinding[] {
  const tol = law.fontSizes.tolerance ?? 0.6;
  const ignore = (law.ignoreSelectors ?? []).map((r) => new RegExp(r));
  const out: ComputedFinding[] = [];
  for (const m of metrics) {
    const groups = new Map<string, { rec: ComputedRecord; n: number; prop: keyof typeof RULE; value: string }>();
    const flag = (rec: ComputedRecord, prop: keyof typeof RULE, value: string) => {
      const key = `${prop}|${value}`;
      const g = groups.get(key);
      if (g) g.n++;
      else groups.set(key, { rec, n: 1, prop, value });
    };
    for (const rec of m.computed ?? []) {
      if (ignore.some((r) => r.test(rec.selector))) continue;
      if (rec.hasText) {
        const okSize = law.fontSizes.px.some((p) => Math.abs(p - rec.fontSize) <= tol) || (law.fontSizes.fluid ?? []).some((f) => rec.fontSize >= f.min - tol && rec.fontSize <= f.max + tol);
        if (!okSize) flag(rec, "fontSize", `${rec.fontSize}px`);
        if (!law.fontWeights.includes(rec.fontWeight)) flag(rec, "fontWeight", String(rec.fontWeight));
        if (!law.fontFamilies.includes(rec.fontFamily)) flag(rec, "fontFamily", rec.fontFamily);
      }
      if (rec.radius !== "none") {
        const px = parseFloat(rec.radius);
        const ok = rec.radius === "pill" ? !!law.radii.pill : rec.radius === "circle" ? !!law.radii.circle : law.radii.px.some((p) => Math.abs(p - px) < 0.5);
        if (!ok) flag(rec, "radius", rec.radius);
      }
      if (rec.shadow !== "none" && !law.shadows.includes(rec.shadow)) flag(rec, "shadow", rec.shadow);
    }
    for (const g of groups.values()) {
      const rule = RULE[g.prop];
      out.push({
        route: m.route,
        viewport: m.viewport,
        scheme: m.scheme,
        rule,
        section: law.sections[g.prop],
        count: g.n,
        message: `${g.prop} ${g.value} x${g.n}, e.g. "${g.rec.text || g.rec.selector}" (${g.rec.selector})`,
      });
    }
  }
  return out;
}
