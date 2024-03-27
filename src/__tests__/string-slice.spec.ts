//!native
//!nonstrict
//!optimize 2
/// <reference types="@rbxts/testez/globals" />

import { stringSlice } from "../utilities";

export = () => {
	it("returns a sliced string", () => {
		const value = "hello";
		expect(stringSlice(value, 2, 4)).to.equal("el");
	});
};
