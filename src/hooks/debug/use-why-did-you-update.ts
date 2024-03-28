//!native
//!nonstrict
//!optimize 2

import { TableToString } from "@rbxts/rbx-debug";
import { useEffect, useRef } from "@rbxts/react";
import { keys } from "../../utilities/object-utilities";

interface ChangeObject {
	from: unknown;
	to: unknown;
}

/**
 * A simple hook that checks which prop caused the component to re-render.
 * @param name The name of the component.
 * @param props The props of the component.
 * @param logFunction The function to use to log the changes.
 * @param logEnabled Whether or not to log the changes.
 */
export function useWhyDidYouUpdate(
	name: string,
	properties: Record<string, unknown>,
	logFunction = print,
	logEnabled = true,
) {
	const previousProperties = useRef<Record<string, unknown>>({});

	function updateCheckEffect() {
		const previous = previousProperties.current;
		if (previous) {
			const allKeys = keys({ ...previous, ...properties });
			const changesObject: Record<string, ChangeObject> = {};

			for (const key of allKeys)
				if (previous[key] !== properties[key])
					changesObject[key] = {
						from: previous[key],
						to: properties[key],
					};

			if (logEnabled && next(changesObject)[0] !== undefined)
				logFunction(`${name} ${TableToString(changesObject, true)}`);
		}

		previousProperties.current = properties;
	}
	useEffect(updateCheckEffect);
}
