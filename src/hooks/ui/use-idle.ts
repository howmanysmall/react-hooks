//!native
//!nonstrict
//!optimize 2

import { useCallback, useEffect, useRef, useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { clearTimeout, setTimeout, type TimerTask } from "../../utilities/timers";
import { useEventConnection } from "../utility/use-event-connection";

const DEFAULT_INPUTS: Array<Enum.UserInputType> = [
	Enum.UserInputType.Keyboard,
	Enum.UserInputType.Touch,
	Enum.UserInputType.Gamepad1,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
];

export interface IdleOptions {
	readonly initialState: boolean;
	readonly userInputTypes: Array<Enum.UserInputType>;
	readonly usingWindowFocus: boolean;
}

/**
 * Returns a boolean value indicating whether the user is currently idle or not.
 *
 * @param {number} timeout - The time (in milliseconds) after which the user is considered idle.
 * @param {Partial<IdleOptions>} options - An optional object containing additional options:
 *   - initialState: The initial state of the idle flag. Defaults to `true`.
 *   - userInputTypes: An array of user input types that trigger the idle flag. Defaults to `DEFAULT_INPUTS`.
 *   - usingWindowFocus: A boolean value indicating whether to consider window focus as user input. Defaults to `true`.
 * @return {boolean} The current idle state of the user.
 */
export function useIdle(
	timeout: number,
	{ initialState = true, userInputTypes = DEFAULT_INPUTS, usingWindowFocus = true }: Partial<IdleOptions> = {},
) {
	const [idle, setIdle] = useState(initialState);
	const timer = useRef<TimerTask | undefined>(undefined);

	const handleInput = useCallback(() => {
		setIdle(false);
		if (timer.current !== undefined) clearTimeout(timer.current);
		timer.current = setTimeout(() => setIdle(true), timeout);
	}, [timeout]);

	useEventConnection(
		UserInputService.InputBegan,
		(inputObject) => {
			if (userInputTypes.includes(inputObject.UserInputType)) handleInput();
		},
		[userInputTypes, handleInput],
	);

	function handleWindowEffect() {
		if (!usingWindowFocus) return;

		const onWindowFocused = UserInputService.WindowFocused.Connect(handleInput);
		const onWindowFocusReleased = UserInputService.WindowFocusReleased.Connect(() => {
			if (timer.current !== undefined) {
				clearTimeout(timer.current);
				timer.current = undefined;
			}

			setIdle(true);
		});

		return () => {
			onWindowFocused.Disconnect();
			onWindowFocusReleased.Disconnect();
		};
	}
	useEffect(handleWindowEffect, [handleInput, usingWindowFocus]);

	return idle;
}
