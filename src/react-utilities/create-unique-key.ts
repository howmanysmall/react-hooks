//!native
//!nonstrict
//!optimize 2

/**
 * Creates a unique key generator function.
 *
 * @return A function that generates a unique key based on the provided name.
 */
export function createUniqueKey() {
	const names = new Map<string, number>();

	function uniqueKeyGenerator(name: string): string {
		if (!names.has(name)) {
			names.set(name, 1);
			return name;
		}

		while (true) {
			const newValue = names.get(name)! + 1;
			names.set(name, newValue);
			const finalName = `${name}-${newValue}`;
			if (!names.has(finalName)) return finalName;
		}
	}

	return uniqueKeyGenerator;
}
