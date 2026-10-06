import { chromium, type Page } from "playwright";

export type Viewport = { name: string; width: number; height: number };
export type Scheme = "light" | "dark";

export const VIEWPORTS: Viewport[] = [
  { name: "1280", width: 1280, height: 800 },
  { name: "390", width: 390, height: 844 },
];
export const SCHEMES: Scheme[] = ["light", "dark"];

export type Metrics = {
  route: string;
  viewport: string;
  scheme: Scheme;
  textElements: number;
  fontSizes: Record<string, number>;
  fontWeights: Record<string, number>;
  textColors: Record<string, number>;
  radii: Record<string, number>;
  shadows: Record<string, number>;
  contrastFailures: Array<{
    selector: string;
    text: string;
    ratio: number;
    required: number;
    fg: string;
    bg: string;
    fontSize: number;
  }>;
  contrastIndeterminate: number;
  overflow: {
    docScrollWidth: number;
    viewportWidth: number;
    horizontalScroll: boolean;
    elementsBeyondViewport: string[];
  };
  features: {
    gradientBackgrounds: number;
    gradientText: number;
    backdropFilters: number;
    filterBlurs: number;
    animated: number;
  };
  clipped: Array<{ selector: string; text: string; reason: string }>;
  overlaps: Array<{ a: string; b: string; area: number }>;
};

