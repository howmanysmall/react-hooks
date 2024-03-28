//!native
//!nonstrict
//!optimize 2

import { GuiService } from "@rbxts/services";
import type { Vector2Like } from "../../types";
import { useViewportSize } from "../utility/use-viewport-size";

const [TOP_INSET, BOTTOM_INSET] = GuiService.GetGuiInset();

/**
 * Gets a function that is used to scale a gui element with UIScale.
 *
 * @param scale The scale of the element.
 * @param goalSize The end goal size of the element.
 * @returns A binding with the scale.
 */
export function useScale<T extends Vector2Like>(scale: number, goalSize: T) {
	return useViewportSize().map((viewportSize) => {
		const size = viewportSize.sub(TOP_INSET).add(BOTTOM_INSET);
		return (1 / math.max(goalSize.X / size.X, goalSize.Y / size.Y)) * scale;
	});
}
