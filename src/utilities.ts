//!native
//!nonstrict
//!optimize 2

function safeEquals(a: unknown, b: unknown) {
	if (a === 0 && b === 0) return 1 / a === 1 / b;
	// biome-ignore lint/suspicious/noSelfCompare: nan check
	if (a !== a && b !== b) return true;
	return a === b;
}

const POSSIBLE_VALUES = "0123456789abcdefghijklmnopqrstuvwxyz".split("");

function toBase36(value: number) {
	let result = "";
	let [intPart, decimalPart] = math.modf(value);

	while (intPart > 0) {
		const index = intPart % 36;
		result = POSSIBLE_VALUES[index] + result;
		intPart = intPart.idiv(36);
	}

	if (decimalPart > 0) {
		result += ".";
		while (decimalPart > 0) {
			decimalPart *= 36;
			const digit = math.floor(decimalPart);
			result += POSSIBLE_VALUES[digit];
			decimalPart -= digit;
		}
	}

	return result;
}

namespace Utilities {
	export function keys<T extends object, K extends keyof T>(object: T): Array<K> {
		const result = new Array<K>();
		let length = 0;
		for (const [key] of pairs(object)) result[length++] = key as K;
		return result;
	}

	export function objectIs(a: unknown, b: unknown) {
		return a === b ? a !== 0 || 1 / a === 1 / (b as typeof a) : safeEquals(a, b);
	}

	export function stringSlice(value: string, startIndexString: number | string, lastIndexString?: number | string) {
		const [stringLength, invalidBytePosition] = utf8.len(value);
		assert(
			stringLength !== undefined && stringLength !== false,
			"string `%*` has an invalid byte at position %*".format(value, tostring(invalidBytePosition)),
		);

		let startIndex = tonumber(startIndexString);
		assert(typeIs(startIndex, "number"), "startIndexStr should be a number");

		if (startIndex + stringLength < 0) startIndex = 1;
		if (startIndex > stringLength) return "";

		let lastIndex = stringLength + 1;
		if (lastIndexString !== undefined) lastIndex = tonumber(lastIndexString) ?? 0 / 0;

		assert(typeIs(lastIndex, "number"), "lastIndexStr should convert to number");
		if (lastIndex > stringLength) lastIndex = stringLength + 1;

		const startIndexByte = utf8.offset(value, startIndex)!;
		const lastIndexByte = utf8.offset(value, lastIndex)! - 1;
		return value.sub(startIndexByte, lastIndexByte);
	}

	export function getRandomId() {
		return `hooks-${stringSlice(toBase36(math.random()), 2, 11)}`;
	}
}

export = Utilities;
