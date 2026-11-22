// Maintainer check for the gatehouse plugin. Run from the plugin folder:
//   node --test examples/check.test.mjs
// Structure only: it does not run Gatehouse and does not prove detection.
// Uses node:test, node:fs, node:path and node:assert. No packages. Nothing invokes it.
// This file is ASCII-only; special characters are written as escapes.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { build } from './make-fixtures.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const repo = path.resolve(root, '..', '..');
const rd = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');
const exists = (...p) => fs.existsSync(path.join(root, ...p));
const refs = (n) => rd('skills', 'gatehouse', 'references', n);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const rel = (p) => path.relative(root, p).split(path.sep).join('/');
const allFiles = walk(root);
const selfRel = 'examples/check.test.mjs';
const inFixtures = (r) => r.startsWith('examples/fixtures/');

const pj = JSON.parse(rd('.claude-plugin', 'plugin.json'));
const skill = rd('skills', 'gatehouse', 'SKILL.md');
const rules = refs('rules.md');
const patterns = refs('patterns.md');
const report = refs('report.md');
const readme = rd('README.md');

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(m, 'frontmatter present');
  const o = {};
  for (const line of m[1].split(/\r?\n/)) {
    const k = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (k) o[k[1]] = k[2];
  }
  return o;
}

function verdictTable(text) {
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => l.startsWith('| Condition | Verdict |'));
  assert.ok(i >= 0, 'verdict table found');
  const t = [];
  for (let j = i; j < lines.length && lines[j].startsWith('|'); j++) t.push(lines[j]);
  return t.join('\n');
}

