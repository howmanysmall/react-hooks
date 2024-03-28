//!native
//!nonstrict
//!optimize 2

import { useEffect, useState } from "@rbxts/react";
import { Workspace } from "@rbxts/services";

/**
 * A hook that gets the current camera.
 * @param onChanged What to call when the current camera changes.
 * @returns The current camera.
 */
export function useCurrentCamera(onChanged?: (currentCamera: Camera) => void): Camera {
	const [currentCamera, setCurrentCamera] = useState(Workspace.CurrentCamera!);

	function updateCurrentCamera() {
		const localCurrentCamera = Workspace.CurrentCamera;
		if (localCurrentCamera) {
			setCurrentCamera(localCurrentCamera);
			onChanged?.(localCurrentCamera);
		}

		const connection = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			const localCurrentCamera = Workspace.CurrentCamera;
			if (localCurrentCamera) {
				setCurrentCamera(localCurrentCamera);
				onChanged?.(localCurrentCamera);
			}
		});

		return () => connection.Disconnect();
	}
	useEffect(updateCurrentCamera, [onChanged]);

	return currentCamera;
}
