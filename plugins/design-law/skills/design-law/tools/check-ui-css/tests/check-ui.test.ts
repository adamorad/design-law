import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { checkFile, checkPaths } from "../static";
import { ALL_RULES, RENDER_RULES } from "../rules";

const root = resolve(import.meta.dirname, "../../..");
const ds = join(root, "design-system");
const dsCss = process.env.DS_CSS ?? join(root, "src/ds.css");
const opts = { cwd: root, dsCss };

test("every recipe example passes with zero findings", () => {
  const dir = join(ds, "recipes/examples");
  assert.ok(readdirSync(dir).filter((f) => f.endsWith(".html")).length >= 5);
  const findings = checkPaths([dir], opts);
  assert.deepEqual(findings, [], JSON.stringify(findings, null, 1));
});

test("ds.css itself has no colour literal outside the :root token block", () => {
  const css = readFileSync(dsCss, "utf8");
  const afterRoot = css.slice(css.indexOf("}", css.indexOf(":root")) + 1);
  const hits = afterRoot.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) ?? [];
  assert.deepEqual(hits, []);
});

test("the don't fixtures are flagged on every tagged line, and every static rule fires", () => {
  const all: ReturnType<typeof checkFile> = [];
  for (const f of ["dont.html", "dont.css"]) {
    const file = join(import.meta.dirname, "../fixtures", f);
    const lines = readFileSync(file, "utf8").split("\n");
    const tagged = lines.map((l, i) => (/<!-- bad -->|\/\* bad/.test(l) ? i + 1 : 0)).filter(Boolean);
    const findings = checkFile(file, opts);
    all.push(...findings);
    const flagged = new Set(findings.map((x) => x.line));
    const missed = tagged.filter((n) => !flagged.has(n));
    assert.deepEqual(missed, [], `${f}: unflagged lines ${missed.join(",")}`);
  }
  const fired = new Set(all.map((x) => x.rule));
  const silent = ALL_RULES.map((r) => r.id).filter((id) => !fired.has(id));
  assert.deepEqual(silent, [], `rules never fired on the fixtures: ${silent.join(",")}`);
});

test("every rule cites a section that exists in DESIGN.md and carries a fix", () => {
  const md = readFileSync(join(ds, "DESIGN.md"), "utf8");
  const sections = new Set([...md.matchAll(/^(\d+\.\d+)\s/gm)].map((m) => m[1]));
  for (const r of [...ALL_RULES, ...RENDER_RULES]) {
    assert.ok(sections.has(r.section), `${r.id} cites missing section ${r.section}`);
    assert.ok(r.fix.length > 10, `${r.id} has no fix`);
  }
});
