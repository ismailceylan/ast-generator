import Sequence from "./sequence";

/**
 * Consumes the given target character set(s) starting from the current position
 * of the stream until it encounters something else.
 *
 * @param {string|string[]} targets - The string to consume from the stream.
 * @returns {Sequence} A new Sequence that represents the scenario.
 */
export default function consume( targets )
{
	return new Sequence( targets, function consume({ stream })
	{
		return this.setupSubNode( stream.consume( targets ));
	});
}
