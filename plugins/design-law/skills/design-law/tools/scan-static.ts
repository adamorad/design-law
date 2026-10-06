import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? "src";
const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) && files.push(p);
  }
};
walk(root);

type Hit = { file: string; line: number; text: string };
const patterns: Record<string, RegExp> = {
  colorLiterals: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g,
  arbitraryTailwind: /(?<![\w-])[a-z][\w:-]*-\[[^\]\s]+\]/g,
  inlineStyles: /style=\{\{/g,
  opacityMutedColor: /\b(?:text|border|bg|ring|shadow)-[a-z-]+\/\d+/g,
  opacityUtility: /(?<![\w-])opacity-\d+/g,
  shadowUtility: /(?<![\w-])shadow(?:-[a-z0-9]+)?(?![\w-])/g,
  roundedUtility: /(?<![\w-])rounded(?:-[a-z0-9]+)?(?![\w-])/g,
  textSizeUtility: /(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/g,
};
const result: Record<string, { count: number; byValue: Record<string, number>; hits: Hit[] }> = {};
for (const k of Object.keys(patterns)) result[k] = { count: 0, byValue: {}, hits: [] };

for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((text, i) => {
    for (const [k, re] of Object.entries(patterns)) {
      for (const m of text.matchAll(re)) {
        const r = result[k];
        r.count++;
        r.byValue[m[0]] = (r.byValue[m[0]] || 0) + 1;
        r.hits.push({ file, line: i + 1, text: text.trim().slice(0, 110) });
      }
    }
  });
}

// duplicate class strings: any quoted/backticked class run of >=6 utilities seen 2+ times
const dup: Record<string, string[]> = {};
for (const file of files.filter((f) => f.endsWith(".tsx"))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/["`]([a-z0-9:\[\]\/.\-_ ]{40,})["`]/g)) {
    const toks = m[1].trim().split(/\s+/);
    if (toks.length < 6) continue;
    const key = [...toks].sort().join(" ");
    (dup[key] ||= []).push(file);
  }
}
const duplicateClassStrings = Object.entries(dup)
  .filter(([, v]) => v.length > 1)
  .map(([k, v]) => ({ classes: k, occurrences: v.length, files: v }));

const out = { files: files.length, ...Object.fromEntries(Object.entries(result).map(([k, v]) => [k, { count: v.count, byValue: v.byValue, hits: v.hits }])), duplicateClassStrings };
writeFileSync(process.argv[3] ?? "design-system/baseline-static.json", JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(result)) console.log(k.padEnd(20), v.count, JSON.stringify(v.byValue).slice(0, 300));
console.log("duplicateClassStrings", duplicateClassStrings.length);
