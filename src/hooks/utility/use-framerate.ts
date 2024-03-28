//!native
//!nonstrict
//!optimize 2

import { useBinding, useEffect, useRef, type Binding } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { addSample, getAverage, getSamples } from "../../utilities/rolling-average";
import { useEventConnection } from "./use-event-connection";

/**
 * A custom hook for tracking the framerate of the client, using the provided
 * clock function and {@linkcode RunService.PostSimulation}.
 *
 * @param [clockFunction] - the function to use for tracking time. Defaults to {@linkcode os.clock}.
 * @return A tuple containing the current framerate and the average framerate
 */
export function useFramerate(clockFunction = os.clock) {
	const [framerate, setFramerate] = useBinding(60);
	const [average, setAverage] = useBinding(60);
	const frameUpdateArray = useRef(new Array<number>(100));
	const startTime = useRef(clockFunction());
	const samples = useRef(getSamples());

	function updateStartTimeWhenClockChanges() {
		startTime.current = clockFunction();
		frameUpdateArray.current.clear();
	}
	useEffect(updateStartTimeWhenClockChanges, [clockFunction]);

	useEventConnection(
		RunService.PostSimulation,
		() => {
			const current = frameUpdateArray.current;
			const lastIteration = clockFunction();
			for (const index of $range(current.size() - 1, 0, -1)) {
				const value = current[index];
				current[index + 1] = value >= lastIteration - 1 ? value : undefined!;
			}
			current[0] = lastIteration;

			const currentTime = clockFunction() - startTime.current;
			const newFramerate = currentTime >= 1 ? current.size() : current.size() / currentTime;
			addSample(samples.current, newFramerate);
			setFramerate(newFramerate);
			setAverage(getAverage(samples.current));
		},
		[clockFunction],
	);

	return $tuple<Tuple>(framerate, average);
}

type Tuple = [framerate: Binding<number>, averageFramerate: Binding<number>];
