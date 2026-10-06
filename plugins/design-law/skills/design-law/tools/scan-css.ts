import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";

const [cssFile, htmlFile, out] = process.argv.slice(2);
const css = readFileSync(cssFile, "utf8");
const html = readFileSync(htmlFile, "utf8");
const root = postcss.parse(css);

const bump = (o: Record<string, number>, k: string) => (o[k] = (o[k] || 0) + 1);
const r = {
  rules: 0,
  customProperties: [] as string[],
  colorLiteralsOutsideRoot: {} as Record<string, number>,
  colorLiteralsInRoot: 0,
  fontSizes: {} as Record<string, number>,
  fontWeights: {} as Record<string, number>,
  fontFamilies: {} as Record<string, number>,
  radii: {} as Record<string, number>,
  boxShadows: {} as Record<string, number>,
  gradients: 0,
  gradientText: 0,
  backdropFilters: {} as Record<string, number>,
  filters: {} as Record<string, number>,
  animations: [] as string[],
  keyframes: 0,
  important: 0,
  textTransform: 0,
  letterSpacing: {} as Record<string, number>,
  opacityDecls: {} as Record<string, number>,
  tokenUse: { varRefs: 0, literalColorDecls: 0 },
  surfaceSignatures: {} as Record<string, string[]>,
  mediaQueries: [] as string[],
};
const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

root.walkAtRules((a) => {
  if (a.name === "keyframes") r.keyframes++;
  if (a.name === "media") r.mediaQueries.push(a.params);
});
root.walkRules((rule) => {
  if (rule.parent && (rule.parent as any).name === "keyframes") return;
  r.rules++;
  const isRoot = rule.selector.trim() === ":root";
  const decls: Record<string, string> = {};
  rule.walkDecls((d) => {
    decls[d.prop] = d.value;
    if (d.important) r.important++;
    if (d.prop.startsWith("--")) {
      r.customProperties.push(d.prop);
      if (isRoot) r.colorLiteralsInRoot += (d.value.match(COLOR) || []).length;
      return;
    }
    const colors = d.value.match(COLOR) || [];
    for (const c of colors) bump(r.colorLiteralsOutsideRoot, c.replace(/\s+/g, ""));
    if (colors.length) r.tokenUse.literalColorDecls++;
    if (/var\(--/.test(d.value)) r.tokenUse.varRefs++;
    if (d.prop === "font-size") bump(r.fontSizes, d.value);
    if (d.prop === "font-weight") bump(r.fontWeights, d.value);
    if (d.prop === "font-family") bump(r.fontFamilies, d.value.split(",")[0].trim());
    if (d.prop === "border-radius") bump(r.radii, d.value);
    if (d.prop === "box-shadow") bump(r.boxShadows, d.value);
    if (/gradient/.test(d.value)) r.gradients++;
    if (d.prop.endsWith("background-clip") && d.value === "text") r.gradientText++;
    if (d.prop === "backdrop-filter") bump(r.backdropFilters, d.value);
    if (d.prop === "filter") bump(r.filters, d.value);
    if (d.prop === "animation") r.animations.push(rule.selector);
    if (d.prop === "text-transform") r.textTransform++;
    if (d.prop === "letter-spacing") bump(r.letterSpacing, d.value);
    if (d.prop === "opacity") bump(r.opacityDecls, d.value);
  });
  if (decls["backdrop-filter"] || (decls["background"]?.startsWith("rgba(255,255,255") && decls["border"])) {
    const sig = [decls["background"], decls["border"], decls["border-radius"], decls["backdrop-filter"] ? "blur" : "flat"].join(" | ");
    (r.surfaceSignatures[sig] ||= []).push(rule.selector);
  }
});

// HTML
const inlineStyles = [...html.matchAll(/\sstyle="([^"]*)"/g)].map((m) => m[1].slice(0, 80));
const htmlClasses = new Set([...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/).filter(Boolean)));
const cssClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const unusedCss = [...cssClasses].filter((c) => !htmlClasses.has(c) && !/^(copied)$/.test(c));
const undefinedInCss = [...htmlClasses].filter((c) => !cssClasses.has(c));
const svgInline = (html.match(/<svg/g) || []).length;
const emoji = (html.match(/[←-⇿☀-➿]/g) || []).length;
const pseudoNumbered = [...htmlClasses].filter((c) => /^fold\d/.test(c)).length;

const result = {
  css: { file: cssFile, lines: css.split("\n").length, ...r, distinct: {
    fontSizes: Object.keys(r.fontSizes).length, fontWeights: Object.keys(r.fontWeights).length,
    radii: Object.keys(r.radii).length, boxShadows: Object.keys(r.boxShadows).length,
    colorLiteralsOutsideRoot: Object.keys(r.colorLiteralsOutsideRoot).length,
    totalColorLiteralUses: Object.values(r.colorLiteralsOutsideRoot).reduce((a, b) => a + b, 0),
    surfaceSignatures: Object.keys(r.surfaceSignatures).length,
  } },
  html: { file: htmlFile, inlineStyles: inlineStyles.length, inlineStyleSamples: inlineStyles, htmlClasses: htmlClasses.size, unusedCssClasses: unusedCss, classesWithoutCss: undefinedInCss, inlineSvgs: svgInline, symbolsInCopy: emoji, numberedFoldClasses: pseudoNumbered },
};
writeFileSync(out, JSON.stringify(result, null, 1));
console.log(JSON.stringify({ ...result.css.distinct, rules: r.rules, customProperties: r.customProperties.length, tokenVarRefs: r.tokenUse.varRefs, literalColorDecls: r.tokenUse.literalColorDecls, gradients: r.gradients, gradientText: r.gradientText, important: r.important, keyframes: r.keyframes, animations: r.animations.length, inlineStyles: result.html.inlineStyles, unusedCss: unusedCss.length, symbolsInCopy: emoji }, null, 0));
