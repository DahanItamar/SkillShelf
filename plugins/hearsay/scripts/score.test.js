// Optional maintainer check. Not run at install. Node built-ins only.
//
// Score a saved ledger against a golden file:
//   HEARSAY_OUT=run.md HEARSAY_GOLDEN=examples/expected/notes-1.4.0.md node --test scripts/score.test.js
// Without those variables only the built-in self-check runs (each golden scored against itself).
//
// It compares rows by id (H-nn) and verdict. It never edits a golden.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const VERDICTS = ['verified', 'unverified', 'contradicted', 'unmeasurable'];

// Parse table rows of the form `| H-nn | claim | Kind | verdict | ...`.
function parse(text) {
  const rows = new Map();
  for (const line of text.split(/\r?\n/)) {
    const cells = line.split(/(?<!\\)\|/).map((c) => c.trim());
    if (cells.length < 5 || !/^H-\d+$/.test(cells[1])) continue;
    const verdict = cells[4].replace(/[*`]/g, '').toLowerCase();
    if (VERDICTS.includes(verdict)) rows.set(cells[1], verdict);
  }
  return rows;
}

function score(out, gold) {
  const r = { matched: [], differs: [], missing: [], extra: [], falseAccusations: [] };
  for (const [id, v] of gold) {
    if (!out.has(id)) r.missing.push(id);
    else if (out.get(id) === v) r.matched.push(id);
    else r.differs.push(`${id} (run: ${out.get(id)}, golden: ${v})`);
  }
  for (const [id, v] of out) {
    if (!gold.has(id)) r.extra.push(`${id} (${v})`);
    if (v === 'contradicted' && gold.get(id) !== 'contradicted') r.falseAccusations.push(id);
  }
  return r;
}

function report(name, r) {
  console.log(`${name}: matched ${r.matched.length}, differs ${r.differs.length}, missing ${r.missing.length}, extra ${r.extra.length}`);
  if (r.differs.length) console.log(`  differs: ${r.differs.join('; ')}`);
  if (r.missing.length) console.log(`  missing: ${r.missing.join(', ')}`);
  if (r.extra.length) console.log(`  extra: ${r.extra.join(', ')}`);
  console.log(`  false accusations (contradicted in run, not in golden): ${r.falseAccusations.length}${r.falseAccusations.length ? ' ' + r.falseAccusations.join(', ') : ''}`);
}

test('scorer: every golden scores clean against itself', () => {
  const dir = path.join(__dirname, '..', 'examples', 'expected');
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const g = parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const r = score(g, g);
    assert.equal(r.missing.length + r.differs.length + r.extra.length + r.falseAccusations.length, 0, f);
  }
});

test('scorer: counts a wrong contradicted as a false accusation', () => {
  const gold = parse('| H-01 | c | Behavior | unverified | x | n |');
  const out = parse('| H-01 | c | Behavior | contradicted | x | n |\n| H-02 | d | Scope | contradicted | x | n |');
  const r = score(out, gold);
  assert.deepEqual(r.falseAccusations, ['H-01', 'H-02']);
  assert.deepEqual(r.extra, ['H-02 (contradicted)']);
});

const OUT = process.env.HEARSAY_OUT;
const GOLD = process.env.HEARSAY_GOLDEN;
test('score a saved run', { skip: !(OUT && GOLD) && 'set HEARSAY_OUT and HEARSAY_GOLDEN' }, () => {
  const r = score(parse(fs.readFileSync(OUT, 'utf8')), parse(fs.readFileSync(GOLD, 'utf8')));
  report(path.basename(GOLD), r);
});
