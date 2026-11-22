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
