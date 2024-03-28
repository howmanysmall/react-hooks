//!native
//!nonstrict
//!optimize 2

import { is } from "../utilities/object-utilities";

/**
 * A faster properties compare for use with {@linkcode React.memo}. Probably
 * doesn't really help much while also being dangerous, but it is there for
 * you.
 *
 * @param a
 * @param b
 * @returns
 */
export function unsafeCompare<T extends object>(a: T, b: T) {
	let lengthA = 0;
	for (const [key] of a as Map<keyof T, unknown>) {
		lengthA += 1;
		if (!is(a[key], b[key])) return false;
	}

	let lengthB = 0;
	for (const [_] of b as Map<keyof T, unknown>) lengthB += 1;
	return lengthA === lengthB;
}

/**
 * Compares two values for equality, taking into account nested tables.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @return Returns true if the values are equal, false otherwise.
 */
export function safeCompare(a: unknown, b: unknown) {
	if (a === b) return true;
	if (!typeIs(a, "table") || !typeIs(b, "table")) return false;

	let lengthA = 0;
	for (const [key] of a as Map<never, unknown>) {
		lengthA += 1;
		if (!is(a[key], b[key])) return false;
		if (!(key in b)) return false;
	}

	let lengthB = 0;
	for (const [_] of b as Map<never, unknown>) lengthB += 1;
	return lengthA === lengthB;
}
