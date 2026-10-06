#!/usr/bin/env node
// design-law PostToolUse hook: run the project's check-ui on the file the agent just wrote or edited,
// and feed findings back to the agent (exit code 2, findings on stderr). Silent when clean.
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }

const file = input.tool_input?.file_path;
if (!file) process.exit(0);
const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const abs = path.resolve(cwd, file);
const rel = path.relative(cwd, abs);
const ds = path.join(cwd, "design-system");
const tsx = path.join(ds, "node_modules/.bin/tsx");
if (!existsSync(ds) || !existsSync(tsx)) process.exit(0);

// Vocabulary and tooling are exempt: they are the law, not product code.
if (rel.startsWith("design-system" + path.sep) || rel.includes(path.join("components", "ds") + path.sep) || path.basename(rel) === "ds.css") process.exit(0);

let law = {};
try { law = JSON.parse(readFileSync(path.join(ds, "design-law.json"), "utf8")); } catch { /* optional */ }

let checker, env = { ...process.env };
if (/\.(html|css)$/.test(abs) && existsSync(path.join(ds, "check-ui-css/index.ts"))) {
  checker = path.join(ds, "check-ui-css/index.ts");
  env.DS_CSS = path.resolve(cwd, law.dsCss ?? "src/ds.css");
} else if (/\.tsx$/.test(abs) && existsSync(path.join(ds, "check-ui/index.ts"))) {
  checker = path.join(ds, "check-ui/index.ts");
} else process.exit(0);

const r = spawnSync(tsx, [checker, abs], { cwd, env, encoding: "utf8", timeout: 60000 });
const out = ((r.stdout || "") + (r.stderr || "")).trim();
const m = out.match(/(\d+) finding\(s\)/);
const n = m ? Number(m[1]) : r.status === 0 ? 0 : -1;
try { appendFileSync(path.join(ds, ".hook-log.jsonl"), JSON.stringify({ t: new Date().toISOString(), file: rel, findings: n }) + "\n"); } catch { /* best effort */ }

if (r.status === 0) process.exit(0);
process.stderr.write(
  `design-law: ${n >= 0 ? n : "some"} finding(s) in ${rel}. Fix them before continuing (DESIGN.md section numbers are cited; do not edit design-system/ to make them pass).\n\n${out}\n`,
);
process.exit(2);
