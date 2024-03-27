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
	useEffect(() => {
		count.current += 1;
	});

	return count.current;
}