const ruleIds = [...rules.matchAll(/^### (G-[A-Z]+-\d\d)\b/gm)].map((m) => m[1]);

test('1 plugin.json has the required fields', () => {
  assert.equal(pj.name, 'gatehouse');
  assert.equal(pj.displayName, 'Gatehouse');
  assert.match(pj.version, /^\d+\.\d+\.\d+$/);
  assert.ok(pj.description && pj.description.length > 20);
  assert.deepEqual(pj.author, { name: 'Itamar Dahan', url: 'https://github.com/DahanItamar' });
  assert.equal(pj.homepage, 'https://github.com/DahanItamar/claude-skills/tree/main/plugins/gatehouse');
  assert.equal(pj.repository, 'https://github.com/DahanItamar/claude-skills');
  assert.equal(pj.license, 'MIT');
  assert.ok(Array.isArray(pj.keywords) && pj.keywords.length >= 5);
  assert.match(rd('LICENSE'), /Copyright \(c\) 2026 Itamar Dahan/);
  assert.match(rd('CHANGELOG.md'), new RegExp('^## ' + pj.version.replace(/\./g, '\\.') + ' ', 'm'));
});

test('1b marketplace entry matches plugin.json (skipped until the entry exists)', (t) => {
  const mf = path.join(repo, '.claude-plugin', 'marketplace.json');
  if (!fs.existsSync(mf)) return t.skip('marketplace.json not found (plugin copied alone)');
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  const e = m.plugins.find((p) => p.name === 'gatehouse');
  if (!e) return t.skip('gatehouse is not listed in marketplace.json yet');
  assert.equal(e.version, pj.version);
  assert.equal(e.description, pj.description);
  assert.equal(e.source, './plugins/gatehouse');
  assert.equal(e.category, 'security');
});

test('2 marketplace and root README say five (skipped until gatehouse is listed)', (t) => {
  const mf = path.join(repo, '.claude-plugin', 'marketplace.json');
  if (!fs.existsSync(mf)) return t.skip('no marketplace.json');
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  if (!m.plugins.some((p) => p.name === 'gatehouse')) return t.skip('gatehouse is not listed yet');
  assert.equal(m.plugins.length, 5);
  assert.match(m.description, /^Five /);
  const rr = fs.readFileSync(path.join(repo, 'README.md'), 'utf8');
  assert.match(rr, /\*\*Five Claude Code skills/);
  assert.match(rr, /plugins-5-0F766E/);
});

test('3 nothing at the plugin root can run or start', () => {
  for (const p of ['hooks', 'bin', 'monitors', 'mods', '.mcp.json', 'settings.json', 'package.json', 'commands', 'agents', '.claude']) {
    assert.ok(!exists(p), p + ' must not exist at the plugin root');
  }
  assert.ok(!('hooks' in pj) && !('mcpServers' in pj));
  const skills = fs.readdirSync(path.join(root, 'skills'));
  assert.deepEqual(skills, ['gatehouse']);
  const fm = frontmatter(skill);
  const tools = fm['allowed-tools'].split(/[\s,]+/).filter(Boolean).sort();
  assert.deepEqual(tools, ['Glob', 'Grep', 'Read']);
  for (const f of allFiles) {
    const r = rel(f);
    if (inFixtures(r) || r === selfRel) continue;
    if (/SKILL\.md$/.test(r)) {
      const tx = fs.readFileSync(f, 'utf8');
      if (/^---/.test(tx)) {
        const g = frontmatter(tx)['allowed-tools'];
        if (g) assert.deepEqual(g.split(/[\s,]+/).filter(Boolean).sort(), ['Glob', 'Grep', 'Read'], r);
      }
    }
  }
});

test('4 house rules: no emoji, invisible characters, emails, private paths, IPs or tokens', () => {
  const invisible = new RegExp("[\u200B-\u200F\u2060\uFEFF\u202A-\u202E\u2066-\u2069]|[\u{E0000}-\u{E007F}]", "u");
  const emoji = /\p{Extended_Pictographic}/u;
  const email = /[\w.+-]+@[\w-]+\.[A-Za-z]{2,}/;
  const priv = new RegExp('[A-Za-z]:' + '\\\\|/ho' + 'me/|/Us' + 'ers/');
  const ip = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  const token = /AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}/;
  for (const f of allFiles) {
    const r = rel(f);
    if (r === selfRel) {
      assert.ok(/^[\x00-\x7F]*$/.test(fs.readFileSync(f, 'utf8')), 'check file is ASCII');
      continue;
    }
    const tx = fs.readFileSync(f, 'utf8');
    assert.ok(!emoji.test(tx.replace(new RegExp("[\u00A9\u00AE\u2122]", "g"), "")), r + ": emoji");
    if (!inFixtures(r)) assert.ok(!invisible.test(tx), r + ': invisible character');
    assert.ok(!email.test(tx), r + ': email address');
    assert.ok(!priv.test(tx), r + ': private path');
    assert.ok(!ip.test(tx), r + ': IP address');
    assert.ok(!token.test(tx), r + ': token-like string');
  }
});

test('5 README badges: flat-square, one colour, no logos, facts match the files', () => {
  const badges = [...readme.matchAll(/https:\/\/img\.shields\.io\/[^"')\s]+/g)].map((m) => m[0]);
  assert.ok(badges.length >= 4);
  for (const b of badges) {
    assert.ok(b.includes('-0F766E?'), b + ' colour');
    assert.ok(b.includes('style=flat-square'), b + ' style');
    assert.ok(!/logo/i.test(b), b + ' logo');
  }
  assert.ok(badges.some((b) => b.includes('/badge/version-' + pj.version + '-')), 'version badge matches plugin.json');
  assert.ok(badges.some((b) => b.includes('/badge/rules-' + ruleIds.length + '-')), 'rules badge matches rules.md');
  assert.ok(badges.some((b) => b.includes('/badge/dependencies-0-')));
});

test('6 SKILL.md size and description', () => {
  assert.ok(skill.split('\n').length <= 150, 'at most 150 lines');
  assert.ok(Buffer.byteLength(skill) <= 10 * 1024, 'at most 10 KB');
  const fm = frontmatter(skill);
  assert.equal(fm.name, 'gatehouse');
  assert.ok(fm.description.length > 100);
  assert.match(fm.description, /Does NOT trigger/);
  assert.ok(fm['argument-hint']);
});

test('7 rules.md: 16 rules, full block shape, unique ids, ids exist where cited', () => {
  assert.equal(ruleIds.length, 16);
  assert.equal(new Set(ruleIds).size, 16);
  const groups = { TEXT: 3, INJ: 3, EXEC: 4, PERM: 2, NET: 1, INTENT: 3 };
  for (const [g, n] of Object.entries(groups)) {
    const got = ruleIds.filter((i) => i.startsWith('G-' + g + '-'));
    assert.deepEqual(got, Array.from({ length: n }, (_, k) => 'G-' + g + '-0' + (k + 1)));
  }
  const blocks = rules.split(/^### /m).slice(1);
  assert.equal(blocks.length, 16);
  for (const b of blocks) {
    const id = b.slice(0, 10);
    for (const f of ["**DON'T:**", '*Why:*', '*Applies:*', '*Check:*', '*Severity:*']) {
      assert.ok(b.includes(f), id + ' missing ' + f);
    }
  }
  const sections = [...patterns.matchAll(/^## (G-[A-Z]+-\d\d)\b/gm)].map((m) => m[1]);
  assert.deepEqual([...sections].sort(), [...ruleIds].sort(), 'patterns.md sections match rule ids');
  const cited = new Set();
  for (const f of fs.readdirSync(path.join(root, 'examples', 'expected'))) {
    const tx = rd('examples', 'expected', f);
    for (const m of tx.matchAll(/G-[A-Z]+-\d\d/g)) cited.add(m[0]);
  }
  for (const id of cited) assert.ok(ruleIds.includes(id), id + ' cited in a golden but not in rules.md');
  for (const f of ['hidden-text', 'helpful-installer', 'overreach', 'almost-fine', 'own-plugins', 'self']) {
    assert.ok(exists('examples', 'expected', f + '.md'), f + ' golden');
  }
});

test('8 the verdict table is identical in SKILL.md and report.md', () => {
  assert.equal(verdictTable(skill), verdictTable(report));
  assert.match(report, /Gatehouse is a reading aid, not a sandbox\. It read these files as text and ran nothing\./);
});

test('9 each fixture still holds its seeded features', () => {
  const hidden = rd('examples', 'fixtures', 'hidden-text', 'SKILL.md');
  const raw = [...hidden].filter((c) => c.codePointAt(0) >= 0xE0000 && c.codePointAt(0) <= 0xE007F);
  assert.equal(raw.length, 0, 'the committed fixture holds no real tag characters');
  const esc = hidden.match(/<U\+E00[0-7][0-9A-F]>/g) || [];
  assert.ok(esc.length >= 8, 'tag characters survive as escapes');
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gatehouse-check-'));
  try {
    const copy = fs.readFileSync(path.join(build(out), 'SKILL.md'), 'utf8');
    const tags = [...copy].filter((c) => c.codePointAt(0) >= 0xE0000 && c.codePointAt(0) <= 0xE007F);
    assert.equal(tags.length, esc.length, 'the generated copy has a real tag character per escape');
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
  assert.ok(/<!--[\s\S]*?-->/.test(hidden), 'hidden comment survives');
  assert.ok(hidden.includes('PINEAPPLE-CANARY'), 'canary survives');
  const runs = hidden.match(/[A-Za-z0-9+/]{100,}={0,2}/g) || [];
  assert.ok(runs.length >= 1, 'a base64 run of 100+ characters');
  const decoded = Buffer.from(runs[0], 'base64').toString('utf8');
  assert.match(decoded, /^(FIXTURE BLOB - NOT AN INSTRUCTION\. ?)+$/);

  const hj = JSON.parse(rd('examples', 'fixtures', 'helpful-installer', 'hooks', 'hooks.json'));
  assert.ok(hj.hooks.SessionStart[0].hooks[0].command.includes('| sh'));
  const mcp = JSON.parse(rd('examples', 'fixtures', 'helpful-installer', '.mcp.json'));
  assert.equal(mcp.mcpServers['quick-commit'].command, 'npx');
  const sh = rd('examples', 'fixtures', 'helpful-installer', 'bin', 'helper.sh');
  const shRun = (sh.match(/[A-Za-z0-9+/]{100,}={0,2}/) || [''])[0];
  assert.match(Buffer.from(shRun, 'base64').toString('utf8'), /^(FIXTURE BLOB - NOT AN INSTRUCTION\. ?)+$/);

  const over = frontmatter(rd('examples', 'fixtures', 'overreach', 'SKILL.md'));
  assert.match(over['allowed-tools'], /\bBash\b/);
  assert.match(over.description, /Read-only/);

  const fine = JSON.parse(rd('examples', 'fixtures', 'almost-fine', 'hooks', 'hooks.json'));
  assert.ok(fine.hooks.PostToolUse[0].hooks[0].command.includes('lint.mjs'));
  assert.match(rd('examples', 'fixtures', 'almost-fine', 'skills', 'lint-on-save', 'SKILL.md'), /Use for every task/);

  assert.match(rd('examples', 'README.md'), /These are deliberately hostile test fixtures\. They are inert text\./);
});

test('10 every host in the fixtures is a reserved or example domain', () => {
  const ok = (h) => h.endsWith('.invalid') || h === 'example.com' || h.endsWith('.example.com') || h === 'example.net' || h.endsWith('.example.net');
  let seen = 0;
  for (const f of allFiles) {
    const r = rel(f);
    if (!inFixtures(r)) continue;
    const tx = fs.readFileSync(f, 'utf8');
    for (const m of tx.matchAll(/https?:\/\/([^\/\s"')<>]+)/g)) {
      seen++;
      assert.ok(ok(m[1].toLowerCase()), r + ': host ' + m[1]);
    }
  }
  assert.ok(seen >= 3);
});

test('11 the shipped skill and README never claim a result that is not recorded', () => {
  const results = fs.readdirSync(path.join(root, 'examples', 'results')).filter((n) => n.endsWith('.md'));
  if (results.length === 0) {
    assert.match(readme, /\*\*Measured so far:\*\* Not yet measured\./);
  } else {
    assert.doesNotMatch(readme, /Measured so far:\*\* Not yet measured/);
  }
});

test('12 the procedure keeps its ordered Step 0, per-plugin table, receipt and new recipes', () => {
  assert.match(skill, /Glob the argument; if it exists it is a path/);
  assert.match(skill, /plugins\/gatehouse` and `vendor\/x` are paths/);
  assert.match(report, /^## Per plugin$/m);
  assert.match(report, /^## Audit receipt$/m);
  assert.match(report, /\(coverage incomplete\)/);
  for (const r of ['S-DESTRUCT', 'S-DEP-SPEC', 'S-CI']) assert.ok(patterns.includes('`' + r + '`'), r);
  assert.ok(!/^### G-/m.test(skill) && ruleIds.length === 16, 'still 16 rules');
});
