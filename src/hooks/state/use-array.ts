//!native
//!nonstrict
//!optimize 2

import { useCallback, useState } from "@rbxts/react";
import { arrayReverseMutation } from "../../utilities/array-utilities";

/**
 * Lets you manipulate an array data structure without ever needing extra utilities.
 * @param initialValue The initial array to use.
 * @returns
 */
export function useArray<T extends defined>(initialValue: Array<T>) {
	const [array, setArray] = useState(initialValue);

	const createNewArray = useCallback(
		(callback: (array: Array<T>) => Array<T>) => setArray((currentArray) => callback(table.clone(currentArray))),
		[],
	);

	const append = useCallback(
		(...elements: ReadonlyArray<T>) =>
			createNewArray((currentArray) => elements.move(0, elements.size() - 1, currentArray.size(), currentArray)),
		[createNewArray],
	);

	const filter = useCallback(
		(callback: (value: T, index: number, array: ReadonlyArray<T>) => boolean) =>
			createNewArray((currentArray) => currentArray.filter(callback)),
		[createNewArray],
	);

	const set = useCallback(
		(index: number, value: T) =>
			createNewArray((currentArray) => {
				currentArray[index] = value;
				return currentArray;
			}),
		[createNewArray],
	);

	const remove = useCallback(
		(index: number) =>
			createNewArray((currentArray) => {
				currentArray.remove(index);
				return currentArray;
			}),
		[createNewArray],
	);
	const unorderedRemove = useCallback(
		(index: number) =>
			createNewArray((currentArray) => {
				currentArray.unorderedRemove(index);
				return currentArray;
			}),
		[createNewArray],
	);

	const clear = useCallback(() => setArray([]), []);
	const map = useCallback(
		(callback: (value: T, index: number, array: ReadonlyArray<T>) => T) =>
			createNewArray((currentArray) => currentArray.map(callback)),
		[createNewArray],
	);

	const mapFiltered = useCallback(
		(callback: (value: T, index: number, array: ReadonlyArray<T>) => T | undefined) =>
			createNewArray((currentArray) => currentArray.mapFiltered(callback)),
		[createNewArray],
	);

	const unshift = useCallback(
		(...elements: ReadonlyArray<T>) =>
			createNewArray((currentArray) => {
				for (const index of $range(elements.size() - 1, 0, -1)) currentArray.unshift(elements[index]);
				return currentArray;
			}),
		[createNewArray],
	);

	const reverse = useCallback(() => createNewArray(arrayReverseMutation), [createNewArray]);
	const sort = useCallback(
		(compare?: (a: T, b: T) => boolean) => createNewArray((currentArray) => currentArray.sort(compare)),
		[createNewArray],
	);

	const shift = useCallback(
		() =>
			createNewArray((currentArray) => {
				currentArray.shift();
				return currentArray;
			}),
		[createNewArray],
	);

	const insert = useCallback(
		(index: number, value: T) =>
			createNewArray((currentArray) => {
				currentArray.insert(index, value);
				return currentArray;
			}),
		[createNewArray],
	);
	const pop = useCallback(
		() =>
			createNewArray((currentArray) => {
				currentArray.pop();
				return currentArray;
			}),
		[createNewArray],
	);

	const filterUndefined = useCallback(
		() => createNewArray((currentArray) => currentArray.filterUndefined()),
		[createNewArray],
	);

	return table.freeze({
		append,
		array,
		clear,
		createNewArray,
		filter,
		filterUndefined,
		insert,
		map,
		mapFiltered,
		pop,
		remove,
		reverse,
		set,
		setArray,
		shift,
		sort,
		unorderedRemove,
		unshift,
	});
}
