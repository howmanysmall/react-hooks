//!native
//!nonstrict
//!optimize 2

import { useCallback, useImperativeHandle, useRef, type Ref } from "@rbxts/react";

/**
 * This function creates a ref that will call the given updateFunction whenever the ref is updated.
 *
 * - If the ref is set to a non-nil value, the updateFunction will be called with that value.
 * - If the ref is set to nil, the updateFunction will be called with no arguments.
 * ---
 * - The updateFunction is expected to return a cleanup function, which will be called before the next update.
 * - The updateFunction will be called whenever the ref is updated, even if the ref is set to the same value.
 * - The updateFunction will not be called if the component is unmounted.
 *
 * @param forwardReference
 * @param updateFunction
 * @returns
 */
export function useForwardReference<T>(forwardReference: Ref<T>, updateFunction: UpdateFunction<T>) {
	const value = useRef<T | undefined>(undefined);
	const cleanup = useRef<CleanupFunction | undefined>(undefined);

	const reference = useCallback(
		(instance?: T) => {
			cleanup.current?.();
			cleanup.current = undefined;

			// eslint-disable-next-line roblox-ts/lua-truthiness
			if (instance) {
				value.current = instance;
				cleanup.current = updateFunction(instance) as CleanupFunction;
			}
		},
		[updateFunction],
	);

	useImperativeHandle(forwardReference, () => value.current!);
	return reference;
}

type CleanupFunction = () => void;
type UpdateFunction<T> = ((value: T) => CleanupFunction) | ((value: T) => void);
