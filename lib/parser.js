import AsciiByteStream from "@iceylan/ascii-byte-stream/uncompiled";
import ASTNode from "./ast-node";

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
		const nodes = [];
		const stream = new AsciiByteStream( raw );

		do
		{
			for( const compName in this.components )
			{
				const component = this.components[ compName ];

				try
				{
					nodes.push(
						component.run({ name: compName, stream })
					);
				}
				catch( e ){}

				nodes.push(
					( new ASTNode )
						.name( "ascii" )
						.set( "value", stream.current )
						.starts( stream.cursor )
						.flush()
				);
			}
		}
		while( stream.next !== undefined );

		return nodes;
	}
}
