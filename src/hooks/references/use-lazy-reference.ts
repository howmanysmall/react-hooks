//!native
//!nonstrict
//!optimize 2

import React, { useRef } from "@rbxts/react";
import Error from "../../utilities/error";

/**
 * An alternative to useRef that avoids creating the initial value when it is not needed.
 * It takes an initialization function instead, and only invokes it on the first call.
 * The value returned is a ref with its current value set to what the init function returned.
 *
 * @param initializeFunction
 * @returns
 */
export function useLazyReference<T>(initializeFunction: () => T): React.MutableRefObject<T> {
	const reference = useRef<T | undefined>();
	if (reference.current === undefined) reference.current = initializeFunction();

	if (reference.current === undefined) {
		const exception = new Error("Reference must be defined after initialization function is called!");
		Error.captureStackTrace(exception, useLazyReference);
		throw exception;
	}

	return reference as React.MutableRefObject<T>;
}
