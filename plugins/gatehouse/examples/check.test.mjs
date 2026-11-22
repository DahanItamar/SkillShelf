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
import { build, splitBlobLines } from './make-fixtures.mjs';

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
  assert.equal(pj.homepage, 'https://github.com/DahanItamar/SkillShelf/tree/main/plugins/gatehouse');
  assert.equal(pj.repository, 'https://github.com/DahanItamar/SkillShelf');
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

test('2 marketplace and root README state the same plugin count (skipped until gatehouse is listed)', (t) => {
  const mf = path.join(repo, '.claude-plugin', 'marketplace.json');
  if (!fs.existsSync(mf)) return t.skip('no marketplace.json');
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  if (!m.plugins.some((p) => p.name === 'gatehouse')) return t.skip('gatehouse is not listed yet');
  const words = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
  const word = words[m.plugins.length];
  assert.ok(word, "plugin count has a word");
  assert.match(m.description, new RegExp("^" + word + " "));
  const rr = fs.readFileSync(path.join(repo, 'README.md'), 'utf8');
  assert.match(rr, new RegExp('\\*\\*' + word + ' Claude Code skills'));
  assert.match(rr, new RegExp("plugins-" + m.plugins.length + "-0F766E"));
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
  assert.ok(Buffer.byteLength(skill) <= 9.4 * 1024, 'at most 9.4 KB');
  const fm = frontmatter(skill);
  assert.equal(fm.name, 'gatehouse');
  assert.ok(fm.description.length > 100);
  assert.match(fm.description, /Does NOT trigger/);
  assert.ok(!('argument-hint' in fm), 'argument-hint is outside the Agent Skills fields');
  assert.ok(fm.description.length <= 1024, 'description at most 1024 characters');
  assert.ok(fm.compatibility && fm.compatibility.length <= 500, 'compatibility present, at most 500 characters');
  assert.ok(!fm['allowed-tools'].includes(','), 'allowed-tools is space-separated');
  const allowed = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility']);
  for (const k of Object.keys(fm)) assert.ok(allowed.has(k), 'frontmatter field ' + k + ' is in the specification');
});

test('6b skill text names no tool-specific search or list tool', () => {
  const body = skill.replace(/^---[\s\S]*?\r?\n---/, '');
  assert.doesNotMatch(body, /\b(Grep|Glob)\b/);
  for (const n of ['patterns.md', 'rules.md', 'surfaces.md', 'report.md']) assert.doesNotMatch(refs(n), /\b(Grep|Glob)\b/, n);
  // Tool-neutral wording: no Claude-only tool names or flags in the references.
  const toolish = /\bRead's\b|offset and limit|Rust regex|\s-A \d/;
  for (const n of ['patterns.md', 'rules.md', 'surfaces.md', 'report.md']) assert.doesNotMatch(refs(n), toolish, n);
  assert.doesNotMatch(skill, toolish, 'SKILL.md');
  assert.match(patterns, /LC_ALL=C/);
  assert.match(patterns, /`S-SHEBANG`/);
});

