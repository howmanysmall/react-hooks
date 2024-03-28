//!native
//!nonstrict
//!optimize 2

import { useLayoutEffect, useState } from "@rbxts/react";
import safeThreadCancel from "../../utilities/safe-thread-cancel";

/**
 * Generates a debounced value based on the input value and timeout.
 *
 * @param value - The value to be debounced.
 * @param [timeout] - The time in milliseconds to wait before updating the debounced value.
 * @return The debounced value.
 */
export function useDebounce<T>(value: T, timeout?: number) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	function debounceEffect() {
		function updateValue() {
			setDebouncedValue(value);
		}

		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (!timeout) {
			updateValue();
			return;
		}

		const thread = task.delay(timeout, updateValue);
		return () => safeThreadCancel(thread);
	}
	useLayoutEffect(debounceEffect, [timeout, value]);

	return debouncedValue;
}
