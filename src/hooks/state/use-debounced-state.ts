//!native
//!nonstrict
//!optimize 2

import { useState } from "@rbxts/react";
import { useDebounce } from "./use-debounce";

/**
 * Creates a debounced state hook that returns a tuple containing the debounced state and a setter function.
 *
 * @param initialState - The initial state value.
 * @param [timeout] - The timeout in milliseconds for the debounce. If not provided, a default timeout of 500ms is used.
 * @return A tuple containing the debounced state and a setter function.
 */
export function useDebouncedState<T>(initialState: T, timeout?: number) {
	const [state, setState] = useState(initialState);
	const debouncedState = useDebounce(state, timeout);
	return $tuple(debouncedState, setState);
}
