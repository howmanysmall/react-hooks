//!native
//!nonstrict
//!optimize 2

import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useAsyncEffect } from "./use-async-effect";

function promiseLocalPlayer() {
	const localPlayer = Players.LocalPlayer;
	if (localPlayer) return Promise.resolve(localPlayer);

	return Promise.fromEvent(
		Players.GetPropertyChangedSignal("LocalPlayer"),
		() => Players.LocalPlayer !== undefined,
	).andThenReturn(Players.LocalPlayer!);
}

export function useLocalPlayer() {
	const [localPlayer, setLocalPlayer] = useState<Player>();

	function localPlayerAsyncEffect() {
		return promiseLocalPlayer()
			.then(setLocalPlayer)
			.catch((exception) => warn(`Failed to get LocalPlayer in useLocalPlayer? - ${exception}`));
	}
	useAsyncEffect(localPlayerAsyncEffect, []);

	return localPlayer;
}
