//!native
//!nonstrict
//!optimize 2

import { useCallback, useState } from "@rbxts/react";
import type { OnInput } from "../../types";

export interface BasicInputEvents<T extends GuiObject> {
	readonly InputBegan: OnInput<T>;
	readonly InputEnded: OnInput<T>;
	readonly hovered: boolean;
	readonly onInputBegan: OnInput<T>;
	readonly onInputEnded: OnInput<T>;
	readonly pressed: boolean;
	readonly setHovered: (hovered: boolean) => void;
	readonly setPressed: (hovered: boolean) => void;
}

export interface Functions<T extends GuiObject> {
	readonly onHoverEnded?: (rbx: T, inputObject: InputObject) => void;
	readonly onHovered?: (rbx: T, inputObject: InputObject) => void;
	readonly onPressEnded?: (rbx: T, inputObject: InputObject) => void;
	readonly onPressed?: (rbx: T, inputObject: InputObject) => void;
}

/**
 * Basically just removes the boilerplate from the InputBegan and InputEnded events
 * for you. Also handles hovered and pressed states.
 *
 * @param functions
 * @returns
 */
export function useBasicInputEvents<T extends GuiObject>({
	onHoverEnded,
	onHovered,
	onPressEnded,
	onPressed,
}: Functions<T> = {}): BasicInputEvents<T> {
	const [hovered, setHovered] = useState(false);
	const [pressed, setPressed] = useState(false);

	const onInputBegan = useCallback<OnInput<T>>(
		(rbx, inputObject) => {
			const userInputType = inputObject.UserInputType;
			if (userInputType === Enum.UserInputType.MouseMovement) {
				setHovered(true);
				onHovered?.(rbx, inputObject);
			} else if (
				userInputType === Enum.UserInputType.MouseButton1 ||
				userInputType === Enum.UserInputType.Touch
			) {
				setPressed(true);
				onPressed?.(rbx, inputObject);
			}
		},
		[onHovered, onPressed],
	);

	const onInputEnded = useCallback<OnInput<T>>(
		(rbx, inputObject) => {
			const userInputType = inputObject.UserInputType;
			if (userInputType === Enum.UserInputType.MouseMovement) {
				setHovered(false);
				onHoverEnded?.(rbx, inputObject);
			} else if (
				userInputType === Enum.UserInputType.MouseButton1 ||
				userInputType === Enum.UserInputType.Touch
			) {
				setPressed(false);
				onPressEnded?.(rbx, inputObject);
			}
		},
		[onHoverEnded, onPressEnded],
	);

	return table.freeze({
		InputBegan: onInputBegan,
		InputEnded: onInputEnded,
		hovered,
		onInputBegan,
		onInputEnded,
		pressed,
		setHovered,
		setPressed,
	});
}
