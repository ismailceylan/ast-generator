/**
 * @typedef {import('@iceylan/ascii-byte-stream').default} AsciiByteStream
 */
export default class Component
{
	/**
	 * Step by step component structure.
	 * 
	 * @type {array}
	 */
	structure;

	/**
	 * The abstract byte stream.
	 * 
	 * @type {AsciiByteStream}
	 */
	abs;

	/**
	 * Constructor for initializing the component with a structure.
	 *
	 * @param {object} options - The options for the component.
	 * @param {array} options.structure - The step by step component structure.
	 */
	constructor({ structure = []} = {})
	{
		this.structure = structure;
	}

	run()
	{
		
	}
}
