// Casebook before/after proof. Run from anywhere:
//   node --test examples/proof/proof.test.mjs
// No packages. Needs Node 18+ and a POSIX sh for the lint group.
//
// This shows the scenario the skill is built around: a repro that fails
// before the fix and passes after, plus a lint over the example case files.
// It does not measure any model's output.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { roundMoney as before } from "./before.mjs";
import { roundMoney as after } from "./after.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("1. the repro, observed failing against before.mjs", () => {
  // The regression assertion is roundMoney(1.005) === 1.01.
  // Here we assert that it does NOT hold, so the suite stays green
  // while the failure is demonstrated.
  assert.notEqual(before(1.005), 1.01);
  assert.equal(before(1.005), 1);
  assert.notEqual(before(1.255), 1.26);
});

test("2. the same assertions pass against after.mjs", () => {
  assert.equal(after(1.005), 1.01);
  assert.equal(after(1.255), 1.26);
  assert.equal(after(10.075), 10.08);
});

test("2b. the fix does not change values that were already right", () => {
  for (const x of [0, 0.1, 1.004, 1.006, 19.99, 100]) {
    assert.equal(after(x), before(x), `value ${x}`);
  }
});

function lint(file, as = "001.md") {
  const r = spawnSync("sh", ["scripts/check-case.sh", "--as", as, file], {
    cwd: root,
    encoding: "utf8",
  });
  assert.ok(r.error === undefined, `could not run sh: ${r.error}`);
  const ids = new Set([...r.stdout.matchAll(/^FAIL (L\d):/gm)].map((m) => m[1]));
  return { status: r.status, ids, out: r.stdout };
}

const casesDir = join(root, "examples", "cases");
for (const name of readdirSync(casesDir).filter((n) => n.endsWith(".md")).sort()) {
  test(`3. lint: ${name}`, () => {
    const first = readFileSync(join(casesDir, name), "utf8").split("\n")[0];
    const m = first.match(/^<!-- expect: (pass|FAIL (L\d)) -->$/);
    assert.ok(m, `${name} must start with an expect comment`);
    const got = lint(`examples/cases/${name}`);
    if (m[1] === "pass") {
      assert.equal(got.status, 0, got.out);
      assert.equal(got.ids.size, 0);
    } else {
      assert.equal(got.status, 1, got.out);
      assert.deepEqual([...got.ids], [m[2]], got.out);
    }
  });
}

test("3. lint: a file not named NNN.md fails L1", () => {
  const dir = mkdtempSync(join(tmpdir(), "casebook-"));
  try {
    copyFileSync(join(casesDir, "good-closed.md"), join(dir, "1.md"));
    const r = spawnSync("sh", ["scripts/check-case.sh", join(dir, "1.md")], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /^FAIL L1:/m);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("3. lint: a missing file exits 2", () => {
  const r = spawnSync("sh", ["scripts/check-case.sh", "examples/cases/does-not-exist.md"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(r.status, 2);
});

// Drift checks: counts stated in prose must match the files they describe.
// The release-time check against the marketplace entry stays a manual step.
const read = (...p) => readFileSync(join(root, ...p), "utf8");

test("4. drift: lint RULE_COUNT equals the README rule count", () => {
  const script = read("scripts", "check-case.sh").match(/^RULE_COUNT=(\d+)$/m);
  const readme = read("README.md").match(/against (\d+) rules/);
  assert.ok(script && readme, "RULE_COUNT and the README rule count must both be present");
  assert.equal(script[1], readme[1]);
});

test("4. drift: close-checks has 9 checks and the README says 9", () => {
  const rows = read("skills", "casebook-close", "references", "close-checks.md").match(/^\| C\d+ \|/gm) || [];
  assert.equal(rows.length, 9);
  assert.match(read("README.md"), /\(C1 to C9\)/);
  assert.match(read("skills", "casebook-close", "references", "close-checks.md"), /^Nine checks/m);
});

test("4. drift: the README byte counts match the two SKILL.md files", () => {
  const readme = read("README.md");
  const a = readme.match(/skills\/casebook\/SKILL\.md` \((\d+) bytes\)/);
  const b = readme.match(/skills\/casebook-close\/SKILL\.md` \((\d+) bytes\)/);
  assert.ok(a && b, "README Cost section must state both byte counts");
  assert.equal(Number(a[1]), Buffer.byteLength(read("skills", "casebook", "SKILL.md")));
  assert.equal(Number(b[1]), Buffer.byteLength(read("skills", "casebook-close", "SKILL.md")));
});

test("4. drift: the README reference-file byte totals match the files", () => {
  const readme = read("README.md");
  const size = (...p) => Buffer.byteLength(read(...p));
  const refs = [
    size("skills", "casebook", "references", "case-template.md"),
    size("skills", "casebook", "references", "hypotheses.md"),
    size("skills", "casebook", "references", "experiments.md"),
    size("skills", "casebook-close", "references", "close-checks.md"),
  ];
  const [ct, hy, ex, cc] = refs;
  const total = refs.reduce((x, y) => x + y, 0);
  const open = size("skills", "casebook", "SKILL.md") + ct + hy + ex;
  const close = size("skills", "casebook-close", "SKILL.md") + cc;
  assert.match(readme, new RegExp(`four reference files total ${total} bytes`));
  assert.match(readme, new RegExp(`hypotheses and experiments: ${open} bytes`));
  assert.match(readme, new RegExp(`close-checks: ${close} bytes`));
});
