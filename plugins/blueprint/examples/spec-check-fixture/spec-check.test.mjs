// Run by a maintainer: node --test examples/spec-check-fixture/spec-check.test.mjs
// Runs the optional scripts/spec-check.sh against the hand-built fixture. Needs `sh` and `awk`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const run = spawnSync(
  'sh',
  ['scripts/spec-check.sh', 'examples/spec-check-fixture/SPEC.md', 'examples/spec-check-fixture/TASKS.md'],
  { cwd: root, encoding: 'utf8' },
);

test('the checker finds the three deliberate orphans in the fixture', { skip: run.error ? 'sh not available' : false }, () => {
  const lines = run.stdout.trim().split('\n');
  assert.equal(lines.at(-1), 'RESULT orphans=3 status=fail');
  assert.equal(lines.at(-2), 'Orphans: 3');
  assert.ok(lines.some((l) => l.startsWith('T-03 cites AC-009, which does not exist')));
  assert.ok(lines.includes('AC-003 active, closed by no task'));
  assert.ok(lines.includes('AC-003 appears twice in section 2.1'));
  assert.equal(run.status, 1);
});