// Runs inside the page. Must be self-contained.
function collect() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  type RGBA = [number, number, number, number];

  const parse = (css: string): RGBA => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    // canvas premultiplies on read; recover straight alpha
    const a = d[3] / 255;
    if (a === 0) return [0, 0, 0, 0];
    return [d[0], d[1], d[2], a];
  };
  const blend = (
    top: RGBA,
    under: [number, number, number],
  ): [number, number, number] => [
    top[0] * top[3] + under[0] * (1 - top[3]),
    top[1] * top[3] + under[1] * (1 - top[3]),
    top[2] * top[3] + under[2] * (1 - top[3]),
  ];
  const lum = (c: number[]) => {
    const f = (v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a: number[], b: number[]) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const hex = (c: number[]) =>
    "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  const sel = (el: Element) => {
    const parts: string[] = [];
    let n: Element | null = el;
    for (
      let i = 0;
      n && n !== document.body && i < 3;
      i++, n = n.parentElement
    ) {
      const cls = (n.getAttribute("class") || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(".");
      parts.unshift(n.tagName.toLowerCase() + (cls ? "." + cls : ""));
    }
    return parts.join(" > ");
  };

  const visible = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const hasOwnText = (el: Element) =>
    Array.from(el.childNodes).some(
      (n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0,
    );

  const bump = (o: Record<string, number>, k: string) =>
    (o[k] = (o[k] || 0) + 1);

  const pageBg: [number, number, number] = (() => {
    const b = parse(getComputedStyle(document.documentElement).backgroundColor);
    const bb = parse(getComputedStyle(document.body).backgroundColor);
    const base: [number, number, number] = [255, 255, 255];
    const afterHtml = blend(b, base);
    return blend(bb, afterHtml);
  })();

  const imgs = Array.from(
    document.querySelectorAll("img, video, canvas, iframe"),
  ).map((e) => ({
    el: e,
    r: e.getBoundingClientRect(),
  }));

  const out = {
    textElements: 0,
    fontSizes: {} as Record<string, number>,
    fontWeights: {} as Record<string, number>,
    textColors: {} as Record<string, number>,
    radii: {} as Record<string, number>,
    shadows: {} as Record<string, number>,
    contrastFailures: [] as any[],
    contrastIndeterminate: 0,
    features: { gradientBackgrounds: 0, gradientText: 0, backdropFilters: 0, filterBlurs: 0, animated: 0 },
    clipped: [] as any[],
    overlaps: [] as any[],
    elementsBeyondViewport: [] as string[],
  };

  const vw = document.documentElement.clientWidth;
  const textEls: Element[] = [];

  for (const el of Array.from(document.body.querySelectorAll("*"))) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (/gradient/.test(cs.backgroundImage)) out.features.gradientBackgrounds++;
    if (cs.backdropFilter && cs.backdropFilter !== "none") out.features.backdropFilters++;
    if (/blur/.test(cs.filter)) out.features.filterBlurs++;
    if (cs.animationName && cs.animationName !== "none") out.features.animated++;

    if (cs.borderRadius !== "0px") {
      const r = el.getBoundingClientRect();
      const first = parseFloat(cs.borderTopLeftRadius);
      const pill =
        first >= 999 || first >= Math.min(r.width, r.height) / 2 - 0.5;
      bump(out.radii, pill ? "pill/circle" : cs.borderTopLeftRadius);
    }
    if (cs.boxShadow !== "none")
      bump(
        out.shadows,
        cs.boxShadow
          .replace(/rgba?\([^)]*\)|oklab\([^)]*\)|color\([^)]*\)/g, "C")
          .trim(),
      );

    const rect = el.getBoundingClientRect();
    if (
      cs.position !== "fixed" &&
      rect.right > vw + 1 &&
      el.tagName !== "HTML"
    ) {
      // only report if no scrollable/clipping ancestor contains it
      let clippedByAncestor = false;
      for (
        let p = el.parentElement;
        p && p !== document.body;
        p = p.parentElement
      ) {
        const ps = getComputedStyle(p);
        if (ps.overflowX !== "visible") {
          clippedByAncestor = true;
          break;
        }
      }
      if (!clippedByAncestor) out.elementsBeyondViewport.push(sel(el));
    }

    if (!hasOwnText(el)) continue;
    textEls.push(el);
    out.textElements++;
    bump(out.fontSizes, cs.fontSize);
    bump(out.fontWeights, cs.fontWeight);

    // clipping
    const htmlEl = el as HTMLElement;
    const text = (el.textContent || "").trim().slice(0, 50);
    if (
      (cs.overflowX !== "visible" || cs.textOverflow === "ellipsis") &&
      htmlEl.scrollWidth > htmlEl.clientWidth + 1
    )
      out.clipped.push({
        selector: sel(el),
        text,
        reason: "own scrollWidth > clientWidth",
      });
    if (
      cs.overflowY !== "visible" &&
      htmlEl.scrollHeight > htmlEl.clientHeight + 1
    )
      out.clipped.push({
        selector: sel(el),
        text,
        reason: "own scrollHeight > clientHeight",
      });
    for (
      let p = el.parentElement;
      p && p !== document.documentElement;
      p = p.parentElement
    ) {
      const ps = getComputedStyle(p);
      if (ps.overflowX === "visible" && ps.overflowY === "visible") continue;
      const pr = p.getBoundingClientRect();
      const tr = rect;
      if (
        (ps.overflowX !== "visible" &&
          (tr.left < pr.left - 1 || tr.right > pr.right + 1)) ||
        (ps.overflowY !== "visible" &&
          (tr.top < pr.top - 1 || tr.bottom > pr.bottom + 1))
      ) {
        // ignore containers that scroll on purpose
        if (ps.overflowX === "auto" || ps.overflowX === "scroll") break;
        out.clipped.push({
          selector: sel(el),
          text,
          reason: "outside overflow-hidden ancestor " + sel(p),
        });
        break;
      }
    }

    // contrast: composite root -> el
    const chain: Element[] = [];
    for (let n: Element | null = el; n; n = n.parentElement) chain.unshift(n);
    let backdrop: [number, number, number] = pageBg;
    let cumOpacity = 1;
    let indeterminate = false;
    for (const n of chain) {
      if (n === document.documentElement || n === document.body) continue;
      const ns = getComputedStyle(n);
      const op = parseFloat(ns.opacity);
      cumOpacity *= op;
      if (ns.backgroundImage !== "none") indeterminate = true;
      const bg = parse(ns.backgroundColor);
      if (bg[3] > 0) {
        backdrop = blend([bg[0], bg[1], bg[2], bg[3] * cumOpacity], backdrop);
      }
    }
    for (const im of imgs) {
      if (im.el.contains(el) || el.contains(im.el)) continue;
      const a = im.r;
      if (
        rect.left < a.right &&
        rect.right > a.left &&
        rect.top < a.bottom &&
        rect.bottom > a.top
      ) {
        indeterminate = true;
        break;
      }
    }
    const fill = parse((cs as any).webkitTextFillColor || cs.color);
    if (fill[3] === 0 && parse(cs.color)[3] > 0) {
      indeterminate = true;
      out.features.gradientText++;
    }
    const fg = parse(cs.color);
    const effective = blend(
      [fg[0], fg[1], fg[2], fg[3] * cumOpacity],
      backdrop,
    );
    bump(out.textColors, hex(effective));
    if (indeterminate) {
      out.contrastIndeterminate++;
    } else {
      const r = ratio(effective, backdrop);
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;
      if (r < required)
        out.contrastFailures.push({
          selector: sel(el),
          text,
          ratio: Math.round(r * 100) / 100,
          required,
          fg: hex(effective),
          bg: hex(backdrop),
          fontSize: size,
        });
    }
  }

  // overlaps between text leaves (neither contains the other)
  const rects = textEls.map((e) => {
    const range = document.createRange();
    range.selectNodeContents(e);
    return { e, r: range.getBoundingClientRect() };
  });
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i],
        b = rects[j];
      if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 2 && h > 2)
        out.overlaps.push({
          a: sel(a.e),
          b: sel(b.e),
          area: Math.round(w * h),
        });
    }
  }

  return {
    ...out,
    docScrollWidth: document.documentElement.scrollWidth,
    viewportWidth: vw,
  };
}

