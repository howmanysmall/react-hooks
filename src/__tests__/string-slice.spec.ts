//!native
//!nonstrict
//!optimize 2
/// <reference types="@rbxts/testez/globals" />

import stringSlice from "../utilities/string-slice";

export = () => {
	it("returns a sliced string", () => {
		const value = "hello";
		expect(stringSlice(value, 2, 4)).to.equal("el");
		expect(stringSlice(value, 3)).to.equal("llo");
	});

	it("returns a sliced string if start is below zero", () => {
		const value = "hello";
		expect(stringSlice(value, -1)).to.equal("o");
		expect(stringSlice(value, -2)).to.equal("lo");
		expect(stringSlice(value, -3)).to.equal("llo");
		expect(stringSlice(value, -4)).to.equal("ello");
		expect(stringSlice(value, -5)).to.equal("hello");
		expect(stringSlice(value, -6)).to.equal("hello");
		expect(stringSlice(value, -100)).to.equal("hello");
	});

	it("returns empty string when start index is below zero", () => {
		const value = "4.123";
		expect(stringSlice(value, -1, 4)).to.equal("");
	});

	it("returns correct substring when start index is zero", () => {
		const value = "4.123";
		expect(stringSlice(value, 0, 4)).to.equal("4.1");
	});

	it("returns correct substring when start index is one", () => {
		const value = "4.123";
		expect(stringSlice(value, 1, 4)).to.equal("4.1");
	});

	it("returns empty string when start position is greater than str length", () => {
		const value = "4.123";
		expect(stringSlice(value, 7, 4)).to.equal("");
	});

	it("returns full string when end position undefined", () => {
		const value = "4.123";
		expect(stringSlice(value, 1)).to.equal("4.123");
	});

	it("returns full string when end position is greater than str length", () => {
		const value = "4.123";
		expect(stringSlice(value, 1, 99)).to.equal("4.123");
	});

	it("handle chars above 7-bit ascii", () => {
		// two bytes
		// first byte (81)  - has high bit set
		// second byte (23) - must have second byte
		let body = "\u{8123}a";

		expect(stringSlice(body, 1, 2)).to.equal("\u{8123}");
		expect(stringSlice(body, 2, 3)).to.equal("a");

		body = "123 \u{0A0A} 456";

		expect(stringSlice(body, 1, 6)).to.equal("123 \u{0A0A}");
		expect(stringSlice(body, 5, 10)).to.equal("\u{0A0A} 456");
	});
};
