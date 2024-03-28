//!native
//!nonstrict
//!optimize 2

import { useCallback, useState } from "@rbxts/react";

interface ToggleState {
	readonly disable: () => void;
	readonly enable: () => void;
	readonly on: boolean;
	readonly toggle: () => void;
	readonly toggled: boolean;
}

/**
 * Creates a toggle state hook with initial state.
 *
 * @param initial - The initial state of the toggle.
 * @return An object containing the following properties:
 *   - disable: A function to disable the toggle.
 *   - enable: A function to enable the toggle.
 *   - on: A boolean indicating whether the toggle is enabled.
 *   - toggle: A function to toggle the toggle.
 *   - toggled: A boolean indicating the current state of the toggle. Same as `on`.
 */
export function useToggleState(initial: boolean): ToggleState {
	const [toggled, setToggled] = useState(initial);

	const enable = useCallback(() => setToggled(true), []);
	const disable = useCallback(() => setToggled(false), []);
	const toggle = useCallback(() => setToggled((currentToggled) => !currentToggled), []);

	return table.freeze({
		disable,
		enable,
		on: toggled,
		toggle,
		toggled,
	});
}
