/**
 * Returns the inclusive last row offset for a Supabase range, or null when
 * the range would exceed JavaScript's safe-integer precision.
 */
export function getEndOffset(offset: number, limit: number): number | null {
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(limit) ||
    limit < 1
  ) {
    return null;
  }

  // Check before addition: floating-point rounding can otherwise make an
  // overflowing sum appear to be a safe integer after subtracting one.
  const additionalRows = limit - 1;
  if (offset > Number.MAX_SAFE_INTEGER - additionalRows) {
    return null;
  }

  return offset + additionalRows;
}
