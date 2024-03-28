//!native
//!nonstrict
//!optimize 2

export default function stringSlice(
	value: string,
	startIndexString: number | string,
	lastIndexString?: number | string,
) {
	const [stringLength, invalidBytePosition] = utf8.len(value);
	assert(
		stringLength !== undefined && stringLength !== false,
		"string `%*` has an invalid byte at position %*".format(value, `${invalidBytePosition}`),
	);

	let startIndex = tonumber(startIndexString);
	assert(typeIs(startIndex, "number"), "startIndexStr should be a number");

	if (startIndex + stringLength < 0) startIndex = 1;
	if (startIndex > stringLength) return "";

	let lastIndex = stringLength + 1;
	if (lastIndexString !== undefined) lastIndex = tonumber(lastIndexString) ?? 0 / 0;

	assert(typeIs(lastIndex, "number"), "lastIndexStr should convert to number");
	if (lastIndex > stringLength) lastIndex = stringLength + 1;

	const startIndexByte = utf8.offset(value, startIndex)!;
	const lastIndexByte = utf8.offset(value, lastIndex)! - 1;
	return value.sub(startIndexByte, lastIndexByte);
}
