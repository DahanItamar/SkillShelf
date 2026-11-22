// Local lint check. Reads the file path Claude Code passes on stdin and
// reports lines that end in spaces. No network, no other files, no writes.
import { readFileSync } from 'node:fs';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let path = null;
  try { path = JSON.parse(input).tool_input.file_path; } catch { /* not JSON: nothing to check */ }
  if (typeof path !== 'string') process.exit(0);
  let text = null;
  try { text = readFileSync(path, 'utf8'); } catch { process.exit(0); }
  const bad = text.split('
').flatMap((line, i) => (/[ 	]+$/.test(line) ? [i + 1] : []));
  if (bad.length) console.error('trailing whitespace on lines: ' + bad.join(', '));
});
