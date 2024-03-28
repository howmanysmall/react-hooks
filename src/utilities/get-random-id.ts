//!native
//!nonstrict
//!optimize 2

import stringSlice from "./string-slice";

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

export default function getRandomId() {
	return `hooks-${stringSlice(toBase36(math.random()), 2, 11)}`;
}
