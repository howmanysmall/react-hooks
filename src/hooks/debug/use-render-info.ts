//!native
//!nonstrict
//!optimize 2

import { TableToString } from "@rbxts/rbx-debug";
import { useEffect, useRef } from "@rbxts/react";

export interface RenderInfo {
	readonly name: string;
	readonly renders: number;
	readonly sinceLastRender: number;
	readonly timestamp: number;
}

/**
 * If you want to monitor and log how a component renders, you can use
 * the `useRenderInfo` hook. This hook records the render count, the
 * time difference between renders, and the current render timestamp.
 * This hook is especially useful for development purposes, as it helps
 * developers understand how a component behaves in terms of rendering,
 * and allows them to improve performance and detect potential problems.
 *
 * @param name The name of the component you are monitoring.
 * @param logFunction The function to use for logging. Defaults to `print`.
 * @param logEnabled Whether or not logging is enabled.
 */
export function useRenderInfo(name = "Unknown", logFunction = print, logEnabled = true): Readonly<RenderInfo> {
	const count = useRef(0);
	const lastRender = useRef<number>();
	const currentTime = os.clock();

	count.current += 1;

	function lastRenderUpdateEffect() {
		lastRender.current = os.clock();
	}
	useEffect(lastRenderUpdateEffect);

	const sinceLastRender = lastRender.current === undefined ? 0 : currentTime - lastRender.current;
	const info = {
		name,
		renders: count.current,
		sinceLastRender,
		timestamp: currentTime,
	};

	if (logEnabled) logFunction(TableToString(info, true));
	return table.freeze(info);
}
