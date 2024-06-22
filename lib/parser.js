import AsciiByteStream from "@iceylan/ascii-byte-stream/uncompiled";

export default class Parser
{
	/**
	 * Component tree.
	 * 
	 * @type {object}
	 */
	components = {}

	/**
	 * Constructs a new instance of the Parser class.
	 *
	 * @param {object} options - The options for the parser.
	 * @param {object} options.components - The component tree.
	 */
	constructor({ components = {}} = {})
	{
		this.components = components;
	}

	parse( raw )
	{
		const stream = new AsciiByteStream( raw );

		do
		{
			for( const compName in this.components )
			{
				const component = this.components[ compName ];

				component.stream = stream;
				component.run();
			}
		}
		while( stream.next !== undefined );
	}
}
