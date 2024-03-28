//!native
//!nonstrict
//!optimize 2

import { useCallback, useRef } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import type { Vector2Like } from "../../types";
import { useEventConnection } from "../utility/use-event-connection";

const DEFAULT_INPUTS: Array<Enum.UserInputType> = [Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch];

function contains<T extends Vector2Like>(guiObject: GuiBase2d, position: T) {
	const absolutePosition = guiObject.AbsolutePosition;
	const absoluteSize = guiObject.AbsoluteSize;

	const x = position.X;
	const y = position.Y;

	return (
		absolutePosition.X <= x &&
		absolutePosition.Y <= y &&
		absolutePosition.X + absoluteSize.X >= x &&
		absolutePosition.Y + absoluteSize.Y >= y
	);
}

/**
 * Custom hook that triggers a callback when clicking outside of a specified set of GUI objects.
 *
 * @param onClickedOutside - Callback function to be triggered when clicking outside of the GUI objects.
 * @param [userInputTypes] - Array of user input types to listen for.
 * @param [guiObjects] - Optional array of GUI objects to check for clicking outside.
 * @return Reference to the mutable ref object containing the GUI base 2D element.
 */
export function useClickOutside<T extends GuiBase2d>(
	onClickedOutside: () => void,
	userInputTypes: Array<Enum.UserInputType> = DEFAULT_INPUTS,
	guiObjects?: Array<GuiObject>,
): React.MutableRefObject<T | undefined> {
	const reference = useRef<T>();

	const onInputBegan = useCallback(
		(inputObject: InputObject) => {
			if (guiObjects) {
				let shouldTrigger = true;
				for (const guiObject of guiObjects)
					if (contains(guiObject, inputObject.Position)) {
						shouldTrigger = false;
						break;
					}

				if (shouldTrigger) onClickedOutside();
			} else {
				const guiBase2d = reference.current;
				if (guiBase2d && !contains(guiBase2d, inputObject.Position)) onClickedOutside();
			}
		},
		[guiObjects, onClickedOutside],
	);

	useEventConnection(
		UserInputService.InputBegan,
		(inputObject) => {
			if (userInputTypes.includes(inputObject.UserInputType)) onInputBegan(inputObject);
		},
		[onInputBegan, userInputTypes],
	);

	return reference;
}
