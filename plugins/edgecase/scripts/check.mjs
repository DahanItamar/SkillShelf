// Maintainer check for the edgecase plugin. Zero dependencies. Run: node --test scripts/check.mjs
// Nothing here runs at install time and nothing is loaded while the skill is used.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const walk = (dir) =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    return e.isDirectory() ? walk(rel) : [rel];
  });

const CORE = ["references/states.md", "references/feedback.md", "references/forms.md"];
const OPT_IN = ["references/opt-in/laws.md"];
const rulesIn = (file) => {
  const out = [];
  let cur = null;
  for (const line of read(file).split("\n")) {
    const h = line.match(/^### (R-[A-Z]+-\d+)/);
    if (h) { cur = { id: h[1], severity: "" }; out.push(cur); }
    const s = line.match(/^\*Severity:\*\s*(.*)$/);
    if (s && cur) cur.severity = s[1].trim();
  }
  return out;
};

test("core rule count is 34 and within the cap of 40", () => {
  const core = CORE.flatMap(rulesIn);
  assert.equal(core.length, 34);
  assert.ok(core.length <= 40);
  assert.equal(new Set(core.map((r) => r.id)).size, core.length, "duplicate rule id");
});

test("18 core rules are required (Severity line starts with 'required')", () => {
  const required = CORE.flatMap(rulesIn).filter((r) => r.severity.startsWith("required"));
  assert.equal(required.length, 18, required.map((r) => r.id).join(" "));
});

test("opt-in laws: 8 rules, none required", () => {
  const laws = OPT_IN.flatMap(rulesIn);
  assert.equal(laws.length, 8);
  assert.equal(laws.filter((r) => r.severity.startsWith("required")).length, 0);
});

test("version matches plugin.json, CHANGELOG head, README badge and marketplace entry", () => {
  const v = JSON.parse(read(".claude-plugin/plugin.json")).version;
  assert.equal(read("CHANGELOG.md").match(/^## (\d+\.\d+\.\d+)/m)[1], v, "CHANGELOG head");
  assert.ok(read("README.md").includes(`badge/version-${v}-0F766E`), "README badge");
  const mp = path.resolve(root, "../../.claude-plugin/marketplace.json");
  if (!fs.existsSync(mp)) return; // copied out of the repo: nothing to compare
  const entry = JSON.parse(fs.readFileSync(mp, "utf8")).plugins.find((p) => p.name === "edgecase");
  assert.ok(entry, "no edgecase entry in marketplace.json");
  assert.equal(entry.version, v, "marketplace.json version");
});

test("every R-ID cited in examples/expected exists in references/", () => {
  const known = new Set([...CORE, ...OPT_IN].flatMap(rulesIn).map((r) => r.id));
  for (const f of walk("examples/expected")) {
    for (const [id] of read(f).matchAll(/R-[A-Z]+-\d+/g)) assert.ok(known.has(id), `${f}: ${id}`);
  }
});

test("every path referenced from SKILL.md, README and references exists", () => {
  const files = ["SKILL.md", "README.md", "examples/README.md", ...walk("references")];
  const skip = new Set(["CLAUDE.md", "docs/STATES.md", "README.md"]);
  for (const f of files) {
    const text = read(f);
    const base = path.dirname(f);
    for (const m of text.matchAll(/\]\((?!https?:|#|mailto:)([^)#\s]+)/g)) {
      assert.ok(fs.existsSync(path.join(root, base, m[1])), `${f}: link ${m[1]}`);
    }
    for (const m of text.matchAll(/`((?:references|scripts|examples|docs)\/[\w./-]+)`/g)) {
      if (!skip.has(m[1])) assert.ok(fs.existsSync(path.join(root, m[1])), `${f}: ${m[1]}`);
    }
    if (f === "SKILL.md") {
      for (const m of text.matchAll(/`([\w-]+\.md)`/g)) {
        if (skip.has(m[1]) || m[1] === "SKILL.md") continue;
        const ok = ["references", "references/opt-in"].some((d) => fs.existsSync(path.join(root, d, m[1])));
        assert.ok(ok, `SKILL.md: ${m[1]}`);
      }
    }
  }
});

test("no emoji and no private path or address strings in text files", () => {
  const emoji = /(?![©®™])\p{Extended_Pictographic}/u; // the copyright sign is allowed
  const priv = /[A-Za-z]:\\Users|\/home\/[a-z]|\/Users\/[A-Za-z]|[\w.+-]+@[\w-]+\.[a-z]{2,}|\b\d{1,3}(\.\d{1,3}){3}\b/;
  const textFiles = walk(".").filter((f) => /\.(md|json|jsx|mjs|sh|vue|svelte|html|erb)$/.test(f));
  for (const f of textFiles) {
    const t = read(f);
    assert.ok(!emoji.test(t), `${f}: emoji`);
    assert.ok(!priv.test(t), `${f}: private-looking string ${t.match(priv)?.[0]}`);
  }
});
