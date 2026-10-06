import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { CLASS_RULES, ELEMENT_RULES, STYLE_RULE, TEXT_RULES, type Rule } from "./rules";

export type Finding = {
  file: string;
  line: number;
  rule: string;
  section: string;
  title: string;
  fix: string;
  snippet: string;
};

const SKIP_ATTRS = new Set(["href", "id", "src", "alt", "key", "target", "rel", "type", "name", "sizes", "aria-label", "title"]);
const CLASS_HINT =
  /^(?:[a-z0-9-]+:)*(?:flex|inline-flex|grid|block|hidden|relative|absolute|p[xytrbl]?-|m[xytrbl]?-|gap-|space-|text-|bg-|border|rounded|shadow|font-|w-|h-|max-|min-|items-|justify-|opacity-|ring|tracking-|leading-|uppercase|blur|backdrop|animate-|transition|from-|via-|to-|dark:|group|overflow-|aspect-|col-span|object-|shrink|mt-|mb-)/;

const isClassList = (s: string) => {
  const toks = s.trim().split(/\s+/).filter(Boolean);
  if (toks.length === 0) return false;
  if (!toks.every((t) => /^[!\w:[\]\/.%#(),&>*_=-]+$/.test(t))) return false;
  return toks.some((t) => CLASS_HINT.test(t));
};

export function listFiles(paths: string[]): string[] {
  const out: string[] = [];
  const walk = (p: string) => {
    const st = statSync(p);
    if (st.isDirectory()) {
      for (const f of readdirSync(p)) if (f !== "node_modules" && f !== ".next") walk(join(p, f));
    } else if (/\.tsx$/.test(p)) out.push(p);
  };
  paths.forEach(walk);
  return out;
}

export function isVocabularyFile(file: string) {
  return /(^|\/)src\/components\/ds\//.test(file.replace(/\\/g, "/"));
}

export function checkFile(file: string, cwd = process.cwd()): Finding[] {
  if (isVocabularyFile(relative(cwd, file) || file)) return [];
  const src = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const lines = src.split("\n");
  const findings: Finding[] = [];
  const seen = new Set<string>();

  const add = (rule: Rule, pos: number, extra = "") => {
    const line = sf.getLineAndCharacterOfPosition(pos).line + 1;
    const key = `${rule.id}:${line}:${extra}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({
      file: relative(cwd, file),
      line,
      rule: rule.id,
      section: rule.section,
      title: extra ? `${rule.title} (${extra})` : rule.title,
      fix: rule.fix,
      snippet: lines[line - 1].trim().slice(0, 120),
    });
  };

  const checkClassString = (text: string, start: number) => {
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const tok = m[0];
      const bare = tok.replace(/^(?:[a-z0-9-]+:)+/, "");
      for (const r of CLASS_RULES) {
        if (!r.test) continue;
        if (r.id === "UI18" ? !r.test.test(tok) : !r.test.test(bare)) continue;
        if (r.except?.test(tok) || r.except?.test(bare)) continue;
        add(r, start + m.index, tok);
      }
    }
  };

  const checkText = (text: string, pos: number) => {
    const clean = text.replace(/[\u00A9\u00AE\u2122]/g, "");
    for (const r of TEXT_RULES) if (r.test!.test(clean)) add(r, pos, text.trim().slice(0, 40));
  };

  const attrName = (n: ts.Node): string | undefined => {
    for (let p: ts.Node | undefined = n.parent; p; p = p.parent) {
      if (ts.isJsxAttribute(p)) return p.name.getText();
    }
    return undefined;
  };

  const visit = (n: ts.Node) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
      const text = n.text;
      const an = attrName(n);
      const isImport = ts.isImportDeclaration(n.parent) || ts.isExportDeclaration(n.parent);
      if (!isImport && !(an && SKIP_ATTRS.has(an)) && !(an === "style")) {
        const start = n.getStart() + 1;
        if (an === "className" || an === "class" || isClassList(text)) checkClassString(text, start);
        else checkText(text, n.getStart());
      }
    } else if (ts.isJsxText(n)) {
      const t = n.text;
      if (t.trim()) checkText(t, n.getStart() + t.search(/\S/));
    } else if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = n.tagName.getText();
      for (const r of ELEMENT_RULES) if (r.tags!.includes(tag)) add(r, n.getStart(), `<${tag}>`);
    } else if (ts.isJsxAttribute(n) && n.name.getText() === "style" && n.initializer && ts.isJsxExpression(n.initializer)) {
      const e = n.initializer.expression;
      if (e && ts.isObjectLiteralExpression(e)) {
        for (const p of e.properties) {
          if (ts.isPropertyAssignment(p) && (ts.isStringLiteral(p.initializer) || ts.isNumericLiteral(p.initializer) || ts.isNoSubstitutionTemplateLiteral(p.initializer))) {
            add(STYLE_RULE, p.getStart(), p.name.getText());
          }
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return findings.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
}

export function checkPaths(paths: string[], cwd = process.cwd()): Finding[] {
  return listFiles(paths).flatMap((f) => checkFile(f, cwd));
}
