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
