import { writeFileSync } from "node:fs";
import { checkPaths } from "./static";
import { ALL_RULES } from "./rules";

const args = process.argv.slice(2);
const flag = (k: string) => args.includes("--" + k);
const val = (k: string) => {
  const i = args.indexOf("--" + k);
  return i > -1 ? args[i + 1] : undefined;
};
const valueFlags = new Set(["--render", "--routes", "--out", "--json"]);
const paths = args.filter((a, i) => !a.startsWith("--") && !valueFlags.has(args[i - 1]));

if (flag("rules")) {
  for (const r of ALL_RULES) console.log(`${r.id}  DESIGN.md ${r.section}  ${r.title}`);
  process.exit(0);
}

const out: string[] = [];
let total = 0;
const json: any = { static: [], render: [] };

if (paths.length) {
  const f = checkPaths(paths);
  total += f.length;
  json.static = f;
  for (const x of f) out.push(`${x.file}:${x.line}  ${x.rule} DESIGN.md ${x.section}  ${x.title}\n    ${x.snippet}\n    fix: ${x.fix}`);
  out.push(`static: ${f.length} finding(s) in ${paths.join(", ")}`);
}

const base = val("render");
if (base) {
  const { renderCheck } = await import("./render");
  const r = await renderCheck({ base, routes: (val("routes") ?? "/").split(","), outDir: val("out") ?? "design-system/shots/check" });
  total += r.findings.length;
  json.render = r.findings;
  for (const x of r.findings) out.push(`${x.route} @${x.viewport} ${x.scheme}  ${x.rule} DESIGN.md ${x.section}  ${x.message}\n    fix: ${x.fix}`);
  out.push(`render: ${r.findings.length} finding(s) at ${base} routes ${val("routes") ?? "/"}`);
}

if (!paths.length && !base) {
  console.error("usage: check-ui <paths...> [--render http://localhost:3100 --routes /,/x --out dir] [--json file] | --rules");
  process.exit(2);
}
const j = val("json");
if (j) writeFileSync(j, JSON.stringify({ total, ...json }, null, 2));
console.log(out.join("\n"));
console.log(total === 0 ? "OK: 0 findings" : `FAIL: ${total} finding(s)`);
process.exit(total === 0 ? 0 : 1);
