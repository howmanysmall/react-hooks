//!native
//!nonstrict
//!optimize 2

import { useLazyReference } from "./use-lazy-reference";

/**
 * A hook that returns the result of an initialization function.
 *
 * The initializeFunction is only invoked on the first render. The returned
 * value is saved and returned directly on all subsequent renders.
 *
 * @param initializeFunction
 * @returns
 */
export function useInitializedValue<T>(initializeFunction: () => T) {
	const reference = useLazyReference(initializeFunction);
	return reference.current;
}
