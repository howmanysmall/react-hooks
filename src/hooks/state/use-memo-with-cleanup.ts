//!native
//!nonstrict
//!optimize 2

import { useEffect, useRef } from "@rbxts/react";

/**
 * Returns a memoized value that is created by the `createValue` function and cleaned up by the `cleanupValue` function.
 * The memoized value is recalculated when any of the dependencies change.
 *
 * @param createValue - A function that creates the memoized value.
 * @param cleanupValue - A function that cleans up the memoized value.
 * @param dependencies - An array of dependencies that trigger the recalculation of the memoized value.
 * @return The memoized value.
 */
export function useMemoWithCleanup<T extends defined>(
	createValue: () => T,
	cleanupValue: (value: T) => void,
	dependencies: ReadonlyArray<unknown>,
): T {
	const currentValue = useRef<CurrentValue<T> | undefined>();

	let needsToRecalculate = false;
	if (currentValue.current) {
		let index = 0;
		for (const dependency of dependencies) {
			if (dependency !== currentValue.current.dependencies[index]) {
				needsToRecalculate = true;
				break;
			}
			index += 1;
		}
	} else needsToRecalculate = true;

	if (needsToRecalculate) {
		const currentValueCurrent = currentValue.current;
		if (currentValueCurrent) cleanupValue(currentValueCurrent.memoizedValue);

		currentValue.current = {
			dependencies,
			memoizedValue: createValue(),
		};
	}

	function memoCleanupEffect() {
		return () => {
			const currentValueCurrent = currentValue.current;
			if (!currentValueCurrent) return;
			cleanupValue(currentValueCurrent.memoizedValue);
			currentValue.current = undefined;
		};
	}
	useEffect(memoCleanupEffect, [cleanupValue]);
	return currentValue.current!.memoizedValue;
}

interface CurrentValue<T extends defined> {
	dependencies: ReadonlyArray<unknown>;
	memoizedValue: T;
}
