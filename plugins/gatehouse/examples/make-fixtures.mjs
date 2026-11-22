// Maintainer helper for the gatehouse examples. Optional. No packages.
// The committed hidden-text fixture writes its Unicode tag characters as
// escapes such as <U+E0046>, so the repository holds no invisible text.
// This script writes temporary copies in which each escape in the range
// U+E0000..U+E007F is replaced by the real character, so Gatehouse can be run on it.
//   node examples/make-fixtures.mjs        prints the path of the generated hidden-text copy (rtl-notes and split-blob sit beside it)
// This file is ASCII-only. Nothing invokes it.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ESCAPE = /<U\+(E00[0-7][0-9A-F]|200F)>/g;

export function expand(text) {
  return text.replace(ESCAPE, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

// A short ASCII sentence written as Unicode tag characters (U+E0000 + code point).
const tag = (t) => [...t].map((c) => String.fromCodePoint(0xE0000 + c.charCodeAt(0))).join('');

// Thirty-character pieces of a harmless sentence in base64, one per line (the split-payload variant).
export function splitBlobLines() {
  const b64 = Buffer.from('FIXTURE BLOB - NOT AN INSTRUCTION. '.repeat(6)).toString('base64');
  const out = [];
  for (let i = 0; i < b64.length && out.length < 8; i += 30) out.push(b64.slice(i, i + 30));
  return out;
}

export function build(outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gatehouse-fixtures-'))) {
  // Every generated fixture is the committed folder with its escapes expanded in SKILL.md.
  // Returns the hidden-text copy; rtl-notes and split-blob are written next to it.
  let first = null;
  for (const name of ['hidden-text', 'rtl-notes']) {
    const dst = path.join(outDir, name);
    fs.cpSync(path.join(here, 'fixtures', name), dst, { recursive: true });
    const f = path.join(dst, 'SKILL.md');
    fs.writeFileSync(f, expand(fs.readFileSync(f, 'utf8')));
    first = first || dst;
  }
  // Hidden-text copy only: one tag-character payload in a dot-file and one in a git-ignored file,
  // to check that the sweeps reach hidden and ignored files (S-TAG must hit both).
  const ht = path.join(outDir, 'hidden-text');
  fs.writeFileSync(path.join(ht, '.dotnote.md'), 'Dot-file note. ' + tag('FIXTURE NOT AN INSTRUCTION') + '\n');
  fs.writeFileSync(path.join(ht, '.gitignore'), 'ignored-note.md\n');
  fs.writeFileSync(path.join(ht, 'ignored-note.md'), 'Ignored-file note. ' + tag('FIXTURE NOT AN INSTRUCTION') + '\n');
  // Split-payload variant: a skill whose only oddity is a payload cut into 30-character lines.
  const sb = path.join(outDir, 'split-blob');
  fs.mkdirSync(sb, { recursive: true });
  fs.writeFileSync(path.join(sb, 'SKILL.md'), [
    '---', 'name: split-blob', 'description: Formats a changelog from commit titles.', '---', '', '# split-blob', '',
    'Format the changelog from the commit titles the user gives you. Keep the wording.', '',
    ...splitBlobLines(), ''].join('\n'));
  return first;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(build());
}
