import { BaseModule } from ".";

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Exact extends BaseModule
{
	/**
	 * The target of the exact matching.
	 * 
	 * @type {string}
	 */
	target;

	/**
	 * Constructor for the Exact class.
	 *
	 * @param {type} target - The target of the exact matching.
	 * @returns {type} 
	 */
	constructor( target )
	{
		super();

		this.target = target;
	}

	run()
	{
		if( this.target === this.stream.current )
		{
			this.stream.next;
			this.state = true;

			return;
		}

		this.state = false;

		throw new Error(
			`${ this.target } deosn't match ${ this.stream.current }.`
		);
	}
}
