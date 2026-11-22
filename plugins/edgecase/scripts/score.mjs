// Score a saved model output against a golden file. Zero dependencies. Maintainer-run.
// Usage: node scripts/score.mjs <saved-output.md> <examples/expected/name.md>
// Reads the last "edgecase-ids:" line of the output and the "`file:line · R-ID`" bullets of the golden.
import fs from "node:fs";

const [outFile, goldenFile] = process.argv.slice(2);
if (!outFile || !goldenFile) {
  console.error("usage: node scripts/score.mjs <saved-output> <expected/name.md>");
  process.exit(2);
}
const out = fs.readFileSync(outFile, "utf8").split("\n").filter((l) => /^\s*edgecase-ids:/.test(l));
if (out.length === 0) {
  console.error("no 'edgecase-ids:' line in the output file; cannot score");
  process.exit(2);
}
const got = new Set(out.at(-1).match(/R-[A-Z]+-\d+/g) ?? []);
const want = new Set();
for (const line of fs.readFileSync(goldenFile, "utf8").split("\n")) {
  const m = line.match(/^- `[^`]* · (R-[A-Z]+-\d+)`/);
  if (m) want.add(m[1]);
}
const sorted = (s) => [...s].sort();
const matched = sorted(want).filter((id) => got.has(id));
const missed = sorted(want).filter((id) => !got.has(id));
const extra = sorted(got).filter((id) => !want.has(id));
console.log(`matched ${matched.length}: ${matched.join(" ") || "-"}`);
console.log(`missed  ${missed.length}: ${missed.join(" ") || "-"}`);
console.log(`extra   ${extra.length}: ${extra.join(" ") || "-"}`);
