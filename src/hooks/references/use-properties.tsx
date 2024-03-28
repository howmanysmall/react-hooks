//!native
//!nonstrict
//!optimize 2

import React, { useCallback } from "@rbxts/react";
import safeThreadCancel from "../../utilities/safe-thread-cancel";
import { useForwardReference } from "./use-forward-reference";

function usePropertiesBase<T extends Instance, K extends keyof InstanceProperties<T>>(
	forwardReference: React.Ref<T>,
	update: (...propertyValues: ReadonlyArray<T[K]>) => void,
	defer: boolean,
	...propertiesList: ReadonlyArray<K>
) {
	const onReferenceChanged = useCallback(
		(rbx: T) => {
			function onPropertyChanged() {
				update(...propertiesList.map((name) => rbx[name]));
			}

			let deferTask: thread | undefined = undefined;
			function deferOnPropertyChanged() {
				if (deferTask) return;
				deferTask = task.defer(() => {
					deferTask = undefined;
					onPropertyChanged();
				});
			}

			const connections = propertiesList.map((property) =>
				rbx.GetPropertyChangedSignal(property).Connect(defer ? deferOnPropertyChanged : onPropertyChanged),
			);

			onPropertyChanged();
			return () => {
				for (const connection of connections) connection.Disconnect();
				connections.clear();
				if (deferTask) safeThreadCancel(deferTask);
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[defer, update, propertiesList.join()],
	);

	return useForwardReference(forwardReference, onReferenceChanged);
}

/**
 * Allows safely using a property value from a reference.
 *
 * The update function will be called every time one of the watched properties change
 * it will also be called every time the ref instance changes, including on mount
 * update will be called with the values of the properties in the names list, in order
 * providing a different list of prop names will call update and watch the new properties.
 *
 * @example
 * const FrameComponent = React.forwardRef<Frame>((_, reference) => {
 * 	const [absolutePosition, setAbsolutePosition] = useState<Vector2 | undefined>(undefined);
 * 	const frameReference = useProperties(reference, setAbsolutePosition, "AbsolutePosition");
 * 	if (absolutePosition) print("hey cool we got AbsolutePosition ->", absolutePosition);
 *
 * 	return <frame ref={frameReference} />;
 * });
 *
 * @param forwardReference
 * @param update
 * @param propertiesList
 * @returns
 */
export function useProperties<T extends Instance, K extends keyof InstanceProperties<T>>(
	forwardReference: React.Ref<T>,
	update: (...propertyValues: ReadonlyArray<T[K]>) => void,
	...propertiesList: ReadonlyArray<K>
) {
	return usePropertiesBase(forwardReference, update, false, ...propertiesList);
}

/**
 * This changes the behavior of {@linkcode useProperties} by delaying the update callback
 * to the end of the frame.
 *
 * This might be useful to prevent reentrant cycles during layout of {@linkcode GuiObject}s
 * or to batch multiple updates into a single callback.
 *
 * @param forwardReference
 * @param update
 * @param propertiesList
 * @returns
 */
export function usePropertiesDeferred<T extends Instance, K extends keyof InstanceProperties<T>>(
	forwardReference: React.Ref<T>,
	update: (...propertyValues: ReadonlyArray<T[K]>) => void,
	...propertiesList: ReadonlyArray<K>
) {
	return usePropertiesBase(forwardReference, update, true, ...propertiesList);
}
