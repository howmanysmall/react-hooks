//!native
//!nonstrict
//!optimize 2

namespace ArrayUtilities {
	export function arrayReverse<T extends defined>(array: Array<T>) {
		const newArray = table.clone(array);
		const length = array.size();
		for (const left of $range(0, length / 2 - 1)) {
			const right = length - 1 - left;
			[newArray[left], newArray[right]] = [newArray[right], newArray[left]];
		}
		return newArray;
	}

	export function arrayReverseMutation<T extends defined>(array: Array<T>) {
		const length = array.size();
		for (const left of $range(0, length / 2 - 1)) {
			const right = length - 1 - left;
			[array[left], array[right]] = [array[right], array[left]];
		}
		return array;
	}

	export function dependenciesDifferent(
		dependencies: ReadonlyArray<unknown>,
		previousDependencies: ReadonlyArray<unknown>,
	) {
		let length = 0;
		let index = 0;

		for (const dependency of dependencies) {
			length += 1;
			if (dependency !== previousDependencies[index]) return true;
			index += 1;
		}

		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [_] of pairs(previousDependencies)) length -= 1;
		return length !== 0;
	}
}

export = ArrayUtilities;