async function settle(page: Page) {
  // trigger whileInView reveals and lazy images, then return to top
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(700);
}

export async function auditRoutes(opts: {
  base: string;
  routes: string[];
  outDir: string;
  label: string;
}): Promise<Metrics[]> {
  const { mkdirSync } = await import("node:fs");
  mkdirSync(opts.outDir, { recursive: true });
  const browser = await chromium.launch();
  const results: Metrics[] = [];
  for (const scheme of SCHEMES) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: scheme,
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      await ctx.addInitScript("window.__name = (f) => f;");
      const page = await ctx.newPage();
      for (const route of opts.routes) {
        await page.goto(opts.base + route, { waitUntil: "load" });
        await settle(page);
        const m = (await page.evaluate(collect)) as any;
        const slug =
          route === "/"
            ? "home"
            : route.replace(/\W+/g, "-").replace(/^-|-$/g, "");
        await page.screenshot({
          path: `${opts.outDir}/${opts.label}-${slug}-${vp.name}-${scheme}.png`,
          fullPage: true,
        });
        results.push({
          route,
          viewport: vp.name,
          scheme,
          textElements: m.textElements,
          fontSizes: m.fontSizes,
          fontWeights: m.fontWeights,
          textColors: m.textColors,
          radii: m.radii,
          shadows: m.shadows,
          contrastFailures: m.contrastFailures,
          contrastIndeterminate: m.contrastIndeterminate,
          features: m.features,
          overflow: {
            docScrollWidth: m.docScrollWidth,
            viewportWidth: m.viewportWidth,
            horizontalScroll: m.docScrollWidth > m.viewportWidth,
            elementsBeyondViewport: m.elementsBeyondViewport,
          },
          clipped: m.clipped,
          overlaps: m.overlaps,
        });
      }
      await ctx.close();
    }
  }
  await browser.close();
  return results;
}

export function summarise(ms: Metrics[]) {
  const union = (
    k: "fontSizes" | "fontWeights" | "textColors" | "radii" | "shadows",
  ) => {
    const o: Record<string, number> = {};
    for (const m of ms)
      for (const [key, n] of Object.entries(m[k])) o[key] = (o[key] || 0) + n;
    return o;
  };
  return {
    distinctFontSizes: Object.keys(union("fontSizes")).length,
    distinctFontWeights: Object.keys(union("fontWeights")).length,
    distinctTextColors: Object.keys(union("textColors")).length,
    distinctRadii: Object.keys(union("radii")).length,
    distinctShadows: Object.keys(union("shadows")).length,
    contrastFailures: ms.reduce((n, m) => n + m.contrastFailures.length, 0),
    horizontalScrollPages: ms.filter((m) => m.overflow.horizontalScroll).length,
    elementsBeyondViewport: ms.reduce(
      (n, m) => n + m.overflow.elementsBeyondViewport.length,
      0,
    ),
    clipped: ms.reduce((n, m) => n + m.clipped.length, 0),
    overlaps: ms.reduce((n, m) => n + m.overlaps.length, 0),
  };
}
