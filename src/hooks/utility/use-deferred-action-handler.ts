//!native
//!nonstrict
//!optimize 2

import { useEffect, useRef } from "@rbxts/react";
import safeThreadCancel from "../../utilities/safe-thread-cancel";

/**
 * Custom hook that creates a deferred action handler with optional throttle time.
 *
 * @param timeout - The time in milliseconds before the action is executed
 * @param action - The action to be executed
 * @param [throttleTime] - The optional time in milliseconds to throttle the action
 * @param [clockFunction=os.clock] - The optional function to get the current time
 * @return The handleAction function that can be called to execute the action after the timeout
 */
export function useDeferredActionHandler(
	timeout: number,
	action: () => void,
	throttleTime?: number,
	clockFunction = os.clock,
) {
	const currentThreadReference = useRef<thread | undefined>();
	const lastThreadStartTime = useRef(0);

	function handleAction() {
		const currentTime = clockFunction();
		if (
			throttleTime !== undefined &&
			lastThreadStartTime.current !== undefined &&
			currentTime - lastThreadStartTime.current < throttleTime
		)
			return;

		lastThreadStartTime.current = currentTime;
		const currentThread = currentThreadReference.current;
		if (currentThread) safeThreadCancel(currentThread);

		currentThreadReference.current = task.delay(timeout, () => action());
	}

	function cancelEffect() {
		return () => {
			const currentThread = currentThreadReference.current;
			if (currentThread) safeThreadCancel(currentThread);
		};
	}
	useEffect(cancelEffect, [currentThreadReference]);

	return handleAction;
}
