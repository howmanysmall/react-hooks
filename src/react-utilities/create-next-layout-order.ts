//!native
//!nonstrict
//!optimize 2

/**
 * Creates a function that generates and returns the next layout order starting from the specified value.
 *
 * @param startAt - The value to start the layout order from (default is 0).
 * @return A function that when called, returns the next layout order value.
 */
export function createNextLayoutOrder(startAt = 0) {
	let layoutOrder = startAt;
	function getNext() {
		return layoutOrder++;
	}

	return getNext;
}
