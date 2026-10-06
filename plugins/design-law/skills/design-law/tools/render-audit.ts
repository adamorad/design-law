import { writeFileSync } from "node:fs";
import { auditRoutes, summarise } from "./lib/render-metrics";

const arg = (k: string, d?: string) => {
  const i = process.argv.indexOf("--" + k);
  return i > -1 ? process.argv[i + 1] : d;
};
const base = arg("base", "http://localhost:3100")!;
const routes = arg("routes", "/")!.split(",");
const out = arg("out", "design-system/shots")!;
const label = arg("label", "baseline")!;
const json = arg("json");

const metrics = await auditRoutes({ base, routes, outDir: out, label });
const result = { label, base, routes, generated: new Date().toISOString(), summary: summarise(metrics), pages: metrics };
if (json) writeFileSync(json, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.summary, null, 2));
