//!native
//!nonstrict
//!optimize 2

import { useRef } from "@rbxts/react";
import { Dictionary } from "@rbxts/sift";

const equalsDeep = Dictionary.equalsDeep as (...objects: ReadonlyArray<unknown>) => boolean;

function deepCompare(previousValue?: ReadonlyArray<unknown>, currentValue?: ReadonlyArray<unknown>) {
	if (!previousValue || !currentValue) return false;
	if (previousValue === currentValue) return true;

	const length = previousValue.size();
	if (length !== currentValue.size()) return false;

	for (const index of $range(0, length - 1)) if (!equalsDeep(previousValue[index], currentValue[index])) return false;
	return true;
}

/**
 * A custom hook that performs a deep comparison of the dependencies array and updates the reference count if there is a change.
 *
 * @param dependencies - An optional array of dependencies to be compared.
 * @return An array containing the updated reference count.
 */
export function useDeepCompare(dependencies?: ReadonlyArray<unknown>): ReadonlyArray<number> {
	const reference = useRef<ReadonlyArray<unknown>>([]);
	const updatedReference = useRef(0);

	if (!deepCompare(reference.current, dependencies)) {
		reference.current = dependencies!;
		updatedReference.current += 1;
	}

	return [updatedReference.current];
}
