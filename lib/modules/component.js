import BaseModule from './base-module';

/**
 * @typedef {import('@iceylan/ascii-byte-stream/uncompiled').default} AsciiByteStream
 */
export default class Component
{
	/**
	 * Step by step component structure.
	 * 
	 * @type {Array<BaseModule>}
	 */
	structure;

	/**
	 * The abstract byte stream.
	 * 
	 * @type {AsciiByteStream}
	 */
	stream;

	/**
	 * Constructor for initializing the component with a structure.
	 *
	 * @param {object} options - The options for the component.
	 * @param {Array<BaseModule>} options.structure - The step by step component structure.
	 */
	constructor({ structure = []} = {})
	{
		this.structure = structure;
	}

	run()
	{
		const structureScope = {}

		for( const step of this.structure )
		{
			step.scope = structureScope;
			step.stream = this.stream;
			step.run();

			if( step.instanceName )
			{
				structureScope[ step.instanceName ] = step.state;
			}
		}
	}
}
