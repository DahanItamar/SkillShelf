// Truthpath maintainer check. Optional: nothing in the plugin runs it, and it needs no packages.
// Usage (from the plugin folder):  node --test scripts/check.test.mjs
// It reads files and runs `sh scripts/hints.sh` on the planted sample. It writes nothing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = join(ROOT, "skills", "truthpath");
const PATTERNS_DIR = join(SKILL_DIR, "references", "patterns");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out.sort();
}

const text = (p) => readFileSync(p, "utf8");
const rel = (p) => relative(ROOT, p).split(sep).join("/");

test("hints.sh on the planted sample matches the recorded output byte for byte", (t) => {
  const probe = spawnSync("sh", ["-c", "exit 0"]);
  if (probe.error) {
    t.skip("sh is not available on this machine");
    return;
  }
  const run = spawnSync("sh", ["scripts/hints.sh", "examples/planted"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(run.status, 0, "hints.sh must exit 0 after printing");
  assert.ok(
    run.stderr.split("\n")[0].startsWith("HINTS ONLY: candidates for a reader, not findings."),
    "the first stderr line must say HINTS ONLY",
  );
  const expected = readFileSync(join(ROOT, "examples", "expected", "planted-hints.txt"), "utf8");
  assert.equal(run.stdout, expected);
  for (const line of run.stdout.split("\n")) {
    assert.ok(!line.includes("/test/"), `a hint names test code: ${line}`);
  }
});

test("hints.sh exits 2 on bad usage", (t) => {
  const probe = spawnSync("sh", ["-c", "exit 0"]);
  if (probe.error) {
    t.skip("sh is not available on this machine");
    return;
  }
  const run = spawnSync("sh", ["scripts/hints.sh", "--nope"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(run.status, 2);
});

test("SKILL.md frontmatter: name equals its folder, description is 1024 characters or fewer", () => {
  const src = text(join(SKILL_DIR, "SKILL.md"));
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(m, "frontmatter is missing");
  const name = m[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  assert.equal(name, "truthpath");
  assert.equal(name, SKILL_DIR.split(sep).pop(), "name must equal its folder");
  assert.match(name, /^[a-z0-9-]{1,64}$/);
  const raw = m[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  assert.ok(raw, "description is missing");
  const description = raw.replace(/^"([\s\S]*)"$/, "$1");
  assert.ok(description.length <= 1024, `description is ${description.length} characters`);
  assert.ok(description.length <= 900, `description is ${description.length} characters; keep a margin under 1024`);
  assert.ok(description.includes("Does NOT trigger"), "description needs the Does NOT trigger clause");
});

test("every pattern file has the nine sections and two or more code languages", () => {
  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith(".md"));
  assert.equal(files.length, 10, "exactly ten pattern files");
  for (const f of files) {
    const src = text(join(PATTERNS_DIR, f));
    const heads = [...src.matchAll(/^## (.+)$/gm)].map((x) => x[1]);
    const bad = heads.filter((h) => /^Bad \(.+\)$/.test(h));
    const good = heads.filter((h) => /^Good \(.+\)$/.test(h));
    assert.ok(bad.length >= 2, `${f}: needs two or more Bad sections`);
    assert.ok(good.length >= 2, `${f}: needs two or more Good sections`);
    for (const h of ["Shape", "How a user is misled", "Confirmed when", "Not a finding when", "Smallest fix"]) {
      assert.ok(heads.includes(h), `${f}: missing section "${h}"`);
    }
    assert.ok(heads.length >= 9, `${f}: needs at least nine sections`);
    const langs = new Set([...src.matchAll(/^```([a-z]+)\s*$/gm)].map((x) => x[1]));
    assert.ok(langs.size >= 2, `${f}: needs two or more fenced languages, found ${[...langs].join(",")}`);
  }
});

test("the catalogue lists exactly the TP ids that exist as files", () => {
  const fileIds = readdirSync(PATTERNS_DIR)
    .map((f) => f.match(/^(TP-\d\d)-/)?.[1])
    .filter(Boolean)
    .sort();
  assert.deepEqual(fileIds, ["TP-01", "TP-02", "TP-03", "TP-04", "TP-05", "TP-06", "TP-07", "TP-08", "TP-09", "TP-10"]);
  const cat = text(join(SKILL_DIR, "references", "catalogue.md"));
  const rows = [...cat.matchAll(/^\| (TP-\d\d) \|/gm)].map((x) => x[1]).sort();
  assert.deepEqual(rows, fileIds);
  for (const f of readdirSync(PATTERNS_DIR)) {
    assert.ok(cat.includes(`patterns/${f}`), `catalogue does not link ${f}`);
  }
});

test("the skill tree has no emoji and no tool names", () => {
  const toolNames = [
    /`(Read|Grep|Bash|Edit|Write|Glob)`/,
    /\b(Read|Grep|Bash|Edit|Write|Glob) tool\b/,
    /\b(Read|Edit|Write)\(/,
    /\b(Grep|Bash|Glob|WebFetch|TodoWrite)\b/,
  ];
  for (const p of walk(join(ROOT, "skills"))) {
    const src = text(p);
    assert.ok(!/\p{Extended_Pictographic}/u.test(src), `${rel(p)}: emoji found`);
    for (const re of toolNames) assert.ok(!re.test(src), `${rel(p)}: tool name matched ${re}`);
    assert.ok(!/[^\x00-\x7F]/.test(src), `${rel(p)}: non-ASCII character found`);
  }
});

test("no absolute local paths and no other skill named in the plugin", () => {
  const abs = [/(^|[^A-Za-z0-9])[A-Za-z]:[\\/]/, new RegExp("/Us" + "ers/"), new RegExp("/ho" + "me/")];
  const others = /\b(regwise|edgecase|blueprint|showcase|casebook|hearsay|gatehouse)\b/i;
  for (const p of walk(ROOT)) {
    const src = text(p);
    for (const re of abs) assert.ok(!re.test(src), `${rel(p)}: absolute local path matched ${re}`);
    if (rel(p).startsWith("skills/") || rel(p) === "README.md") {
      assert.ok(!others.test(src), `${rel(p)}: names another SkillShelf skill`);
    }
  }
});

test("versions agree and plugin.json is valid", () => {
  const manifest = JSON.parse(text(join(ROOT, ".claude-plugin", "plugin.json")));
  assert.equal(manifest.name, "truthpath");
  assert.equal(manifest.version, "0.1.0");
  for (const key of ["displayName", "description", "author", "homepage", "repository", "license", "keywords"]) {
    assert.ok(manifest[key], `plugin.json: missing ${key}`);
  }
  assert.ok(text(join(ROOT, "README.md")).includes("badge/version-0.1.0-0F766E"));
  assert.ok(text(join(ROOT, "CHANGELOG.md")).includes("## 0.1.0"));
  assert.ok(text(join(ROOT, "LICENSE")).includes("Copyright (c) 2026 Itamar Dahan"));
});

test("planted files keep their line numbers and use LF endings", () => {
  const lines = (p) => text(join(ROOT, "examples", "planted", p)).split("\n").length - 1;
  assert.equal(lines("src/orders.js"), 10);
  assert.equal(lines("src/payments.py"), 15);
  assert.equal(lines("src/tax.ts"), 6);
  assert.ok(existsSync(join(ROOT, "examples", "planted", "test", "orders.test.js")));
  for (const p of walk(join(ROOT, "examples"))) {
    assert.ok(!text(p).includes("\r"), `${rel(p)}: CR found, line endings must be LF`);
  }
});
