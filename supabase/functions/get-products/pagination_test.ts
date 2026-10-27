import { getEndOffset } from "./pagination.ts";

Deno.test("getEndOffset returns the inclusive end for normal ranges", () => {
  if (getEndOffset(0, 100) !== 99) {
    throw new Error("Expected offset 0 and limit 100 to end at 99.");
  }
});

Deno.test("getEndOffset permits the largest safe offset for a single row", () => {
  if (getEndOffset(Number.MAX_SAFE_INTEGER, 1) !== Number.MAX_SAFE_INTEGER) {
    throw new Error("Expected a single row at MAX_SAFE_INTEGER to be valid.");
  }
});

Deno.test("getEndOffset rejects a range that overflows safe-integer precision", () => {
  if (getEndOffset(Number.MAX_SAFE_INTEGER, 2) !== null) {
    throw new Error("Expected MAX_SAFE_INTEGER offset with limit 2 to be rejected.");
  }
});

Deno.test("getEndOffset accepts a range ending exactly at MAX_SAFE_INTEGER", () => {
  if (getEndOffset(Number.MAX_SAFE_INTEGER - 1, 2) !== Number.MAX_SAFE_INTEGER) {
    throw new Error("Expected the range ending at MAX_SAFE_INTEGER to be valid.");
  }
});
