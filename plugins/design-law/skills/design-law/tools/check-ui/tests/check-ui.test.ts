import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { checkFile, checkPaths } from "../static";
import { ALL_RULES } from "../rules";

const root = resolve(import.meta.dirname, "../../..");
const ds = join(root, "design-system");

test("every recipe example passes with zero findings", () => {
  const dir = join(ds, "recipes/examples");
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
  assert.ok(files.length >= 5);
  const findings = checkPaths([dir], root);
  assert.deepEqual(findings, [], JSON.stringify(findings, null, 1));
});

test("the ds wrappers themselves are exempt (they are the vocabulary)", () => {
  assert.deepEqual(checkPaths([join(root, "src/components/ds")], root), []);
});

test("the don't fixture is flagged on every tagged line, and every rule fires", () => {
  const file = join(ds, "check-ui/fixtures/dont.tsx");
  const lines = readFileSync(file, "utf8").split("\n");
  const tagged = lines.map((l, i) => (l.includes("{/* bad */}") ? i + 1 : 0)).filter(Boolean);
  const findings = checkFile(file, root);
  const flagged = new Set(findings.map((f) => f.line));
  const missed = tagged.filter((n) => !flagged.has(n));
  assert.deepEqual(missed, [], `unflagged lines: ${missed.join(",")}`);
  const fired = new Set(findings.map((f) => f.rule));
  const silent = ALL_RULES.map((r) => r.id).filter((id) => !fired.has(id));
  assert.deepEqual(silent, [], `rules never fired on the fixture: ${silent.join(",")}`);
});

test("every finding cites a section that exists in DESIGN.md and carries a fix", () => {
  const md = readFileSync(join(ds, "DESIGN.md"), "utf8");
  const sections = new Set([...md.matchAll(/^(\d+\.\d+)\s/gm)].map((m) => m[1]));
  for (const r of ALL_RULES) {
    assert.ok(sections.has(r.section), `${r.id} cites missing section ${r.section}`);
    assert.ok(r.fix.length > 10, `${r.id} has no fix`);
  }
});
