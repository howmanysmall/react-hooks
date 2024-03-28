//!native
//!nonstrict
//!optimize 2
/// <reference types="@rbxts/testez/globals" />

import { is } from "../utilities/object-utilities";

export = () => {
	it("returns true when given ('foo', 'foo')", () => {
		expect(is("foo", "foo")).to.equal(true);
	});

	it("returns false when given ('foo', 'bar')", () => {
		expect(is("foo", "bar")).to.equal(false);
	});

	it("returns false when given ({}, {})", () => {
		expect(is({}, {})).to.equal(false);
	});

	const foo = { a: 1 };
	const bar = { a: 1 };

	it("returns true when given (foo, foo)", () => {
		expect(is(foo, foo)).to.equal(true);
	});

	it("returns false when given (foo, bar)", () => {
		expect(is(foo, bar)).to.equal(false);
	});

	it("returns true when given (nil, nil)", () => {
		expect(is(undefined, undefined)).to.equal(true);
	});

	it("returns false when given (0, -0)", () => {
		expect(is(0, -0)).to.equal(false);
	});

	it("returns true when given (-0, -0)", () => {
		expect(is(-0, -0)).to.equal(true);
	});

	it("returns true when given (0 / 0, 0 / 0)", () => {
		expect(is(0 / 0, 0 / 0)).to.equal(true);
	});
};
