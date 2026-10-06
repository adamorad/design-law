import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { parse } from "parse5";
import postcss from "postcss";
import { RULES, type Rule } from "./rules";

export type Finding = { file: string; line: number; rule: string; section: string; title: string; fix: string; snippet: string };

const ALLOWED_SYMBOLS = /[✓✗↓←~]/g;
const SYMBOLS = /[\p{Extended_Pictographic}←-⇿☀-➿⬀-⯿•●▶]/u;
const PROOF = /\b(?:trusted by|testimonials?|\d[\d,.]*\s?[kKmM]?\+?\s+(?:happy |active |satisfied )?(?:users|customers|clients|developers|downloads|stars|companies|teams)|supercharge|revolutionary|seamless(?:ly)?|cutting-edge|game-?chang(?:ing|er)|unlock|10x|learn more|get started|blazing)\b/i;
const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const SCALE = new Set([0, 4, 8, 12, 16, 24, 32, 48, 64]);
const FONT_SIZES = new Set(["12px", "13px", "14px", "16px", "clamp(2rem, 5vw, 3.2rem)", "clamp(1.5rem, 3.5vw, 2.2rem)"]);

export function dsClasses(dsCssPath: string): Set<string> {
  const css = readFileSync(dsCssPath, "utf8");
  return new Set([...css.matchAll(/\.(ds-[\w-]+)/g)].map((m) => m[1]));
}

export function listFiles(paths: string[]): string[] {
  const out: string[] = [];
  const walk = (p: string) => {
    if (statSync(p).isDirectory()) {
      for (const f of readdirSync(p)) if (f !== "node_modules" && f !== "dist") walk(join(p, f));
    } else if (/\.(html|css)$/.test(p)) out.push(p);
  };
  paths.forEach(walk);
  return out;
}

type Ctx = { file: string; lines: string[]; out: Finding[]; seen: Set<string> };
const add = (c: Ctx, rule: Rule, line: number, extra = "") => {
  const key = `${rule.id}:${line}:${extra}`;
  if (c.seen.has(key)) return;
  c.seen.add(key);
  c.out.push({ file: c.file, line, rule: rule.id, section: rule.section, title: extra ? `${rule.title} (${extra})` : rule.title, fix: rule.fix, snippet: (c.lines[line - 1] ?? "").trim().slice(0, 120) });
};

function checkHtml(src: string, c: Ctx, ds: Set<string>) {
  const doc: any = parse(src, { sourceCodeLocationInfo: true });
  let h1 = 0;
  const walk = (n: any, ancestors: any[]) => {
    const line = n.sourceCodeLocation?.startLine ?? 1;
    if (n.nodeName === "#text") {
      const t: string = n.value;
      if (!t.trim()) return;
      const parent = ancestors[ancestors.length - 1]?.nodeName;
      if (parent === "script" || parent === "style" || parent === "title") return;
      const clean = t.replace(ALLOWED_SYMBOLS, "");
      if (SYMBOLS.test(clean)) add(c, RULES.UI06, line, t.trim().slice(0, 30));
      if (PROOF.test(t)) add(c, RULES.UI07, line, t.trim().slice(0, 40));
      return;
    }
    if (n.attrs) {
      const attr = (name: string): string | undefined => n.attrs.find((a: any) => a.name === name)?.value;
      const attrLine = (name: string) => n.sourceCodeLocation?.attrs?.[name]?.startLine ?? line;
      const tag = n.nodeName;
      const classes = (attr("class") ?? "").split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        if (/^(?:fold|section)-?\d/.test(cls)) add(c, RULES.UI13, attrLine("class"), cls);
        else if (!cls.startsWith("ds-")) add(c, RULES.UI01, attrLine("class"), cls);
        else if (!ds.has(cls)) add(c, RULES.UI02, attrLine("class"), cls);
      }
      if (attr("style") !== undefined) add(c, RULES.UI03, attrLine("style"));
      if (tag === "style") add(c, RULES.UI04, line);
      if (tag === "link" && attr("rel") === "stylesheet") {
        const href = attr("href") ?? "";
        if (!/fonts\.googleapis\.com/.test(href) && !/ds\.css$/.test(href)) add(c, RULES.UI05, line, href);
      }
      if (tag === "script" && !(attr("src") && /\/src\/ds\.js$/.test(attr("src")!))) add(c, RULES.UI05, line, "script");
      if (/^h[1-6]$/.test(tag)) {
        if (tag === "h1") h1++;
        const want = { h1: "ds-h1", h2: "ds-h2", h3: "ds-h3" }[tag as string];
        if (!want || !classes.includes(want)) add(c, RULES.UI08, line, `<${tag}>`);
      }
      if (tag === "table") {
        const wrapped = ancestors.some((a) => (a.attrs?.find((x: any) => x.name === "class")?.value ?? "").split(/\s+/).includes("ds-table-wrap"));
        if (!wrapped || !classes.includes("ds-table")) add(c, RULES.UI09, line);
      }
      if (tag === "button" && !classes.includes("ds-btn")) add(c, RULES.UI10, line);
      if (classes.includes("ds-status") && attr("aria-label") === undefined && attr("aria-hidden") === undefined) add(c, RULES.UI11, line);
      if (["b", "i", "center", "font", "u", "marquee", "blink"].includes(tag) || attr("align") !== undefined || attr("bgcolor") !== undefined) add(c, RULES.UI12, line, `<${tag}>`);
      if (tag === "code" && ancestors.some((a) => (a.attrs?.find((x: any) => x.name === "class")?.value ?? "").split(/\s+/).includes("ds-copy-row")) && !attr("id")) add(c, RULES.UI14, line);
      if (classes.includes("ds-copy-btn") && !ancestors.some((a) => (a.attrs?.find((x: any) => x.name === "class")?.value ?? "").split(/\s+/).includes("ds-copy-row"))) add(c, RULES.UI14, line, "copy button outside ds-copy-row");
      for (const a of n.attrs) if (["alt", "aria-label", "title", "content"].includes(a.name) && PROOF.test(a.value)) add(c, RULES.UI07, attrLine(a.name), a.value.slice(0, 40));
    }
    for (const ch of n.childNodes ?? []) walk(ch, n.attrs ? [...ancestors, n] : ancestors);
    if (n.content) walk(n.content, ancestors);
  };
  walk(doc, []);
  if (h1 > 1) add(c, RULES.UI08, 1, `${h1} h1 elements`);
}

