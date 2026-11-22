// The buggy version, as found in the case. 1.005 * 100 is 100.49999999999999
// in binary floating point, so a half-cent boundary rounds the wrong way.
export function roundMoney(x) {
  return Math.round(x * 100) / 100;
}
