/**
 * A function that tags an object with a custom toStringTag property.
 *
 * @template T
 * @param {T} obj - The object to tag.
 * @param {string} value - The value to assign to the toStringTag property.
 * @return {T} The tagged object.
 */
export default function tag( obj, value )
{
	Object.defineProperty(
		obj,
		Symbol.toStringTag,
		{ value }
	);

	return obj;
}
