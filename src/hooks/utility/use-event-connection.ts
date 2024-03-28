//!native
//!nonstrict
//!optimize 2

import { useEffect, useMemo } from "@rbxts/react";
import type { InferSignalParameters, SignalLike } from "../../types";
import connect from "../../utilities/connect";

/**
 * Hook that establishes a connection between a signal and a callback function,
 * and automatically disconnects when the component unmounts. The callback function
 * will be memoized using the provided dependencies.
 *
 * @param signal - The signal to connect to.
 * @param callback - The callback function to invoke when the signal emits.
 * @param dependencies - The dependencies to use for memoizing the callback function.
 */
export function useEventConnection<T extends SignalLike>(
	signal: T,
	callback: (...signalArguments: InferSignalParameters<T>) => void,
	dependencies: ReadonlyArray<unknown>,
) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const cachedCallback = useMemo(() => callback, dependencies);

	function connectEffect() {
		const connection = connect(signal, cachedCallback);
		return () => connection.Disconnect();
	}
	useEffect(connectEffect, [signal, cachedCallback]);
}
