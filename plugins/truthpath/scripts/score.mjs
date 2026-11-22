// Truthpath maintainer scorer. Optional: not needed to use the skill. No packages.
// Usage (from the plugin folder):  node scripts/score.mjs < report.md
// Reads a pasted Truthpath report on stdin and compares it with examples/expected/planted.md.
// It records and invents nothing: it only counts what the pasted report contains.
import { readFileSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DECOY = "src/cleanup.py";

// Returns [{ key: "file:line TP-NN", grade }] from the finding headings and their Certainty lines.
export function extract(text) {
  const out = [];
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^###\s+(\S+?:\d+)\s+(TP-\d\d)\b/);
    if (h) { cur = { key: `${h[1]} ${h[2]}`, grade: "unknown" }; out.push(cur); continue; }
    const c = line.match(/^- Certainty:\s*(confirmed|suspected)/i);
    if (c && cur) cur.grade = c[1].toLowerCase();
  }
  return out;
}

export function score(report, expected) {
  const got = extract(report), want = extract(expected);
  const gotKeys = new Set(got.map((g) => g.key)), wantKeys = new Set(want.map((w) => w.key));
  const found = want.filter((w) => gotKeys.has(w.key));
  const misgraded = found.filter((w) => got.find((g) => g.key === w.key).grade !== w.grade);
  return {
    found: found.length,
    missed: want.filter((w) => !gotKeys.has(w.key)).map((w) => w.key),
    extra: got.filter((g) => !wantKeys.has(g.key) && !g.key.startsWith(DECOY)).map((g) => g.key),
    decoyReported: got.filter((g) => g.key.startsWith(DECOY)).length,
    misgraded: misgraded.map((w) => w.key),
    expected: want.length,
  };
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const expected = readFileSync(join(root, "examples", "expected", "planted.md"), "utf8");
  const r = score(readFileSync(0, "utf8"), expected);
  console.log(`found ${r.found}/${r.expected}, missed ${r.missed.length}, extra ${r.extra.length}, decoy-reported ${r.decoyReported}, misgraded ${r.misgraded.length}`);
  for (const k of r.missed) console.log(`missed: ${k}`);
  for (const k of r.extra) console.log(`extra: ${k}`);
  for (const k of r.misgraded) console.log(`misgraded: ${k}`);
}
