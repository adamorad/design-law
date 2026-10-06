import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { renderCheck } from "../render";

const fixtures = resolve(import.meta.dirname, "../fixtures");
const out = mkdtempSync(join(tmpdir(), "check-ui-"));

test("render check flags contrast, overflow, clipping, overlap and a hidden key column on the don't page", async () => {
  const { findings } = await renderCheck({ base: "file://" + fixtures, routes: ["/render-dont.html"], outDir: out });
  const at390 = findings.filter((f) => f.viewport === "390");
  for (const rule of ["R01", "R02", "R03", "R04", "R05"]) {
    assert.ok(at390.some((f) => f.rule === rule), `${rule} not raised at 390: ${JSON.stringify([...new Set(findings.map((f) => f.rule))])}`);
  }
});

test("render check passes a clean page at both widths", async () => {
  const { findings } = await renderCheck({ base: "file://" + fixtures, routes: ["/render-clean.html"], outDir: out });
  assert.deepEqual(findings, [], JSON.stringify(findings, null, 1));
});

const law = resolve(fixtures, "law-test.json");

test("computed-law check flags size, weight, family, radius and shadow outside the law (including browser defaults)", async () => {
  const { findings } = await renderCheck({ base: "file://" + fixtures, routes: ["/render-law-dont.html"], outDir: out, law });
  const rules = new Set(findings.map((f) => f.rule));
  for (const r of ["R06", "R07", "R08", "R09", "R10"]) assert.ok(rules.has(r), `${r} not raised: ${[...rules]}`);
  assert.ok(findings.some((f) => f.rule === "R07" && /fontWeight 700 x2/.test(f.message)), "th default weight (700) was not counted with the explicit 700 paragraph");
});

test("computed-law check passes a page that stays inside the law", async () => {
  const { findings } = await renderCheck({ base: "file://" + fixtures, routes: ["/render-law-clean.html"], outDir: out, law });
  assert.deepEqual(findings.filter((f) => /^R(06|07|08|09|10)$/.test(f.rule)), [], JSON.stringify(findings, null, 1));
});

import { existsSync, readdirSync } from "node:fs";
const projectLaw = join(resolve(import.meta.dirname, "../.."), "design-law.json");
const examples = join(resolve(import.meta.dirname, "../.."), "recipes/examples");

test("every recipe example stays inside the computed-style law (skipped without design-law.json)", async (t) => {
  if (!existsSync(projectLaw) || !existsSync(examples)) return t.skip("no design-law.json or recipes/examples");
  const routes = readdirSync(examples).filter((f) => f.endsWith(".html")).map((f) => "/" + f);
  const { findings } = await renderCheck({ base: "file://" + examples, routes, outDir: out, law: projectLaw });
  const law = findings.filter((f) => /^R(06|07|08|09|10)$/.test(f.rule));
  assert.deepEqual(law, [], JSON.stringify(law, null, 1));
});
