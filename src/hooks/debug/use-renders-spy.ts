//!native
//!nonstrict
//!optimize 2

import { useEffect, useRef } from "@rbxts/react";

/**
 * A simple function that checks how many times the component
 * has been rendered.
 * @returns The render count.
 */
export function useRendersSpy() {
	const count = useRef(0);

	function countIncrementEffect() {
		count.current += 1;
	}
	useEffect(countIncrementEffect);

	return count.current;
}
