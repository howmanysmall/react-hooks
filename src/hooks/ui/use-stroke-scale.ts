//!native
//!nonstrict
//!optimize 2

import { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { Workspace } from "@rbxts/services";

const NORMAL_ASPECT_RATIO = 16 / 9;
function clampToNormal(viewportSize: Vector2) {
	return viewportSize.X / viewportSize.Y > NORMAL_ASPECT_RATIO
		? viewportSize.X * NORMAL_ASPECT_RATIO
		: viewportSize.X;
}

/**
 * A hook that calculates and applies stroke thickness based on pixel thickness and relative size.
 *
 * @param pixelThickness - the thickness of the stroke in pixels
 * @param relativeSize - the relative size used for calculating stroke thickness
 * @param [clampToNormalAspectRatio] - whether to clamp the stroke thickness to the normal aspect ratio
 * @return the calculated stroke thickness
 */
export function useStrokeScale(pixelThickness = 1, relativeSize = 985, clampToNormalAspectRatio?: boolean) {
	const [thickness, setThickness] = useBinding(0);
	const ratio = pixelThickness / relativeSize;

	const getViewportSizeX = useCallback(
		(viewportSize: Vector2) => (clampToNormalAspectRatio ? clampToNormal(viewportSize) : viewportSize.X),
		[clampToNormalAspectRatio],
	);

	function thicknessEffect() {
		const currentCamera = Workspace.CurrentCamera;
		if (!currentCamera) return;

		setThickness(getViewportSizeX(currentCamera.ViewportSize) * ratio);
		const connection = currentCamera
			.GetPropertyChangedSignal("ViewportSize")
			.Connect(() => setThickness(getViewportSizeX(currentCamera.ViewportSize) * ratio));

		return () => connection.Disconnect();
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(thicknessEffect, [ratio, getViewportSizeX]);

	return thickness;
}

/**
 * A hook that calculates and applies stroke thickness based on pixel thickness and relative size.
 *
 * This returns a number instead of a binding, so beware!
 *
 * @param pixelThickness - the thickness of the stroke in pixels
 * @param relativeSize - the relative size used for calculating stroke thickness
 * @param [clampToNormalAspectRatio] - whether to clamp the stroke thickness to the normal aspect ratio
 * @return the calculated stroke thickness
 */
export function useStrokeScaleState(pixelThickness = 1, relativeSize = 985, clampToNormalAspectRatio?: boolean) {
	const [thickness, setThickness] = useState(0);
	const ratio = pixelThickness / relativeSize;

	const getViewportSizeX = useCallback(
		(viewportSize: Vector2) => (clampToNormalAspectRatio ? clampToNormal(viewportSize) : viewportSize.X),
		[clampToNormalAspectRatio],
	);

	function thicknessEffect() {
		const currentCamera = Workspace.CurrentCamera;
		if (!currentCamera) return;

		setThickness(getViewportSizeX(currentCamera.ViewportSize) * ratio);
		const connection = currentCamera
			.GetPropertyChangedSignal("ViewportSize")
			.Connect(() => setThickness(getViewportSizeX(currentCamera.ViewportSize) * ratio));

		return () => connection.Disconnect();
	}
	useEffect(thicknessEffect, [ratio, getViewportSizeX]);

	return thickness;
}
