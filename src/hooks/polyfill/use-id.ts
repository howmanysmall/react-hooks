//!native
//!nonstrict
//!optimize 2

import { useLayoutEffect, useState } from "@rbxts/react";
import getRandomId from "../../utilities/get-random-id";

/**
 * The `useId` hook generates random id that persists across renders.
 * Hook is usually used to bind input elements to labels. Generated
 * random id is saved to ref and will not change unless component is
 * unmounted.
 *
 * @param staticId A static id to use instead of a generated one.
 */
export function useId(staticId?: string) {
	const [uuid, setUuid] = useState("");

	function updateUuidEffect() {
		setUuid(getRandomId());
	}
	useLayoutEffect(updateUuidEffect, []);

	return staticId ?? uuid;
}
