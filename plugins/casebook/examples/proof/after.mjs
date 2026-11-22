// The fix confirmed in case 001: round on the decimal text of the number,
// not on a float product. Shifting the decimal point with an "e2" string
// gives exactly 100.5, so half a cent rounds up as expected.
export function roundMoney(x) {
  const text = String(x);
  if (text.includes("e")) {
    // Exponent notation (very large or very small numbers): keep the old path.
    return Math.round(x * 100) / 100;
  }
  return Number(`${Math.round(Number(`${text}e2`))}e-2`);
}