function checkCss(src: string, c: Ctx, isDs: boolean) {
  if (isDs) return;
  const root = postcss.parse(src);
  const firstRule = root.nodes.find((n) => n.type === "rule");
  add(c, RULES.UI24, firstRule?.source?.start?.line ?? 1);
  root.walkAtRules("keyframes", (a) => add(c, RULES.UI22, a.source?.start?.line ?? 1, "@keyframes"));
  root.walkDecls((d) => {
    const line = d.source?.start?.line ?? 1;
    const p = d.prop, v = d.value.trim();
    const inRoot = d.parent && (d.parent as any).selector === ":root" && p.startsWith("--");
    if (!inRoot && COLOR.test(v)) add(c, RULES.UI15, line, v.slice(0, 30));
    if (inRoot && COLOR.test(v)) add(c, RULES.UI15, line, p);
    if (p === "font-size" && !FONT_SIZES.has(v) && !v.startsWith("var(")) add(c, RULES.UI16, line, v);
    if (p === "font-weight" && !["400", "500", "600", "normal"].includes(v) && !v.startsWith("var(")) add(c, RULES.UI17, line, v);
    if (p.startsWith("border") && p.endsWith("radius") && !/^(var\(--ds-r-(sm|md|pill)\)|8px|16px|100px|50%|0|inherit)$/.test(v)) add(c, RULES.UI18, line, v);
    if (p === "box-shadow" && !/^(none|var\(--ds-shadow-glass\))$/.test(v)) add(c, RULES.UI19, line, v.slice(0, 30));
    if ((p === "backdrop-filter" || p === "-webkit-backdrop-filter") && !/^(none|var\(--ds-blur\))$/.test(v)) add(c, RULES.UI19, line, v);
    if (p === "filter" && v !== "none") add(c, RULES.UI19, line, v);
    if (/gradient\(/.test(v) && !inRoot) add(c, RULES.UI20, line, v.slice(0, 30));
    if (/^(padding|margin)(-|$)|^(row-|column-)?gap$/.test(p)) {
      for (const t of v.split(/\s+/)) {
        const m = t.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)$/);
        if (m && !(m[2] === "px" && SCALE.has(Math.abs(parseFloat(m[1]))))) add(c, RULES.UI21, line, t);
      }
    }
    if (p === "animation" || p === "animation-name") add(c, RULES.UI22, line, p);
    if ((p === "transform" || (p === "transition" && /transform/.test(v))) && /:hover|:focus/.test((d.parent as any)?.selector ?? "")) add(c, RULES.UI22, line, "hover transform");
    if (p === "transition" && /transform/.test(v)) add(c, RULES.UI22, line, "transition: transform");
    if ((p === "text-transform" && v !== "none") || p === "letter-spacing") add(c, RULES.UI23, line, `${p}: ${v}`);
  });
}

export function checkFile(file: string, opts: { cwd?: string; dsCss: string }): Finding[] {
  const cwd = opts.cwd ?? process.cwd();
  const src = readFileSync(file, "utf8");
  const c: Ctx = { file: relative(cwd, file), lines: src.split("\n"), out: [], seen: new Set() };
  if (file.endsWith(".html")) checkHtml(src, c, dsClasses(opts.dsCss));
  else checkCss(src, c, basename(file) === "ds.css");
  return c.out.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
}

export function checkPaths(paths: string[], opts: { cwd?: string; dsCss: string }): Finding[] {
  return listFiles(paths).flatMap((f) => checkFile(f, opts));
}
