//!native
//!nonstrict
//!optimize 2

import { useReducer } from "@rbxts/react";

function reducer(value: number) {
	return (value + 1) % 1_000_000;
}

/**
 * A hook that creates a function used to force a component to re-render.
 * @returns A function that forces a component to re-render.
 */
export function useForceUpdate() {
	const [currentUpdateCount, dispatch] = useReducer(reducer, 0);
	return $tuple<Tuple>(dispatch, currentUpdateCount);
}

type Tuple = [forceUpdate: () => void, currentUpdateCount: number];