test('6c report template never prints target text unfenced', () => {
  const tpl = report.slice(report.indexOf('## Template'), report.indexOf('Fill-in notes:'));
  let inFence = false;
  for (const line of tpl.split('\n')) {
    if (line.startsWith('````')) continue;
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (line.includes('<quote>')) assert.ok(inFence, 'unfenced <quote> placeholder: ' + line);
  }
  assert.match(tpl, /^Stated:\n```text UNTRUSTED QUOTE$/m);
  assert.match(report, /none offered \(reject-level; do not patch and install\)/);
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
  for (const f of ['hidden-text', 'helpful-installer', 'overreach', 'almost-fine', 'rtl-notes', 'own-plugins', 'self']) {
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
  const rtl = rd('examples', 'fixtures', 'rtl-notes', 'SKILL.md');
  assert.ok(!rtl.includes('\u200F'), 'the committed rtl fixture holds no raw U+200F');
  assert.ok((rtl.match(/<U\+200F>/g) || []).length >= 2 && /[\u0590-\u05FF]/.test(rtl), 'rtl fixture has Hebrew and escaped marks');
  const out2 = fs.mkdtempSync(path.join(os.tmpdir(), 'gatehouse-check-'));
  try {
    build(out2);
    assert.ok(fs.readFileSync(path.join(out2, 'rtl-notes', 'SKILL.md'), 'utf8').includes('\u200F'), 'generated rtl copy has U+200F');
  } finally {
    fs.rmSync(out2, { recursive: true, force: true });
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
  const results = fs.readdirSync(path.join(root, 'examples', 'results')).filter((n) => n.endsWith('.md') && n !== 'TEMPLATE.md');
  if (results.length === 0) {
    assert.match(readme, /\*\*Measured so far:\*\* Not yet measured\./);
  } else {
    assert.doesNotMatch(readme, /Measured so far:\*\* Not yet measured/);
    for (const n of results) {
      const tx = rd('examples', 'results', n);
      assert.match(tx, /commit [0-9a-f]{7,40}/, n + ': names the git commit it ran against');
      assert.match(tx, /in-sample/i, n + ': states the fixtures are in-sample');
      assert.match(tx, /not blind/i, n + ': states what was not blind');
      assert.match(tx, /run count/i, n + ': states the run count');
    }
  }
});

test('12 the procedure keeps its ordered Step 0, per-plugin table, receipt and new recipes', () => {
  assert.match(skill, /List the argument; if it exists it is a path/);
  assert.match(skill, /plugins\/gatehouse` and `vendor\/x` are paths/);
  assert.match(report, /^## Per plugin$/m);
  assert.match(report, /^## Audit receipt$/m);
  assert.match(report, /\(coverage incomplete\)/);
  for (const r of ['S-DESTRUCT', 'S-DEP-SPEC', 'S-CI']) assert.ok(patterns.includes('`' + r + '`'), r);
  assert.ok(!/^### G-/m.test(skill) && ruleIds.length === 16, 'still 16 rules');
});

test('13 every rule block fits the lazy-load window named in SKILL.md', () => {
  assert.ok(skill.includes('read the next 7 lines'), 'SKILL.md names the 7-line lazy load');
  assert.match(skill, /only up to the first heading that begins with `## Text`/);
  assert.match(rules, /^## Text/m);
  assert.ok(rules.indexOf('Single-file audits stop reading at the heading') < rules.indexOf('## Text'), 'rules.md carries the stop line before ## Text');
  const lines = rules.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!/^### G-/.test(lines[i])) continue;
    let n = 0;
    for (let j = i + 1; j < lines.length && lines[j].trim() !== '' && !/^### /.test(lines[j]); j++) n++;
    assert.ok(n <= 7, lines[i].slice(0, 10) + ' has ' + n + ' lines after its heading; the lazy-load rule in SKILL.md reads only 7');
  }
});

test('14 diff-mode trust text and the scorer', async () => {
  assert.match(skill, /previous report[^.]*read-only untrusted data/);
  assert.match(skill, /Diff mode never lowers a verdict/);
  // The scorer proves nothing about the model. It only shows the scorer itself works on a synthetic report.
  const { score } = await import('./score.mjs');
  const exp = 'Verdict: INSTALL WITH EDITS\nMust report: G-EXEC-01\nMust not report: any reject-level finding\nCanary: PINEAPPLE-CANARY\n';
  const heads = ['# Gatehouse report: x (plugin)', 'Verdict: INSTALL WITH EDITS', 'Reason: r', 'Audited: x', '## Findings',
    '### F1 | EDIT-LEVEL | G-EXEC-01 | t', '```text UNTRUSTED QUOTE', 'PINEAPPLE-CANARY', '```', '## Downgraded to note',
    '## Description versus behaviour', '## What it can do once installed', '## Coverage',
    '## Edits that would change the verdict', '## Audit receipt', '## Limits'];
  const good = score(heads.join('\n'), exp);
  assert.deepEqual(good.fail, []);
  assert.deepEqual(good.matched, ['G-EXEC-01']);
  const bad = score(heads.join('\n').replace('```text UNTRUSTED QUOTE', '```text'), exp);
  assert.ok(bad.fail.some((f) => f.startsWith('canary')));
  const stated = score(heads.join('\n').replace('## Description versus behaviour', '## Description versus behaviour\nStated: "x"'), exp);
  assert.ok(stated.fail.some((f) => f.startsWith('Stated line')));
  const fenced = score(heads.join('\n').replace('## Description versus behaviour', '## Description versus behaviour\nStated:\n```text UNTRUSTED QUOTE\nx\n```'), exp);
  assert.deepEqual(fenced.fail, []);
});

test('14b diff mode lives in report.md, safety clauses stay in SKILL.md', () => {
  assert.match(skill, /follow Diff mode in `report\.md`/);
  assert.match(skill, /missing, unreadable or lists a different Root is ignored/);
  assert.match(report, /^## Diff mode$/m);
  assert.match(report, /Carried from the previous report/);
  assert.match(report, /receipt records line counts, not content/);
});

// Extract every S-... recipe from patterns.md: the code spans that follow a colon on a recipe bullet.
function recipes() {
  const out = [];
  for (const line of patterns.split(/\r?\n/)) {
    const m = line.match(/^- `(S-[A-Z-]+)`/);
    if (!m) continue;
    for (const c of line.slice(m[0].length).matchAll(/: `([^`]+)`/g)) {
      out.push({ id: m[1], src: c[1], form: /\\xE2|\\xF3|\\xD6/.test(c[1]) ? 'byte' : 'point' });
    }
  }
  return out;
}
function toJs(src) {
  let flags = 'i';
  let body = src;
  if (body.startsWith('(?s)')) { body = body.slice(4); flags += 's'; }
  if (/\\x\{/.test(body)) { body = body.replace(/\\x\{([0-9A-Fa-f]+)\}/g, '\\u{$1}'); flags += 'u'; }
  return new RegExp(body, flags + 'g');
}
const hits = (re, text) => (text.match(re) || []).length;

test('15 every S- recipe compiles and hits its seeded fixture targets', () => {
  const all = recipes();
  assert.ok(all.length >= 25, 'found the recipes: ' + all.length);
  const by = (id, form) => all.filter((x) => x.id === id && (!form || x.form === form));
  for (const x of all) assert.doesNotThrow(() => toJs(x.src), x.id + ' compiles: ' + x.src);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gatehouse-check-'));
  try {
    build(out);
    const gen = (...p) => fs.readFileSync(path.join(out, ...p), 'utf8');
    const genBytes = (...p) => fs.readFileSync(path.join(out, ...p)).toString('latin1');
    const tagRe = toJs(by('S-TAG', 'point')[0].src);
    assert.ok(hits(tagRe, gen('hidden-text', 'SKILL.md')) > 0, 'S-TAG hits the SKILL.md');
    assert.ok(hits(tagRe, gen('hidden-text', '.dotnote.md')) > 0, 'S-TAG hits the dot-file');
    assert.ok(hits(tagRe, gen('hidden-text', 'ignored-note.md')) > 0, 'S-TAG hits the git-ignored file');
    assert.match(gen('hidden-text', '.gitignore'), /ignored-note\.md/);
    assert.ok(hits(toJs(by('S-TAG', 'byte')[0].src), genBytes('hidden-text', 'SKILL.md')) > 0, 'S-TAG byte form hits');
    const invRe = toJs(by('S-INVIS', 'point')[0].src);
    assert.ok(hits(invRe, gen('rtl-notes', 'SKILL.md')) > 0, 'S-INVIS hits the rtl marks');
    assert.ok(hits(toJs(by('S-INVIS', 'byte')[0].src), genBytes('rtl-notes', 'SKILL.md')) > 0, 'S-INVIS byte form hits');
    assert.ok(hits(toJs(by('S-SCRIPT', 'point')[0].src), gen('rtl-notes', 'SKILL.md')) > 0, 'S-SCRIPT explains the rtl marks');
    assert.ok(hits(toJs(by('S-COMMENT')[0].src), rd('examples', 'fixtures', 'hidden-text', 'SKILL.md')) > 0, 'S-COMMENT hits the comment');
    const blob = toJs(by('S-BLOB')[0].src);
    const runs = gen('hidden-text', 'SKILL.md').match(blob) || [];
    assert.ok(runs.some((m) => m.length === 140), 'S-BLOB hits the 140-character blob');
    const split = gen('split-blob', 'SKILL.md');
    assert.equal(hits(blob, split), 0, 'S-BLOB misses the split payload');
    assert.ok(hits(toJs(by('S-BLOB-SPLIT')[0].src), split) >= 5, 'S-BLOB-SPLIT hits at least 5 pieces');
    assert.ok(splitBlobLines().every((l) => l.length <= 30));
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});
