export default function tag( obj, value )
{
	Object.defineProperty(
		obj,
		Symbol.toStringTag,
		{ value }
	);

	return obj;
}
