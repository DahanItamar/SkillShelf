// The fix confirmed in case 001: round on the decimal text of the number,
// not on a float product. Shifting the decimal point with an "e2" string
// gives exactly 100.5, so half a cent rounds up as expected.
// Positive amounts only: Math.round rounds halves toward +infinity, so
// roundMoney(-1.005) returns -1 and roundMoney(-2.675) returns -2.67.
export function roundMoney(x) {
  const text = String(x);
  if (text.includes("e")) {
    // Exponent notation (very large or very small numbers): keep the old path.
    return Math.round(x * 100) / 100;
  }
  return Number(`${Math.round(Number(`${text}e2`))}e-2`);
}
