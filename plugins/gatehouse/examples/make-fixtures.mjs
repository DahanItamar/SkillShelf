// Maintainer helper for the gatehouse examples. Optional. No packages.
// The committed hidden-text fixture writes its Unicode tag characters as
// escapes such as <U+E0046>, so the repository holds no invisible text.
// This script writes temporary copies in which each escape in the range
// U+E0000..U+E007F is replaced by the real character, so Gatehouse can be run on it.
//   node examples/make-fixtures.mjs        prints the path of the generated hidden-text copy (rtl-notes sits beside it)
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

export function build(outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gatehouse-fixtures-'))) {
  // Every generated fixture is the committed folder with its escapes expanded in SKILL.md.
  // Returns the hidden-text copy; rtl-notes is written next to it.
  let first = null;
  for (const name of ['hidden-text', 'rtl-notes']) {
    const dst = path.join(outDir, name);
    fs.cpSync(path.join(here, 'fixtures', name), dst, { recursive: true });
    const f = path.join(dst, 'SKILL.md');
    fs.writeFileSync(f, expand(fs.readFileSync(f, 'utf8')));
    first = first || dst;
  }
  return first;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(build());
}
