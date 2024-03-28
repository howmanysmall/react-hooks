//!native
//!nonstrict
//!optimize 2

import { useBinding, useEffect, useState, type Binding } from "@rbxts/react";
import { useCurrentCamera } from "./use-current-camera";

/**
 * Custom hook that returns the viewport size in a Binding and updates it when the current camera changes.
 *
 * @return The viewport size
 */
export function useViewportSize(): Binding<Vector2> {
	const currentCamera = useCurrentCamera();
	const [viewportSize, setViewportSize] = useBinding(currentCamera.ViewportSize);

	function viewportSizeEffect() {
		if (!currentCamera) return;

		setViewportSize(currentCamera.ViewportSize);
		const connection = currentCamera
			.GetPropertyChangedSignal("ViewportSize")
			.Connect(() => setViewportSize(currentCamera.ViewportSize));

		return () => connection.Disconnect();
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(viewportSizeEffect, [currentCamera]);

	return viewportSize;
}

/**
 * Custom hook that returns the viewport size and updates it when the current camera changes.
 *
 * @return The viewport size
 */
export function useViewportSizeState(): Vector2 {
	const currentCamera = useCurrentCamera();
	const [viewportSize, setViewportSize] = useState(currentCamera.ViewportSize);

	function viewportSizeEffect() {
		if (!currentCamera) return;

		setViewportSize(currentCamera.ViewportSize);
		const connection = currentCamera
			.GetPropertyChangedSignal("ViewportSize")
			.Connect(() => setViewportSize(currentCamera.ViewportSize));

		return () => connection.Disconnect();
	}
	useEffect(viewportSizeEffect, [currentCamera]);

	return viewportSize;
}
