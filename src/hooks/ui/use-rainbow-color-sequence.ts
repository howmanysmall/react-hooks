//!native
//!nonstrict
//!optimize 2

import { useBinding, useCallback, useEffect, useRef, type Binding } from "@rbxts/react";
import { RunService } from "@rbxts/services";

const INCREMENT_CHECK = 2;
const FREQUENCY = math.pi / 12;
const PI_DIV_40 = math.pi / 40;
const TAU = math.pi * 2;
const TOTAL_POINTS = 15;
const WHITE_COLOR3 = Color3.fromRGB(255, 255, 255);

/**
 * The options for the `useRainbowColorSequence` hook.
 */
export interface RainbowColorSequenceOptions {
	/**
	 * Whether or not the hook should be in performance mode.
	 * Performance mode disables the effect entirely.
	 *
	 * @default false
	 */
	readonly isPerformanceMode: boolean;

	/**
	 * Whether or not the hook should be visible.
	 *
	 * @default true
	 */
	readonly visible: boolean;
}

/**
 * A hook that creates a rainbow color sequence.
 * @param options The options for the hook.
 * @param [framerate] The framerate to use. Makes the color sequence more smooth.
 * @returns The color sequence.
 */
export function useRainbowColorSequence(
	{ isPerformanceMode = false, visible = true }: Partial<RainbowColorSequenceOptions> = {},
	framerate?: Binding<number>,
) {
	const colorSequenceArray = useRef(new Array<ColorSequenceKeypoint>(TOTAL_POINTS + 1)).current;
	const [colorSequence, setColorSequence] = useBinding(new ColorSequence(WHITE_COLOR3));
	const [increment, setIncrement] = useBinding(0);
	const [phaseShift, setPhaseShift] = useBinding(0);

	const onUpdateEvent = useCallback(
		(deltaTime: number) => {
			debug.profilebegin("useRainbowColorSequence.onUpdateEvent");
			const currentIncrement = increment.getValue();
			if (!isPerformanceMode && currentIncrement % INCREMENT_CHECK === 0) {
				let currentPhaseShift = phaseShift.getValue();
				debug.profilebegin("create colorSequenceArray");
				for (const index of $range(0, TOTAL_POINTS))
					colorSequenceArray[index] = new ColorSequenceKeypoint(
						index / TOTAL_POINTS,
						Color3.fromRGB(
							127 * math.sin(FREQUENCY * index + currentPhaseShift) + 128,
							127 * math.sin(FREQUENCY * index + 2 * 1.0471975511966 + currentPhaseShift) + 128,
							127 * math.sin(FREQUENCY * index + 4 * 1.0471975511966 + currentPhaseShift) + 128,
						),
					);
				debug.profileend();

				setColorSequence(new ColorSequence(colorSequenceArray));
				colorSequenceArray.clear();

				const scaleFactor = (60 / (framerate?.getValue() ?? 60)) * 60;
				currentPhaseShift += PI_DIV_40 * deltaTime * scaleFactor;
				if (currentIncrement >= TAU) currentPhaseShift = 0;

				setPhaseShift(currentPhaseShift);
			}
			setIncrement((currentIncrement + 1) % 1000);
			debug.profileend();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[framerate, isPerformanceMode],
	);

	const onEventFired = useCallback(
		(deltaTime: number) => {
			if (visible) onUpdateEvent(deltaTime);
		},
		[onUpdateEvent, visible],
	);

	function initialUpdateEffect() {
		if (isPerformanceMode) onUpdateEvent(1 / 60);
	}
	useEffect(initialUpdateEffect, [onUpdateEvent, isPerformanceMode]);

	function createConnectionEffect() {
		if (!visible) return;
		const connection = RunService.PostSimulation.Connect(onEventFired);
		return () => connection.Disconnect();
	}
	useEffect(createConnectionEffect, [onEventFired, visible]);

	return colorSequence;
}
