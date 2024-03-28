//!native
//!nonstrict
//!optimize 2

import React, { useEffect, useRef, useState } from "@rbxts/react";

/**
 * Creates a reference to an object of type T and returns a tuple containing the reference and the object itself.
 *
 * @template T - The type of the object being referenced.
 * @returns A tuple containing the {@linkcode React.useRef} reference and the object itself.
 */
export function useObjectReference<T extends Instance>() {
	const reference = useRef<T | undefined>();
	const [object, setObject] = useState<T | undefined>();

	function setObjectEffect() {
		const rbx = reference.current;
		if (rbx) setObject(rbx);
	}
	useEffect(setObjectEffect, []);

	return $tuple<Tuple<T>>(reference, object);
}

type Tuple<T extends Instance> = [reference: React.MutableRefObject<T | undefined>, object?: T];
