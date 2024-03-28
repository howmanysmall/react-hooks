//!native
//!nonstrict
//!optimize 2

import type { InferSignalParameters, SignalLike } from "../types";

export default function connect<T extends SignalLike>(
	event: T,
	callback: (...signalArguments: InferSignalParameters<T>) => void,
) {
	if ("Connect" in event) {
		assert(typeIs(event.Connect, "function"), "not a function");
		return event.Connect(callback);
	}

	if ("connect" in event) {
		assert(typeIs(event.connect, "function"), "not a function");
		return event.connect(callback);
	}

	return { Disconnect() {} };
}
