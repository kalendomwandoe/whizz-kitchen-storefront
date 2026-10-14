// Returns the number as 254XXXXXXXXX, or null if it isn't a valid Kenyan mobile number.
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "").replace(/^\+/, "");

  let international = digits;
  if (digits.startsWith("0")) international = `254${digits.slice(1)}`;
  else if (/^[17]\d{8}$/.test(digits)) international = `254${digits}`;

  return /^254[17]\d{8}$/.test(international) ? international : null;
}